import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { isTokenExpired } from "@/utils/jwt";
import { setAccessTokenProvider } from "@/lib/authToken";
import client from "@/lib/apolloClient";

const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
const CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "";
const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/protocol/openid-connect/token`;

// Seul le refresh token est gardé entre deux lancements : le jeton d'accès vit
// cinq minutes, et l'identité se relit depuis /userinfo.
const REFRESH_TOKEN_KEY = "bagbuddy.refreshToken";

// Au-delà, on laisse l'utilisateur sur l'écran d'accueil plutôt que de garder
// le splash indéfiniment quand Keycloak ne répond pas. La reprise continue
// derrière : elle connectera l'utilisateur dès qu'elle aboutit.
const RESTORE_TIMEOUT_MS = 8000;

// Keycloak injoignable au lancement : on réessaie avec le refresh token sauvé,
// de plus en plus espacé, plutôt que de faire retaper le mot de passe.
const RESTORE_RETRY_MIN_MS = 5000;
const RESTORE_RETRY_MAX_MS = 60000;

// Le splash reste affiché tant que la session précédente n'est pas relue :
// sans ça, l'écran d'accueil déconnecté clignoterait avant l'accueil connecté.
SplashScreen.preventAutoHideAsync().catch(() => {});

/** Réponse de /protocol/openid-connect/token. */
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
}

/** Réponse de /userinfo : claims Keycloak, en snake_case. */
export interface KeycloakUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  [claim: string]: unknown;
}

export interface AuthState {
  isRestoring: boolean;
  isSignedIn: boolean;
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  userInfo: KeycloakUserInfo | null;
}

type AuthAction =
  | { type: "SIGN_IN"; payload: TokenResponse; userInfo: KeycloakUserInfo }
  | { type: "TOKENS"; payload: TokenResponse }
  | { type: "USER_INFO"; payload: KeycloakUserInfo }
  | { type: "RESTORED" }
  | { type: "SIGN_OUT" };

export type AuthErrorCode = "invalid_credentials" | "account_disabled" | "unavailable";

const initialState: AuthState = {
  isRestoring: true,
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  refreshToken: null,
  userInfo: null,
};

/**
 * Ce que les écrans de connexion ont besoin de distinguer pour écrire un
 * message utile : `invalid_credentials`, `account_disabled` ou `unavailable`.
 */
export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Keycloak répond `invalid_grant` aussi bien pour un mot de passe faux (ou un
 * refresh token mort) que pour un compte désactivé ou bloqué après trop
 * d'essais : le détail n'est que dans la description. Toute autre erreur
 * (`invalid_scope`, `unauthorized_client`, `invalid_client`…) vient de la
 * configuration du realm, pas de l'utilisateur : ce n'est pas son mot de passe.
 */
export function authErrorCode(
  error: string | undefined,
  description: string | undefined
): AuthErrorCode {
  if (error !== "invalid_grant") return "unavailable";
  if (description && /disabled|not fully set up|temporarily/i.test(description)) {
    return "account_disabled";
  }
  return "invalid_credentials";
}

/** Le refresh token ne resservira pas : la session est finie. */
const isSessionEnded = (code: AuthErrorCode) =>
  code === "invalid_credentials" || code === "account_disabled";

async function postToken(params: Record<string, string>): Promise<TokenResponse> {
  let response;
  try {
    response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString(),
    });
  } catch {
    throw new AuthError("unavailable");
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const code = authErrorCode(payload?.error, payload?.error_description);
    if (code === "unavailable") {
      // Souvent une erreur de configuration du realm : à voir en développement.
      console.warn("Keycloak token error", response.status, payload?.error);
    }
    throw new AuthError(code);
  }
  return response.json();
}

async function fetchUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
  let response;
  try {
    response = await fetch(`${KEYCLOAK_URL}/protocol/openid-connect/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    throw new AuthError("unavailable");
  }
  if (!response.ok) throw new AuthError("unavailable");
  return response.json();
}

export interface AuthContextValue {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUserInfo: (userInfo: KeycloakUserInfo) => void;
  getValidAccessToken: () => Promise<string>;
}

const notMounted = () => Promise.reject(new Error("AuthProvider is not mounted"));

const AuthContext = createContext<AuthContextValue>({
  state: initialState,
  signIn: notMounted,
  signOut: notMounted,
  refreshSession: notMounted,
  updateUserInfo: () => {},
  getValidAccessToken: notMounted,
});

/**
 * Session Keycloak ouverte depuis nos propres écrans (app/login.js), sans
 * jamais afficher de page hébergée par Keycloak.
 *
 * On utilise le grant `password` (« direct access grant ») du client public
 * `bagbuddy-mobile`, comme le front web le fait avec `bagbuddy-web`. Ce que ce
 * choix coûte : le mot de passe transite par notre code au lieu de n'être connu
 * que de Keycloak, et ce grant ne sait porter ni MFA ni connexion Google/Apple.
 * Le jour où l'un des deux devient nécessaire, il faut revenir au flux
 * redirection (le client garde ses redirectUris pour ça).
 *
 * L'inscription et le mot de passe oublié ne passent pas par ici mais par les
 * mutations anonymes `register` / `requestPasswordReset` de userservice.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, dispatch] = useReducer((prev: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "SIGN_IN":
        return {
          ...prev,
          isSignedIn: true,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token ?? prev.idToken,
          refreshToken: action.payload.refresh_token,
          userInfo: action.userInfo,
        };
      // Un refresh ne connecte personne : pendant une reprise de session,
      // isSignedIn attend que l'identité soit chargée.
      case "TOKENS":
        return {
          ...prev,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token ?? prev.idToken,
          refreshToken: action.payload.refresh_token,
        };
      case "USER_INFO":
        return { ...prev, userInfo: action.payload };
      case "RESTORED":
        return { ...prev, isRestoring: false };
      case "SIGN_OUT":
        return { ...initialState, isRestoring: false };
      default:
        return prev;
    }
  }, initialState);

  // Copie synchrone des jetons, lue par getValidAccessToken. L'état React ne
  // change qu'au rendu suivant : une requête partie entre-temps relirait
  // l'ancien refresh token et relancerait un refresh inutile (voire refusé si
  // Keycloak fait tourner les refresh tokens).
  const tokensRef = useRef<{ accessToken: string | null; refreshToken: string | null }>({
    accessToken: null,
    refreshToken: null,
  });
  // Un seul refresh à la fois : les requêtes lancées pendant qu'il tourne
  // attendent la même promesse au lieu d'en envoyer chacune un. La promesse est
  // rangée avec le refresh token qu'elle échange : celle d'une session
  // précédente (reprise restée pendante) ne répond pas pour la session courante.
  const refreshRef = useRef<{
    refreshToken: string;
    promise: Promise<TokenResponse>;
  } | null>(null);
  // Change à chaque connexion ou déconnexion explicite : une reprise de
  // session encore en cours sait alors qu'elle n'a plus rien à reprendre.
  const sessionRef = useRef(0);

  const storeTokens = useCallback((tokens: TokenResponse) => {
    tokensRef.current = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token).catch(
      (e) => console.warn("Refresh token non sauvegardé", e)
    );
  }, []);

  const clearTokens = useCallback(() => {
    tokensRef.current = { accessToken: null, refreshToken: null };
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
  }, []);

  const refreshTokens = useCallback((): Promise<TokenResponse> => {
    const { refreshToken } = tokensRef.current;
    if (!refreshToken) return Promise.reject(new Error("No refresh token"));
    if (refreshRef.current?.refreshToken === refreshToken) {
      return refreshRef.current.promise;
    }
    const promise = postToken({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    })
      .then((tokens) => {
        // Session fermée ou remplacée pendant l'appel : ces jetons
        // n'appartiennent plus à personne.
        if (tokensRef.current.refreshToken !== refreshToken) {
          throw new Error("Session closed during refresh");
        }
        storeTokens(tokens);
        dispatch({ type: "TOKENS", payload: tokens });
        return tokens;
      })
      .finally(() => {
        if (refreshRef.current?.promise === promise) refreshRef.current = null;
      });
    refreshRef.current = { refreshToken, promise };
    return promise;
  }, [storeTokens]);

  const signOut = useCallback(async () => {
    const { refreshToken } = tokensRef.current;
    sessionRef.current += 1;
    clearTokens();
    dispatch({ type: "SIGN_OUT" });
    // Le cache contient le profil et les transactions du compte qui part :
    // le compte suivant ne doit pas les voir, même un instant.
    client.clearStore().catch(() => {});
    router.replace("/start");
    if (!refreshToken) return;
    try {
      await fetch(`${KEYCLOAK_URL}/protocol/openid-connect/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          refresh_token: refreshToken,
        }).toString(),
      });
    } catch (e) {
      console.warn(e);
    }
  }, [clearTokens]);

  const getValidAccessToken = useCallback(async (): Promise<string> => {
    const { accessToken } = tokensRef.current;
    if (accessToken && !isTokenExpired(accessToken)) return accessToken;
    try {
      const tokens = await refreshTokens();
      return tokens.access_token;
    } catch (err) {
      // Refresh token expiré ou révoqué, compte désactivé : la session est
      // finie. Une panne réseau, elle, ne doit pas déconnecter : la requête
      // suivante réessaiera.
      if (err instanceof AuthError && isSessionEnded(err.code)) {
        await signOut();
      }
      throw err;
    }
  }, [refreshTokens, signOut]);

  // Reprend la session du lancement précédent, s'il y en a une.
  useEffect(() => {
    let cancelled = false;
    let restored = false;
    let splashTimer: ReturnType<typeof setTimeout> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = RESTORE_RETRY_MIN_MS;
    const session = sessionRef.current;
    // Faux dès que l'utilisateur s'est connecté ou déconnecté lui-même.
    const stillRestoring = () => !cancelled && sessionRef.current === session;

    const finishRestoring = () => {
      if (cancelled || restored) return;
      restored = true;
      clearTimeout(splashTimer);
      dispatch({ type: "RESTORED" });
      SplashScreen.hideAsync().catch(() => {});
    };

    const attempt = async () => {
      try {
        const tokens = await refreshTokens();
        const userInfo = await fetchUserInfo(tokens.access_token);
        if (stillRestoring()) dispatch({ type: "SIGN_IN", payload: tokens, userInfo });
      } catch (e) {
        if (!stillRestoring()) return;
        if (e instanceof AuthError && isSessionEnded(e.code)) {
          // Jeton refusé ou compte désactivé : il ne resservira pas.
          clearTokens();
        } else {
          // Keycloak injoignable : le jeton reste valable, on le garde (en
          // mémoire et pour le prochain lancement) et on réessaie.
          retryTimer = setTimeout(attempt, retryDelay);
          retryDelay = Math.min(retryDelay * 2, RESTORE_RETRY_MAX_MS);
        }
      } finally {
        finishRestoring();
      }
    };

    (async () => {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY).catch(
        () => null
      );
      if (!refreshToken || !stillRestoring()) {
        finishRestoring();
        return;
      }
      tokensRef.current = { accessToken: null, refreshToken };
      splashTimer = setTimeout(finishRestoring, RESTORE_TIMEOUT_MS);
      attempt();
    })();

    return () => {
      cancelled = true;
      clearTimeout(splashTimer);
      clearTimeout(retryTimer);
    };
    // Une seule fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authContext = useMemo<AuthContextValue>(
    () => ({
      state: authState,
      /**
       * Ouvre une session. Ne rend la main qu'une fois l'identité chargée :
       * l'écran appelant peut naviguer vers l'accueil sans état intermédiaire.
       * Lève une AuthError dont l'écran tire son message.
       *
       * Rend le jeton d'accès : le lien Apollo ne le verra qu'au rendu suivant,
       * et l'inscription en a besoin tout de suite pour l'email de vérification.
       */
      signIn: async (email: string, password: string) => {
        const tokens = await postToken({
          grant_type: "password",
          client_id: CLIENT_ID,
          username: email.trim(),
          password,
          // `offline_access` : le refresh token survit à la fermeture de
          // l'app (30 jours d'inactivité côté realm) au lieu de mourir avec la
          // session SSO après 30 minutes.
          scope: "openid profile email offline_access",
        });
        const userInfo = await fetchUserInfo(tokens.access_token);
        sessionRef.current += 1;
        storeTokens(tokens);
        dispatch({ type: "SIGN_IN", payload: tokens, userInfo });
        return tokens.access_token;
      },
      /**
       * Ferme la session localement d'abord, puis révoque le refresh token.
       * Sans flux redirection il n'y a pas de cookie SSO à nettoyer : si la
       * révocation échoue, le jeton expirera de lui-même.
       */
      signOut,
      /**
       * Redemande un jeton et relit l'identité. À appeler après un changement
       * de nom ou d'email : les claims du jeton courant datent d'avant.
       */
      refreshSession: async () => {
        if (!tokensRef.current.refreshToken) return;
        const tokens = await refreshTokens();
        const userInfo = await fetchUserInfo(tokens.access_token);
        dispatch({ type: "USER_INFO", payload: userInfo });
      },
      updateUserInfo: (newUserInfo: KeycloakUserInfo) =>
        dispatch({ type: "USER_INFO", payload: newUserInfo }),
      getValidAccessToken,
    }),
    [authState, signOut, refreshTokens, getValidAccessToken, storeTokens]
  );

  // Le lien Apollo vit hors de React : il ne peut pas lire ce contexte, mais il
  // a besoin d'un jeton valide à chaque requête. On lui passe donc la fonction
  // qui rafraîchit le jeton, pas le jeton lui-même, qui serait figé ici.
  useEffect(() => {
    setAccessTokenProvider(getValidAccessToken);
  }, [getValidAccessToken]);

  // Rien à montrer tant que la session n'est pas relue : le splash couvre.
  if (authState.isRestoring) return null;

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

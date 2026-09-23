import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { router } from "expo-router";
import axios from "axios";
import { isTokenExpired } from "@/utils/jwt";
import { setAccessTokenProvider } from "@/lib/authToken";
import client from "@/lib/apolloClient";

const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
const CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;
const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/protocol/openid-connect/token`;

const initialState = {
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
  constructor(code) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Keycloak répond `invalid_grant` aussi bien pour un mot de passe faux que pour
 * un compte désactivé ou bloqué après trop d'essais : le détail n'est que dans
 * la description.
 */
function authErrorCode(status, description) {
  if (description && /disabled|not fully set up|temporarily/i.test(description)) {
    return "account_disabled";
  }
  return status === 400 || status === 401 ? "invalid_credentials" : "unavailable";
}

async function postToken(params) {
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
    throw new AuthError(authErrorCode(response.status, payload?.error_description));
  }
  return response.json();
}

async function fetchUserInfo(accessToken) {
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

const AuthContext = createContext({
  state: initialState,
  signIn: async (email, password) => {},
  signOut: () => {},
  hasRole: (role) => false,
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
const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer((prev, action) => {
    switch (action.type) {
      case "SIGN_IN":
        return {
          ...prev,
          isSignedIn: true,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token ?? prev.idToken,
          refreshToken: action.payload.refresh_token,
          userInfo: action.userInfo ?? prev.userInfo,
        };
      case "USER_INFO":
        return { ...prev, userInfo: action.payload };
      case "SIGN_OUT":
        return initialState;
      default:
        return prev;
    }
  }, initialState);

  const authContext = useMemo(
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
      signIn: async (email, password) => {
        const tokens = await postToken({
          grant_type: "password",
          client_id: CLIENT_ID,
          username: email.trim(),
          password,
          scope: "openid profile email",
        });
        const userInfo = await fetchUserInfo(tokens.access_token);
        dispatch({ type: "SIGN_IN", payload: tokens, userInfo });
        return tokens.access_token;
      },
      /**
       * Ferme la session localement d'abord, puis révoque le refresh token.
       * Sans flux redirection il n'y a pas de cookie SSO à nettoyer : si la
       * révocation échoue, le jeton expirera de lui-même.
       */
      signOut: async () => {
        const { refreshToken } = authState;
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
      },
      /**
       * Redemande un jeton et relit l'identité. À appeler après un changement
       * de nom ou d'email : les claims du jeton courant datent d'avant.
       */
      refreshSession: async () => {
        if (!authState.refreshToken) return;
        const tokens = await postToken({
          grant_type: "refresh_token",
          client_id: CLIENT_ID,
          refresh_token: authState.refreshToken,
        });
        const userInfo = await fetchUserInfo(tokens.access_token);
        dispatch({ type: "SIGN_IN", payload: tokens, userInfo });
      },
      updateUserInfo: (newUserInfo) =>
        dispatch({ type: "USER_INFO", payload: newUserInfo }),
      getValidAccessToken: async () => {
        if (!authState.accessToken || isTokenExpired(authState.accessToken)) {
          if (!authState.refreshToken) throw new Error("No refresh token");
          try {
            const tokenResponse = await axios.post(
              TOKEN_ENDPOINT,
              new URLSearchParams({
                grant_type: "refresh_token",
                client_id: CLIENT_ID,
                refresh_token: authState.refreshToken,
              }),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            dispatch({ type: "SIGN_IN", payload: tokenResponse.data });

            return tokenResponse.data.access_token;
          } catch (err) {
            await authContext.signOut();
            throw err;
          }
        }
        return authState.accessToken;
      },
    }),
    [authState]
  );

  // Le lien Apollo vit hors de React : il ne peut pas lire ce contexte, mais il
  // a besoin d'un jeton valide à chaque requête. On lui passe donc la fonction
  // qui rafraîchit le jeton, pas le jeton lui-même, qui serait figé ici.
  useEffect(() => {
    setAccessTokenProvider(authContext.getValidAccessToken);
  }, [authContext]);

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

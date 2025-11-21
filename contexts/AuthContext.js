import React, { createContext, useEffect, useMemo, useReducer } from "react";
import * as AuthSession from "expo-auth-session";
import { useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import { router } from "expo-router";

const initialState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
};

const AuthContext = createContext({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  hasRole: (role) => false,
});

const AuthProvider = ({ children }) => {
  const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_KEYCLOAK_URL);

  const redirectUri = AuthSession.makeRedirectUri({
    native: "bagbuddy://redirect",
    useProxy: false,
  });
  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile"],
      responseType: "code",
    },
    discovery
  );

  const [authState, dispatch] = useReducer((prev, action) => {
    switch (action.type) {
      case "SIGN_IN":
        return {
          ...prev,
          isSignedIn: true,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token,
        };
      case "USER_INFO":
        return { ...prev, userInfo: action.payload };
      case "SIGN_OUT":
        return initialState;
      default:
        return prev;
    }
  }, initialState);


  // Échange le code contre le token
  useEffect(() => {
    const getToken = async (code) => {
      if (!request) return;

      const formData = new URLSearchParams();
      formData.append("grant_type", "authorization_code");
      formData.append("client_id", process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID);
      formData.append("code", code);
      if (request.codeVerifier)
        formData.append("code_verifier", request.codeVerifier);
      formData.append("redirect_uri", redirectUri);

      try {
        const tokenResponse = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
          }
        );

        if (tokenResponse.ok) {
          const payload = await tokenResponse.json();
          dispatch({ type: "SIGN_IN", payload });
        } else {
          console.warn("Token request failed", await tokenResponse.text());
        }
      } catch (e) {
        console.warn(e);
      }
    };

    if (response?.type === "success") {
      const { code } = response.params;
      getToken(code);
    } else if (response?.type === "error") {
      console.warn("Authentication error:", response.error);
    }
  }, [response, request, redirectUri]);

  // Récupère les informations utilisateur
  useEffect(() => {
    const getUserInfo = async () => {
      if (!authState.accessToken) return;

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            headers: { Authorization: `Bearer ${authState.accessToken}` },
          }
        );
        if (res.ok) {
          const payload = await res.json();
          dispatch({ type: "USER_INFO", payload });
        }
      } catch (e) {
        console.warn(e);
      }
    };
    if (authState.isSignedIn) getUserInfo();
  }, [authState.accessToken, authState.isSignedIn]);

  const authContext = useMemo(
    () => ({
      state: authState,
      signIn: () => promptAsync(),
      signOut: async () => {
        try {
          if (authState.idToken) {
            await fetch(
              `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${authState.idToken}`
            );
          }
          dispatch({ type: "SIGN_OUT" });
          router.replace("/start");
        } catch (e) {
          console.warn(e);
        }
      },
      hasRole: (role) => authState.userInfo?.roles?.includes(role),
    }),
    [authState, promptAsync]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

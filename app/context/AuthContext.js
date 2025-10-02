import React, { createContext, useMemo, useReducer, useEffect } from 'react'
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session'

/**
 * @typedef {Object} UserInfo
 * @property {string} username
 * @property {string} givenName
 * @property {string} familyName
 * @property {string} email
 * @property {string[]} roles
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isSignedIn
 * @property {string|null} accessToken
 * @property {string|null} idToken
 * @property {UserInfo|null} userInfo
 */

/** @type {AuthState} */

const initialState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
}

const AuthContext = createContext({
    state: initialState,
    signIn: () => {},
    signOut: () => {},
    hasRole: (role) => false,
})

const AuthProvider = ({ children }) => {
    const discovery = useAutoDiscovery(process.env.EXPO_PUBLIC_KEYCLOAK_URL)
    const redirectUri = makeRedirectUri({
        useProxy: true,  // indispensable pour Expo Go
    })
    const [request, response, promptAsync] = useAuthRequest(
        {
        clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
        redirectUri: redirectUri,
        scopes: ['openid', 'profile'],
        },
        discovery
    )
    // machine état pour traiter les actions d'authentification
  const [authState, dispatch] = useReducer((previousState, action) => {
    switch (action.type) {
        case 'SIGN_IN':
        return {
          ...previousState,
          isSignedIn: true,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token,
        }
              case 'USER_INFO':
        return {
          ...previousState,
          userInfo: {
            username: action.payload.preferred_username,
            givenName: action.payload.given_name,
            familyName: action.payload.family_name,
            email: action.payload.email,
            roles: action.payload.roles,
          },
        }
      case 'SIGN_OUT':
        return {
          initialState,
        }
    }
  }, initialState)

   const authContext = useMemo(
    () => ({
      state: authState,
      signIn: () => {
        promptAsync()
      },
      signOut: async () => {
        try {
          const idToken = authState.idToken
          await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${idToken}`
          )
          dispatch({ type: 'SIGN_OUT' })
        } catch (e) {
          console.warn(e)
        }
      },
      hasRole: (role) => authState.userInfo?.roles.indexOf(role) != -1,
    }),
    [authState, promptAsync]
  )

  // Si on reçoit un code d'autorisation, on l'échange contre un token
  useEffect(() => {
    const getToken = async ({ code, codeVerifier, redirectUri }) => {
      try {
        const formData = {
          grant_type: 'authorization_code',
          client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }
        const formBody = []
        for (const property in formData) {
          var encodedKey = encodeURIComponent(property)
          var encodedValue = encodeURIComponent(formData[property])
          formBody.push(encodedKey + '=' + encodedValue)
        }

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody.join('&'),
          }
        )
        if (response.ok) {
          const payload = await response.json()
          dispatch({ type: 'SIGN_IN', payload })
        }
      } catch (e) {
        console.warn(e)
      }
    }
    if (response?.type === 'success') {
      const { code } = response.params
      getToken({
        code,
        codeVerifier: request?.codeVerifier,
        redirectUri,
      })
    } else if (response?.type === 'error') {
      console.warn('Authentication error: ', response.error)
    }
  }, [dispatch, redirectUri, request?.codeVerifier, response])

  // Maintenant qu'on a un token, on peut récupérer les infos utilisateur
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const accessToken = authState.accessToken
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              Accept: 'application/json',
            },
          }
        )
        if (response.ok) {
          const payload = await response.json()
          dispatch({ type: 'USER_INFO', payload })
        }
      } catch (e) {
        console.warn(e)
      }
    }
    if (authState.isSignedIn) {
      getUserInfo()
    }
  }, [authState.accessToken, authState.isSignedIn, dispatch])

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  )
}


export { AuthContext, AuthProvider }
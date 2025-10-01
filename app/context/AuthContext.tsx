import React, {
  createContext,
  useMemo,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  AuthRequestConfig,
  ResponseType,
} from 'expo-auth-session'

// --- Types d’état et d’actions ---

type UserInfo = {
  preferred_username?: string
  given_name?: string
  family_name?: string
  email?: string
  roles?: string[]
  [key: string]: any
}

type AuthState = {
  isSignedIn: boolean
  accessToken: string | null
  idToken: string | null
  userInfo: UserInfo | null
}

const initialState: AuthState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
}

type AuthAction =
  | { type: 'SIGN_IN'; accessToken: string; idToken: string }
  | { type: 'USER_INFO'; userInfo: UserInfo }
  | { type: 'SIGN_OUT' }

type AuthContextType = {
  state: AuthState
  signIn: () => void
  signOut: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  hasRole: () => false,
})

// Reducer
const reducer = (prev: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prev,
        isSignedIn: true,
        accessToken: action.accessToken,
        idToken: action.idToken,
      }
    case 'USER_INFO':
      return {
        ...prev,
        userInfo: action.userInfo,
      }
    case 'SIGN_OUT':
      return { ...initialState }
    default:
      return prev
  }
}

// Provider
type AuthProviderProps = {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const discovery = useAutoDiscovery(
    process.env.EXPO_PUBLIC_KEYCLOAK_URL ?? ''
  )

  const redirectUri = makeRedirectUri()

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
      redirectUri,
      scopes: ['openid', 'profile'],
      responseType: ResponseType.Code,
    } as AuthRequestConfig,
    discovery
  )

  // Échange du code contre tokens
  useEffect(() => {
    const getToken = async ({
      code,
      codeVerifier,
      redirectUri,
    }: {
      code: string
      codeVerifier?: string
      redirectUri: string
    }) => {
      try {
        const formData: Record<string, string | undefined> = {
          grant_type: 'authorization_code',
          client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }

        const formBody = Object.entries(formData)
          .map(
            ([k, v]) =>
              encodeURIComponent(k) + '=' + encodeURIComponent(v ?? '')
          )
          .join('&')

        const tokenRes = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
          }
        )

        if (tokenRes.ok) {
          const payload = await tokenRes.json()
          dispatch({
            type: 'SIGN_IN',
            accessToken: payload.access_token,
            idToken: payload.id_token,
          })
        } else {
          console.warn('Token exchange failed', await tokenRes.text())
        }
      } catch (e) {
        console.warn('getToken error', e)
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
  }, [response, redirectUri, request?.codeVerifier])

  // Récupération des infos utilisateur une fois connecté
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!state.accessToken) return
      try {
        const infoRes = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
              Accept: 'application/json',
            },
          }
        )
        if (infoRes.ok) {
          const userInfo = await infoRes.json()
          dispatch({ type: 'USER_INFO', userInfo })
        } else {
          console.warn('UserInfo fetch failed', await infoRes.text())
        }
      } catch (e) {
        console.warn('fetchUserInfo error', e)
      }
    }

    if (state.isSignedIn) {
      fetchUserInfo()
    }
  }, [state.accessToken, state.isSignedIn])

  const authContext = useMemo(
    () => ({
      state,
      signIn: () => {
        promptAsync()
      },
      signOut: async () => {
        try {
          const idToken = state.idToken
          await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${idToken}`
          )
        } catch (e) {
          console.warn('logout error', e)
        } finally {
          dispatch({ type: 'SIGN_OUT' })
        }
      },
      hasRole: (role: string) => {
        const roles = state.userInfo?.roles
        if (!roles) return false
        return roles.includes(role)
      },
    }),
    [state, promptAsync]
  )

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

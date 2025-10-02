// screens/ProfileScreen.tsx

import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { AuthContext } from '../context/AuthContext'

const ProfileScreen = () => {
  const { state } = useContext(AuthContext)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      {state.isSignedIn ? (
        <>
          <Text>Username: {state.userInfo?.username}</Text>
          <Text>Email: {state.userInfo?.email}</Text>
          <Text>Roles: {state.userInfo?.roles?.join(', ')}</Text>
        </>
      ) : (
        <Text>Pas connecte</Text>
      )}
    </View>
  )
}

export { ProfileScreen }

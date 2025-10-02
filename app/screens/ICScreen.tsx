// screens/ICScreen.tsx

import React, { useContext } from 'react'
import { View, Text, Button } from 'react-native'
import { AuthContext } from '../context/AuthContext'

const ICScreen = () => {
  const { state, signIn, signOut } = useContext(AuthContext)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>IC Screen</Text>
      {state.isSignedIn ? (
        <>
          <Text>Bienvenue {state.userInfo?.username}</Text>
          <Button title="Se deconnecter" onPress={signOut} />
        </>
      ) : (
        <Button title="Se connecter" onPress={signIn} />
      )}
    </View>
  )
}

export { ICScreen }

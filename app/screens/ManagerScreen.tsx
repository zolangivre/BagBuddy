// screens/ManagerScreen.tsx

import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { AuthContext } from '../context/AuthContext'

const ManagerScreen = () => {
  const { state, hasRole } = useContext(AuthContext)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Manager Screen</Text>
      {state.isSignedIn ? (
        hasRole('manager') ? (
          <Text>Contenu réservé aux managers</Text>
        ) : (
          <Text>Acces refuse</Text>
        )
      ) : (
        <Text>Veuillez vous connecter</Text>
      )}
    </View>
  )
}

export { ManagerScreen }

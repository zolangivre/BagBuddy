import React, { useContext } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../../context/AuthContext'

const SignInScreen = () => {
  const { signIn } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <Text>SignIn-Screen</Text>
      <Button onPress={signIn} title={'Sign in'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export { SignInScreen }
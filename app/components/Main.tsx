import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../context/AuthContext'
import { HomeScreen } from '../screens/Home/HomeScreen'
import { AboutScreen } from './screens/AboutScreen'
import { SignInScreen } from '../screens/SignIn/SignInScreen'

const NativeStack = createNativeStackNavigator()

const Main = () => {
  const { state } = useContext(AuthContext)
  
  return (
    <NavigationContainer>
      <NativeStack.Navigator>
        {state.isSignedIn ? (
          <>
            <NativeStack.Screen name={'Home'} component={HomeScreen} />
            <NativeStack.Screen name={'About'} component={AboutScreen} />
          </>
        ) : (
          <NativeStack.Screen
            name={'SignIn'}
            component={SignInScreen}
            options={{ animationTypeForReplace: 'pop' }}
          />
        )}
      </NativeStack.Navigator>
    </NavigationContainer>
  )
}

export { Main }
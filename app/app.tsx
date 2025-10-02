
import React from 'react'
import { Main } from './components/Main'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <>
      <h1>BagBuddy</h1>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </>
  )
}
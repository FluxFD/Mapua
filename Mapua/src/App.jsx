import React from 'react'
import { useState } from 'react'
import Login from './pages/login'
import Dashboard from './pages/dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </>
  )
}
export default App

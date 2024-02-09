

import { useState, useEffect } from 'react'
import { auth } from './Firebase'

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  return { currentUser }
}

export default useAuth;

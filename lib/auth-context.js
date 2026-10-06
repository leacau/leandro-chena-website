"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, getUserRole } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const AuthContext = createContext({
  user: null,
  userRole: null,
  loading: true,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const role = await getUserRole(currentUser.uid)
          setUserRole(role)
        } catch (error) {
          console.error("Error fetching role:", error)
          setUserRole('user')
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userRole, loading: loading || (user && userRole === null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

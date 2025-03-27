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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Obtener el rol del usuario
        const role = await getUserRole(user.uid)
        setUserRole(role)
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, userRole, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


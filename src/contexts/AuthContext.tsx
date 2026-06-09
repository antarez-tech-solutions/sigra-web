import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, RegisterRequest } from '../api/types'
import { apiClient } from '../api/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      apiClient.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('refresh-token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await apiClient.login(data)
    localStorage.setItem('auth-token', response.token)
    localStorage.setItem('refresh-token', response.refreshToken)
    setUser(response.user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await apiClient.register(data)
    localStorage.setItem('auth-token', response.token)
    localStorage.setItem('refresh-token', response.refreshToken)
    setUser(response.user)
  }

  const logout = async () => {
    await apiClient.logout()
    localStorage.removeItem('auth-token')
    localStorage.removeItem('refresh-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

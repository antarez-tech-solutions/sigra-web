import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ReactNode } from 'react'
import { apiClient } from '../api/client'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  // Em modo mock, sempre permitir acesso para desenvolvimento
  const isMockMode = apiClient.useMock

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isMockMode && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

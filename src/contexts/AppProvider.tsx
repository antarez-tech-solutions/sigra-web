import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeContext'
import { ToastProvider } from '../components/ToastProvider'
import { AuthProvider } from './AuthContext'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

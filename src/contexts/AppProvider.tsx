import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeContext'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

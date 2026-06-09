import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { useToast } from './components/ToastProvider'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('demo@sigra.io')
  const [password, setPassword] = useState('password')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      showToast('success', t('auth.loginSuccess'))
    } catch (error) {
      showToast('error', t('auth.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Card className="w-full max-w-md">
        <h1 className="heading-2 mb-6">{t('auth.loginTitle')}</h1>
        <p className="text-muted mb-6">{t('auth.loginSubtitle')}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            {t('auth.loginButton')}
          </Button>
        </form>
      </Card>
    </div>
  )
}

function DashboardPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted">{t('dashboard.welcome', { name: user?.firstName })}</p>
        </div>
        <Button variant="ghost" onClick={logout}>
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

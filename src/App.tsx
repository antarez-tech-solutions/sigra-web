import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { Badge } from './components/Badge'
import { useToast } from './components/ToastProvider'
import { useState } from 'react'

function LandingDemo() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="heading-2">{t('common.appName')}</h1>
          <div className="flex gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="heading-1 mb-6">
          {t('landing.hero.title')}
        </h1>
        <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
          {t('landing.hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">{t('landing.hero.cta')}</Button>
          <Button variant="secondary" size="lg">{t('landing.hero.ctaSecondary')}</Button>
        </div>

        <div className="mt-20">
          <h2 className="heading-2 mb-8">{t('landing.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="heading-3 mb-3">{t('landing.features.upload.title')}</h3>
              <p className="text-muted">{t('landing.features.upload.description')}</p>
            </Card>
            <Card>
              <h3 className="heading-3 mb-3">{t('landing.features.sign.title')}</h3>
              <p className="text-muted">{t('landing.features.sign.description')}</p>
            </Card>
            <Card>
              <h3 className="heading-3 mb-3">{t('landing.features.anchor.title')}</h3>
              <p className="text-muted">{t('landing.features.anchor.description')}</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function LoginDemo() {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-2">{t('auth.loginTitle')}</h1>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
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

function DashboardDemo() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted">{t('dashboard.welcome', { name: user?.firstName })}</p>
        </div>
        <div className="flex gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="ghost" onClick={logout}>
            {t('nav.logout')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-muted mb-2">{t('dashboard.stats.totalDocuments')}</p>
          <p className="text-3xl font-bold">12</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">{t('dashboard.stats.pendingSignatures')}</p>
          <p className="text-3xl font-bold text-warning">3</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">{t('dashboard.stats.completed')}</p>
          <p className="text-3xl font-bold text-accent">8</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">{t('dashboard.stats.anchoredOnChain')}</p>
          <p className="text-3xl font-bold text-primary">8</p>
        </Card>
      </div>

      <Card>
        <h2 className="heading-2 mb-4">{t('dashboard.recentActivity')}</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div>
                <p className="font-semibold">NDA Agreement #{i}</p>
                <p className="text-sm text-muted">2 days ago</p>
              </div>
              <Badge variant="success">{t('envelopes.status.completed')}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function I18nDemo() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">i18n Demo</h1>
          <p className="text-muted">Step 5: Multi-language support</p>
        </div>
        <div className="flex gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="heading-2 mb-4">Current Language: {t('common.appName')}</h2>
          <p className="text-muted mb-4">
            The app supports English and Portuguese (Brazil) with automatic language detection and localStorage persistence.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/'}>
              {t('nav.home')}
            </Button>
            <Button variant="secondary" onClick={() => window.location.href = '/login'}>
              {t('nav.login')}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="heading-3 mb-4">Translation Examples</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {t('common.loading')}</p>
            <p><strong>Save:</strong> {t('common.save')}</p>
            <p><strong>Cancel:</strong> {t('common.cancel')}</p>
            <p><strong>Dashboard:</strong> {t('nav.dashboard')}</p>
            <p><strong>Documents:</strong> {t('nav.documents')}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<I18nDemo />} />
      <Route path="/landing" element={<LandingDemo />} />
      <Route path="/login" element={<LoginDemo />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <DashboardDemo />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

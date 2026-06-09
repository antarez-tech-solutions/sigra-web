import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PublicHeader } from '../components/PublicHeader'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ToastProvider'
import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({ email, password })
      showToast('success', t('auth.loginSuccess'))
      navigate('/app/dashboard')
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : t('auth.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="py-20">
        <Container>
          <div className="max-w-md mx-auto">
            <Card>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('auth.loginTitle')}</h1>
                <p className="text-muted-foreground">{t('auth.loginSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label={t('auth.password')}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock className="w-5 h-5" />}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-primary hover:text-primary-hover font-medium">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  {t('auth.loginButton')}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full">
                  Google
                </Button>
                <Button variant="secondary" className="w-full">
                  GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-8">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
                  {t('auth.registerButton')}
                </Link>
              </p>
            </Card>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo credentials: demo@sigra.io / password</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

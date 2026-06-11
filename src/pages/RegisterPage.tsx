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
import { Mail, Lock, User, Building } from 'lucide-react'

export function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      showToast('error', 'Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      showToast('error', 'Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || undefined,
        email: formData.email,
        password: formData.password,
      })
      showToast('success', t('auth.registerSuccess'))
      navigate('/app/dashboard')
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Registration failed')
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
                <h1 className="text-3xl font-bold mb-2">{t('auth.registerTitle')}</h1>
                <p className="text-muted-foreground">{t('auth.registerSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('auth.firstName')}
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    icon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label={t('auth.lastName')}
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label={t('auth.company')}
                  name="company"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={handleChange}
                  icon={<Building className="w-5 h-5" />}
                />

                <Input
                  label={t('auth.email')}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon={<Mail className="w-5 h-5" />}
                />

                <Input
                  label={t('auth.password')}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  icon={<Lock className="w-5 h-5" />}
                />

                <Input
                  label={t('auth.confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  icon={<Lock className="w-5 h-5" />}
                />

                <Button type="submit" loading={loading} className="w-full">
                  {t('auth.registerButton')}
                </Button>
              </form>

              <div className="flex items-center my-8 gap-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">{t('auth.orContinueWith')}</span>
                <div className="flex-1 h-px bg-border"></div>
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
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-primary hover:text-primary-hover font-medium no-underline" style={{ textDecoration: 'none' }}>
                  {t('auth.loginButton')}
                </Link>
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}

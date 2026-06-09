import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../components/PublicHeader'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { useToast } from '../components/ToastProvider'
import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      showToast('success', 'Password reset email sent!')
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />

        <section className="py-20">
          <Container>
            <div className="max-w-md mx-auto">
              <Card>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h1 className="text-2xl font-bold mb-4">Check your email</h1>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or{' '}
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-primary hover:text-primary-hover font-medium"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              </Card>
            </div>
          </Container>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="py-20">
        <Container>
          <div className="max-w-md mx-auto">
            <Card>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
                <p className="text-muted-foreground">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button type="submit" loading={loading} className="w-full">
                  Send reset link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  )
}

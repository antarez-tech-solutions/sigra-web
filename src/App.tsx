import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { useToast } from './components/ToastProvider'
import { useState } from 'react'

function LoginDemo() {
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
      showToast('success', 'Login successful!')
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-2">Log In</h1>
          <ThemeToggle />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>
          <p className="text-sm text-muted text-center">
            Demo credentials: demo@sigra.io / password
          </p>
        </form>
      </Card>
    </div>
  )
}

function DashboardDemo() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    await logout()
    showToast('success', 'Logged out successfully')
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">Dashboard</h1>
          <p className="text-muted">Welcome, {user?.firstName}!</p>
        </div>
        <div className="flex gap-3">
          <ThemeToggle />
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-muted mb-2">Total Documents</p>
          <p className="text-3xl font-bold">12</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">Pending Signatures</p>
          <p className="text-3xl font-bold text-warning">3</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">Completed</p>
          <p className="text-3xl font-bold text-accent">8</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">Anchored On-Chain</p>
          <p className="text-3xl font-bold text-primary">8</p>
        </Card>
      </div>

      <Card>
        <h2 className="heading-2 mb-4">User Profile</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Company:</strong> {user?.company}</p>
          <p><strong>Plan:</strong> {user?.plan}</p>
        </div>
      </Card>
    </div>
  )
}

function ApiDemo() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">API & Auth Demo</h1>
          <p className="text-muted">Step 4: Mock backend integration</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="heading-2 mb-4">Mock API Client</h2>
          <p className="text-muted mb-4">
            The API client simulates backend responses with realistic delays. All data is stored in memory and localStorage.
          </p>
          <div className="space-y-2 text-sm">
            <p>✓ Authentication (login, register, logout)</p>
            <p>✓ JWT token management</p>
            <p>✓ Protected routes</p>
            <p>✓ Documents API</p>
            <p>✓ Envelopes API</p>
            <p>✓ Document verification</p>
          </div>
        </Card>

        <Card>
          <h2 className="heading-2 mb-4">Try It</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/login" className="btn-primary text-center">
              Go to Login →
            </a>
            <a href="/app/dashboard" className="btn-secondary text-center">
              Go to Dashboard (Protected) →
            </a>
          </div>
          <p className="text-sm text-muted mt-4">
            The dashboard is protected and will redirect to login if not authenticated.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ApiDemo />} />
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

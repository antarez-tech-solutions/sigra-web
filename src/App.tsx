import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { VerifyPage } from './pages/VerifyPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { EnvelopesPage } from './pages/EnvelopesPage'
import { EnvelopeDetailPage } from './pages/EnvelopeDetailPage'
import { CreateEnvelopePage } from './pages/CreateEnvelopePage'
import { SigningPage } from './pages/SigningPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/sign/:token" element={<SigningPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/documents"
        element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/envelopes"
        element={
          <ProtectedRoute>
            <EnvelopesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/envelopes/new"
        element={
          <ProtectedRoute>
            <CreateEnvelopePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/envelopes/:id"
        element={
          <ProtectedRoute>
            <EnvelopeDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

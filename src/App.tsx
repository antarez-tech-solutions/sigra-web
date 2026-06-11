import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'
import { AppShell } from './components/AppShell'
import { ThemeToggle } from './components/ThemeToggle'
import { Link } from 'react-router-dom'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

function LandingDemo() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="heading-1 mb-6">
          Every Signature, <span className="text-primary">Forever Verifiable</span>
        </h1>
        <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
          Blockchain-anchored e-signatures with independent verification. No vendor lock-in, no expiration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </Link>
          <Link to="/verify" className="btn-secondary text-lg px-8 py-4">
            Verify Document
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card">
            <h3 className="heading-3 mb-3">Upload</h3>
            <p className="text-muted">Upload any PDF document to get started</p>
          </div>
          <div className="card">
            <h3 className="heading-3 mb-3">Sign</h3>
            <p className="text-muted">Add signers and collect e-signatures</p>
          </div>
          <div className="card">
            <h3 className="heading-3 mb-3">Anchor</h3>
            <p className="text-muted">Proof anchored on Ethereum L2</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

function DashboardDemo() {
  return (
    <AppShell title="Dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-muted mb-2">Total Documents</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="card">
            <p className="text-sm text-muted mb-2">Pending Signatures</p>
            <p className="text-3xl font-bold text-warning">3</p>
          </div>
          <div className="card">
            <p className="text-sm text-muted mb-2">Completed</p>
            <p className="text-3xl font-bold text-accent">8</p>
          </div>
          <div className="card">
            <p className="text-sm text-muted mb-2">Anchored On-Chain</p>
            <p className="text-3xl font-bold text-primary">8</p>
          </div>
        </div>

        <div className="card">
          <h2 className="heading-2 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-semibold">NDA Agreement #{i}</p>
                  <p className="text-sm text-muted">Created 2 days ago</p>
                </div>
                <span className="badge badge-success">Completed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function LayoutDemo() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-1 mb-2">Layout Components Demo</h1>
            <p className="text-muted">Step 2: Public and authenticated layouts</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          <section className="card">
            <h2 className="heading-2 mb-4">Public Layout</h2>
            <p className="text-muted mb-4">
              Used for landing page, pricing, verify, login, and register pages.
              Includes PublicHeader (sticky navigation) and PublicFooter (links & social).
            </p>
            <Link to="/demo/public" className="btn-primary">
              View Public Layout →
            </Link>
          </section>

          <section className="card">
            <h2 className="heading-2 mb-4">Authenticated Layout</h2>
            <p className="text-muted mb-4">
              Used for dashboard, documents, envelopes, and settings.
              Includes AppShell (flex layout), Sidebar (responsive navigation), and Topbar (header with menu).
            </p>
            <Link to="/demo/authenticated" className="btn-primary">
              View Authenticated Layout →
            </Link>
          </section>

          <section className="card">
            <h2 className="heading-3 mb-4">Component Features</h2>
            <ul className="space-y-2 text-muted">
              <li>✓ Responsive sidebar (mobile drawer + desktop fixed)</li>
              <li>✓ Sticky headers with backdrop blur</li>
              <li>✓ Theme-aware colors and borders</li>
              <li>✓ Active route highlighting in sidebar</li>
              <li>✓ Accessible navigation with ARIA labels</li>
              <li>✓ Smooth transitions and animations</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDemo />} />
      <Route path="/demo/public" element={<LandingDemo />} />
      <Route path="/demo/authenticated" element={<DashboardDemo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './contexts/ThemeContext'

function DesignSystemDemo() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-1 mb-2">SigraChain Design System</h1>
          <p className="text-muted text-lg">Step 1: Theme-aware component foundation</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-8">
        <section className="card">
          <h2 className="heading-2 mb-4">Current Theme: {theme}</h2>
          <p className="text-muted">The design system supports light and dark modes with automatic system preference detection and localStorage persistence.</p>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-ghost">Ghost Button</button>
            <button className="btn-danger">Danger Button</button>
            <button className="btn-primary" disabled>Disabled</button>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-bold mb-2">Interactive Card</h4>
              <p className="text-muted text-sm">This card has hover effects and shadow transitions.</p>
            </div>
            <div className="card-flat">
              <h4 className="font-bold mb-2">Flat Card</h4>
              <p className="text-muted text-sm">This card has no hover effects.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Inputs</h3>
          <div className="max-w-md space-y-4">
            <input type="text" className="input-field" placeholder="Text input" />
            <input type="email" className="input-field" placeholder="Email input" />
            <textarea className="input-field" placeholder="Textarea" rows={3}></textarea>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-error">Error</span>
            <span className="badge badge-info">Info</span>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Typography</h3>
          <div className="space-y-3">
            <p className="heading-1">Heading 1</p>
            <p className="heading-2">Heading 2</p>
            <p className="heading-3">Heading 3</p>
            <p className="text-body">Body text - Regular paragraph with primary color</p>
            <p className="text-muted">Muted text - Secondary color for less important content</p>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary text-white text-center">Primary</div>
            <div className="p-4 rounded-lg bg-accent text-white text-center">Accent</div>
            <div className="p-4 rounded-lg bg-warning text-white text-center">Warning</div>
            <div className="p-4 rounded-lg bg-error text-white text-center">Error</div>
          </div>
        </section>

        <section>
          <h3 className="heading-3 mb-4">Animations</h3>
          <div className="flex flex-wrap gap-4">
            <div className="animate-fade-in p-4 bg-primary-light rounded-lg">Fade In</div>
            <div className="animate-slide-up p-4 bg-accent-light rounded-lg">Slide Up</div>
            <div className="animate-pulse-soft p-4 bg-warning-light rounded-lg">Pulse</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DesignSystemDemo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, FileText, Send, Settings, CreditCard, LogOut, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const { theme } = useTheme()
  const { logout } = useAuth()

  const navItems = [
    { to: '/app/dashboard', icon: Home, label: t('nav.dashboard') },
    { to: '/app/documents', icon: FileText, label: t('nav.documents') },
    { to: '/app/envelopes', icon: Send, label: t('nav.envelopes') },
    { to: '/app/settings', icon: Settings, label: t('nav.settings') },
    { to: '/app/billing', icon: CreditCard, label: 'Billing' },
  ]

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : '#FFFFFF',
          borderRight: `1px solid var(--border-primary)`,
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <img src="/logo.svg" alt="SigraChain" className="h-8 w-auto" />
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>SigraChain</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                  style={{
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error-light dark:hover:bg-error/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

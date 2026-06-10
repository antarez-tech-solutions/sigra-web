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
          fixed top-0 left-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: '320px',
          minWidth: '320px',
          maxWidth: '320px',
          flexShrink: 0,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : '#FFFFFF',
          borderRight: `1px solid var(--border-primary)`,
          boxShadow: theme === 'dark' ? 'none' : '0 0 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex flex-col h-full w-full">
          {/* Logo Section */}
          <div 
            className="flex items-center justify-between px-8 py-6 border-b"
            style={{ 
              borderColor: 'var(--border-primary)',
              backgroundColor: theme === 'dark' ? 'var(--bg-primary)' : '#FAFAFA',
            }}
          >
            <Link to="/" className="flex items-center gap-4 flex-shrink-0" onClick={onClose}>
              <img src="/logo-icon.svg" alt="SigraChain" className="h-10 w-auto flex-shrink-0" />
              <span 
                className="text-2xl font-bold flex-shrink-0"
                style={{ color: 'var(--text-primary)' }}
              >
                SigraChain
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`
                    flex items-center gap-5 px-6 py-4 rounded-lg text-base font-medium
                    transition-all duration-200 w-full group flex-shrink-0
                    ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }
                  `}
                  style={{
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <item.icon 
                    className={`w-6 h-6 transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isActive ? 'drop-shadow-sm' : ''
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout Section */}
          <div 
            className="px-6 py-6 border-t"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-5 px-6 py-4 rounded-lg text-base font-medium text-error hover:bg-error/10 dark:hover:bg-error/5 transition-all duration-200 group flex-shrink-0"
            >
              <LogOut className="w-6 h-6 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="truncate">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

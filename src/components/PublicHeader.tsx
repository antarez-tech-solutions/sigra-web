import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

export function PublicHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <img src="/logo.svg" alt="SigraChain" className="h-8 w-auto" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>SigraChain</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
              {t('nav.home')}
            </Link>
            <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
              {t('nav.pricing')}
            </Link>
            <Link to="/verify" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: 'var(--text-secondary)' }}>
              {t('nav.verify')}
            </Link>
            <Link to="/login" className="btn-ghost">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn-primary">
              {t('nav.register')}
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

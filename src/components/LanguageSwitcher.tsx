import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const currentLanguage = languages.find(lang => lang.code === i18n.language) ?? languages[0]
  
  if (!currentLanguage) return null

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <div className="relative flex items-center">
      <Globe className="absolute left-3 w-4 h-4 pointer-events-none text-muted-foreground" />
      <select
        value={currentLanguage.code}
        onChange={handleLanguageChange}
        className="appearance-none pl-9 pr-8 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary border border-border"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            }}
          >
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

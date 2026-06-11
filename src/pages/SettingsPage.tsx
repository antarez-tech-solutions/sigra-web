import { useTranslation } from 'react-i18next'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../components/ToastProvider'
import { useState } from 'react'
import { 
  User, 
  Globe, 
  Palette, 
  Shield, 
  Key,
  Bell,
  Save
} from 'lucide-react'

type Tab = 'profile' | 'preferences' | 'security'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
    email: user?.email || '',
  })

  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('success', 'Profile updated successfully')
    } catch (error) {
      showToast('error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      showToast('error', 'Passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      showToast('error', 'Password must be at least 8 characters')
      return
    }

    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('success', 'Password changed successfully')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      showToast('error', 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    showToast('success', 'Language updated')
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'preferences' as Tab, label: 'Preferences', icon: Globe },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ]

  return (
    <AppShell title={t('settings.title')}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profile.email}
                    disabled
                    helperText="Email cannot be changed"
                  />
                  <Button onClick={handleSaveProfile} loading={saving}>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Language
                  </h2>
                  <Select
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="pt-BR">Português (Brasil)</option>
                  </Select>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Theme
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appearance</p>
                      <p className="text-sm text-muted-foreground">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === 'light' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => theme !== 'light' && toggleTheme()}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => theme !== 'dark' && toggleTheme()}
                      >
                        Dark
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your envelopes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">
                          Receive product updates and news
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Change Password
                  </h2>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                    <Button onClick={handleChangePassword} loading={saving}>
                      <Key className="w-5 h-5 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Two-Factor Authentication
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="secondary">
                      Enable 2FA
                    </Button>
                  </div>
                </Card>

                <Card className="border-danger/50">
                  <h2 className="text-xl font-semibold mb-4 text-danger">
                    Danger Zone
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="danger" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

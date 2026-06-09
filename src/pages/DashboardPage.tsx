import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ToastProvider'
import { apiClient } from '../api/client'
import { useEffect, useState } from 'react'
import { Envelope, Document } from '../api/types'
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Shield, 
  Plus, 
  Upload, 
  Clock,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [docs, envs] = await Promise.all([
        apiClient.getDocuments(),
        apiClient.getEnvelopes(),
      ])
      setDocuments(docs)
      setEnvelopes(envs)
    } catch (error) {
      showToast('error', 'Failed to load dashboard data')
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: t('dashboard.stats.totalDocuments'),
      value: documents.length,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: t('dashboard.stats.pendingSignatures'),
      value: envelopes.filter(e => e.status === 'pending').length,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: t('dashboard.stats.completed'),
      value: envelopes.filter(e => e.status === 'completed' || e.status === 'anchored').length,
      icon: CheckCircle2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: t('dashboard.stats.anchoredOnChain'),
      value: envelopes.filter(e => e.status === 'anchored').length,
      icon: Shield,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  const recentEnvelopes = envelopes.slice(0, 5)

  const getStatusBadge = (status: string) => {
    const styles = {
      anchored: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-accent/10 text-accent border-accent/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      draft: 'bg-muted text-muted-foreground border-border',
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  return (
    <AppShell title={t('dashboard.title')}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome', { name: user?.firstName })}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your documents today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-accent">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.quickActions.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <button
                onClick={() => navigate('/app/envelopes/new')}
                className="w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('dashboard.quickActions.newEnvelope')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and send for signatures
                    </p>
                  </div>
                </div>
              </button>
            </Card>

            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <button
                onClick={() => navigate('/app/documents')}
                className="w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('dashboard.quickActions.uploadDocument')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload PDF documents
                    </p>
                  </div>
                </div>
              </button>
            </Card>

            <Card className="hover:border-primary/50 cursor-pointer transition-colors">
              <button
                onClick={() => navigate('/verify')}
                className="w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('dashboard.quickActions.verifyDocument')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Check document authenticity
                    </p>
                  </div>
                </div>
              </button>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t('dashboard.recentActivity')}</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/app/envelopes')}
              className="text-sm"
            >
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : recentEnvelopes.length === 0 ? (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No envelopes yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first envelope to get started
              </p>
              <Button onClick={() => navigate('/app/envelopes/new')}>
                Create Envelope
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnvelopes.map((envelope) => (
                <div
                  key={envelope.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/envelopes/${envelope.id}`)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{envelope.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {envelope.signers.length} signer{envelope.signers.length !== 1 ? 's' : ''} •{' '}
                        {new Date(envelope.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(envelope.status)}>
                    {envelope.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

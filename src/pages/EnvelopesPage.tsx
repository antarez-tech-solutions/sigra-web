import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import { useToast } from '../components/ToastProvider'
import { apiClient } from '../api/client'
import { useEffect, useState } from 'react'
import { Envelope } from '../api/types'
import { 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Shield
} from 'lucide-react'

export function EnvelopesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadEnvelopes()
  }, [])

  const loadEnvelopes = async () => {
    try {
      const envs = await apiClient.getEnvelopes()
      setEnvelopes(envs)
    } catch (error) {
      showToast('error', 'Failed to load envelopes')
      console.error('Load envelopes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      anchored: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-accent/10 text-accent border-accent/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      draft: 'bg-muted text-muted-foreground border-border',
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'anchored':
        return <Shield className="w-4 h-4" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <Send className="w-4 h-4" />
    }
  }

  const filteredEnvelopes = envelopes.filter(env => {
    const matchesSearch = env.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || env.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: envelopes.length,
    draft: envelopes.filter(e => e.status === 'draft').length,
    pending: envelopes.filter(e => e.status === 'pending').length,
    completed: envelopes.filter(e => e.status === 'completed').length,
    anchored: envelopes.filter(e => e.status === 'anchored').length,
  }

  return (
    <AppShell title={t('envelopes.title')}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('envelopes.title')}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your signing envelopes
            </p>
          </div>
          <Button onClick={() => navigate('/app/envelopes/new')}>
            <Plus className="w-5 h-5 mr-2" />
            {t('envelopes.newEnvelope')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search envelopes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'draft', 'pending', 'completed', 'anchored'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-xs opacity-70">
                  ({statusCounts[status]})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Envelopes List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredEnvelopes.length === 0 ? (
          <Card className="text-center py-16">
            <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No envelopes found' : 'No envelopes yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first envelope to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => navigate('/app/envelopes/new')}>
                <Plus className="w-5 h-5 mr-2" />
                Create Envelope
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEnvelopes.map((envelope) => (
              <Card
                key={envelope.id}
                className="hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/app/envelopes/${envelope.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold truncate">{envelope.title}</h3>
                        <Badge className={getStatusBadge(envelope.status)}>
                          {getStatusIcon(envelope.status)}
                          <span className="ml-1">{envelope.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {envelope.signers.filter(s => s.status === 'signed').length}/{envelope.signers.length} signers
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(envelope.createdAt).toLocaleDateString()}</span>
                        </div>
                        {envelope.completedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <span>Completed {new Date(envelope.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

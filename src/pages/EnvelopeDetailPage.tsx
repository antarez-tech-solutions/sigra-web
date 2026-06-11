import { useParams, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useToast } from '../components/ToastProvider'
import { apiClient } from '../api/client'
import { useEffect, useState } from 'react'
import { Envelope } from '../api/types'
import { 
  Send, 
  FileText, 
  Users, 
  Shield, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Mail,
  ArrowLeft
} from 'lucide-react'

export function EnvelopeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [envelope, setEnvelope] = useState<Envelope | null>(null)

  useEffect(() => {
    if (id) {
      loadEnvelope(id)
    }
  }, [id])

  const loadEnvelope = async (envelopeId: string) => {
    try {
      const env = await apiClient.getEnvelope(envelopeId)
      setEnvelope(env)
    } catch (error) {
      showToast('error', 'Failed to load envelope')
      console.error('Load envelope error:', error)
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

  if (loading) {
    return (
      <AppShell title="Loading...">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!envelope) {
    return (
      <AppShell title="Not Found">
        <div className="max-w-4xl mx-auto text-center py-16">
          <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Envelope not found</h2>
          <p className="text-muted-foreground mb-6">
            The envelope you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/app/envelopes')}>
            Back to Envelopes
          </Button>
        </div>
      </AppShell>
    )
  }

  const signedCount = envelope.signers.filter(s => s.status === 'signed').length
  const totalCount = envelope.signers.length

  return (
    <AppShell title={envelope.title}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/app/envelopes')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Envelopes
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{envelope.title}</h1>
                <Badge className={getStatusBadge(envelope.status)}>
                  {envelope.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Created on {new Date(envelope.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {envelope.status === 'anchored' && (
              <Button variant="secondary">
                <Shield className="w-5 h-5 mr-2" />
                View on Blockchain
              </Button>
            )}
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Signing Progress</span>
              <span className="font-semibold">{signedCount}/{totalCount} signed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${(signedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Document Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Document ID:</span>
                <p className="font-mono text-xs mt-1">{envelope.documentId}</p>
              </div>
              {envelope.completedAt && (
                <div>
                  <span className="text-muted-foreground">Completed:</span>
                  <p className="font-semibold mt-1">
                    {new Date(envelope.completedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {envelope.anchoredAt && (
                <div>
                  <span className="text-muted-foreground">Anchored:</span>
                  <p className="font-semibold mt-1">
                    {new Date(envelope.anchoredAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {envelope.status === 'anchored' && envelope.transactionHash && (
            <Card>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Blockchain Proof
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Network:</span>
                  <p className="font-semibold mt-1">Ethereum L2 (Base)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Merkle Root:</span>
                  <p className="font-mono text-xs mt-1 break-all">{envelope.merkleRoot}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Transaction:</span>
                  <a
                    href={`https://basescan.org/tx/${envelope.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:text-primary-hover mt-1"
                  >
                    <span className="font-mono text-xs break-all">{envelope.transactionHash}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Signers */}
        <Card>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Signers ({totalCount})
          </h2>
          <div className="space-y-4">
            {envelope.signers.map((signer, index) => (
              <div
                key={signer.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{signer.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {signer.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusBadge(signer.status)}>
                    {signer.status === 'signed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {signer.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {signer.status}
                  </Badge>
                  {signer.signedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(signer.signedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

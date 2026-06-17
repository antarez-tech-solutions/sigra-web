import { useTranslation } from 'react-i18next'
import { PublicHeader } from '../components/PublicHeader'
import { PublicFooter } from '../components/PublicFooter'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { apiClient } from '../api/client'
import { useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { Shield, CheckCircle2, XCircle, Clock, ExternalLink, FileText, Users, Calendar } from 'lucide-react'
import { Envelope } from '../api/types'

export function VerifyPage() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ verified: boolean; envelope?: Envelope } | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hash.trim()) {
      showToast('error', 'Please enter a document hash')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await apiClient.verifyDocument(hash.trim())
      setResult(response)
      if (response.verified) {
        showToast('success', 'Document verified successfully!')
      } else {
        showToast('warning', 'Document not found in our records')
      }
    } catch (error) {
      showToast('error', 'Failed to verify document. Please try again.')
      console.error('Verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{t('verify.title')}</h1>
              <p className="text-lg text-muted-foreground">
                {t('verify.subtitle')}
              </p>
            </div>

            <Card className="mb-8">
              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  label={t('verify.inputLabel')}
                  placeholder={t('verify.inputPlaceholder')}
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="font-mono"
                />
                <Button type="submit" loading={loading} className="w-full">
                  {t('verify.button')}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <strong>How to find your document hash:</strong> The hash is a 66-character string 
                  starting with "0x" that was provided when the document was signed. You can find it 
                  in the signed document's details page or in the email confirmation.
                </p>
              </div>
            </Card>

            {result && (
              <div className="animate-slide-up">
                {result.verified && result.envelope ? (
                  <Card className="border-success/50 bg-success/5">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-success mb-2">
                          {t('verify.verified.title')}
                        </h2>
                        <p className="text-muted-foreground">
                          {t('verify.verified.description')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="p-4 rounded-lg bg-background border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Document Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Title:</span>
                            <p className="font-medium">{result.envelope.title}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(result.envelope.status)}`}>
                              {result.envelope.status.charAt(0).toUpperCase() + result.envelope.status.slice(1)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <p className="font-medium">{formatDate(result.envelope.createdAt)}</p>
                          </div>
                          {result.envelope.completedAt && (
                            <div>
                              <span className="text-muted-foreground">Completed:</span>
                              <p className="font-medium">{formatDate(result.envelope.completedAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-background border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Signers ({result.envelope.signers.length})
                        </h3>
                        <div className="space-y-2">
                          {result.envelope.signers.map((signer) => (
                            <div key={signer.id} className="flex items-center justify-between text-sm">
                              <div>
                                <p className="font-medium">{signer.name}</p>
                                <p className="text-muted-foreground text-xs">{signer.email}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(signer.status)}`}>
                                {signer.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {result.envelope.status === 'anchored' && result.envelope.transactionHash && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Blockchain Verification
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Network:</span>
                              <p className="font-medium">Ethereum L2 (Base)</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Merkle Root:</span>
                              <p className="font-mono text-xs break-all">{result.envelope.merkleRoot}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              <p className="font-mono text-xs break-all">{result.envelope.transactionHash}</p>
                            </div>
                            <a
                              href={`https://basescan.org/tx/${result.envelope.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mt-2"
                            >
                              View on Blockchain Explorer
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={() => window.print()}
                        className="flex-1"
                      >
                        Download Verification Report
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setHash('')
                          setResult(null)
                        }}
                      >
                        Verify Another
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="border-warning/50 bg-warning/5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-warning" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-warning mb-2">
                          {t('verify.notFound.title')}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {t('verify.notFound.description')}
                        </p>
                        <div className="p-4 rounded-lg bg-background border border-border mb-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Hash searched:</strong>
                          </p>
                          <p className="font-mono text-xs break-all">{hash}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            <strong>Possible reasons:</strong>
                          </p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                            <li>The document has not been signed on SigraChain</li>
                            <li>The hash was entered incorrectly</li>
                            <li>The document was signed using a different platform</li>
                          </ul>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setHash('')
                            setResult(null)
                          }}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {!result && (
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Independent Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify documents without needing a SigraChain account
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get verification results in seconds with full blockchain proof
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Cryptographic Proof</h3>
                  <p className="text-sm text-muted-foreground">
                    Merkle proof verification ensures document integrity
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <PublicFooter />
    </div>
  )
}

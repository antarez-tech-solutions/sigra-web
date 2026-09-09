import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiClient, apiErrorMessage } from '../api/client'
import { ApiHashResult } from '../api/wire'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Input } from '../components/Input'
import { PublicHeader } from '../components/PublicHeader'
import { PublicFooter } from '../components/PublicFooter'
import { SHA256_HEX_RE, sha256HexOfFile } from '../lib/hash'
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  FileUp,
} from 'lucide-react'

export function VerifyPage() {
  const { t } = useTranslation()
  const [hash, setHash] = useState('')
  const [result, setResult] = useState<ApiHashResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const verify = async (value: string) => {
    const trimmed = value.trim().toLowerCase()
    if (!SHA256_HEX_RE.test(trimmed)) {
      setError('Enter a valid SHA-256 hash — 64 hexadecimal characters.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      setResult(await apiClient.verifyHash(trimmed))
    } catch (e) {
      setError(apiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await verify(hash)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // The file never leaves the machine: only its SHA-256 is sent.
    const digest = await sha256HexOfFile(file)
    setHash(digest)
    await verify(digest)
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

            <Card className="p-8 mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('verify.inputLabel')}
                  placeholder={t('verify.inputPlaceholder')}
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                />
                {error && (
                  <p className="text-sm text-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? '…' : t('verify.button')}
                  </Button>
                  <label className="flex-1">
                    <span className="sr-only">Verify by uploading the file</span>
                    <input
                      type="file"
                      onChange={handleFile}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer"
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <FileUp className="w-4 h-4" />
                  Or pick the file itself — it is hashed locally with WebCrypto
                  and never uploaded.
                </p>
              </form>
            </Card>

            {result && (
              result.found ? (
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

                  <div className="p-4 rounded-lg bg-background border border-border space-y-2 text-sm">
                    {result.anchored ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">Attestation UID:</span>
                          <p className="font-mono text-xs break-all">{result.attestation_uid}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Merkle Root:</span>
                          <p className="font-mono text-xs break-all">{result.merkle_root}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Network:</span>
                          <p className="font-medium">Base (chain {result.chain_id})</p>
                        </div>
                        {result.attestation_uid && (
                          <a
                            href={`https://basescan.org/tx/${result.attestation_uid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mt-2"
                          >
                            View on Blockchain Explorer
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </>
                    ) : (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Signed, not yet anchored on-chain.
                      </p>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setHash('')
                      setResult(null)
                    }}
                    className="mt-4"
                  >
                    Verify Another
                  </Button>
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
                        <p className="font-mono text-xs break-all">{result.hash}</p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setHash('')
                          setResult(null)
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </Card>
              )
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
                  <h3 className="font-semibold mb-2">Private by Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify by hash — the document itself never leaves your machine
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

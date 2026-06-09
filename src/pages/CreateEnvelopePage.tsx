import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { useToast } from '../components/ToastProvider'
import { apiClient } from '../api/client'
import { useEffect, useState } from 'react'
import { Document } from '../api/types'
import { 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Send
} from 'lucide-react'

interface Signer {
  name: string
  email: string
}

export function CreateEnvelopePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocId, setSelectedDocId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [signers, setSigners] = useState<Signer[]>([{ name: '', email: '' }])

  useEffect(() => {
    loadDocuments()
    // Pre-select document if passed via state
    const state = location.state as { documentId?: string } | null
    if (state?.documentId) {
      setSelectedDocId(state.documentId)
    }
  }, [location.state])

  const loadDocuments = async () => {
    try {
      const docs = await apiClient.getDocuments()
      setDocuments(docs)
    } catch (error) {
      showToast('error', 'Failed to load documents')
      console.error('Load documents error:', error)
    }
  }

  const addSigner = () => {
    setSigners([...signers, { name: '', email: '' }])
  }

  const removeSigner = (index: number) => {
    if (signers.length === 1) {
      showToast('error', 'At least one signer is required')
      return
    }
    setSigners(signers.filter((_, i) => i !== index))
  }

  const updateSigner = (index: number, field: keyof Signer, value: string) => {
    const updated = [...signers]
    updated[index] = { ...updated[index], [field]: value }
    setSigners(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDocId) {
      showToast('error', 'Please select a document')
      return
    }

    if (!title.trim()) {
      showToast('error', 'Please enter a title')
      return
    }

    const invalidSigners = signers.filter(s => !s.name.trim() || !s.email.trim())
    if (invalidSigners.length > 0) {
      showToast('error', 'All signers must have name and email')
      return
    }

    setLoading(true)
    try {
      // Mock create - in real app, this would call apiClient.createEnvelope()
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      showToast('success', 'Envelope created successfully!')
      navigate('/app/envelopes')
    } catch (error) {
      showToast('error', 'Failed to create envelope')
      console.error('Create envelope error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell title="Create Envelope">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/app/envelopes')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Envelopes
        </Button>

        <form onSubmit={handleSubmit}>
          {/* Document Selection */}
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Select Document
            </h2>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No documents available</p>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/app/documents')}
                >
                  Upload Document
                </Button>
              </div>
            ) : (
              <Select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                required
              >
                <option value="">Choose a document...</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.filename} ({(doc.size / 1024).toFixed(1)} KB)
                  </option>
                ))}
              </Select>
            )}
          </Card>

          {/* Envelope Details */}
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Envelope Details</h2>
            <Input
              label="Title"
              placeholder="e.g., NDA Agreement with Acme Corp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Card>

          {/* Signers */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Signers
              </h2>
              <Button variant="secondary" size="sm" onClick={addSigner} type="button">
                <Plus className="w-4 h-4 mr-1" />
                Add Signer
              </Button>
            </div>

            <div className="space-y-4">
              {signers.map((signer, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Signer {index + 1}
                    </span>
                    {signers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSigner(index)}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Full name"
                      value={signer.name}
                      onChange={(e) => updateSigner(index, 'name', e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={signer.email}
                      onChange={(e) => updateSigner(index, 'email', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/app/envelopes')}
              className="flex-1"
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              <Send className="w-5 h-5 mr-2" />
              Create Envelope
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}

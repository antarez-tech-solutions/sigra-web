import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { useToast } from '../components/ToastProvider'
import { apiClient } from '../api/client'
import { useEffect, useState } from 'react'
import { Document } from '../api/types'
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  MoreVertical,
  Calendar,
  HardDrive
} from 'lucide-react'

export function DocumentsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await apiClient.getDocuments()
      setDocuments(docs)
    } catch (error) {
      showToast('error', 'Failed to load documents')
      console.error('Load documents error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('error', 'Please select a file')
      return
    }

    setUploading(true)
    try {
      // Mock upload - in real app, this would call apiClient.uploadDocument()
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        filename: selectedFile.name,
        size: selectedFile.size,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        uploadedAt: new Date().toISOString(),
        userId: 'user-1',
      }
      
      setDocuments([newDoc, ...documents])
      showToast('success', 'Document uploaded successfully!')
      setUploadModalOpen(false)
      setSelectedFile(null)
    } catch (error) {
      showToast('error', 'Failed to upload document')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setDocuments(documents.filter(d => d.id !== id))
      showToast('success', 'Document deleted')
    } catch (error) {
      showToast('error', 'Failed to delete document')
      console.error('Delete error:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell title={t('documents.title')}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('documents.title')}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your uploaded documents
            </p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-5 h-5 mr-2" />
            {t('documents.upload')}
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Upload your first document to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setUploadModalOpen(true)}>
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="relative group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold mb-2 truncate">{doc.filename}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Hash:</p>
                  <p className="text-xs font-mono truncate">{doc.hash}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate('/app/envelopes/new', { state: { documentId: doc.id } })}
                  >
                    Create Envelope
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(doc.hash)
                      showToast('success', 'Hash copied to clipboard')
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false)
            setSelectedFile(null)
          }}
          title="Upload Document"
        >
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold mb-2">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF files up to 10MB
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            {selectedFile && (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold mb-1">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setUploadModalOpen(false)
                  setSelectedFile(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                loading={uploading}
                disabled={!selectedFile}
                className="flex-1"
              >
                Upload
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  )
}

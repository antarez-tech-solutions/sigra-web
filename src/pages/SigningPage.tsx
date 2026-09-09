import { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useToast } from '../components/ToastProvider'
import { 
  FileText, 
  CheckCircle2, 
  Shield,
  PenTool,
  Type
} from 'lucide-react'

export function SigningPage() {
  const { showToast } = useToast()
  const [signingMethod, setSigningMethod] = useState<'draw' | 'type'>('draw')
  const [typedSignature, setTypedSignature] = useState('')
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  // Mock envelope data - in real app, fetch via token
  const envelope = {
    id: 'env-1',
    title: 'NDA Agreement with Acme Corp',
    documentName: 'NDA_Agreement.pdf',
    senderName: 'John Doe',
    signerName: 'Jane Smith',
  }

  const handleSign = async () => {
    if (signingMethod === 'type' && !typedSignature.trim()) {
      showToast('error', 'Please type your signature')
      return
    }

    setSigning(true)
    try {
      // Mock signing - in real app, this would call apiClient.signEnvelope()
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSigned(true)
      showToast('success', 'Document signed successfully!')
    } catch (error) {
      showToast('error', 'Failed to sign document')
      console.error('Sign error:', error)
    } finally {
      setSigning(false)
    }
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Document Signed!</h1>
          <p className="text-muted-foreground mb-8">
            Your signature has been successfully recorded. You will receive a confirmation email shortly.
          </p>
          <Card className="mb-6">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Document:</span>
                <p className="font-semibold">{envelope.documentName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Envelope:</span>
                <p className="font-semibold">{envelope.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Signed by:</span>
                <p className="font-semibold">{envelope.signerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Signed at:</span>
                <p className="font-semibold">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-semibold text-primary mb-1">
                  What happens next?
                </p>
                <p className="text-muted-foreground">
                  Once all signers complete, the document will be anchored on the blockchain for permanent verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SigraChain" className="h-8 w-auto" />
            <span className="font-bold text-xl">SigraChain</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Signing invitation from {envelope.senderName}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">{envelope.title}</h2>
                  <p className="text-sm text-muted-foreground">{envelope.documentName}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Mock PDF Preview */}
              <div className="bg-muted rounded-lg p-8 min-h-[600px] border border-border">
                <div className="bg-white rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-center mb-8">
                      NON-DISCLOSURE AGREEMENT
                    </h1>
                    <p className="text-sm text-gray-700">
                      This Non-Disclosure Agreement ("Agreement") is entered into as of the date of last signature below by and between the parties.
                    </p>
                    <h2 className="text-lg font-semibold mt-6">1. Definition of Confidential Information</h2>
                    <p className="text-sm text-gray-700">
                      "Confidential Information" means any information disclosed by either party to the other party that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.
                    </p>
                    <h2 className="text-lg font-semibold mt-6">2. Obligations of Receiving Party</h2>
                    <p className="text-sm text-gray-700">
                      The receiving party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the disclosing party.
                    </p>
                    <h2 className="text-lg font-semibold mt-6">3. Time Periods</h2>
                    <p className="text-sm text-gray-700">
                      The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and receiving party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret.
                    </p>
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Disclosing Party Signature</p>
                          <div className="border-b-2 border-gray-300 pb-2 mb-2 h-12"></div>
                          <p className="text-xs text-gray-500">John Doe</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Receiving Party Signature</p>
                          <div className="border-b-2 border-primary pb-2 mb-2 h-12 bg-primary/5"></div>
                          <p className="text-xs text-primary font-semibold">Your signature required</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Signing Panel */}
          <div>
            <Card className="sticky top-8">
              <h2 className="text-xl font-bold mb-6">Sign Document</h2>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Signing as:</p>
                <p className="font-semibold">{envelope.signerName}</p>
              </div>

              {/* Signing Method Toggle */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={signingMethod === 'draw' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSigningMethod('draw')}
                  className="flex-1"
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Draw
                </Button>
                <Button
                  variant={signingMethod === 'type' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSigningMethod('type')}
                  className="flex-1"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Type
                </Button>
              </div>

              {/* Drawing Canvas */}
              {signingMethod === 'draw' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Draw your signature
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/30 text-center">
                    <PenTool className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Click and drag to draw your signature
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Canvas drawing would be implemented here)
                    </p>
                  </div>
                </div>
              )}

              {/* Typed Signature */}
              {signingMethod === 'type' && (
                <div className="mb-6">
                  <Input
                    label="Type your full name"
                    placeholder="Jane Smith"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                  />
                  {typedSignature && (
                    <div className="mt-4 p-6 bg-muted/30 rounded-lg border border-border text-center">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <p className="text-2xl font-serif italic">{typedSignature}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Legal Notice */}
              <div className="p-4 rounded-lg bg-muted/50 mb-6 text-xs text-muted-foreground">
                <p className="mb-2">
                  <strong>Legal Notice:</strong> By clicking "Sign Document", you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your electronic signature is legally binding</li>
                  <li>You have read and understood the document</li>
                  <li>You agree to the terms outlined in the document</li>
                </ul>
              </div>

              {/* Sign Button */}
              <Button
                onClick={handleSign}
                loading={signing}
                className="w-full"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Sign Document
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                This action cannot be undone
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

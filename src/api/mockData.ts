import { User, Document, Envelope } from './types'

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@sigra.io',
  firstName: 'Demo',
  lastName: 'User',
  company: 'SigraChain',
  plan: 'pro',
  createdAt: '2026-01-15T10:00:00Z',
}

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    filename: 'NDA_Agreement.pdf',
    size: 245760,
    hash: '0x1a2b3c4d5e6f...',
    uploadedAt: '2026-06-08T14:30:00Z',
    userId: 'user-1',
  },
  {
    id: 'doc-2',
    filename: 'Employment_Contract.pdf',
    size: 512000,
    hash: '0x7g8h9i0j1k2l...',
    uploadedAt: '2026-06-07T10:15:00Z',
    userId: 'user-1',
  },
  {
    id: 'doc-3',
    filename: 'Lease_Agreement.pdf',
    size: 1024000,
    hash: '0x3m4n5o6p7q8r...',
    uploadedAt: '2026-06-05T09:00:00Z',
    userId: 'user-1',
  },
]

export const mockEnvelopes: Envelope[] = [
  {
    id: 'env-1',
    documentId: 'doc-1',
    title: 'NDA with Acme Corp',
    status: 'anchored',
    createdAt: '2026-06-08T14:35:00Z',
    completedAt: '2026-06-08T16:30:00Z',
    anchoredAt: '2026-06-08T18:00:00Z',
    signers: [
      {
        id: 'signer-1',
        email: 'alice@acme.com',
        name: 'Alice Johnson',
        status: 'signed',
        signedAt: '2026-06-08T15:00:00Z',
      },
      {
        id: 'signer-2',
        email: 'bob@acme.com',
        name: 'Bob Smith',
        status: 'signed',
        signedAt: '2026-06-08T16:30:00Z',
      },
    ],
    merkleRoot: '0xabc123...',
    transactionHash: '0xdef456...',
  },
  {
    id: 'env-2',
    documentId: 'doc-2',
    title: 'Employment Contract - John Doe',
    status: 'pending',
    createdAt: '2026-06-07T10:20:00Z',
    signers: [
      {
        id: 'signer-3',
        email: 'john.doe@example.com',
        name: 'John Doe',
        status: 'signed',
        signedAt: '2026-06-07T14:00:00Z',
      },
      {
        id: 'signer-4',
        email: 'hr@company.com',
        name: 'HR Manager',
        status: 'pending',
      },
    ],
  },
  {
    id: 'env-3',
    documentId: 'doc-3',
    title: 'Office Lease Agreement',
    status: 'completed',
    createdAt: '2026-06-05T09:05:00Z',
    completedAt: '2026-06-06T11:00:00Z',
    signers: [
      {
        id: 'signer-5',
        email: 'landlord@property.com',
        name: 'Property Owner',
        status: 'signed',
        signedAt: '2026-06-05T15:00:00Z',
      },
      {
        id: 'signer-6',
        email: 'tenant@company.com',
        name: 'Company CEO',
        status: 'signed',
        signedAt: '2026-06-06T11:00:00Z',
      },
    ],
  },
]

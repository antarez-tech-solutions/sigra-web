export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  plan: 'free' | 'pro' | 'business'
  createdAt: string
}

export interface Document {
  id: string
  filename: string
  size: number
  hash: string
  uploadedAt: string
  userId: string
}

export interface Envelope {
  id: string
  documentId: string
  title: string
  status: 'draft' | 'pending' | 'completed' | 'anchored'
  createdAt: string
  completedAt?: string
  anchoredAt?: string
  signers: Signer[]
  merkleRoot?: string
  transactionHash?: string
}

export interface Signer {
  id: string
  email: string
  name: string
  status: 'pending' | 'signed' | 'declined'
  signedAt?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  company?: string
}

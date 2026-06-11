import axios, { AxiosInstance, AxiosError } from 'axios'
import { User, Document, Envelope, LoginRequest, RegisterRequest, AuthResponse } from './types'
import { mockUser, mockDocuments, mockEnvelopes } from './mockData'

class ApiClient {
  private client: AxiosInstance
  private useMock: boolean = true

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('refresh-token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    if (this.useMock) {
      await this.delay()
      if (data.email === 'demo@sigra.io' && data.password === 'password') {
        return {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
        }
      }
      throw new Error('Invalid email or password')
    }
    const response = await this.client.post<AuthResponse>('/auth/login', data)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (this.useMock) {
      await this.delay()
      return {
        user: {
          ...mockUser,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
        },
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }
    }
    const response = await this.client.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMock) {
      await this.delay(300)
      return mockUser
    }
    const response = await this.client.get<User>('/auth/me')
    return response.data
  }

  async getDocuments(): Promise<Document[]> {
    if (this.useMock) {
      await this.delay()
      return mockDocuments
    }
    const response = await this.client.get<Document[]>('/documents')
    return response.data
  }

  async getDocument(id: string): Promise<Document> {
    if (this.useMock) {
      await this.delay()
      const doc = mockDocuments.find(d => d.id === id)
      if (!doc) throw new Error('Document not found')
      return doc
    }
    const response = await this.client.get<Document>(`/documents/${id}`)
    return response.data
  }

  async getEnvelopes(): Promise<Envelope[]> {
    if (this.useMock) {
      await this.delay()
      return mockEnvelopes
    }
    const response = await this.client.get<Envelope[]>('/envelopes')
    return response.data
  }

  async getEnvelope(id: string): Promise<Envelope> {
    if (this.useMock) {
      await this.delay()
      const env = mockEnvelopes.find(e => e.id === id)
      if (!env) throw new Error('Envelope not found')
      return env
    }
    const response = await this.client.get<Envelope>(`/envelopes/${id}`)
    return response.data
  }

  async verifyDocument(hash: string): Promise<{ verified: boolean; envelope?: Envelope }> {
    if (this.useMock) {
      await this.delay(800)
      const env = mockEnvelopes.find(e => 
        mockDocuments.find(d => d.id === e.documentId)?.hash === hash
      )
      return { verified: !!env, envelope: env }
    }
    const response = await this.client.post('/verify', { hash })
    return response.data
  }

  async logout(): Promise<void> {
    if (this.useMock) {
      await this.delay(200)
      return
    }
    await this.client.post('/auth/logout')
  }
}

export const apiClient = new ApiClient()

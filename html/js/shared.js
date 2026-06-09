const PAGES = {
  'landing': 'pages/landing.html',
  'pricing': 'pages/pricing.html',
  'verify': 'pages/verify.html',
  'login': 'pages/login.html',
  'register': 'pages/register.html',
  'dashboard': 'pages/dashboard.html',
  'documents': 'pages/documents.html',
  'envelopes': 'pages/envelopes.html',
  'envelope-new': 'pages/envelope-new.html',
  'envelope-detail': 'pages/envelope-detail.html',
  'signing': 'pages/signing.html',
  'settings': 'pages/settings.html',
  'billing': 'pages/billing.html',
};

function navigate(page) {
  window.location.href = PAGES[page] || 'pages/landing.html';
}

const MOCK_USER = {
  id: 'usr_abc123',
  email: 'maria@example.com',
  name: 'Maria Silva',
  plan: 'free',
  docsThisMonth: 3,
  docsLimit: 5,
};

const MOCK_DOCUMENTS = [
  { id: 'doc_001', filename: 'NDA_AcmeCorp.pdf', content_type: 'application/pdf', size_bytes: 245760, hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', created_at: '2026-06-08T14:30:00Z' },
  { id: 'doc_002', filename: 'Contract_SupplierXYZ.pdf', content_type: 'application/pdf', size_bytes: 512000, hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', created_at: '2026-06-07T10:15:00Z' },
  { id: 'doc_003', filename: 'Invoice_May2026.pdf', content_type: 'application/pdf', size_bytes: 128000, hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', created_at: '2026-06-05T09:00:00Z' },
];

const MOCK_ENVELOPES = [
  {
    id: 'env_001', document_id: 'doc_001', title: 'NDA with Acme Corp', status: 'anchored',
    signing_order: 'sequential', deadline: '2026-06-15T23:59:00Z',
    attestation_uid: '0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
    merkle_root: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    signers: [
      { id: 'sig_001', name: 'Maria Silva', email: 'maria@example.com', order: 1, status: 'signed', signed_at: '2026-06-08T15:00:00Z' },
      { id: 'sig_002', name: 'John Smith', email: 'john@acmecorp.com', order: 2, status: 'signed', signed_at: '2026-06-08T16:30:00Z' },
    ],
    created_at: '2026-06-08T14:35:00Z',
  },
  {
    id: 'env_002', document_id: 'doc_002', title: 'Supplier Agreement', status: 'pending',
    signing_order: 'parallel', deadline: '2026-06-20T23:59:00Z',
    attestation_uid: null, merkle_root: null,
    signers: [
      { id: 'sig_003', name: 'Maria Silva', email: 'maria@example.com', order: 1, status: 'signed', signed_at: '2026-06-07T11:00:00Z' },
      { id: 'sig_004', name: 'Carlos Lopez', email: 'carlos@supplierxyz.com', order: 2, status: 'pending', signed_at: null },
      { id: 'sig_005', name: 'Ana Torres', email: 'ana@supplierxyz.com', order: 3, status: 'pending', signed_at: null },
    ],
    created_at: '2026-06-07T10:20:00Z',
  },
  {
    id: 'env_003', document_id: 'doc_003', title: 'Invoice May 2026', status: 'completed',
    signing_order: 'sequential', deadline: null,
    attestation_uid: null, merkle_root: null,
    signers: [
      { id: 'sig_006', name: 'Maria Silva', email: 'maria@example.com', order: 1, status: 'signed', signed_at: '2026-06-05T09:30:00Z' },
      { id: 'sig_007', name: 'Roberto Chen', email: 'roberto@client.com', order: 2, status: 'signed', signed_at: '2026-06-06T08:15:00Z' },
    ],
    created_at: '2026-06-05T09:05:00Z',
  },
];

const MOCK_VERIFY_VERIFIED = {
  hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
  found: true, anchored: true, document_id: 'doc_001', filename: 'NDA_AcmeCorp.pdf',
  attestation_uid: '0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
  merkle_root: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  chain_id: 8453,
};

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncateHash(hash, chars = 8) {
  if (!hash) return '—';
  return hash.substring(0, chars) + '...' + hash.substring(hash.length - chars);
}

function statusBadge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

function getChainExplorerUrl(chainId, attestationUid) {
  if (chainId === 8453) return `https://base.easscan.org/attestation/view/${attestationUid}`;
  if (chainId === 42161) return `https://arb.easscan.org/attestation/view/${attestationUid}`;
  return `https://easscan.org/attestation/view/${attestationUid}`;
}

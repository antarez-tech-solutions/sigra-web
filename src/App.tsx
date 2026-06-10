import { Routes, Route, Navigate } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">SigraChain</h1>
        <p className="text-xl text-gray-600 mb-8">Every Signature, Forever Verifiable</p>
        <p className="text-sm text-gray-500">React application scaffolded successfully</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

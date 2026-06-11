# sigra-web

The frontend application for the Sigra e-signature platform — document upload, signer management, signing workflow, blockchain verification, and subscription management.

Built with React and TypeScript, consuming the Sigra backend services: `sigra-service` for the core API, `sigrachain-crypto-engine` for hash verification, and `antarez-eas-client` for on-chain attestation lookups.

## Status

**In development.** Frontend scaffolding and UI components are complete. API integration is in progress.

## Features

- Landing page, pricing, and public verification portal
- Authentication flow (login, register, password recovery)
- Dashboard with document stats and recent activity
- Document upload, search, and management
- Envelope creation, listing, and signing workflow
- User settings (profile, preferences, security)
- Billing and subscription management
- Light/dark theme with system preference detection
- Internationalization (English + Portuguese-BR)

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design tokens
- **Routing:** React Router
- **i18n:** react-i18next (English + Portuguese-BR)
- **HTTP Client:** axios (with mock API layer for development)

## Architecture

```
sigra-web (React)
├── sigra-service             — core API (documents, envelopes, signing)
├── sigrachain-crypto-engine  — hash verification, Merkle proof validation
└── antarez-eas-client        — on-chain attestation lookups
```

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

### Available Scripts

- `npm run dev` — Start development server (port 3000)
- `npm run build` — Build for production
- `npm run preview` — Preview production build (port 4173)
- `npm run lint` — Run ESLint

### Mock API

The application includes a complete mock API layer for development. To switch to a real backend, set `useMock = false` in `src/api/client.ts` and configure `VITE_API_URL`.

## Project Structure

```
src/
├── api/          — API client and mock data
├── components/   — Reusable UI components
├── contexts/     — React contexts (Auth, Theme, Toast)
├── i18n/         — Internationalization
├── pages/        — Page components
├── types/        — TypeScript type definitions
└── main.tsx      — Application entry point
```

## License

This repository and all contributions are licensed under the [LGPL 3.0](https://www.gnu.org/licenses/lgpl-3.0.html), unless otherwise specified in subdirectory LICENSE files.

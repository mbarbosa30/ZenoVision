# Zeno Vision Landing Page

## Overview

This is the marketing website for Zeno Vision, an AI-native Web3 venture studio. The site targets investors, partners, and collaborators with a professional, sharp-cornered design aesthetic. Core tagline: "Measure what matters. Ship what moves."

Key features:
- **Homepage** (`/`): Hero section with metrics, thesis blocks, process steps, full portfolio (8 products), partner network, and contact form
- **About page** (`/about`): "Why Zeno" section (quantum physics, Stoic philosophy, paradoxes), vision, operations, distribution rails, and team
- **Investment Memo page** (`/memo`): Full investment thesis with TL;DR, status, portfolio highlights, business model, $ZENO tokenomics, and fundraising round details
- **Admin page** (`/admin`): Protected dashboard for viewing inquiries and managing projects (requires ADMIN_PASSWORD)
- Interest form submission with role selection (Investor/Partner/Collaborator)
- Professional dark theme with sharp corners (no rounded elements)
- Responsive design for desktop and mobile

## Design System

- **Color Palette**: Dark charcoal (#0f0f0f, #1a1a1a, #2d2d2d), blue accent (#3b82f6)
- **Typography**: Sharp, professional headings with gray body text (#a0aec0)
- **Components**: Sharp corners only (CSS radius: 0), visible borders
- **Animations**: Subtle fade-in on scroll with Framer Motion

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Fonts**: Space Grotesk (headings), Inter (body), JetBrains Mono (code)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **Build**: Vite for client, esbuild for server bundling
- **API Design**: RESTful endpoints under `/api` prefix

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # UI components (shadcn/ui)
      block.tsx   # Shared Block component (used across all pages)
      dashboard/  # Dashboard-specific extracted components
        metric-definitions.ts  # Metric info definitions
        ui-components.tsx      # StatCard, InfoButton, InfoModal, formatNum
        data-utils.ts          # processHistoricalSnapshots, calculateGrowthRates
        index.ts               # Re-exports
      password-gate.tsx  # Server-session-based password gate
    pages/        # Route components
      home.tsx    # Homepage with portfolio and contact form
      about.tsx   # About page with Why Zeno, vision, team
      memo.tsx    # Investment memo page
      admin.tsx   # Protected admin dashboard
      dashboard.tsx  # Portfolio metrics dashboard (public, no auth required)
      proposal.tsx   # Partnership proposal (gated)
      proposal-marco.tsx  # Personal proposal (gated)
      proposal-celo-self.tsx  # Initiative proposal (gated)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
      types.ts    # Shared TypeScript types (Project, Metrics, MetricsSnapshot, etc.)
server/           # Backend Express application
  index.ts        # Server entry point (cookie-parser enabled)
  routes.ts       # API route definitions (requireAdmin middleware for admin routes)
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle schema definitions
```

### Admin Security
- Server-side auth via HTTP-only `adminToken` cookie (secure in production)
- `requireAdmin` middleware protects all admin endpoints
- `/api/admin/verify` issues cookie, `/api/admin/session` validates, `/api/admin/logout` clears
- Public endpoints: `/api/projects` (GET, strips metricsApiKey/metricsEndpoint, adds hasMetrics flag), `/api/public-metrics`, `POST /api/inquiries`, `/api/metrics/public-latest`, `/api/metrics/public-history`
- Admin-only endpoints: `/api/metrics/latest`, `/api/metrics/history`, `/api/metrics/fetch-all`, `/api/metrics/fetch/:projectId`, `/api/inquiries` (GET), all project CRUD, all metrics DELETE

### Page Routes
- `/` - Homepage
- `/about` - About page
- `/memo` - Investment Memo page (password gated)
- `/admin` - Admin dashboard (password protected)
- `/dashboard` - Public portfolio metrics dashboard (no auth required, refresh uses admin auth)

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Static files served from `dist/public`, server bundled to `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently used)

### Third-Party Services
- None currently integrated, but packages available for:
  - Stripe (payments)
  - OpenAI / Google Generative AI
  - Nodemailer (email)
  - Passport (authentication)

### Key npm Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` + `drizzle-zod`: Database ORM and validation
- `framer-motion`: Animations
- `zod`: Schema validation
- `wouter`: Client-side routing
- Full shadcn/ui component library with Radix UI primitives
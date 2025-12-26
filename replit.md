# Zeno Vision / LabyRhythm Landing Page

## Overview

This is a single-page landing site for an AI-native Web3 venture studio. The primary purpose is to capture qualified interest from potential investors, partners, and collaborators through an interest form. The site showcases the studio's portfolio of shipped products with traction metrics and explains the partner-powered distribution model.

Key features:
- Landing page with hero, portfolio showcase, partner network section, and contact form
- Interest form submission with role selection (Investor/Partner/Collaborator)
- Dark/light theme toggle
- Responsive design for desktop and mobile

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
    pages/        # Route components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Backend Express application
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle schema definitions
```

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
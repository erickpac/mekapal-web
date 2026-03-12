# Mekapal Web

Logistics and transportation management console for Guatemala.

**pnpm** monorepo powered by **Turborepo**.

## Apps

| App | Description | Stack |
| --- | --- | --- |
| `apps/console` | Admin/backoffice dashboard | Vite + React 19 + TypeScript |
| `apps/landing` | Public landing page | Astro |

## Shared Packages

| Package | Description |
| --- | --- |
| `packages/tailwind-config` | Shared Tailwind configuration |
| `packages/types` | Shared TypeScript types |
| `packages/ui` | Shared UI components |

## Requirements

- **Node.js** >= 22.12.0
- **pnpm** 10.31.0+

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build
```

## Scripts

```bash
pnpm dev            # Start all apps
pnpm build          # Build all apps
pnpm lint           # Run ESLint
pnpm format         # Format with Prettier
pnpm format:check   # Check formatting
```

### Console

```bash
cd apps/console
pnpm dev            # Dev server
pnpm build          # tsc -b && vite build
pnpm lint           # ESLint
npx tsc --noEmit    # Type check only
```

## Tech Stack (Console)

- **React 19** + **TypeScript 5.9** (strict, `erasableSyntaxOnly`)
- **Vite 7** with **Tailwind CSS 4**
- **TanStack Router** (file-based routing)
- **TanStack React Query** for server state
- **react-hook-form** + **Zod 4** for forms
- **shadcn/ui v4** (Radix primitives)
- **Axios** with Bearer token interceptor
- **Recharts** for charts
- **Sonner** for toast notifications
- **Lucide React** for icons

## Project Structure

```
apps/
├── console/src/
│   ├── components/ui/    # shadcn/ui components
│   ├── features/         # Feature modules
│   │   └── {name}/
│   │       ├── api/      # API types & Axios functions
│   │       ├── hooks/    # TanStack Query hooks
│   │       └── components/
│   ├── routes/           # File-based routes (TanStack Router)
│   └── shared/           # Shared code (API client, types, utils)
└── landing/              # Landing page (Astro)
```

## Modules

- **auth** — Authentication & session management
- **dashboard** — Main dashboard with analytics
- **users** — User management
- **locations** — Location/branch management
- **incidents** — Incident reporting
- **validations** — Validation workflows
- **settlements** — Settlements
- **commissions** — Commissions
- **reports** — Reports

## Code Style

- No semicolons
- Single quotes
- Trailing commas
- 80 character width
- 2 space indentation

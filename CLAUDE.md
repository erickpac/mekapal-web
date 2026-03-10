# Mekapal Web

Logistics/transportation management console for Guatemala. pnpm monorepo with Turborepo.

## Apps

- `apps/console` — Admin/backoffice dashboard (Vite + React 19 + TypeScript)
- `apps/landing` — Public landing page (Astro)

## Commands

```bash
# From monorepo root
pnpm dev           # Start all apps
pnpm build         # Build all apps
pnpm format        # Format with Prettier

# From apps/console
pnpm dev           # Dev server
pnpm build         # tsc -b && vite build
pnpm lint          # ESLint
npx tsc --noEmit   # Type check only
```

Always verify changes compile: run `npx tsc --noEmit` and `npx vite build` from `apps/console`.

## Tech Stack (Console)

- **React 19** + **TypeScript 5.9** (strict, `erasableSyntaxOnly` — no `enum`, use `const` objects + type)
- **Vite 7** with `@tailwindcss/vite`
- **TanStack Router** (file-based routing in `src/routes/`)
- **TanStack React Query** for server state
- **react-hook-form** + **@hookform/resolvers** + **Zod 4** for forms
- **shadcn/ui v4** (Radix primitives) — add components via `pnpm dlx shadcn@latest add <name>`
- **Tailwind CSS v4** with CSS variables for theming
- **Axios** with Bearer token interceptor (`src/shared/api/client.ts`)
- **Recharts** for dashboard charts
- **Sonner** for toast notifications
- **Lucide React** for icons

## Project Structure (Console)

```
apps/console/src/
├── components/ui/       # shadcn/ui components
├── features/            # Feature modules
│   └── {name}/
│       ├── api/         # API types + axios functions
│       ├── hooks/       # TanStack Query hooks
│       └── components/  # Feature-specific components
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx
│   ├── _authenticated.tsx
│   └── _authenticated/  # Protected routes
└── shared/
    ├── api/             # Axios client config
    ├── types/           # Shared const enums (UserRole, etc.)
    └── utils/           # Route guards, helpers
```

## Key Conventions

- **Path alias**: `@/*` maps to `./src/*`
- **No regular enums**: Use `const` object + `type` pattern due to `erasableSyntaxOnly`
- **API base URL** includes `/api/` at the end — don't duplicate in endpoint paths
- **Currency**: Guatemalan Quetzal (Q), locale `es-GT`, currency code `GTQ`
- **Shared types** live in `src/shared/types/` — import directly, never re-export from feature modules
- **Feature isolation**: Each feature has its own `api/`, `hooks/`, `components/` directories
- **No Co-Authored-By** or any AI signature in commit messages

## Backend Reference

Backend is NestJS. Always read backend DTOs, controllers, and entities as the source of truth before modifying frontend API types.

## Formatting

- Prettier: no semicolons, single quotes, trailing commas, 80 char width, 2 space indent
- Plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`

## Known Backend Gaps

- No user listing/detail endpoint — users page is create-only

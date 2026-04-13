Audit `apps/console` for issues specific to the React 19 + Vite + TanStack + shadcn stack with `erasableSyntaxOnly`.

Run all checks across `apps/console/src/`. Skip `node_modules/`, `dist/`, generated route trees, and `apps/landing/`.

## Checks

### 1. Forbidden `enum` usage
`erasableSyntaxOnly` forbids TypeScript `enum`. Find any `enum ` declaration. The correct pattern is `const X = { ... } as const` + `type X = (typeof X)[keyof typeof X]`.

### 2. `any` type usage
Find explicit `: any`, `as any`, `<any>`. Also flag implicit `any` from missing type annotations on exported functions and hooks.

### 3. Duplicated `/api/` in endpoints
The Axios base URL already includes `/api/`. Find Axios calls (`client.get`, `client.post`, etc.) whose path starts with `/api/` — that produces `/api/api/...` and 404s.

### 4. Cross-feature imports (isolation violation)
Find imports inside `src/features/<A>/` that reach into `src/features/<B>/` (where A ≠ B). Cross-feature code must live in `src/shared/`.

### 5. Re-exports of shared types from feature modules
Shared types (e.g., `UserRole`) live in `src/shared/types/` and must be imported directly from there. Find files in `src/features/**/` that re-export anything from `src/shared/types/`.

### 6. Relative path imports
Find imports using `../../` or deeper. The path alias `@/*` should be used instead.

### 7. Direct shadcn/Radix bypass
shadcn components live in `src/components/ui/`. Find files (outside `src/components/ui/`) that import directly from `@radix-ui/*` instead of using the wrapped shadcn component — Radix should only be touched inside `src/components/ui/`.

### 8. Server state outside TanStack Query
Find `useEffect` blocks that call `axios`/`fetch` for data loading. Server state should go through TanStack Query hooks in `features/<name>/hooks/`.

### 9. Forms without Zod
Find `useForm(...)` calls without a `resolver: zodResolver(...)`. All forms must validate with Zod.

### 10. Currency / locale
- Find numeric currency formatting that doesn't use `Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' })`
- Flag any hardcoded currency code other than `GTQ` and any hardcoded locale other than `es-GT`

### 11. Hardcoded colors
Find hex colors (`#fff`, `#000`, etc.) and `rgb(...)` in `.tsx`/`.ts` files. The Tailwind v4 design tokens (CSS variables) should be used instead.

### 12. Console statements
Find `console.log`, `console.warn`, `console.error` in `src/`. Should not remain in committed code.

### 13. Protected routes outside `_authenticated/`
Routes that require auth must live under `src/routes/_authenticated/`. Find route files outside that folder that reference auth-only data (e.g., `useUser`, profile data).

## Output

For each check:
- ✅ Clean — no issues found
- ⚠️ `file:line` — Description

Group findings by check. End with a total count.

## Important

- Do **NOT** fix anything — report only.
- Ask before applying fixes.
- Focus on actionable issues, not style nitpicks (Prettier handles style).

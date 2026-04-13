Review all uncommitted changes in `apps/console` for quality and correctness against React 19 + TanStack + shadcn + `erasableSyntaxOnly` conventions.

## Steps

1. **Gather changes**:
   ```
   git status
   git diff
   git diff --staged
   ```

2. **Review each changed file** against the checks below.

## Checks

### Type Safety
- New `any` types introduced (`: any`, `as any`, `<any>`)
- `enum` keyword used (forbidden by `erasableSyntaxOnly` — must be `const` object + `type`)
- Missing type annotations on exported functions, hooks, and components
- Improper type assertions or unsafe casts

### Project Structure
- Cross-feature imports (one feature reaching into another's internals)
- Shared types re-exported from feature modules instead of imported from `src/shared/types/`
- Relative paths (`../../`) used instead of `@/*` alias
- New protected routes placed outside `src/routes/_authenticated/`

### API Layer
- `/api/` duplicated in endpoint paths (base URL already includes it)
- New API types invented without a backing backend DTO — surface as a gap, recommend running `api-contract-sync`
- Server state loaded via `useEffect` + `axios` instead of TanStack Query

### Forms
- `useForm` without `zodResolver`
- Manual validation logic that should be in a Zod schema
- Form state stored in component state instead of `react-hook-form`

### UI
- Direct `@radix-ui/*` imports outside `src/components/ui/`
- Hardcoded hex/rgb colors instead of Tailwind v4 design tokens
- Inline styles when Tailwind classes would suffice
- Custom button/input/etc. when shadcn equivalent exists

### Currency / Locale
- Money formatted without `Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' })`
- Hardcoded currency code other than `GTQ`
- Hardcoded locale other than `es-GT`

### Code Quality
- `console.log/warn/error` left in code
- Unused imports
- Dead code or commented-out blocks
- Magic numbers/strings that should be constants
- Missing error/loading states on TanStack Query consumers

### Routing
- New routes not following file-based conventions in `src/routes/`
- Missing route guards on auth-protected pages

## Output

Group findings by category. For each:
- ⚠️ `file:line` — Description and suggested fix

Skip categories with no findings.

## Important

- Do **NOT** fix anything — report only.
- Ask before applying fixes.
- Style nits are owned by Prettier — don't report them.
- If a change requires backend coordination (new field, endpoint), recommend invoking `nestjs-senior` or `api-contract-sync` instead of fixing locally.

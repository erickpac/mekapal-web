Sync frontend API types with the backend for the specified module.

## Arguments

- $ARGUMENTS: The feature module name (e.g., "dashboard", "settlements", "incidents"). If empty, ask which module to sync.

## Instructions

1. **Read the backend** for the `$ARGUMENTS` module:
   - Find the backend project by looking for `mecapal-api` in sibling directories relative to this monorepo
   - Read the controller(s) in `src/modules/$ARGUMENTS/infrastructure/controllers/`
   - Read the DTOs in `src/modules/$ARGUMENTS/application/dtos/`
   - Read the entity in `src/modules/$ARGUMENTS/domain/entities/`
   - If the module name doesn't match exactly (e.g., "commissions" maps to a "billing-profile" entity), explore the backend `src/modules/` directory to find the right module

2. **Read the frontend** API layer:
   - `apps/console/src/features/$ARGUMENTS/api/*.ts` — types and API functions
   - `apps/console/src/features/$ARGUMENTS/hooks/*.ts` — TanStack Query hooks

3. **Compare and report** differences:
   - List all endpoint paths that don't match the backend controller routes
   - List all type fields that are missing, extra, or misnamed vs the backend DTOs/entities
   - List any query param mismatches (e.g., `startDate` vs `fromDate`)
   - List any HTTP method mismatches (e.g., PUT vs PATCH)

4. **Fix the frontend** to match the backend:
   - Update types in the API file
   - Update endpoint paths and HTTP methods in API functions
   - Update hooks if function signatures changed
   - Update components that consume changed types (check for type errors)

5. **Verify** the changes compile:
   - Run `npx tsc --noEmit` from `apps/console/`
   - Run `npx vite build` from `apps/console/`
   - Fix any errors before finishing

6. **Summarize** what changed.

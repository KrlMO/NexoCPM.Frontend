# Copilot Workspace Instructions for NexoCPM.Frontend

## Overview
This workspace is an Angular project generated with Angular CLI. It follows standard Angular conventions for structure, build, and testing. See the [README.md](README.md) for basic commands and usage.

## Build & Test Commands
- **Start dev server:** `ng serve`
- **Build:** `ng build`
- **Unit tests:** `ng test`
- **E2E tests:** `ng e2e` (framework not included by default)

## Project Structure
- `src/app/` — Main application code, organized by feature and shared modules
- `src/assets/` — Static assets (icons, images)
- `public/` — Publicly served static files
- `README.md` — Project and workflow documentation

## Conventions & Patterns
- Use Angular CLI for scaffolding components, services, etc.
- Feature modules are under `src/app/features/`
- Shared UI components are under `src/app/shared/ui/`
- Layouts are under `src/app/layout/`
- Use `*.spec.ts` for unit tests
- Use `*.css` for component styles

## Best Practices
- Keep components small and focused
- Prefer Angular services for business logic and state
- Use Angular guards and interceptors for authentication and API concerns
- Organize code by feature for scalability
- Use environment files for configuration

## Documentation
- See [README.md](README.md) for build/test commands and Angular CLI usage
- Add new documentation in `docs/` if needed

## Example Prompts
- "Add a new feature module for project management."
- "Generate a new shared button component."
- "Add a route guard for authenticated pages."
- "Write a unit test for the login service."

---

For advanced customization, see [Angular CLI documentation](https://angular.dev/tools/cli).

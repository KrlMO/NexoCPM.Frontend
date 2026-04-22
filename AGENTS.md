# AGENTS.md - NexoCPM.Frontend

## Commands

- **Dev server:** `npm start` or `ng serve`
- **Build:** `npm run build` or `ng build`
- **Tests:** `npm run test` or `ng test`
- **Watch mode:** `npm run watch` (dev build with auto-rebuild)

No `ng lint` configured — project does not use ESLint.

## Build Artifacts

- `dist/` — production build output
- `coverage/` — test coverage reports (generated on `ng test --coverage`)

## Project Structure

```
src/
├── app/
│   ├── core/        # Services, guards, interceptors, models
│   ├── features/    # Page modules (auth/, app/)
│   ├── layout/      # Layout components (app-layout, auth-layout, public-layout)
│   ├── shared/      # Reusable UI (ui/, utils/)
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts       # Root component
├── assets/         # Static assets
├── public/          # Public static files
└── styles.css      # Global styles (TailwindCSS)
```

## Framework Details

- **Angular 20** with standalone components (no NgModules)
- **TailwindCSS 4** — uses `@import "tailwindcss"` in styles.css
- **TypeScript strict mode** enabled in tsconfig.json
- Component files: `*.ts` + `*.html` + `*.css` + `*.spec.ts` (tests)

## Conventions

- Use Angular CLI: `ng g component`, `ng g service`
- Prettier: 100 char width, single quotes for `.ts`, Angular parser for `.html`
- Routes defined in `app.routes.ts`
- Auth guard: `src/app/core/guards/auth-guard.ts`
- Auth service/facade: `src/app/core/services/auth/auth.ts`

## Notes

- No CI/CD workflows found in `.github/workflows/`
- No pre-commit hooks configured
- API config at `src/app/core/config/api.config.ts`
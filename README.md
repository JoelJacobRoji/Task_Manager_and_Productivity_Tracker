# Task Management and Productivity Tracker

Angular + TypeScript productivity app with task creation, editing, filtering, progress tracking, route protection, and local persistence.

## Tech Stack
- Angular 21 (standalone components, router, DI)
- TypeScript (strict mode)
- Angular Material (table, cards, dialogs, icons, progress, form controls)
- RxJS Observables
- Persistence: Local Storage + mock JSON seed (`public/mock/tasks.json`)

## Criteria Coverage (1-9)

1. Setup and TypeScript essentials
- Angular project configured with strict TypeScript.
- Models include interfaces and classes with inheritance/access modifiers:
  - `Task`, `TaskModel`
  - `Category`, `CategoryModel`
  - `User`, `UserModel`
  - Base entity class in `entity.model.ts`

2. Architecture and components
- Implemented modular standalone components:
  - `task-list`
  - `task-detail`
  - `task-form`
  - `task-edit`
  - `completed-tasks`
  - `navbar`
- Uses data/event binding and directives (`*ngFor`, `*ngIf`, `[ngStyle]`, `[ngClass]`).

3. Routing and navigation
- Routes:
  - `/tasks`
  - `/add-task`
  - `/completed`
  - `/task/:id`
  - `/edit/:id` (guarded)
- Mock auth guard prevents edit access when logged out.

4. Services and dependency injection
- `TaskService` supports add/update/delete/fetch/filter operations.
- DI across components.
- Local storage persistence + initial HTTP seed load.

5. Forms and validation
- Reactive form: `task-form`.
- Template-driven form: `task-edit`.
- Validations: required fields, length constraints, and due-date rules.
- Inline validation messages included.

6. Custom pipes and directives
- `task-filter` custom pipe filters by completion, priority, and category.
- `priority-highlight` custom directive highlights high-priority and overdue tasks.
- Built-in pipes used: `DatePipe`, `SlicePipe`, `AsyncPipe`.

7. Angular Material and UI enhancement
- Material components used: `MatTable`, `MatDialog`, `MatButton`, `MatIcon`, `MatProgressBar`, `MatCard`.
- Delete confirmation dialog implemented.
- Responsive layout included.
- Dark/light mode toggle in navbar.

8. Observables, HTTP, async handling
- Observable-driven task streams and UI updates.
- Async pipe usage in list/detail/completed views.
- HttpClient used for seed loading.
- Global HTTP error interceptor handles request failures.

9. Testing and integration
- Integrated routing/services/forms/UI.
- Unit tests added and passing for:
  - App bootstrap
  - Task service operations
  - Task filtering pipe
- Build succeeds for production.

## Project Structure
- `src/app/models` - Typed models and base entity
- `src/app/services` - Task/auth/theme services
- `src/app/guards` - Route guard
- `src/app/pipes` - Custom task filter pipe
- `src/app/directives` - Priority/overdue highlight directive
- `src/app/components` - UI pages and shared dialog
- `src/app/interceptors` - Global HTTP error interceptor

## Setup
1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm start
```
3. Open browser:
- `http://localhost:4200`

## Test
```bash
npm test -- --watch=false
```

## Build (Production)
```bash
npm run build
```
Output folder:
- `dist/TaskTracker`

## Deployment Options

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist/TaskTracker/browser`

### Vercel
1. Framework preset: Other
2. Build command: `npm run build`
3. Output directory: `dist/TaskTracker/browser`

### Static Hosting (any)
1. Run `npm run build`
2. Upload contents of `dist/TaskTracker/browser`

### GitHub Pages (already configured)
1. Commit and push to `main`.
2. In GitHub repo settings, enable `Pages` with source `GitHub Actions`.
3. Workflow file: `.github/workflows/deploy-pages.yml`.

## Screenshots
Add screenshots in `docs/screenshots/` (recommended):
- `task-list.png`
- `add-task-form.png`
- `task-detail.png`
- `completed-tasks.png`
- `dark-light-toggle.png`

## Notes
- Default auth state is logged in for demo; use navbar Login/Logout to test guard behavior.
- If local storage is empty, app loads starter data from `public/mock/tasks.json`.

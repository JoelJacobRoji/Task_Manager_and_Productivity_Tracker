# Task Manager and Productivity Tracker

A full-stack task management app built with **Angular + TypeScript** (frontend) and **Node.js + Express** (backend API), focused on productivity workflows such as task tracking, filtering, progress monitoring, and validation.

## Live Links
- Frontend: [https://joeljacobroji.github.io/Task_Manager_and_Productivity_Tracker/](https://joeljacobroji.github.io/Task_Manager_and_Productivity_Tracker/)
- Backend API: [https://task-tracker-backend-6k2k.onrender.com](https://task-tracker-backend-6k2k.onrender.com)

## Features
- Create, edit, view, delete, and complete tasks
- Progress tracking (`completed / total`) with progress bar
- Filter tasks by:
  - Status (`all`, `pending`, `completed`)
  - Priority
  - Category
- Guarded edit route (mock auth)
- Reactive form (`Add Task`) + template-driven form (`Edit Task`)
- Input validations (required, max length, due-date constraints)
- Custom pipe + custom directive
- Angular Material based responsive UI
- Dark/Light theme toggle
- HTTP error interceptor
- Unit tests for app bootstrap, task service, and pipe

## Tech Stack
- Frontend:
  - Angular 21 (standalone components)
  - TypeScript
  - Angular Material
  - RxJS
- Backend:
  - Node.js
  - Express
- Deployment:
  - GitHub Pages (frontend)
  - Render (backend)

## Project Structure
```text
Task-Tracker/
  backend/
    db.json
    package.json
    server.cjs
  public/
    mock/
      tasks.json
  src/
    app/
      components/
      config/
      directives/
      guards/
      interceptors/
      models/
      pipes/
      services/
```

## API Endpoints
Base URL: `https://task-tracker-backend-6k2k.onrender.com`

- `GET /health`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- Angular CLI (optional, npm scripts already use local CLI)

### 1. Clone and install
```bash
git clone https://github.com/JoelJacobRoji/Task_Manager_and_Productivity_Tracker.git
cd Task_Manager_and_Productivity_Tracker
npm install
```

### 2. Run backend locally
```bash
cd backend
npm install
npm start
```
Backend local URL: `http://localhost:10000`

### 3. Run frontend locally
Open another terminal:
```bash
cd Task_Manager_and_Productivity_Tracker
npm start
```
Frontend local URL: `http://localhost:4200`

## Frontend API Configuration
Frontend backend URL is configured in:
- `src/app/config/api.config.ts`

If needed, update:
```ts
export const API_BASE_URL = 'http://localhost:10000';
```
for local backend usage.

## Scripts
From repository root:

- Start frontend dev server:
```bash
npm start
```
- Build frontend:
```bash
npm run build
```
- Run tests:
```bash
npm test -- --watch=false
```

From `backend/`:
- Start backend:
```bash
npm start
```

## Deployment

### Frontend (GitHub Pages using `gh-pages` branch)
```bash
npm run build -- --configuration production --base-href "/Task_Manager_and_Productivity_Tracker/"
cp dist/TaskTracker/browser/index.html dist/TaskTracker/browser/404.html
npx gh-pages -d dist/TaskTracker/browser
```

PowerShell equivalent for `404.html`:
```powershell
Copy-Item "dist/TaskTracker/browser/index.html" "dist/TaskTracker/browser/404.html" -Force
```

### Backend (Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Live URL: `https://task-tracker-backend-6k2k.onrender.com`

## Test Status
- `npm run build` passes
- `npm test -- --watch=false` passes


## Notes
- If backend has cold start delay on Render free tier, first API request may take a few seconds.
- If GitHub Pages shows old content, hard refresh (`Ctrl + Shift + R`) after redeploy.

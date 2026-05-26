# Todo Flow - Full Stack APK Ready Todo App

A premium-looking full stack todo list app with:
- **Frontend**: React + Vite (mobile-first premium UI)
- **Backend**: Node.js + Express REST API
- **Android APK readiness**: Capacitor configuration included

## Project Structure

- `/frontend` - React UI
- `/backend` - Express API

## Run Locally

### 1) Start backend API

```bash
cd /tmp/workspace/HEMANTH-eng/Mobile-coding-/backend
npm install
npm run dev
```

API runs on `http://localhost:4000`.

### 2) Start frontend

```bash
cd /tmp/workspace/HEMANTH-eng/Mobile-coding-/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and connects to backend using `VITE_API_URL` (defaults to `http://localhost:4000`).

## Backend API Endpoints

- `GET /api/health`
- `GET /api/todos`
- `POST /api/todos` with `{ "title": "..." }`
- `PATCH /api/todos/:id` with `{ "completed": true|false }` or `{ "title": "..." }`
- `DELETE /api/todos/:id`

## Tests

```bash
cd /tmp/workspace/HEMANTH-eng/Mobile-coding-/backend
npm test
```

## Build Frontend

```bash
cd /tmp/workspace/HEMANTH-eng/Mobile-coding-/frontend
npm run build
```

## APK (Android) Build Preparation with Capacitor

```bash
cd /tmp/workspace/HEMANTH-eng/Mobile-coding-/frontend
npm run build
npx cap add android
npm run apk:sync
npx cap open android
```

Then build/sign APK from Android Studio.

> For physical devices, set `VITE_API_URL` to a reachable backend URL before building.

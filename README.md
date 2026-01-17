# Skill Sync Dashboard

React 18 + Vite + Tailwind CSS dashboard with role-aware navigation, JWT-based auth context, and axios interceptors.

## Stack
- React 18 with React Router 6
- Vite (rolldown) build
- Tailwind CSS 3
- Axios + jwt-decode

## Features
- Auth context with localStorage-backed JWT, role derivation (admin vs user), and a `useAuth` hook
- Axios instance with request/response interceptors (auto attach token, logout on 401)
- Protected routes and a two-sided sidebar: common, learner-only, admin-only links
- Pages: Login, Register, Dashboard, Profile, Enrolled Courses, Catalog, Admin Course Manager (CRUD + modal), Course Inventory, User Management, Revenue Reports
- Deep indigo/slate theme, responsive layout, and loading overlays

## Getting Started
1) Install deps
```
npm install
```
2) Run dev server
```
npm run dev
```
3) Build
```
npm run build
```

### Auth behavior
- Token stored at `localStorage.skillSyncToken`.
- On load, token is decoded/validated; on 401 responses the interceptor triggers logout.
- Emails containing `admin` authenticate as the admin role; others default to user.

### Notable paths
- Auth context: `src/context/AuthContext.jsx`
- API instance: `src/api.js`
- useAuth hook: `src/hooks/useAuth.js`
- Sidebar + guards: `src/components/Sidebar.jsx`, `src/components/ProtectedRoute.jsx`
- Pages: `src/pages/*`

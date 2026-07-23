# BookIt — Movie Booking System · Frontend

<div align="center">
  <table>
    <tr>
      <td><img src="public/home.png" width="100%"/></td>
      <td><img src="public/movies.png" width="100%"/></td>
    </tr>
    <tr>
      <td align="center"><em>Home</em></td>
      <td align="center"><em>Movies</em></td>
    </tr>
    <tr>
      <td><img src="public/booking.png" width="100%"/></td>
      <td><img src="public/dashboard.png" width="100%"/></td>
    </tr>
    <tr>
      <td align="center"><em>Seat Selection</em></td>
      <td align="center"><em>Admin Dashboard</em></td>
    </tr>
  </table>
</div>

<div align="center">

![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.12.0-764ABC?style=flat-square&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18.0-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18.1-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Pages & Routing](#4-pages--routing)
5. [State Management](#5-state-management)
6. [API Integration](#6-api-integration)
7. [Component Architecture](#7-component-architecture)
8. [Authentication & Route Protection](#8-authentication--route-protection)
9. [Getting Started](#9-getting-started)
10. [Environment Variables](#10-environment-variables)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

**BookIt Frontend** is the client-side layer of the BookIt movie booking platform. Built with **React 19** and powered by **Redux Toolkit** for global state, it communicates exclusively with the Spring Boot backend via a centralized Axios instance with JWT interceptors.

The application covers the full user journey — landing on the home page, browsing movies, selecting seats, completing a booking, and managing past bookings — alongside a complete admin interface for content and operations management.

### Key Capabilities

| Area | Description |
|------|-------------|
| **Movie Discovery** | Browse, search, and filter movies by genre and language |
| **Seat Selection** | Real-time seat availability on the booking page |
| **Booking Management** | Create, view, and cancel bookings from `MyBookings` |
| **Authentication** | JWT-based login/register with Redux auth state |
| **Admin Panel** | Manage movies, theaters, shows, bookings, and users |
| **Route Protection** | `ProtectedRoute` component with role-based access (`USER`/`ADMIN`) |
| **Error Boundaries** | `ErrorBoundary` component catches render-time failures gracefully |
| **Toast Notifications** | `react-toastify` for non-intrusive feedback across the app |

---

## 2. Technology Stack

### Dependencies (from `package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | **19.2.6** | Core UI library |
| `react-dom` | 19.2.6 | DOM rendering |
| `react-router-dom` | **7.18.0** | Client-side routing, nested routes |
| `@reduxjs/toolkit` | **2.12.0** | Global state management, async thunks |
| `react-redux` | 9.3.0 | React bindings for Redux store |
| `axios` | **1.18.1** | HTTP client with interceptors |
| `react-icons` | 5.6.0 | Icon library (5000+ icons) |
| `react-toastify` | **11.1.0** | Toast notification system |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | **8.0.12** | Build tool & dev server |
| `@vitejs/plugin-react` | 6.0.1 | React Fast Refresh support |
| `tailwindcss` | **4.3.1** | Utility-first CSS framework |
| `@tailwindcss/vite` | 4.3.1 | Tailwind v4 Vite integration |
| `autoprefixer` | 10.5.0 | CSS vendor prefix automation |
| `postcss` | 8.5.15 | CSS transformation pipeline |
| `eslint` | 10.3.0 | Code quality linting |
| `eslint-plugin-react-hooks` | 7.1.1 | Hooks rules enforcement |
| `eslint-plugin-react-refresh` | 0.5.2 | Fast refresh linting |

### Package Manager & Runtime

| Tool | Detail |
|------|--------|
| Package Manager | **pnpm** (`pnpm-lock.yaml`) |
| Module System | ES Modules (`"type": "module"`) |
| Build Output | Vite optimized bundle |
| Deployment | **Vercel** (`vercel.json` present) |

---

## 3. Project Structure

```
BMSFRONTEND/
├── public/                          # Static assets served as-is
│
├── src/
│   │
│   ├── api/                         # HTTP layer
│   │   ├── axiosConfig.js           # Axios instance, base URL, JWT interceptor
│   │   └── endpoints.js             # Centralized API endpoint constants
│   │
│   ├── assets/                      # Static assets imported in JS/JSX
│   │   ├── hero.png                 # Hero section background
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── admin/                   # Admin-only components
│   │   │   ├── AdminDashboard.jsx   # Stats overview panel
│   │   │   ├── AdminMovies.jsx      # Movie CRUD table
│   │   │   ├── AdminUsers.jsx       # User management table
│   │   │   ├── ManageBookings.jsx   # Booking management view
│   │   │   ├── ManageShows.jsx      # Show scheduling interface
│   │   │   └── ManageTheaters.jsx   # Theater/screen management
│   │   │
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx   # Route guard — checks auth + role
│   │   │
│   │   └── common/                  # Shared UI primitives
│   │       ├── ErrorBoundary.jsx    # React error boundary wrapper
│   │       └── LoadingSpinner.jsx   # Reusable loading indicator
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── index.js                 # Typed useAppDispatch / useAppSelector
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── Home.jsx                 # Landing page with hero + featured movies
│   │   ├── Movies.jsx               # Browse all movies with search/filter
│   │   ├── MovieDetailPage.jsx      # Movie info + available shows
│   │   ├── BookingPage.jsx          # Seat selection + booking form
│   │   ├── BookingConfirmation.jsx  # Post-booking confirmation & ticket
│   │   ├── MyBookings.jsx           # User's booking history
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── RegisterPage.jsx         # Registration form
│   │   ├── ProfilePage.jsx          # User profile view/edit
│   │   ├── AdminPage.jsx            # Admin panel shell
│   │   ├── AboutUs.jsx              # About page
│   │   ├── Contact.jsx              # Contact page
│   │   ├── FAQ.jsx                  # FAQ page
│   │   ├── PrivacyPolicay.jsx       # Privacy policy page
│   │   ├── TermsAndCondition.jsx    # Terms & conditions page
│   │   └── NotFound.jsx             # 404 fallback page
│   │
│   ├── store/                       # Redux store
│   │   ├── index.js                 # Store configuration, root reducer
│   │   ├── hooks/
│   │   │   └── index.js             # Typed hooks re-export
│   │   └── slices/                  # Redux Toolkit slices
│   │       ├── authSlice.js         # User auth state, login/register thunks
│   │       ├── bookingSlice.js      # Booking creation, history, cancellation
│   │       ├── citySlice.js         # City list for theater filtering
│   │       ├── movieSlice.js        # Movie list, detail, search
│   │       ├── screenSlice.js       # Screen data per theater
│   │       ├── seatSlice.js         # Seat availability per show
│   │       ├── showSlice.js         # Show listings per movie/screen
│   │       ├── theaterSlice.js      # Theater data per city
│   │       └── uiSlice.js           # UI state (loading, modals, toasts)
│   │
│   ├── utils/                       # Utility functions
│   │   └── helpers.js               # Date formatting, price formatting, etc.
│   │
│   ├── App.jsx                      # Root component — router + layout
│   ├── App.css                      # Global app styles
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Tailwind base styles
│
├── .env                             # Environment variables (gitignored)
├── .gitignore
├── eslint.config.js
├── index.html                       # Vite HTML entry point
├── package.json
├── pnpm-lock.yaml
├── vercel.json                      # Vercel deployment config (SPA rewrites)
└── vite.config.js                   # Vite + React + Tailwind plugin config
```

---

## 4. Pages & Routing

### Public Routes (no auth required)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home.jsx` | Hero section, featured movies, quick nav |
| `/movies` | `Movies.jsx` | Full catalog with search and genre/language filters |
| `/movies/:id` | `MovieDetailPage.jsx` | Movie details, cast, showtimes |
| `/login` | `LoginPage.jsx` | Email + password login form |
| `/register` | `RegisterPage.jsx` | New user registration form |
| `/about` | `AboutUs.jsx` | About the platform |
| `/contact` | `Contact.jsx` | Contact form |
| `/faq` | `FAQ.jsx` | Frequently asked questions |
| `/privacy` | `PrivacyPolicay.jsx` | Privacy policy |
| `/terms` | `TermsAndCondition.jsx` | Terms and conditions |
| `*` | `NotFound.jsx` | 404 fallback |

### Protected Routes — `USER` role

| Path | Component | Description |
|------|-----------|-------------|
| `/booking/:showId` | `BookingPage.jsx` | Seat selection + booking creation |
| `/booking/confirmation` | `BookingConfirmation.jsx` | Post-booking ticket & summary |
| `/my-bookings` | `MyBookings.jsx` | Booking history with cancel option |
| `/profile` | `ProfilePage.jsx` | View and edit user profile |

### Protected Routes — `ADMIN` role

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `AdminPage.jsx` | Admin panel shell + tab navigation |
| `/admin` → tab | `AdminDashboard.jsx` | Platform stats overview |
| `/admin` → tab | `AdminMovies.jsx` | Add, edit, delete movies |
| `/admin` → tab | `AdminUsers.jsx` | View and manage users |
| `/admin` → tab | `ManageBookings.jsx` | View all platform bookings |
| `/admin` → tab | `ManageShows.jsx` | Schedule and manage shows |
| `/admin` → tab | `ManageTheaters.jsx` | Manage theaters and screens |

---

## 5. State Management

The application uses **Redux Toolkit** with 8 feature slices, all wired into a single Redux store.

### Store Architecture

```
store/
└── index.js                  ← configureStore with root reducer
    └── slices/
        ├── authSlice.js      ← auth state, JWT, user info
        ├── movieSlice.js     ← movie list, search, detail
        ├── bookingSlice.js   ← create/cancel bookings, history
        ├── showSlice.js      ← shows per movie or screen
        ├── theaterSlice.js   ← theaters per city
        ├── screenSlice.js    ← screens per theater
        ├── seatSlice.js      ← available seats per show
        ├── citySlice.js      ← city master list
        └── uiSlice.js        ← global loading, modal, toast state
```

### Slice Responsibilities

| Slice | State Managed | Key Thunks / Actions |
|-------|--------------|----------------------|
| `authSlice` | `user`, `token`, `role`, `isAuthenticated` | `loginThunk`, `registerThunk`, `logout` |
| `movieSlice` | `movies[]`, `selectedMovie`, `filters` | `fetchMovies`, `fetchMovieById`, `searchMovies` |
| `bookingSlice` | `currentBooking`, `bookings[]`, `status` | `createBooking`, `fetchUserBookings`, `cancelBooking` |
| `showSlice` | `shows[]`, `selectedShow` | `fetchShowsByMovie`, `fetchShowsByScreen` |
| `theaterSlice` | `theaters[]` | `fetchTheatersByCity` |
| `screenSlice` | `screens[]` | `fetchScreensByTheater` |
| `seatSlice` | `availableSeats[]`, `selectedSeats[]` | `fetchAvailableSeats` |
| `citySlice` | `cities[]` | `fetchCities` |
| `uiSlice` | `isLoading`, `activeModal`, `toastQueue` | `setLoading`, `openModal`, `closeModal` |

### Typed Hooks

Both hooks are re-exported from `src/hooks/index.js` and `src/store/hooks/index.js`:

```js
// Use these everywhere instead of plain useDispatch / useSelector
import { useAppDispatch, useAppSelector } from '../hooks';
```

---

## 6. API Integration

### Axios Configuration (`src/api/axiosConfig.js`)

A single Axios instance is created with:
- `baseURL` from `import.meta.env.VITE_API_URL`
- **Request interceptor** — attaches `Authorization: Bearer <token>` from Redux auth state on every outgoing request
- **Response interceptor** — handles `401` globally (clears auth state, redirects to `/login`)

```js
// Pattern (not the actual file — illustrative)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Endpoint Constants (`src/api/endpoints.js`)

All API paths are stored as constants — no hardcoded strings scattered across slices:

```js
// Pattern
export const ENDPOINTS = {
  AUTH: {
    LOGIN:    '/users/login',
    REGISTER: '/users/register',
  },
  MOVIES: {
    ALL:    '/movies',
    BY_ID:  (id) => `/movies/${id}`,
    SEARCH: '/movies/search',
  },
  BOOKINGS: {
    CREATE:    '/bookings',
    BY_USER:   (userId) => `/bookings/user/${userId}`,
    CANCEL:    (id) => `/bookings/${id}/cancel`,
    SEATS:     (showId) => `/bookings/show/${showId}/available-seats`,
  },
  // ...
};
```

---

## 7. Component Architecture

### Component Categories

```
components/
├── admin/       ← Admin-only, rendered inside AdminPage.jsx as tab content
├── auth/        ← Route protection logic
└── common/      ← Shared across all pages
```

### `ProtectedRoute.jsx`

Wraps any route that requires authentication or a specific role:

```jsx
// Behavior
// 1. Not authenticated  → redirect to /login
// 2. Authenticated, wrong role → redirect to /
// 3. Authenticated, correct role → render children
<ProtectedRoute role="ADMIN">
  <AdminPage />
</ProtectedRoute>
```

### `ErrorBoundary.jsx`

React class component that catches JavaScript errors in its subtree during render, preventing the whole app from crashing. Displays a fallback UI with a reload option.

### `LoadingSpinner.jsx`

Reusable centered spinner, driven by `uiSlice.isLoading`. Used across async data-fetching operations.

### Admin Components (tab-based inside `AdminPage.jsx`)

| Component | Operations |
|-----------|------------|
| `AdminDashboard` | Platform stats — total movies, bookings, revenue |
| `AdminMovies` | Add / edit / delete movies with form modal |
| `AdminUsers` | View all users, role information |
| `ManageBookings` | View all bookings across the platform |
| `ManageShows` | Schedule shows — link movie + screen + time |
| `ManageTheaters` | Add theaters and screens per city |

---

## 8. Authentication & Route Protection

### Auth State Flow

```
User submits login form
  → LoginPage dispatches loginThunk(credentials)
  → Axios POST /api/users/login
  → Response: { token, role, name }
  → authSlice stores token + user info
  → token persisted to localStorage
  → ProtectedRoute reads isAuthenticated from store
  → User redirected to intended page
```

### Token Persistence

The JWT token is stored in `localStorage` so it survives page refreshes. On app initialization (`main.jsx` / `App.jsx`), the store is hydrated from `localStorage` if a valid token exists.

### Route Guard Logic (`ProtectedRoute.jsx`)

```
Request hits protected route
  → ProtectedRoute checks store.auth.isAuthenticated
      → false: <Navigate to="/login" replace />
  → Checks store.auth.role === requiredRole (if specified)
      → mismatch: <Navigate to="/" replace />
  → Renders children
```

---

## 9. Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-username/BMSProject.git
cd BMSProject/UI   # or wherever the frontend lives

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Dev server runs at `http://localhost:5173` by default.

### Build for Production

```bash
pnpm build
```

Output goes to `dist/`. Preview the production build locally:

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

---

## 10. Environment Variables

Create a `.env` file in the frontend root (already gitignored):

```bash
# Backend API base URL — include /api suffix
VITE_API_URL=http://localhost:8080/api

# Optional: admin registration secret if implemented
VITE_ADMIN_SECRET_KEY=your_admin_secret
```

> All Vite environment variables must be prefixed with `VITE_` to be exposed to the client bundle.

### Production `.env` (Vercel)

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

---

## 11. Deployment

The frontend is deployed to **Vercel** (`vercel.json` is present in the root).

### `vercel.json` — SPA Rewrite Rule

For React Router to work correctly on Vercel, all routes must be rewritten to `index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments on every push to `main`.

### Build Settings (Vercel Dashboard)

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

---

<div align="center">

**© 2026 BookIt. All rights reserved.**

*Built with React 19 · Redux Toolkit · Tailwind CSS · Vite*

</div>

# Project: React Ecommerce with Medusa

## What this project is
A React + TypeScript ecommerce frontend connected to a Medusa v2 backend. Built with Vite, Tailwind CSS, and React Router.

## Project structure
```
src/
  features/auth/Login.tsx      — Login page with Medusa auth
  features/auth/Register.tsx   — Register page with 2-step Medusa flow
  pages/Home.tsx               — Homepage (/) with navbar, hero, feature cards
  pages/AuthCallback.tsx       — Auth0 callback (unused, commented out)
  services/medusa.ts           — Medusa API helpers (getStoreProducts, getProductById)
  routes.tsx                   — React Router config
  main.tsx                     — App entry point
  App.tsx                      — Root component
```

## Medusa backend
- Running at: `http://localhost:9000`
- Frontend running at: `http://localhost:5173`
- Publishable API key: see `VITE_MEDUSA_PUBLISHABLE_KEY` in `.env`
- Backend folder: `medusa-backend/` (sibling to `react_ecommerce/`)

## Routes built so far
| Path | Component | Status |
|------|-----------|--------|
| `/` | Home.tsx | Done — navbar with login/logout, hero, feature cards |
| `/login` | Login.tsx | Done — connected to Medusa auth, saves token to localStorage |
| `/register` | Register.tsx | Done — 2-step Medusa registration flow |

## Auth flow (Medusa v2)
JWT token is saved to `localStorage` as `medusa_token` on login.

**Register (2 steps):**
1. `POST /auth/customer/emailpass/register` with `{ email, password }` → returns JWT token
2. `POST /store/customers` with `Authorization: Bearer <token>` + `{ email, first_name, last_name }` → creates profile

**Login:**
- `POST /auth/customer/emailpass` with `{ email, password }` → returns JWT token

**Get logged-in customer:**
- `GET /store/customers/me` with `Authorization: Bearer <token>` → returns customer object with `first_name`, `last_name`, etc.

**Logout:**
- Remove `medusa_token` from localStorage and navigate to `/login`

## Home.tsx navbar logic
- Reads token from `localStorage`
- If logged in: fetches customer name from `/store/customers/me`, shows "Hi, {first_name}" + Logout button
- If logged out: shows Sign in button
- Logout clears token and redirects to `/login`

## Shared constants (used in Login, Register, Home)
These are defined at the top of each file:
```ts
const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'your_key_here'
```

## What's commented out / not yet built
- Auth0 integration (commented out in Login.tsx and routes.tsx)
- Forgot password page
- Products page (`/products`)
- Product detail page (`/products/:id`)
- Cart page (`/cart`)

## Next things to build
1. Forgot password page (`/forgot-password`)
2. Products listing page — `getStoreProducts()` already exists in `services/medusa.ts`
3. Product detail page
4. Cart

## env variables (in .env)
```
VITE_MEDUSA_STORE_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=your_key_here
```

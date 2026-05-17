# Project: React Ecommerce with Medusa

## What this project is
A React + TypeScript ecommerce frontend connected to a Medusa v2 backend. Built with Vite, Tailwind CSS, and React Router.

## Project structure
```
src/
  features/auth/Login.tsx           — Login page with Medusa auth
  features/auth/Register.tsx        — Register page with 2-step Medusa flow
  features/auth/ForgotPassword.tsx  — Forgot password page (sends reset email via SendGrid)
  features/auth/ResetPassword.tsx   — Reset password page (reads token from URL)
  pages/Home.tsx                    — Homepage (/) with navbar, hero, feature cards
  pages/AuthCallback.tsx            — Auth0 callback (unused, commented out)
  services/medusa.ts                — Medusa API helpers (getStoreProducts, getProductById)
  routes.tsx                        — React Router config
  main.tsx                          — App entry point
  App.tsx                           — Root component
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
| `/forgot-password` | ForgotPassword.tsx | Done — sends reset email via SendGrid |
| `/reset-password` | ResetPassword.tsx | Done — reads token from URL, updates password |

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

**Forgot Password:**
- `POST /auth/customer/emailpass/reset-password` with `{ identifier: email }` → triggers SendGrid email
- Subscriber at `medusa-backend/src/subscribers/reset-password.ts` listens to `auth.password_reset` event and sends email

**Reset Password:**
- Token arrives in URL as `?token=...` (full JWT)
- `POST /auth/customer/emailpass/update` with `Authorization: Bearer <token>` + `{ password }` → updates password

## SendGrid setup
- Notification module configured in `medusa-config.ts`
- Subscriber: `medusa-backend/src/subscribers/reset-password.ts`
- Template ID: see `SENDGRID_RESET_PASSWORD_TEMPLATE` in `.env`
- Sender: `vibhavranjan0@gmail.com`

## Home.tsx navbar logic
- Reads token from `localStorage`
- If logged in: fetches customer name from `/store/customers/me`, shows "Hi, {first_name}" + Logout button
- If logged out: shows Sign in button
- Logout clears token and redirects to `/login`

## Shared constants (used in all auth files and Home)
These are defined at the top of each file:
```ts
const MEDUSA_API = import.meta.env.VITE_MEDUSA_STORE_URL || 'http://localhost:9000'
const MEDUSA_PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'your_key_here'
```

## Frontend validation
- Password minimum 8 characters — validated in Register.tsx and ResetPassword.tsx before API call
- Confirm password match — validated in ResetPassword.tsx before API call

## What's commented out / not yet built
- Auth0 integration (commented out in Login.tsx and routes.tsx)
- Products page (`/products`)
- Product detail page (`/products/:id`)
- Cart page (`/cart`)

## Next things to build
1. Products listing page — `getStoreProducts()` already exists in `services/medusa.ts`
2. Product detail page
3. Cart

## Code quality
See `REACT_BEST_PRACTICES.md` for the full guide. Key rules to follow in this project:

### Performance
- Lazy load routes with `React.lazy` + `Suspense`
- Add `loading="lazy"` + explicit `width`/`height` on all product images
- Avoid inline functions/objects passed as props in list components

### SEO
- One `<h1>` per page
- Descriptive link text — no "click here"
- Add `react-helmet-async` for page titles when building product/detail pages

### Accessibility
- All inputs must have `htmlFor` + matching `id` (Register.tsx labels still missing this)
- Use `<button>` for actions, `<Link>` for navigation — never `<div onClick>`
- Error messages should use `role="alert"`
- Loading states should use `role="status"`
- All product images need descriptive `alt` text

## env variables (in .env)
```
VITE_MEDUSA_STORE_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=your_key_here
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM=vibhavranjan0@gmail.com
SENDGRID_RESET_PASSWORD_TEMPLATE=your_template_id
```

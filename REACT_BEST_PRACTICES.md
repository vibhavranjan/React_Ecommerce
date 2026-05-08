# React Best Practices
## Performance, SEO, and Accessibility

---

## 1. Performance

### Avoid unnecessary re-renders
- Use `React.memo` to prevent a component from re-rendering if its props haven't changed
- Use `useCallback` to memoize functions passed as props
- Use `useMemo` to memoize expensive computed values

```tsx
// Without memo — re-renders every time parent renders
function ProductCard({ product }) { ... }

// With memo — only re-renders if product prop changes
const ProductCard = React.memo(function ProductCard({ product }) { ... })
```

### Lazy load routes
- Don't load all pages upfront — load them only when the user navigates to them
- Use `React.lazy` + `Suspense` in routes.tsx

```tsx
// Instead of:
import Products from './pages/Products'

// Use:
const Products = React.lazy(() => import('./pages/Products'))

// Wrap router in Suspense:
<Suspense fallback={<div>Loading...</div>}>
  <RouterProvider router={router} />
</Suspense>
```

### Image optimization
- Always set `width` and `height` on images to prevent layout shift
- Use `loading="lazy"` for images below the fold
- Use WebP format where possible

```tsx
<img
  src={product.thumbnail}
  alt={product.title}
  width={300}
  height={300}
  loading="lazy"
/>
```

### Avoid inline functions in JSX
- Inline functions create a new function reference on every render

```tsx
// Bad — new function every render
<button onClick={() => handleDelete(id)}>Delete</button>

// Good — stable reference
const handleDelete = useCallback(() => { ... }, [id])
<button onClick={handleDelete}>Delete</button>
```

### Keep state as local as possible
- Don't lift state to a parent unless multiple children need it
- Global state (context/store) is expensive — only use it for truly global data (auth, cart)

---

## 2. SEO

### Use semantic HTML
- Use the right HTML element for the job — browsers and search engines understand semantic tags

```tsx
// Bad
<div onClick={...}>Click me</div>
<div className="heading">Products</div>

// Good
<button onClick={...}>Click me</button>
<h1>Products</h1>
```

### Heading hierarchy
- Every page should have exactly ONE `<h1>`
- Follow the order: `h1` → `h2` → `h3` (don't skip levels)

```tsx
// Bad
<h1>Shop</h1>
<h3>Featured</h3>  // skipped h2

// Good
<h1>Shop</h1>
<h2>Featured</h2>
<h3>Product Name</h3>
```

### Page titles and meta tags
- Each page should have a unique `<title>` — use a library like `react-helmet-async`

```tsx
import { Helmet } from 'react-helmet-async'

export default function Products() {
  return (
    <>
      <Helmet>
        <title>Products | MyShop</title>
        <meta name="description" content="Browse our collection of products" />
      </Helmet>
      {/* page content */}
    </>
  )
}
```

### Meaningful link text
- Screen readers and search engines read link text — make it descriptive

```tsx
// Bad — doesn't describe the destination
<Link to={`/products/${id}`}>Click here</Link>

// Good
<Link to={`/products/${id}`}>View {product.title}</Link>
```

### Server-side rendering (future)
- React apps are client-rendered by default — search engines may not index them well
- For production ecommerce, consider Next.js or Remix for SSR/SSG
- For now, ensure your app works with JavaScript disabled (graceful degradation)

---

## 3. Accessibility (a11y)

### Always label form inputs
- Every `<input>` must have an associated `<label>` using `htmlFor` + `id`
- Screen readers read the label when the input is focused

```tsx
// Bad — input has no label
<input type="email" placeholder="you@example.com" />

// Good
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="you@example.com" />
```

### Buttons vs links
- `<button>` — triggers an action (submit, open modal, delete)
- `<Link>` / `<a>` — navigates to a new page
- Never use `<div onClick>` for interactive elements

```tsx
// Bad
<div onClick={handleLogout}>Logout</div>

// Good
<button onClick={handleLogout}>Logout</button>
```

### Focus management
- Users navigating by keyboard must be able to reach all interactive elements
- Don't use `outline: none` on focused elements without providing an alternative
- Use Tailwind's `focus:ring-2` to show focus styles

```tsx
// Always include focus styles
className="... focus:outline-none focus:ring-2 focus:ring-purple-500"
```

### Color contrast
- Text must have sufficient contrast against its background
- Minimum ratio: 4.5:1 for normal text, 3:1 for large text
- Use a tool like https://webaim.org/resources/contrastchecker to verify

### Alt text for images
- Every `<img>` must have an `alt` attribute
- If the image is decorative (not informative), use `alt=""`
- If it conveys meaning, describe it

```tsx
// Decorative
<img src="/banner.png" alt="" />

// Informative
<img src={product.thumbnail} alt={`Photo of ${product.title}`} />
```

### ARIA roles (use sparingly)
- Only add ARIA when semantic HTML isn't enough
- Wrong ARIA is worse than no ARIA

```tsx
// Loading state — announce to screen readers
<div role="status" aria-live="polite">
  {loading ? 'Loading products...' : ''}
</div>

// Error message
<p role="alert">{error}</p>
```

### Keyboard navigation
- All interactive elements (buttons, links, inputs) must be reachable by Tab key
- Modals/drawers should trap focus inside while open
- Close modals on Escape key

---

## 4. Code Review Checklist

Use this checklist when reviewing any React component:

### Performance
- [ ] No unnecessary `useEffect` dependencies missing or extra
- [ ] No inline object/array/function literals passed as props
- [ ] Large lists use virtualization (react-window) or pagination
- [ ] Images have `loading="lazy"` and explicit dimensions
- [ ] Routes are lazy loaded

### SEO
- [ ] Page has a unique `<title>` via react-helmet-async
- [ ] Page has a `<meta name="description">`
- [ ] Only one `<h1>` per page
- [ ] Heading levels are not skipped
- [ ] Link text is descriptive

### Accessibility
- [ ] All inputs have associated labels (`htmlFor` + `id`)
- [ ] Interactive elements use `<button>` or `<Link>`, not `<div>`
- [ ] All images have `alt` text
- [ ] Focus styles are visible (not just `outline: none`)
- [ ] Color contrast meets WCAG AA standard
- [ ] Error messages use `role="alert"`
- [ ] Loading states use `role="status"`

### General
- [ ] No console.log left in production code
- [ ] Error states are handled and shown to the user
- [ ] Loading states disable buttons to prevent double-submit
- [ ] No hardcoded API keys or secrets in frontend code

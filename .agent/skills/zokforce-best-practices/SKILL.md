---
name: zokforce-best-practices
description: Use this skill when writing, reviewing, or optimizing code for the ZokForce website to ensure performance, SEO, and accessibility best practices.
---
# ZokForce Best Practices Skill

Performance, SEO, and accessibility guidelines for the ZokForce static website.

## 1. Performance

### Asset Optimization
- **Images**: Use PNG for icons, consider WebP for photos
- **Lazy loading**: Add `loading="lazy"` to below-fold images
- **Preconnect**: Already configured for Google Fonts in `<head>`
- **CSS**: Single `style.css` file — no unnecessary `@import` chains
- **JS**: Load `translations.js` before `app.js`; use `defer` where possible

### Rendering Performance
- **Throttle** scroll/resize handlers (already in `app.js`)
- **Avoid layout thrashing**: Batch DOM reads and writes
- **Use `transform` and `opacity`** for animations (GPU-accelerated)
- **IntersectionObserver** for scroll-triggered animations (already used for counters)

### Cloudflare Optimization
- Static assets served via Cloudflare edge (automatic compression)
- Cloudflare Workers handle API routes — keep worker code lean
- Use `Cache-Control` headers for static assets

## 2. SEO

### Every Page Must Have
- [ ] Descriptive `<title>` tag
- [ ] `<meta name="description">` (150-160 chars)
- [ ] Single `<h1>` per page
- [ ] Heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] `hreflang` alternate links for all 3 languages
- [ ] Open Graph meta tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card meta tags
- [ ] Structured data (JSON-LD) where appropriate

### Blog Posts
- [ ] Unique `<title>` per blog post
- [ ] `datetime` attribute on `<time>` elements
- [ ] Author attribution
- [ ] Internal links back to main site sections
- [ ] Canonical URL

### URL Structure
- Clean paths (no double spaces — worker.js normalizes these)
- Blog post paths: `/blog/Blog Post N/<slug>.html`

## 3. Accessibility (WCAG 2.1 AA)

### Visual
- 4.5:1 contrast ratio (text on background)
- Focus rings on interactive elements (`--color-focus-ring`)
- No content conveyed by color alone

### Structural
- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- `alt` text on all images
- `aria-label` on icon-only buttons
- Skip-to-content link (recommended addition)

### Interactive
- All functionality keyboard-accessible
- Form inputs have associated `<label>` elements
- Error messages announced to screen readers
- Mobile touch targets ≥ 44×44px

## 4. Cloudflare Workers Best Practices

### API Endpoints
- Validate all input server-side (already done for `/api/contact`)
- Return proper HTTP status codes (400, 500)
- Include `Content-Type: application/json` on API responses
- Log errors with `console.error` for Cloudflare's log tail

### Security
- Enable CORS only for allowed origins (use `isValidOrigin()` helper)
- Sanitize user input before forwarding to external APIs
- Use environment secrets for API keys (`wrangler secret put`)
- Consider rate limiting for form endpoints

### Static Assets
- Use `env.ASSETS.fetch(request)` for static file serving
- Worker handles both API routes and static fallback

## 5. Dark Mode Support

- Design tokens already support `prefers-color-scheme: dark`
- Test all new content in both light and dark modes
- Avoid hardcoded colors that break in dark mode
- Use `var(--color-*)` tokens which auto-switch

## 6. Mobile-First Development

- Write CSS mobile-first, then add `@media (min-width: ...)` for larger screens
- Test at 375px → 768px → 1024px → 1280px
- Ensure touch targets are large enough
- Hide non-essential content on mobile (e.g., tagline)

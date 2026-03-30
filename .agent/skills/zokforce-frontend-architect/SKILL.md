---
name: zokforce-frontend-architect
description: Use this skill for any implementation, refactoring, or architectural task to enforce clean code and design token usage on the ZokForce website.
---
# ZokForce Frontend Architect Skill

Follow these standards for all coding tasks on the ZokForce website (vanilla HTML/CSS/JS static site).

## 1. File Architecture

```
zokforcewebsite/
├── index.html              # Main SPA — all sections
├── style.css               # Design tokens + component styles
├── app.js                  # UI logic (nav, forms, animations)
├── translations.js         # i18n strings (EN, zh-TW, zh-CN)
├── worker.js               # Cloudflare Worker (APIs + static serving)
├── blog/                   # Blog post HTML pages
├── AI Assessment/          # Interactive assessment tool
└── exported-assets/Icon/   # Service icons (PNG)
```

## 2. CSS Design Token System (STRICT)

All visual properties MUST use CSS custom properties from `:root` in `style.css`. **Zero hardcoded color values in HTML or JS.**

| ❌ Forbidden | ✅ Required |
|---|---|
| `color: #21808D` | `color: var(--color-primary)` |
| `background: #FCFCF9` | `background: var(--color-background)` |
| `border: 1px solid #ccc` | `border: 1px solid var(--color-border)` |
| `font-family: Inter` | `font-family: var(--font-family-base)` |
| `border-radius: 8px` | `border-radius: var(--radius-base)` |
| `padding: 16px` | `padding: var(--space-16)` |

### Color Token Reference (Light Mode)

| Token | Role | Value |
|---|---|---|
| `--color-primary` | Teal CTA/links | `#21808D` |
| `--color-background` | Page background | `#FCFCF9` |
| `--color-surface` | Card surfaces | `#FFFFFD` |
| `--color-text` | Primary text | `#13343B` |
| `--color-text-secondary` | Muted text | `#626C71` |
| `--color-border` | Borders | Brown 600 at 20% |
| `--color-error` | Error states | `#C0152F` |

## 3. CSS Naming Convention (BEM)

Use BEM (Block__Element--Modifier) for all CSS classes:

```css
/* ✅ CORRECT — BEM */
.service-card { }
.service-card__icon { }
.service-card__title { }
.service-card--featured { }

/* ❌ WRONG — generic or deeply nested */
.card .icon .title { }
.big-blue-card { }
```

## 4. Internationalization (i18n) — STRICT

All user-facing text MUST use the `data-translate` attribute system:

```html
<!-- ✅ CORRECT -->
<h2 data-translate="about.title">About ZOKFORCE</h2>

<!-- ❌ WRONG — hardcoded without translation key -->
<h2>About ZOKFORCE</h2>
```

- For HTML content: add `data-translate-html="true"`
- For placeholders: use `data-translate-placeholder="key"`
- New strings MUST be added to all 3 languages in `translations.js`: EN, zh-TW, zh-CN

## 5. JavaScript Standards

- **No frameworks** — vanilla JS only
- **No `var`** — use `const`/`let`
- **Event delegation** preferred over per-element listeners
- **Throttle/debounce** for scroll and resize handlers
- **Global functions** exposed via `window.functionName = functionName`
- **IIFE** for self-contained modules to avoid global pollution

## 6. Inline Styles — MINIMIZE

Avoid inline `<style>` blocks in HTML whenever possible. All styles belong in `style.css`.

| ❌ Avoid | ✅ Preferred |
|---|---|
| `<style>` in `index.html` | Class in `style.css` |
| `element.style.cssText = ...` in JS | Toggle CSS class via `classList` |

> **Exception**: JS-generated notification elements may use inline styles for positioning.

## 7. Image & Asset Standards

- Icons: PNG in `exported-assets/Icon/`
- Use `alt` attributes on all `<img>` tags
- Include error fallback for missing icons (see `app.js` IIFE pattern)
- Use `loading="lazy"` for below-fold images

## 8. Accessibility (WCAG 2.1 AA)

- 4.5:1 contrast ratio for text
- Keyboard navigable (focus rings via `--color-focus-ring`)
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- `aria-label` on interactive elements without visible text labels

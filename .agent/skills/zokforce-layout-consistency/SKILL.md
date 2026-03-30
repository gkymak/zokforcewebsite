---
name: zokforce-layout-consistency
description: Use this skill when creating or modifying any section, page, or component to ensure consistent layout structure across the ZokForce website.
---
# ZokForce Layout Consistency Skill

## 🚨 ALL SECTIONS MUST USE THE STANDARD LAYOUT PATTERN 🚨

---

## 1. Page Architecture

```
┌───────────────────────────────────────────────────┐
│ <header class="header">                           │
│   container > header__content > logo + nav + CTA  │
├───────────────────────────────────────────────────┤
│ <main>                                            │
│   <section id="..." class="section">              │
│     <div class="container">                       │
│       <div class="section-header">                │
│         <h2 class="section__title">               │
│         <p class="section__subtitle">             │
│       </div>                                      │
│       <!-- section content -->                    │
│     </div>                                        │
│   </section>                                      │
│   ...more sections...                             │
├───────────────────────────────────────────────────┤
│ <footer class="footer">                           │
│   container > footer__content                     │
└───────────────────────────────────────────────────┘
```

## 2. Canonical Section Pattern

Every main section MUST follow this structure:

```html
<section id="section-id" class="section">
    <div class="container">
        <div class="section-header">
            <h2 class="section__title" data-translate="section.title">Title</h2>
            <p class="section__subtitle" data-translate="section.subtitle">Subtitle</p>
        </div>
        <!-- Content goes here -->
    </div>
</section>
```

- Alternating sections use `class="section section--alt"` for visual rhythm
- All content is wrapped in `.container` (max-width handled by CSS breakpoints)

## 3. Grid Patterns

| Layout | CSS Class Pattern | Used In |
|---|---|---|
| **Service cards** | `.services-grid` (6-column auto-fit) | Home services preview |
| **Service details** | `.services-detailed` (stacked) | Services section |
| **Case studies** | `.case-studies-grid` (3-column) | Case Studies section |
| **Blog posts** | `.blog-grid` (auto-fit cards) | Insights section |
| **Contact** | `.contact-content` (info + form 2-col) | Contact section |
| **Stats** | `.hero__stats` (3 inline stats) | Hero section |
| **Values** | `.values-grid` (2x2 grid) | About section |

## 4. Mandatory Rules

| Rule | Correct | Forbidden |
|---|---|---|
| Section wrapper | `<section class="section">` | Raw `<div>` for sections |
| Content width | `.container` class | Hardcoded `max-width` in HTML |
| Section header | `.section-header` with `h2` + `p` | Headings without subtitle |
| Spacing | CSS tokens (`var(--space-*)`) | Hardcoded pixel values |
| Responsive | Mobile-first CSS breakpoints | Desktop-only layouts |

## 5. Container Breakpoints (from `style.css`)

| Breakpoint | Max Width |
|---|---|
| < 640px | 100% (fluid) |
| ≥ 640px | `var(--container-sm)` = 640px |
| ≥ 768px | `var(--container-md)` = 768px |
| ≥ 1024px | `var(--container-lg)` = 1024px |
| ≥ 1280px | `var(--container-xl)` = 1280px |

## 6. Mobile Menu Pattern

- Hamburger toggle: `.mobile-menu-toggle`
- Nav opens via `.nav.active` or `.nav--open`
- Body scroll locks via `.menu-open` on `<body>`
- Tagline hidden on mobile: `.header__logo .tagline { display: none }`

## 7. Pre-Flight Checklist

Before marking any page/section task as complete:

- [ ] Section uses `<section class="section">` with unique `id`
- [ ] Content wrapped in `.container`
- [ ] Section header uses `.section-header` → `h2.section__title` + `p.section__subtitle`
- [ ] All text has `data-translate` attributes
- [ ] Layout is responsive (tested at 768px and 375px)
- [ ] Alternating `section--alt` class used appropriately

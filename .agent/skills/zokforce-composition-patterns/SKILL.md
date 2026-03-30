---
name: zokforce-composition-patterns
description: Use this skill when building reusable CSS/HTML/JS patterns for the ZokForce website. Applies to creating new sections, components, or interactive elements.
---
# ZokForce Composition Patterns Skill

Reusable patterns for the ZokForce vanilla HTML/CSS/JS website.

## 1. CSS Component Pattern (BEM Blocks)

Every visual component is a BEM block with consistent structure:

```css
/* Block */
.service-card { }

/* Elements */
.service-card__icon { }
.service-card__title { }
.service-card__description { }

/* Modifiers */
.service-card--featured { }
.service-card--compact { }
```

### Creating a New Component
1. Define the block class in `style.css`
2. Use design tokens for all visual properties
3. Add responsive overrides within `@media` queries
4. Document with a comment header:

```css
/* ========================================
   Component: Service Card
   Used in: Home (services preview), Services section
   ======================================== */
.service-card { ... }
```

## 2. Section Composition

Sections compose from these building blocks:

```
Section = section-header + content-pattern

Content Patterns:
├── Grid of Cards    (.services-grid, .blog-grid)
├── Detail List      (.services-detailed — icon + text stacked)
├── Metrics Grid     (.results-metrics — stat cards)
├── Two-Column       (.contact-content — info + form)
└── Feature List     (.capabilities-list — inline tags)
```

### Adding a New Section
```html
<!-- 1. Section wrapper with unique id -->
<section id="new-section" class="section">
    <div class="container">
        <!-- 2. Standard header -->
        <div class="section-header">
            <h2 class="section__title" data-translate="newSection.title">Title</h2>
            <p class="section__subtitle" data-translate="newSection.subtitle">Subtitle</p>
        </div>
        <!-- 3. Content using existing pattern -->
        <div class="new-section-grid">
            <!-- Cards, details, etc. -->
        </div>
    </div>
</section>
```

## 3. Interactive Element Patterns

### Button Variants
```html
<!-- Primary CTA -->
<button class="btn btn--primary btn--lg" onclick="scrollToContact()">CTA Text</button>

<!-- Secondary -->
<button class="btn btn--secondary btn--lg">Secondary</button>

<!-- Full width (forms) -->
<button class="btn btn--primary btn--full-width" type="submit">Submit</button>
```

### Form Pattern
```html
<div class="form-group">
    <label for="field-id" class="form-label" data-translate="form.label">Label</label>
    <input type="text" id="field-id" name="field" class="form-control" required>
</div>
```

### Card Pattern
```html
<div class="card-name">
    <div class="card-name__header">
        <h3 data-translate="card.title">Title</h3>
    </div>
    <div class="card-name__content">
        <!-- Content -->
    </div>
</div>
```

## 4. JavaScript Module Pattern

Use IIFEs for self-contained functionality:

```javascript
// Self-contained feature module
(function() {
    const SELECTOR = '.my-component';
    
    function init() {
        const elements = document.querySelectorAll(SELECTOR);
        elements.forEach(el => {
            el.addEventListener('click', handleClick);
        });
    }
    
    function handleClick(e) { /* ... */ }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
```

### Exposing Global Functions
```javascript
// For functions called from HTML onclick attributes
window.myFunction = myFunction;
```

## 5. Translation Pattern

```javascript
// In translations.js — add to ALL three language objects
"newSection": {
    "title": "English Title",
    "subtitle": "English subtitle",
    "card1": {
        "title": "Card Title",
        "description": "Card description"
    }
}
```

HTML usage:
```html
<h2 data-translate="newSection.title">English Title</h2>
<p data-translate="newSection.card1.description">Card description</p>

<!-- For HTML content -->
<h1 data-translate="hero.title" data-translate-html="true">
    Text with <span class="highlight">formatted</span> content
</h1>
```

## 6. Anti-Patterns (FORBIDDEN)

| ❌ Don't | ✅ Do |
|---|---|
| Inline styles in HTML | CSS classes in `style.css` |
| `document.write()` | DOM manipulation with `createElement` |
| Global variable pollution | IIFE or module pattern |
| jQuery or external JS libs | Vanilla JS |
| Tailwind utility classes | BEM classes with design tokens |
| Copy-paste CSS blocks | Reuse existing component classes |

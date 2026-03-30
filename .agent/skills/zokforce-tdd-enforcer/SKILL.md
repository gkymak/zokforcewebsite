---
name: zokforce-tdd-enforcer
description: Use this skill to enforce quality-first development before implementing or modifying website functionality.
---
# ZokForce TDD Enforcer Skill

Enforce a quality-first development approach for the ZokForce static website.

## The Core Principle
```
DEFINE EXPECTED BEHAVIOR BEFORE WRITING CODE
```

## Instructions (Plan → Implement → Validate)

### 1. PLAN — Define Expected Behavior
Before writing any code, document what should happen:
- **What changes visually?** (layout, colors, content)
- **What changes functionally?** (form behavior, navigation, animations)
- **What should NOT break?** (existing sections, mobile layout, i18n)

### 2. IMPLEMENT — Minimal Code
Write the simplest code to achieve the expected behavior.
- Do not add features not planned.
- Follow `zokforce-frontend-architect` skill standards.

### 3. VALIDATE — Verify Against Plan
Run the validation checklist below to confirm correctness.

## Mandatory Validation Checklist

### HTML Validation
```bash
# Check for broken HTML structure
# View the page in browser, check for rendering issues
```

### CSS Validation
- [ ] All colors use design tokens (`var(--color-*)`)
- [ ] All spacing uses spacing tokens (`var(--space-*)`)
- [ ] No `!important` unless overriding third-party styles
- [ ] Dark mode works (`prefers-color-scheme: dark`)

### JavaScript Validation
- [ ] No `console.error` in browser DevTools
- [ ] No uncaught exceptions
- [ ] Forms submit correctly (test with DevTools Network tab)
- [ ] Mobile menu opens/closes properly

### i18n Validation
- [ ] All new text has `data-translate` attributes
- [ ] Translation keys added to `translations.js` for EN, zh-TW, zh-CN
- [ ] Language switcher changes new content correctly

### Cross-Browser Checklist
- [ ] Works in Chrome
- [ ] Works in Safari (mobile)
- [ ] Works at 375px viewport (mobile)
- [ ] Works at 768px viewport (tablet)
- [ ] Works at 1280px viewport (desktop)

## Red Flags — STOP and Fix
- Hardcoded color or spacing values in feature code
- Missing `data-translate` on user-facing text
- Console errors when page loads
- Feature breaks mobile layout

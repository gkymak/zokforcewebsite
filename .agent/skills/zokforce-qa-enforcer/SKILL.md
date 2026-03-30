---
name: zokforce-qa-enforcer
description: Use this skill for EVERY task that involves writing or modifying code. It defines ZokForce's mandatory QA strategy and browser verification protocol.
---
# ZokForce QA Enforcer Skill

> **This skill is non-negotiable. A task is NOT complete until all gates pass.**

## Overview — The Three QA Gates

```
Gate 1: Code Quality Review
         ↓ PASS
Gate 2: Browser Visual Verification (browser_subagent)
         ↓ PASS
Gate 3: Responsive & i18n Check
         ↓ PASS
         → Hand off to user
```

---

## Gate 1 — Code Quality Review

### Checklist
- [ ] All CSS uses design tokens (no hardcoded colors, spacing, fonts)
- [ ] All text has `data-translate` attributes
- [ ] No inline `<style>` blocks added (use `style.css`)
- [ ] No `console.log` left in production code
- [ ] Worker.js API responses include proper CORS headers
- [ ] HTML is semantic (`<section>`, `<article>`, `<nav>`, etc.)

---

## Gate 2 — Browser Visual Verification

### When to Run
After every task that changes:
- Any HTML structure or content
- Any CSS styling or design tokens
- Any JavaScript behavior
- Any blog post or page

### Procedure
Use the `browser_subagent` tool:
1. Navigate to `https://www.zokforce.com` (or `http://localhost:9000` for local dev)
2. Hard-refresh to ensure latest code
3. Capture screenshot — primary view
4. Interact with changed elements (buttons, forms, nav)
5. Capture screenshot — after interactions
6. Check browser console for errors
7. Scroll through entire page to verify all sections render

### Pass Criteria
- ✅ Page loads without blank/broken sections
- ✅ Zero console errors
- ✅ All sections render correctly
- ✅ Interactive elements work (buttons, forms, chatbot, mobile menu)

---

## Gate 3 — Responsive & i18n Check

### Responsive
Test at three viewpoints:
- **Mobile**: 375px width
- **Tablet**: 768px width
- **Desktop**: 1280px width

### i18n Verification
1. Switch to Traditional Chinese (`?lang=zh-TW`)
2. Verify new content translates correctly
3. Check for layout breaks from text expansion

### Pass Criteria
- ✅ No horizontal overflow at any viewport
- ✅ Mobile menu works correctly
- ✅ Content readable in all 3 languages

---

## Failure Protocol
If any gate fails:
1. Fix the issue
2. Re-run ALL gates from the beginning
3. Do NOT hand off until all gates pass

## Reporting
```markdown
### QA Gate Results
- **Gate 1 (Code Quality)**: ✅ Passed — tokens, i18n, semantics verified
- **Gate 2 (Visual)**: ✅ Verified — [screenshot path]
  - Console: no errors
  - Tested: [list of interactions]
- **Gate 3 (Responsive/i18n)**: ✅ 375px, 768px, 1280px, zh-TW verified
```

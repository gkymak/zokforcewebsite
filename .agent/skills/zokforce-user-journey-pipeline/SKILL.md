---
name: zokforce-user-journey-pipeline
description: Use this skill BEFORE starting any new feature, page, or content section. It enforces a structured planning pipeline to ensure quality and alignment.
---
# ZokForce User Journey Pipeline Skill

## 🚨 MANDATORY FIRST STEP FOR ALL NEW FEATURES 🚨

Before writing ANY code for a new page, section, or feature, complete the 3-phase planning pipeline. Skipping any phase is a **blocking violation**.

---

## Folder Structure

New features should be documented in a planning artifact:

```text
docs/Features/<FeatureName>/
├── README.md                  # What is this feature?
├── 01-product-design.md       # Visitor persona, content purpose, wireframe
├── 02-content-contracts.md    # Exact text, translation keys, asset requirements
├── 03-gap-analysis.md         # Checklist of what's built vs pending
└── assets/                    # Mockups, images, reference materials
```

---

## Phase 1: 01-product-design.md

**Role**: Define the "what" and "why"

1. **Target Persona** — Which visitor type? (Prospective client, technical decision maker, etc.)
2. **Content Purpose** — What question does this answer?
3. **Layout Pattern** — Which pattern from `zokforce-layout-consistency`?
4. **Wireframe** — ASCII wireframe or mockup screenshot
5. **i18n Plan** — List of translation keys needed (EN, zh-TW, zh-CN)

---

## Phase 2: 02-content-contracts.md

**Role**: Define the exact content and technical requirements

1. **Text Content** — All headings, descriptions, CTAs in English
2. **Translation Keys** — Mapped to `translations.js` namespace
3. **Assets Required** — Icons, images, diagrams
4. **Data Dependencies** — API endpoints (if any, via `worker.js`)
5. **SEO Requirements** — Meta tags, structured data, heading hierarchy

---

## Phase 3: 03-gap-analysis.md

**Role**: Track implementation status

```markdown
| Component | Owner | Status | Notes |
|-----------|-------|--------|-------|
| HTML structure | Gary | ✅ | Section added to index.html |
| CSS styles | Gary | 🚧 | Responsive pending |
| Translations (EN) | Gary | ✅ | Added to translations.js |
| Translations (zh-TW) | Gary | ❌ | Not started |
| Translations (zh-CN) | Gary | ❌ | Not started |
| Blog post HTML | Gary | ✅ | Standalone page created |
```

Status: ✅ Done, 🚧 WIP, ❌ Not Started

---

## Pipeline Summary

```
01-product-design.md  →  02-content-contracts.md  →  03-gap-analysis.md
     (WHY)                     (WHAT)                    (STATUS)
```

## Checklist Before Implementation
- [ ] `01-product-design.md` exists with persona and wireframe
- [ ] `02-content-contracts.md` exists with exact text and translation keys
- [ ] `03-gap-analysis.md` exists with tracking table
- [ ] User has approved the plan before code begins

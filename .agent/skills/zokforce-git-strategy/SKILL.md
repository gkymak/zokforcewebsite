---
name: zokforce-git-strategy
description: Use this skill for all Git operations, repository collaboration, and CI/CD strategy for the ZokForce company website.
---
# ZokForce Git Strategy Skill

Follow these rules for ALL interactions involving Git, repository management, or deploying the ZokForce website.

## 1. Repository Setup

| Aspect | Details |
|--------|---------|
| **Primary remote (origin)** | `https://zokforce.synology.me:30443/zokforce/zokforce-website.git` (Private GitLab) |
| **Mirror remote (github)** | `https://github.com/gkymak/zokforcewebsite.git` (Public GitHub) |
| **Local clone** | `/Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite` |
| **Deployment** | Cloudflare Workers via `wrangler deploy` |

## 2. Branching Strategy

Our flow is: **`main` ← `feature/*` / `fix/*` / `chore/*`**

- **`main`**: The production branch. Deployed to `zokforce.com` via Cloudflare.
- **`feature/*`**, **`fix/*`**, **`chore/*`**: Short-lived branches for dev work.

**To start new work:**
```bash
git fetch origin
git checkout main
git pull origin main
git checkout -b <type>/<short-description>
```

## 3. Commit Protocol

**🚨 USER APPROVAL REQUIRED 🚨**
You must **NEVER** execute a `git commit` command without explicit prior approval from the human user.

## 4. Commit Standards

Always use **Conventional Commits**:
- `feat(blog): add blog post 9 on RAG pipelines`
- `fix(chatbot): update iframe URL to production domain`
- `chore(i18n): add zh-TW translations for services section`
- `style(css): refactor service card hover animations`

Keep commits granular and logically separated.

## 5. Collaboration & Merge Strategy

1. **Push feature branch to GitLab:**
    ```bash
    git push -u origin <branch-name>
    ```
2. **Handover to human:** Request a **Merge Request (MR)** on GitLab from `<branch-name>` into `main`.
3. **After merge:** Squash merge into `main`.

## 6. Deployment to Cloudflare

After merging to `main`:
```bash
git checkout main
git pull origin main
wrangler deploy
```

## 7. Syncing with the Team

When returning to work:
```bash
git fetch origin
git checkout main
git pull --rebase origin main
```

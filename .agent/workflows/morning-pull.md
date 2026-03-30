---
description: Morning pull — sync latest code from origin before starting work
---

# Morning Pull Workflow

// turbo-all

Run this at the start of each development session to ensure you have the latest code from the team.

## Steps

1. Check current branch and status:
```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && git branch --show-current && git status --short
```

2. If there are uncommitted changes, stash them first:
```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && git stash push -m "WIP: auto-stash before morning pull" --include-untracked
```

3. Pull latest from the current branch:
```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && git pull origin $(git branch --show-current) 2>&1
```

4. If changes were stashed in step 2, pop the stash:
```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && git stash pop
```

5. If there are merge conflicts after popping the stash:
   - List conflicted files: `git diff --name-only --diff-filter=U`
   - Resolve each conflict manually
   - Mark resolved: `git add <file>`

6. Report the result to the user — either "up to date, no conflicts" or list what changed and any conflicts resolved.

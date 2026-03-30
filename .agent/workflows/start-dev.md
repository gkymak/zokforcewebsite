---
description: Start the local dev environment for the ZokForce website
---

# Start Dev Environment

// turbo-all

1. Start the Cloudflare Workers local dev server:

```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && wrangler dev
```

This runs:
- **Static site + Worker** → `http://localhost:8787`
- Contact form API → `POST http://localhost:8787/api/contact`

2. Alternatively, for a simple static server (no Worker APIs):

```bash
cd /Users/gkymakyahoo.ca/zokforceweb1/zokforcewebsite && python3 -m http.server 9000
```

This runs:
- **Static site only** → `http://localhost:9000`

## Notes
- `Ctrl+C` stops the server
- Use `wrangler dev` when testing contact form or assessment email features
- Use `python3 -m http.server` for quick HTML/CSS/JS previews

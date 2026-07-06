# BuildBearing Production Package

This folder is the deploy-ready replacement for the current public BuildBearing website.

## What It Ships

- Public noindex landing page at `/`
- Password-protected console at `/console.html`
- Cookie-based server-side session
- Protected registry and uptime APIs
- Live uptime refresh endpoint
- Robots and response headers that block search indexing

## Required Environment Variables

Set these in the hosting provider before production deploy:

```text
CENTRE_PASSWORD=your-private-password
CENTRE_SESSION_SECRET=random-long-session-secret
```

Do not commit real values.

For local development only, the password falls back to:

```text
centre
```

## Vercel Deploy Shape

This package is Vercel-ready:

- `public/index.html` is the private landing page.
- `public/console.html` is the unlocked console file, protected by middleware.
- `api/login.js` creates the secure session cookie.
- `api/logout.js` clears the session.
- `api/registry.js`, `api/uptime-status.js`, and `api/check-uptime.js` are protected.
- `api/public-summary.js` feeds non-sensitive landing page stats.
- `middleware.js` blocks protected routes unless the signed session cookie is valid.

If Vercel says `No Next.js version detected`, the linked project is still configured
as a Next.js project. Change the project Framework Preset to `Other` or `No
Framework` in Vercel Dashboard -> Project -> Settings -> Build & Development
Settings, then deploy again.

## Production Cutover Plan

1. Create or select the Vercel project for `buildbearing.com`.
2. Set `CENTRE_PASSWORD` and `CENTRE_SESSION_SECRET`.
3. Deploy this folder.
4. Test the preview URL.
5. Attach or repoint `buildbearing.com`.
6. Confirm `/` shows the landing page.
7. Confirm `/console.html` redirects to `/` when logged out.
8. Log in and confirm the console loads.
9. Run the Uptime button.
10. Confirm search indexing is blocked.

## Current Live Snapshot

- Projects checked: 6
- Websites live: 5
- Health endpoints live: 1
- Unreachable: 1
- Missing `/api/health`: 4

## Next Production Improvements

- Add real `/api/health` endpoints to the connected projects.
- Move uptime history into a database or durable KV store.
- Add scheduled checks.
- Connect analytics and Search Console.
- Add proper user management if more people need access.

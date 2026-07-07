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

Optional private data refreshes can also use:

```text
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account-json
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GOOGLE_SERVICE_ACCOUNT_FILE=/absolute/path/to/service-account.json
GOOGLE_ACCESS_TOKEN=short-lived-oauth-token
```

Only one Google credential source is needed. Do not commit real Google
credentials or generated metric snapshots.

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

- Projects checked: 9
- Websites live: 9
- Health endpoints live: 1
- Unreachable: 0
- Missing `/api/health`: 8

## Search Console Refresh

The Search panel reads `data/search-summary.json` through the protected
`/api/search-summary` endpoint. The real snapshot file is ignored by Git because
it can contain private query and click data.

To connect it:

1. Enable the Google Search Console API in Google Cloud.
2. Create OAuth credentials or a service account.
3. Give that credential access to each Search Console property.
4. Set one of the Google credential environment variables above.
5. Run:

```bash
npm run refresh:search
```

The refresh uses the last finalized 30-day Search Console window and writes
queries, clicks, impressions, CTR, and average position for the connected
properties.

## Next Production Improvements

- Add real `/api/health` endpoints to the connected projects.
- Move uptime history into a database or durable KV store.
- Add scheduled checks.
- Connect analytics.
- Add proper user management if more people need access.

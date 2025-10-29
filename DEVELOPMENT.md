# Prayer Circle – Development Notes

## Environment Variables

The Vite client reads a handful of environment variables, but sensible defaults are now provided at build time. You can override them by creating a `.env.local` (or `.env.development`) file in the project root:

```ini
VITE_APP_TITLE=Prayer Circle
VITE_APP_LOGO=/favicon.png
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-site-id
```

> Tip: copy `cp .env.example .env.local` and edit the new file to keep your local configuration out of version control.

### Auth and analytics configuration

- `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` configure the Manus OAuth portal used for sign-in. Leaving them blank while developing locally will cause the sign-in button to fall back to the home page.
- `VITE_ANALYTICS_ENDPOINT` + `VITE_ANALYTICS_WEBSITE_ID` enable Umami analytics (optional). When both are defined the lightweight tracking script is injected automatically.
- `DATABASE_URL` is optional for local development. If it is missing, the server uses curated in-memory sample data so the UI still feels alive.
- `OWNER_OPEN_ID` promotes a Manus user to `admin` automatically after the first login.
- `VITE_DEMO_MODE` (client) and `DEMO_MODE` (server) let you enable the preview “auto-admin” experience so protected routes stay usable without real auth.

#### Quick checklist to validate OAuth locally

1. Copy `.env.example` to `.env.local` and fill in the Manus secrets (`VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `JWT_SECRET`, `OWNER_OPEN_ID`, etc.).
2. Restart `pnpm dev` so the server picks up the new env values.
3. Visit `http://localhost:3000` and click **Sign In**. You should be redirected to the Manus OAuth portal.
4. Complete authentication and ensure Manus calls back to `/api/oauth/callback`. The server should set a session cookie and redirect you to the homepage.
5. Confirm the nav shows your profile indicator and that admin-only routes (like `/admin`) work when your OpenID matches `OWNER_OPEN_ID`.

## Bundle Analysis Workflow

Bundle analysis is available via the Rollup visualizer plug-in. Run the production build with the `ANALYZE` flag to produce `dist/bundle-analysis.html`:

```bash
ANALYZE=true corepack pnpm run build
```

Open the generated HTML file in a browser to explore bundle composition. This is the recommended workflow for diagnosing large dependencies or code paths before shipping.

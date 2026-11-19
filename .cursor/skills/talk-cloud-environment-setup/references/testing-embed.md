# Testing the third-party embed

Coral ships to publishers as a script tag: the host page loads
`<coral>/assets/js/embed.js` and calls `Coral.createStreamEmbed({ rootURL, storyID, storyURL })`.
The stream then talks to `rootURL` from the host page's origin, so the site's
`allowedOrigins` gates it (CORS on `/api`, CSP `frame-ancestors` on framed
pages such as the auth popup). Test embeds from a separate origin, not only
from the bundled `story.html` on 8080.

## Prerequisites

Dev mode running and seeded (see `runbook.md`): server on 3000, client on 8080,
`seed-install.sh` done. The seed allows `http://localhost:8080`,
`http://127.0.0.1:8080`, and `http://localhost:8000`.

## Allowed host page: comment and moderate

```bash
S=.cursor/skills/talk-cloud-environment-setup/scripts
tmux new-session -d -s talk-host-page "$S/host-page.sh 8000"
```

1. Open `http://localhost:8000/?story=browser-demo`.
   Expected: "Host page article" heading, then the stream with Sign in and
   "Post a comment". The story is created lazily from `storyURL` on first load.
2. Click **Sign in**; in the popup use `admin@example.com` / `coral-dev-password`.
   Expected: popup closes, stream shows "Signed in as admin" and **MODERATE**.
3. Post a comment. Expected: it appears immediately with a STAFF badge.
4. Open `http://localhost:3000/admin/moderate/approved`.
   Expected: the comment is listed (staff comments are auto-approved).

For a non-staff flow, sign out, use **Sign in -> Sign up** on the embed to
create a commenter, and check Admin -> Moderate -> Unmoderated.

## Non-allowed host page: rejection path

```bash
tmux new-session -d -s talk-host-page-bad "$S/host-page.sh 8001"
```

Open `http://localhost:8001/?story=browser-demo`.
Expected: the stream shows "Network error. Please refresh your page and try
again."; the console shows `Access to fetch at 'http://localhost:3000/api/graphql'
from origin 'http://localhost:8001' has been blocked by CORS policy`.
Adding `http://localhost:8001` under Admin -> Configure -> Organization/Sites
-> Site -> Permitted domains fixes it.

## Variations

- Bundled dev pages: `http://localhost:8080/` (`story.html`), `/storyButton.html`.
- Production-like script: `TALK_EMBED_SCRIPT_URL=http://localhost:3000/assets/js/embed.js $S/host-page.sh 8000`
  uses the bundle built into `client/dist` instead of the live dev bundle.
- Many sites/stories, story modes (QA, ratings), and SSO: `multi-site-test/README.md`.
- WordPress plugin: `wordpress/README.md` (`docker compose` in `wordpress/`, port 8081;
  add `http://localhost:8081` to allowed origins).
- API-only equivalent of steps 1-4: `$S/smoke-api.sh`.

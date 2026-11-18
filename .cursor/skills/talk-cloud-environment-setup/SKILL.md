---
name: talk-cloud-environment-setup
description: Set up, run, lint, test, and exercise Coral (coralproject/talk) in a Cursor Cloud VM - Node 18 + pnpm 8 toolchain, MongoDB/Redis via Docker, client and server watchers, seeding a dev tenant, and validating the third-party embed on a separate host-page origin. Use when installing talk dependencies, starting Coral locally, running its CI checks, or testing comment/embed/moderation flows.
---

# Coral (talk) cloud environment

Coral is a commenting platform that is embedded into a publisher's page by a
third-party `<script>`. It is not a monorepo workspace: `config`, `common`,
`client`, `server`, and `docs` are independent pnpm projects with their own
lockfiles and **no root `package.json`**. `multi-site-test/` and `wordpress/`
are optional embed test beds.

## Must-know gotchas

- **Toolchain is Node 18.16.x + pnpm 8.14.3** (CI:
  `.github/workflows/build-and-test.yml`; lockfiles are v6). Newer pnpm rejects
  `--frozen-lockfile`. Always `. scripts/env.sh` (or use `scripts/run.sh`)
  before running repo commands.
- **`nvm use` is not enough in agent shells.** `/exec-daemon/node` (Node 22)
  can precede nvm on `PATH`; `re2` then fails to compile during install
  (`v8::AccessControl` errors, `node -v v22...` in the gyp log). `env.sh`
  prepends `$NVM_BIN` to fix this.
- **The server needs one development build before `watch` works.** Without
  `server/dist/.../wordList/worker.js` it crashes on boot
  (`Cannot find module ... wordList/worker.js`). Run
  `scripts/build-development.sh` once after install (~5 min).
- **Use port 3000 for `/admin`, `/install`, `/api`.** The webpack dev server
  (8080) proxies those to `127.0.0.1:3000` without a URL scheme; Node parses
  that as host `3000` and every proxied request times out (`[HPM] ... ETIMEDOUT`)
  on Linux. 8080 still serves the live client bundles and `story.html`.
- **Tenants are keyed by hostname.** Seed and browse with `localhost`, not
  `127.0.0.1` (a different host is "tenant not found").
- **Embeds only work from the site's `allowedOrigins`.** A non-allowed host page
  shows "Network error" in the stream and CORS errors on `/api/graphql`.
- Docker is installed in the image but dockerd is not started at boot;
  `scripts/start-services.sh` starts it on demand.
- `scripts/pnpm-i.sh`/`pnpm-ci.sh` install a git pre-commit hook; the cloud
  scripts here do not.

## Quick start

From the repo root (`/agent/repos/talk`), with `S=.cursor/skills/talk-cloud-environment-setup/scripts`:

```bash
$S/install-deps.sh                          # frozen install of all 5 packages (boot install already does this)
$S/start-services.sh                        # dockerd + mongo:8.0.3 + redis:7.2.5
$S/run.sh sh scripts/build-development.sh   # once per checkout, ~5 min
# long-running, one tmux session each:
$S/run.sh bash -c 'cd client && pnpm run watch'   # :8080 webpack dev server + relay/css generators
$S/run.sh bash -c 'cd server && pnpm run watch'   # :3000 API/admin (ts-node-dev), metrics :9000
$S/seed-install.sh                          # tenant + site + admin (idempotent)
$S/smoke-api.sh                             # login, create story, post + read a comment
$S/host-page.sh 8000                        # third-party host page embedding the stream
```

Then open `http://localhost:8000/?story=demo-1` (embed), `http://localhost:3000/admin`
(admin@example.com / coral-dev-password), or `http://localhost:8080/` (bundled `story.html`).

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/env.sh` | Source to select Node 18.16.1 + pnpm 8.14.3 and fix `PATH` ordering. |
| `scripts/run.sh <cmd...>` | Run any command from the repo root with that toolchain. |
| `scripts/install-deps.sh` | `pnpm install --frozen-lockfile` in config, common, client, server, docs. |
| `scripts/start-services.sh` | Start dockerd if needed and `docker compose up -d mongo redis`; waits for readiness. |
| `scripts/seed-install.sh` | `POST /api/install` with a dev tenant/site/admin; no-op when installed. |
| `scripts/smoke-api.sh [storyID]` | API hello world: auth, lazy story creation, `createComment`, read back. |
| `scripts/host-page.sh [port]` | Serve a minimal CMS-style page on its own origin using the public embed snippet. |

Lint, test, generate, and build use the repo's own scripts (`scripts/generate.sh`,
`scripts/lint.sh`, `scripts/build.sh`, per-package `pnpm run test:*`) through
`run.sh`; see `references/runbook.md` for the CI-equivalent sequence.

## References

- `references/runbook.md` - ports, CI-equivalent checks with timings, dev
  servers, reset, and known limitations.
- `references/testing-embed.md` - validating the third-party embed on a host
  page: sign in, comment, moderate, and the allowed-origin rejection path.

## Working with cloud-agent-env-node

The VM image and boot `install` step are owned by the mounted
`cloud-agent-env-node` repo (`.cursor/Dockerfile`, `.cursor/install-repos.sh`).
Its install step already runs the frozen installs above with Node 18 + pnpm 8
for this repo; change toolchain pins there, not here. No secrets are required
for local development.

# Coral (talk) runbook

All commands run from the repo root with
`S=.cursor/skills/talk-cloud-environment-setup/scripts`.

## Ports

| Port | Process | Notes |
| --- | --- | --- |
| 3000 | server (`server: pnpm run watch`) | GraphQL `/api/graphql`, `/admin`, `/install`, `/embed/*`. Use this for admin/API. |
| 8080 | client webpack dev server (`client: pnpm run watch`) | Live bundles (`/assets/js/embed.js`), `story.html`, `storyButton.html`. Its proxy to 3000 is broken on Linux (see gotchas). |
| 9000 | server metrics | `/metrics` |
| 9229 | server inspector | `ts-node-dev --inspect` |
| 27017 / 6379 | mongo / redis containers | `coral-mongo`, `coral-redis` from `docker-compose.yml` |
| 8000+ | `host-page.sh` | Third-party host pages; only origins in `allowedOrigins` can embed. |

## CI-equivalent checks

Mirrors `.github/workflows/build-and-test.yml`. Times are from a 4-vCPU / 16 GB
cloud VM.

```bash
$S/install-deps.sh                                             # ~4 min cold
$S/run.sh sh scripts/generate.sh                               # ~10 s
$S/run.sh sh scripts/lint.sh                                   # ~2 min (eslint + tsc: client, server, docs)
$S/run.sh bash -c 'cd client && npx @coralproject/package-version-lint'
$S/run.sh bash -c 'cd server && pnpm run test:server -- --ci'  # ~20 s, 187 tests
$S/run.sh bash -c 'cd client && pnpm run test:client:stream -- --ci'   # ~1.5 min
$S/run.sh bash -c 'cd client && pnpm run test:client:admin -- --ci'    # ~1.5 min
$S/run.sh bash -c 'cd client && pnpm run test:client:other -- --ci'    # ~30 s
$S/run.sh sh scripts/build.sh                                  # production build (CI sets NODE_OPTIONS=--max-old-space-size=14336)
```

Expected: all exit 0. `test:server` uses mocks (`server/src/core/server/test/mocks.ts`).
`server: pnpm run test:cache` (not run in CI, not verified here) starts
`mongodb-memory-server`/`redis-memory-server` on 27019/6381, which download or
compile binaries on first use (the boot install sets
`REDISMS_DISABLE_POSTINSTALL=1`, deferring the Redis compile to that run).

## Dev mode

```bash
$S/start-services.sh
$S/run.sh sh scripts/build-development.sh   # first time per checkout, ~5 min
tmux new-session -d -s talk-client "$S/run.sh bash -c 'cd client && pnpm run watch'"
tmux new-session -d -s talk-server "$S/run.sh bash -c 'cd server && pnpm run watch'"
```

Ready signals:

- client: `Compiled successfully!` (first compile takes 1-3 min; it recompiles
  several times while the relay generators run).
- server: `now listening (port=3000)`; `curl -s -o /dev/null -w '%{http_code}' localhost:3000/api/install`
  returns `204` (not installed) or `400` with `TENANT_INSTALLED_ALREADY`.

Then `$S/seed-install.sh` and `$S/smoke-api.sh`. Expected smoke output ends in
`OK` after `story:`, `created:` (status `APPROVED`), and `listed:` lines.

`pnpm run watch` in `server` runs with `DISABLE_JOB_PROCESSORS=true`; use
`pnpm run start:development:withJobs` (no file watcher) to exercise mailer,
notifications, and other job queues. Server env vars go in `server/.env`
(see `docs/docs/environment-variables.md`); defaults work for local dev.

Optional SMTP sink for email flows (configure Coral Admin -> Configure -> Email
with host `localhost`, port `2500`, no auth):

```bash
docker run -d --name inbucket -p 2500:2500 -p 9001:9000 inbucket/inbucket   # UI at :9001
```

## Reset

```bash
docker compose down -v && $S/start-services.sh    # wipe mongo/redis data, then $S/seed-install.sh
```

## Known limitations

- **8080 proxy**: `client/config/webpackDevServer.config.ts` sets the proxy
  target to `` `127.0.0.1:${serverPort}` `` (no `http://`). `url.parse` reads
  `127.0.0.1:` as the protocol and `3000` as the host, so `/admin`, `/install`,
  and `/api` via 8080 hang with `[HPM] ... ETIMEDOUT`. Work around by using
  port 3000 directly.
- `pnpm run watch` in `server` logs `failed to set logging project id` (no
  GCP) and Sentry `offlineDebug` messages; both are harmless in dev.
- Node 18 is end-of-life upstream; it is what CI uses, so do not upgrade it
  as part of environment work.

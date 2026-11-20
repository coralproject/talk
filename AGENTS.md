# AGENTS.md

Contributor docs live in `CONTRIBUTING.md` and `docs/docs/development.md`.

## Cursor Cloud specific instructions

Use the `talk-cloud-environment-setup` skill
(`.cursor/skills/talk-cloud-environment-setup/SKILL.md`) as the source of truth
for installing, running, testing, and exercising Coral in a cloud VM. The
highest-impact gotchas:

- Use Node 24 (24.15 or later; CI uses 24.x) and pnpm 8.14.3; there is no root `package.json`,
  so each of `config`, `common`, `client`, `server`, `docs` installs separately.
- In dev mode, use port 3000 (not the 8080 dev-server proxy) for `/admin`,
  `/install`, and `/api`.

## References

- `.cursor/skills/talk-cloud-environment-setup/` - cloud setup scripts and runbooks.
- `CONTRIBUTING.md`, `docs/docs/development.md` - contributor workflow.

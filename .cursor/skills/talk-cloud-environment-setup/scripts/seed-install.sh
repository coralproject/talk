#!/usr/bin/env bash
# Install a dev tenant, site, and admin through POST /api/install, i.e. what the
# /install wizard does. No-op when a tenant is already installed.
#
# The tenant is keyed by the request hostname, so CORAL_URL's host must be the
# same host the embed's rootURL and the browser use (default: localhost).
set -euo pipefail

CORAL_URL="${CORAL_URL:-http://localhost:3000}"
ADMIN_EMAIL="${TALK_DEV_ADMIN_EMAIL:-admin@example.com}"
ADMIN_USERNAME="${TALK_DEV_ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${TALK_DEV_ADMIN_PASSWORD:-coral-dev-password}"
ALLOWED_ORIGINS="${TALK_DEV_ALLOWED_ORIGINS:-http://localhost:8080 http://127.0.0.1:8080 http://localhost:8000}"

status="$(curl -s -o /dev/null -w '%{http_code}' "$CORAL_URL/api/install")"
case "$status" in
  204) ;;
  400 | 403 | 409 | 500)
    if curl -s "$CORAL_URL/api/install" | grep -q TENANT_INSTALLED_ALREADY; then
      echo "tenant already installed for $CORAL_URL; nothing to do"
      exit 0
    fi
    echo "GET $CORAL_URL/api/install returned $status" >&2
    curl -s "$CORAL_URL/api/install" >&2
    exit 1
    ;;
  000)
    echo "Coral server is not reachable at $CORAL_URL (is the server watcher running?)" >&2
    exit 1
    ;;
  *)
    echo "unexpected status $status from GET $CORAL_URL/api/install" >&2
    exit 1
    ;;
esac

read -r -a origins <<<"$ALLOWED_ORIGINS"
origins_json="$(printf '%s\n' "${origins[@]}" | jq -R . | jq -s -c .)"
body="$(jq -n \
  --arg url "$CORAL_URL" \
  --arg email "$ADMIN_EMAIL" \
  --arg username "$ADMIN_USERNAME" \
  --arg password "$ADMIN_PASSWORD" \
  --argjson origins "$origins_json" \
  '{
    tenant: {
      organization: { name: "Coral Dev", url: $url, contactEmail: $email },
      locale: "en-US"
    },
    site: { name: "Coral Dev Site", allowedOrigins: $origins },
    user: { username: $username, email: $email, password: $password }
  }')"

# The install endpoint allows one request per 10s per IP.
sleep 10
response="$(curl -s -w '\n%{http_code}' -H 'Content-Type: application/json' -d "$body" "$CORAL_URL/api/install")"
code="${response##*$'\n'}"
if [ "$code" != "204" ] && [ "$code" != "200" ]; then
  echo "install failed with HTTP $code: ${response%$'\n'*}" >&2
  exit 1
fi

echo "installed tenant for $CORAL_URL"
echo "  admin:   $CORAL_URL/admin  ($ADMIN_EMAIL / $ADMIN_PASSWORD)"
echo "  origins: $ALLOWED_ORIGINS"

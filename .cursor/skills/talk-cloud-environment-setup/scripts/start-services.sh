#!/usr/bin/env bash
# Start MongoDB and Redis from the repo's docker-compose.yml, starting dockerd
# first if needed. Idempotent; safe to re-run.
set -euo pipefail

TALK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../../.." && pwd)"

docker_cmd() {
  if docker info >/dev/null 2>&1; then docker "$@"; else sudo -n docker "$@"; fi
}

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is not installed in this image" >&2
  exit 1
fi

if ! docker_cmd info >/dev/null 2>&1; then
  if ! pgrep -x dockerd >/dev/null 2>&1; then
    echo "starting dockerd (log: /tmp/dockerd.log)"
    sudo -n sh -c 'nohup dockerd >/tmp/dockerd.log 2>&1 &'
  fi
  for _ in $(seq 1 30); do
    docker_cmd info >/dev/null 2>&1 && break
    sleep 1
  done
  docker_cmd info >/dev/null 2>&1 || { echo "dockerd did not become ready; see /tmp/dockerd.log" >&2; exit 1; }
fi

cd "$TALK_ROOT"
docker_cmd compose up -d mongo redis

for _ in $(seq 1 60); do
  if docker_cmd exec coral-mongo mongosh --quiet --eval 'db.runCommand({ping:1}).ok' 2>/dev/null | grep -q 1 \
    && docker_cmd exec coral-redis redis-cli ping 2>/dev/null | grep -q PONG; then
    echo "mongo (127.0.0.1:27017) and redis (127.0.0.1:6379) are ready"
    exit 0
  fi
  sleep 1
done
echo "mongo/redis did not become ready" >&2
exit 1

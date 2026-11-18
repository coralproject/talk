#!/usr/bin/env bash
# API hello world against a running, seeded server: log in as the dev admin,
# lazily create a story by URL, post a comment, and read it back.
# shellcheck disable=SC2016 # GraphQL $variables are literal.
set -euo pipefail

CORAL_URL="${CORAL_URL:-http://localhost:3000}"
ADMIN_EMAIL="${TALK_DEV_ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${TALK_DEV_ADMIN_PASSWORD:-coral-dev-password}"
STORY_ID="${1:-smoke-$(date +%s)}"
STORY_URL="${TALK_SMOKE_STORY_URL:-http://localhost:8000/?story=$STORY_ID}"

token="$(curl -sf -H 'Content-Type: application/json' \
  -d "$(jq -n --arg e "$ADMIN_EMAIL" --arg p "$ADMIN_PASSWORD" '{email:$e, password:$p}')" \
  "$CORAL_URL/api/auth/local" | jq -r .token)"
if [ -z "$token" ] || [ "$token" = null ]; then
  echo "login failed (run seed-install.sh?)" >&2
  exit 1
fi

gql() {
  curl -sf -H "Authorization: Bearer $token" -H 'Content-Type: application/json' \
    -d "$(jq -n --arg q "$1" --argjson v "${2:-{\}}" '{query:$q, variables:$v}')" \
    "$CORAL_URL/api/graphql"
}

story="$(gql 'query($id: ID!, $url: String!){ stream(id: $id, url: $url){ id url } }' \
  "$(jq -n --arg id "$STORY_ID" --arg url "$STORY_URL" '{id:$id, url:$url}')")"
echo "story:   $(jq -c .data.stream <<<"$story")"

body="Hello from smoke-api.sh at $(date -u +%FT%TZ)"
created="$(gql 'mutation($i: CreateCommentInput!){ createComment(input: $i){ edge { node { id status } } } }' \
  "$(jq -n --arg s "$STORY_ID" --arg b "$body" '{i:{storyID:$s, body:$b, clientMutationId:"smoke"}}')")"
echo "created: $(jq -c .data.createComment.edge.node <<<"$created")"

listed="$(gql 'query($id: ID!){ stream(id: $id){ comments(first: 5){ nodes { body status author { username } } } } }' \
  "$(jq -n --arg id "$STORY_ID" '{id:$id}')")"
echo "listed:  $(jq -c .data.stream.comments.nodes <<<"$listed")"

jq -e --arg b "$body" '.data.stream.comments.nodes | any(.body == $b)' <<<"$listed" >/dev/null \
  || { echo "comment not found in stream" >&2; exit 1; }
echo "OK"

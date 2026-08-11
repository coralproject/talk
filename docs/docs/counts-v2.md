---
title: Comment Counts API (v2)
---

The Counts v2 API is a REST endpoint that returns the current comment count
for one or more stories in a single request. It's an alternative to the
[`count.js` embed script](/counts) for clients who want to retrieve comment
counts server-side, in bulk, or without embedding a script on the page.

## Requirements

- The endpoint requires an authenticated request from a Coral user with the
  **Admin** role.
- Applications authenticate the same way they do for the
  [Coral GraphQL API](/api/schema#get-an-access-token): by generating a
  personal access token with [`coral-cli`](https://github.com/coralproject/coral-cli#coral-cli-tokencreate)
  and sending it in the `Authorization` header.

```bash
coral-cli token:create --domain "{{ CORAL_DOMAIN_NAME }}" --name "{{ accessTokenName }}" --json
```

See [Get an access token](/api/schema#get-an-access-token) for the full
walkthrough, including how to list and revoke tokens.

## Make a request

Send a `POST` request to `/api/story/counts/v2` with a JSON body containing
the `storyIDs` you want counts for:

```bash
curl --request POST \
  --url https://{{ CORAL_DOMAIN_NAME }}/api/story/counts/v2 \
  --header "Authorization: Bearer {{ accessToken }}" \
  --header "Content-Type: application/json" \
  --data '{"storyIDs": ["story-id-1", "story-id-2"]}'
```

### Request body

| Field       | Type       | Required | Description                                                |
| ----------- | ---------- | -------- | ------------------------------------------------------------ |
| `storyIDs`  | `string[]` | Yes      | The Coral story IDs to fetch counts for. Max 100 per request. |

### Response

The response is a JSON array with one entry per requested `storyID`, returned
in the same order (and with the same duplicates, if any) as the request:

```json
[
  { "storyID": "story-id-1", "redisCount": 5, "count": 5 },
  { "storyID": "story-id-2", "mongoCount": 2, "count": 2 }
]
```

| Field        | Description                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `storyID`    | The story ID this entry corresponds to.                                                         |
| `count`      | The number of published comments on the story. Always present.                                  |
| `redisCount` | Present when the count was served from Coral's cache.                                           |
| `mongoCount` | Present when the count was computed fresh (and then cached) because it wasn't already in cache. |

`redisCount` and `mongoCount` are informational only — always read `count`.
A story with no published comments (including a story ID Coral doesn't
recognize) returns a `count` of `0`.

## Errors

| Status | Meaning                                                                          |
| ------ | --------------------------------------------------------------------------------- |
| `400`  | The request body failed validation (missing `storyIDs`, more than 100 IDs, etc). |
| `401`  | No token was provided, or the token is invalid or expired.                       |
| `403`  | The authenticated user does not have the Admin role.                             |

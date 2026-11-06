# 3. Hand the atproto sign-in token to the stream through Redis

Date: 2026-10

## Status

Proposed

## Context and Problem Statement

Coral's sign in runs in a popup opened by the comment stream. When sign in
completes, the popup sends the new access token to the stream with
`window.opener.postMessage` and closes.

Atproto sign in sends the popup to the user's own authorization server.
Authorization servers can send `Cross-Origin-Opener-Policy: same-origin`
(bsky.social does), which cuts the popup off from the page that opened it:
`window.opener` is `null` when the popup comes back to Coral, so it can't send
the token to the stream.

The stream runs in an iframe on the publisher's page, so `BroadcastChannel`,
`localStorage` and similar storage are partitioned there. The popup can't use
them to reach the stream either. The token has to go through Coral's server.

## Decision Drivers

- No requests at all unless a user actually starts an atproto sign in.
- No polling.
- Works when live updates (GraphQL subscriptions) are disabled, as they are on
  some large deployments.
- Works with several Coral instances behind a load balancer.
- A token can only be picked up by the stream that opened that popup, once.
- Nothing kept in Redis longer than a sign in needs.

## Considered Options

- Polling the server from the stream until the token arrives.
- A GraphQL subscription.
- Keying the token by the user's handle.
- A second window that relays the token with `BroadcastChannel`.
- A single held request, woken through Redis pub/sub.

## Decision Outcome

A single held request, woken through Redis pub/sub.

1. When the stream opens the sign in popup, it creates a random handoff ID
   (32 bytes, base64url) and adds it to the popup's URL. This only happens when
   atproto sign in is enabled for the stream. The popup keeps the ID in
   `sessionStorage`, which survives the trip to the authorization server.
2. When the user submits their handle, the sign in request carries the ID and
   the server marks it pending. Just before leaving for the authorization
   server, while it can still reach the stream, the popup tells the stream with
   `postMessage`.
3. The stream accepts that message only for the ID it created, then makes one
   `GET /api/auth/handoff/:id`. The server answers `404` for an ID that isn't
   pending. Otherwise it holds the request open, subscribed to that ID's
   channel, for up to 2 minutes. It answers `204` if nothing arrives, and the
   stream doesn't retry.
4. When sign in completes, the server stores the token under the ID and
   publishes a "ready" signal on the channel. The callback does this itself
   when the account is already complete. Otherwise the popup does it with
   `POST /api/auth/handoff` once the user has completed their account (for
   example chosen a username). The held request reads and deletes the token,
   and returns it to the stream.

Polling was rejected because it made hundreds of requests per popup.
Subscriptions don't work where live updates are disabled. Keying by handle
would let anyone who knows a handle take the token. A second window adds
another popup for users and still needs a channel between the windows.

### Redis keys

The handoff, and the atproto sign in it supports, add these keys. Every key is
scoped to the Tenant.

| Key | Holds | Lifetime |
| --- | --- | --- |
| `authHandoff:<tenantID>:<id>:pending` | Marks a started sign in | 2 minutes, deleted when the token is picked up |
| `authHandoff:<tenantID>:<id>` | The Coral access token | 2 minutes, set once (`NX`), deleted when picked up |
| `authHandoff:<tenantID>:<id>:ready` | Pub/sub channel, carries only "ready" | No stored data |
| `atproto:<tenantID>:state:<key>` | OAuth state between sign in and callback | 10 minutes |
| `atproto:<tenantID>:session:<did>` | The user's atproto OAuth session | Shorter of the session duration and 2 weeks, deleted on sign out |
| `atproto:<tenantID>:lock:<name>` | Lock held while refreshing a session | Up to 30 seconds |

The token is never published on the channel. Starting a sign in, waiting for a
handoff, and storing one are each limited to 10 requests per IP per 10
minutes.

### Positive Consequences

- No requests are made unless a user starts an atproto sign in, and at most
  one request waits per sign in.
- Works with any number of Coral instances, and with live updates disabled.
- A token is only readable once, by the stream that created the ID, for 2
  minutes.

### Negative Consequences

- Redis must support pub/sub. Each Coral process opens one extra Redis
  connection for its subscriptions.
- A waiting stream holds an HTTP connection open for up to 2 minutes. On hosts
  that limit concurrent requests per instance (for example Cloud Run), it
  counts toward that limit.
- If signing in and completing the account takes longer than 2 minutes, the
  stream stops waiting and the user has to reload the page or sign in again.
- The rate limits rely on `req.ip`, so `TRUST_PROXY` must be set correctly
  behind a proxy.

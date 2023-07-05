---
title: Environment Variables
---

The following environment variables can be set to configure the Coral Server. You
can expose them in your shell via `export NODE_ENV=development` or by placing
the variables in a `.env` file in the root of the project in a simple
`NODE_ENV=development` format delimited by newlines.

## Required Configuration Variables

### `PORT`

The port to listen for HTTP and WebSocket requests. (Default `3000`)

### `MONGODB_URI`

The MongoDB database URI to connect to. (Default `mongodb://127.0.0.1:27017/coral`)

### `REDIS_URI`

The Redis database URI to connect to. (Default `redis://127.0.0.1:6379`)

### `SIGNING_SECRET`

The shared secret to use to sign JSON Web Tokens (JWT) with the selected signing
algorithm. (Default: `keyboard cat`)

Note: While there is a default for this so development can be simplified, Coral
will throw a runtime error in the event it's started with `NODE_ENV=production`
and the `SIGNING_SECRET="keyboard cat"` to prevent insecure installations. This
_must_ be set in production to something long and secure. You can use `openssl`
to help with that:

```bash
openssl rand -base64 45
```

## Advanced Configuration Variables

### `NODE_ENV`

Can be one of `production` or `development`. All production deployments should
use `production`. Defaults to `production` when ran with `npm run start`, or
with Docker deployments. Defaults to `development` when run with
`npm run start:development`.

### `REDIS_OPTIONS`

A JSON string with optional configuration options to be used when connecting to
Redis as specified in the [ioredis](https://github.com/luin/ioredis/blob/1dac50a63753c2afc969315cfe38faf0edc50bc5/API.md#new_Redis_new) documentation. (Default: `{}`)

### `SIGNING_ALGORITHM`

The signing algorithm to use for signing tokens. (Default `HS256`).

Supported algorithms are:

- `HS256`
- `HS384`
- `HS512`
- `RS256`
- `RS384`
- `RS512`
- `ES256`
- `ES384`
- `ES512`

### `LOCALE`

Specify the default locale to use for all requests without a locale specified. (Default `en-US`)

### `LOGGING_LEVEL`

The logging level that can be set to one of `fatal`,
`error`, `warn`, `info`, `debug`, or `trace`. (Default `info`)

### `FORCE_SSL`

Forces SSL in production by redirecting all HTTP requests to HTTPS, and sending
[HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) headers. (Default `false`)

Coral does not provide or manage HTTPS certificates. If you want to enable
HTTPS, you must configure a proxy in front of Coral such as
[Caddy](https://caddyserver.com/).

**Troubleshooting**: If you are seeing redirect loops when trying to access
pages like the admin, you may need to configure [`TRUST_PROXY`](#trust-proxy) to
tell Coral which upstream proxies to trust.

**Warning**: When `FORCE_SSL=true`, Coral will send [HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
headers that will force web browsers to connect via HTTPS for the next 60 days.
By forcing SSL use you'll need to provide a secure connection to your Coral
instance for at least the next 60 days.

### `DISABLE_LIVE_UPDATES`

When `true`, the comment stream will not create a WebSocket connection to get
live comment updates. This applies across all tenants on the installation, and
cannot be turned back on via the interface. (Default `false`)

### `DISABLE_LIVE_UPDATES_TIMEOUT`

Stories that have not received a comment within this time frame will pause live
updates automatically. Once a single comment is received on these stories, live
updates will be re-enabled until the story sits idle for the timeout value,
parsed by [ms](https://www.npmjs.com/package/ms). (Default `2 weeks`)

### `DISABLE_TENANT_CACHING`

When `true`, all tenants will be loaded from the database when needed rather than keeping a in-memory copy in sync via published events on Redis. (Default `false`)

### `ENABLE_GRAPHIQL`

When `true`, it will enable the interactive GraphQL developer environment at the
`/graphiql` route. This will also disable persisted (Default `false`)

Note: We do not recommend using this in production environments as it disables
many safety features used by the application to provide it.

### `METRICS_USERNAME`

The username for _Basic Authentication_ at the `/metrics` route. If not
provided with `METRICS_PASSWORD`, no authentication will be added to this route.

### `METRICS_PASSWORD`

The password for _Basic Authentication_ at the `/metrics` route. If not
provided with `METRICS_USERNAME`, no authentication will be added to this route.

### `METRICS_PORT`

[Prometheus](https://prometheus.io/docs/introduction/overview/) metrics are
provided at this port under `/metrics` route. (Default `9000`)

### `SCRAPE_TIMEOUT`

The request timeout for scraping operations, parsed by [ms](https://www.npmjs.com/package/ms).
(Default `10 seconds`)

### `SCRAPE_MAX_RESPONSE_SIZE`

The maximum size (in bytes) to allow for scraping responses. (Default `10e6`)

### `STATIC_URI`

The URI that static assets can be accessed from. This URI can be to a proxy that
uses this Coral server on `PORT` as the upstream. Disabled by default.

### `TRUST_PROXY`

When provided, it configures the "trust proxy" settings for Express. If you are
encountering issues where URLs in the administration are showing with a `http`
instead of `https`, you may need to set the `TRUST_PROXY` setting. Refer to
https://expressjs.com/en/guide/behind-proxies.html for possible values of this
configuration variable as it pertains to your setup.

### `WEBSOCKET_KEEP_ALIVE_TIMEOUT`

The interval that should be used to send keep alive messages over WebSocket to
keep the socket open, parsed by [ms](https://www.npmjs.com/package/ms).
(Default `30s`)

### `WORD_LIST_TIMEOUT`

The length of time that a given request to test a comment against a given word
list, parsed by [ms](https://www.npmjs.com/package/ms). (Default `100ms`)

### `PERSPECTIVE_TIMEOUT`

The length of time that a given request should wait for a response when
interacting with the Perspective API, parsed by [ms](https://www.npmjs.com/package/ms).
(Default `800ms`)

## Development Configuration Variables

The following configuration variables are only enabled when the server has been
started in development mode (where `NODE_ENV=development`).

### `DEV_PORT`

The port where the Webpack Development server is running on. (Default `8080`)

### `DISABLE_RATE_LIMITERS`

Used to disable the rate limiters used in Coral. (Default `false`)

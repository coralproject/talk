---
title: Configuring Version 5
permalink: /v5/configuration/
toc: true
---

The following environment variables can be set to configure the Coral Server. You
can expose them in your shell via `export NODE_ENV=development` or by placing
the variables in a `.env` file in the root of the project in a simple
`NODE_ENV=development` format delimited by newlines.

## `NODE_ENV` 
Can be one of `production` or `development`. All production deployments should use `production`. Defaults to `production` when ran with
  `npm run start` and `development` when run with `npm run start:development`.

## `PORT` 
The port to listen for HTTP and Websocket requests. (Default `3000`)

## `DEV_PORT` 
The port where the Webpack Development server is running on. (Default `8080`)

## `MONGODB_URI`
The MongoDB database URI to connect to. (Default `mongodb://127.0.0.1:27017/coral`)

## `REDIS_URI` 
The Redis database URI to connect to. (Default `redis://127.0.0.1:6379`)

## `REDIS_OPTIONS` 
A JSON string with optional configuration options to be used when connecting to Redis as specified in the [ioredis](https://github.com/luin/ioredis/blob/1dac50a63753c2afc969315cfe38faf0edc50bc5/API.md#new_Redis_new) documentation.  (Default: `{}`)

## `SIGNING_SECRET`
The shared secret to use to sign JSON Web Tokens (JWT) with the selected signing algorithm.  (Default: `keyboard cat`)
🚨 **Don't forget to set this variable!** 🚨

## `SIGNING_ALGORITHM` 
The signing algorithm to use for signing JWT's. (Default `HS256`).

## `CONCURRENCY`
The number of worker nodes to spawn to handle web traffic, this should be tied to the number of CPU's available. (Default `os.cpus().length`)

## `LOCALE` 
Specify the default locale to use for all requests without a locale specified. (Default `en-US`)

## `LOGGING_LEVEL`
The logging level that can be set to one of `fatal`,
  `error`, `warn`, `info`, `debug`, or `trace`. (Default `info`)

## `DISABLE_CLIENT_ROUTES` 
Disables mounting of client routes for developing with Webpack Dev Server (Default `false`)

## `DISABLE_FORCE_SSL`
Disables forcing SSL in production environments. Should not be used except for testing (Default `false`)

## `DISABLE_LIVE_UPDATES` 
When `true`, disables subscriptions for the comment stream for all stories across all tenants (Default `false`)

## `DISABLE_MONGODB_AUTOINDEXING` 
When `true`, Coral will not perform indexing operations when it starts up. This can be desired when you've already installed Coral on the target MongoDB, but want to improve start performance.
  
**You should not use this parameter unless you know what you're doing! Upgrades may introduce additional indexes that the application relies on.**
(Default `false`)

## `DISABLE_RATE_LIMITERS` 
Disables the rate limiters in development. This will only work when also set to a development environment (Default `false`)

## `DISABLE_TENANT_CACHING`
When `true`, all tenants will be loaded from the database when needed rather than keeping a in-memory copy in sync via published events on Redis. (Default `false`)

## `ENABLE_GRAPHIQL` 
When `true`, it will enable the `/graphiql` even in production, **use with care**. (Default `false`)

## `METRICS_USERNAME` 
The username for _Basic Authentication_ at the `/metrics` and `/cluster_metrics` endpoint.

## `METRICS_PASSWORD` 
The password for _Basic Authentication_ at the `/metrics` and `/cluster_metrics` endpoint.

## `CLUSTER_METRICS_PORT` 
If `CONCURRENCY` is more than `1`, the metrics are provided at this port under `/cluster_metrics`. (Default `3001`)

## `SCRAPE_TIMEOUT` 
The request timeout (in ms) for scraping operations (Default `10 seconds`)

## `STATIC_URI`
The URI that static assets can be accessed from. This URI can be to a proxy that uses this Coral server on `PORT` as the upstream. Disabled by default.

## `TRUST_PROXY`
When provided, it configures the "trust proxy" settings for Express. If you are encountering issues where urls in the administration are showing with a `http` instead of `https`, you may need to set the `TRUST_PROXY` setting.
Refer to https://expressjs.com/en/guide/behind-proxies.html for possible values
of this configuration variable as it pertains to your setup.

## `WEBSOCKET_KEEP_ALIVE_TIMEOUT` 
A duration in a parsable format (e.g. `30 seconds`, `1 minute`) that should be used to send keep alive messages through the websocket to keep the socket alive (Default `30 seconds`)
---
title: Configuration
permalink: /docs/running/configuration/
---

{% include toc %}

## Overview
{:.no_toc}

Talk, like many web applications, requires manual configuration via environment
variables to configure the server for your specific needs. This is following the
standard [12 Factor App Manifesto](https://12factor.net/) which requires that
said configuration lives as environment variables.

During development, we can utilize a `.env` file, which takes the form of
`NAME=VALUE`. For example:

```bash
TALK_MONGO_URL=mongodb://some-awesome-mongo-instance
TALK_REDIS_URL=redis://some-awesome-redis-instance
TALK_ROOT_URL=https://my-awesome-talk.com
# ... and so on
```

When you place a file titled `.env` at the root of the project, and start the
application with `yarn dev-start`, it will read in the contents of the `.env`
file as if they were environment variables. This is done via the
[dotenv](https://github.com/motdotla/dotenv) package. In production, using this
method is discouraged, as it promotes bad practices such as storing config in a
file.

## Variables

The Talk application looks for the following configuration values either as
environment variables. Refer to the
[config.js](https://github.com/coralproject/talk/blob/master/config.js) file to
see how the configuration is parsed.

### Webpack

These are only used during the webpack build.

- `TALK_THREADING_LEVEL` (_optional_) - specify the maximum depth of the comment
  thread. (Default `3`)
- `TALK_DEFAULT_STREAM_TAB` (_optional_) - specify the default stream tab in the
  admin. (Default `all`)
- `TALK_DISABLE_EMBED_POLYFILL` (_optional_) - when set to `TRUE`, the build process will not include the [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) in the embed.js target. (Default `FALSE`)

### Database

- `TALK_MONGO_URL` (*required*) - the database connection string for the MongoDB database.
- `TALK_REDIS_URL` (*required*) - the database connection string for the Redis database.

#### Advanced
{:.no_toc}

- `TALK_REDIS_RECONNECTION_MAX_ATTEMPTS` (_optional_) - the amount of attempts
  that a redis connection will attempt to reconnect before aborting with an
  error. (Default `100`)
- `TALK_REDIS_RECONNECTION_MAX_RETRY_TIME` (_optional_) - the time in string
  format for the maximum amount of time that a client can be considered
  "connecting" before attempts at reconnection are aborted with an error.
  (Default `1 min`)
- `TALK_REDIS_RECONNECTION_BACKOFF_FACTOR` (_optional_) - the time factor that
  will be multiplied against the current attempt count inbetween attempts to
  connect to redis. (Default `500 ms`)
- `TALK_REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME` (_optional_) - the minimum time
  used to delay before attempting to reconnect to redis. (Default `1 sec`)

### Server

- `TALK_ROOT_URL` (*required*) - root url of the installed application externally
  available in the format: `<scheme>://<host>:<port?>/<pathname>`.
- `TALK_KEEP_ALIVE` (_optional_) - The keepalive timeout that should be used to
  send keep alive messages through the websocket to keep the socket alive. (Default `30s`)
- `TALK_INSTALL_LOCK` (_optional for dynamic setup_) - When `TRUE`, disables the dynamic setup endpoint. (Default `FALSE`)

#### Advanced
{:.no_toc}

- `TALK_ROOT_URL_MOUNT_PATH` (_optional_) - when set to `TRUE`, the routes will
  be mounted onto the `<pathname>` component of the `TALK_ROOT_URL`. You would
  use this when your upstream proxy cannot strip the prefix from the url.
  (Default `FALSE`)
- `TALK_WEBSOCKET_LIVE_URI` (_optional_) - used to override the location to
  connect to the websocket endpoint to potentially another host. This should
  be used when you need to route websocket requests out of your CDN in order to
  serve traffic more efficiently for websockets. **Warning: if used without
  managing the auth state manually, auth cannot be persisted, for further
  information refer to the [Persistence Documentation]({{ "/docs/running/persistence/" | absolute_url }})**
  (Default `${ssl ? 'ws' : 'wss'}://${location.host}${TALK_ROOT_URL_MOUNT_PATH}api/v1/live`)
- `TALK_STATIC_URI` (_optional_) - Used to set the uri where the static assets
  should be served from. This is used when you want to upload the static assets
  through your build process to a service like Google Cloud Storage or Amazon S3
  and you would then specify the CDN/Storage url. (Default `process.env.TALK_ROOT_URL`)
- `TALK_DISABLE_STATIC_SERVER` (_optional_) - When `TRUE`, it will not mount the
  static asset serving routes on the router. (Default `FALSE`)

### Word Filter

- `TALK_DISABLE_AUTOFLAG_SUSPECT_WORDS` (_optional_)  When `TRUE`, disables flagging of comments that match the suspect word filter. (Default `FALSE`)

### JWT

The following are configuration shared with every type of secret used.

- `TALK_JWT_ALG` (_optional_) - the algorithm used to sign/verify JWT's used for
  session management. Read up about alternative algorithms on the
  [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken#algorithms-supported) package. (Default `HS256`)
- `TALK_JWT_EXPIRY` (_optional_) - the expiry duration (`exp`) for the tokens
  issued for logged in sessions. (Default `1 day`)
- `TALK_JWT_ISSUER` (_optional_) - the issuer (`iss`) claim for login JWT
  tokens. (Default `process.env.TALK_ROOT_URL`)
- `TALK_JWT_AUDIENCE` (_optional_) - the audience (`aud`) claim for login JWT
  tokens. (Default `talk`)

**You must also specify secrets as either the `TALK_JWT_SECRET` or the `TALK_JWT_SECRETS`
variable. Refer to the [Secrets Documentation]({{ "/docs/running/secrets/" | absolute_url }})
on the contents of those variables.**

#### Advanced
{:.no_toc}

These are advanced settings for fine tuning the auth integration, and
is not needed in most situations.

- `TALK_JWT_COOKIE_NAME` (_optional_) - the default cookie name to check for a
  valid JWT token to use for verifying a user. (Default `authorization`)
- `TALK_JWT_SIGNING_COOKIE_NAME` (_optional_) - the default cookie name that is
  use to set a cookie containing a JWT that was issued by Talk.
  (Default `process.env.TALK_JWT_COOKIE_NAME`)
- `TALK_JWT_COOKIE_NAMES` (_optional_) - the different cookie names to check for
  a JWT token in, seperated by `,`. By default, we always use the
  `process.env.TALK_JWT_COOKIE_NAME` and `process.env.TALK_JWT_SIGNING_COOKIE_NAME`
  for this value. Any additional cookie names specified here will be appended to
  the list of cookie names to inspect.
- `TALK_JWT_CLEAR_COOKIE_LOGOUT` (_optional_) - when `FALSE`, Talk will not
  clear the cookie with name `TALK_JWT_COOKIE_NAME` when logging out (Default
  `TRUE`)
- `TALK_JWT_DISABLE_AUDIENCE` (_optional_) - when `TRUE`, Talk will not verify or sign JWT's
  with an audience (`aud`) claim, even if the `TALK_JWT_AUDIENCE` config is set. (Default `FALSE`)
- `TALK_JWT_DISABLE_ISSUER` (_optional_) - when `TRUE`, Talk will not verify or sign JWT's
  with an issuer (`iss`) claim, even if the `TALK_JWT_ISSUER` config is set. (Default `FALSE`)
- `TALK_JWT_USER_ID_CLAIM` (_optional_) - specify the claim using dot notation for where the
  user id should be stored/read to/from. Example `user.id` would store it like: `{user: {id}}`
  on the claims object. (Default `sub`)

When integrating with an external authentication system, the following JWT claims
will be used:

```js
{
  "jti": "<the unique token identifier>",    // *required* unique id used for blacklisting
  "aud": TALK_JWT_AUDIENCE,                  // *optional* if TALK_JWT_DISABLE_AUDIENCE === 'TRUE', *required* otherwise
  "iss": TALK_JWT_ISSUER,                    // *optional* if TALK_JWT_DISABLE_ISSUER === 'TRUE', *required* otherwise

  [TALK_JWT_USER_ID_CLAIM]: "<the user id>", // *required* the id of the user
  // Note, if TALK_JWT_USER_ID_CLAIM contains '.', it will be used to delineate an object, for example
  // `user.id` would store it like: `{user: {id}}`
}
```

When our passport middleware checks for JWT tokens, it searches in the following
order:

1. Custom cookies named from the list in `TALK_JWT_COOKIE_NAMES`.
2. Default cookies named `TALK_JWT_COOKIE_NAME` then `TALK_JWT_SIGNING_COOKIE_NAME`.
3. Query parameter `?access_token={TOKEN}`.
4. Header: `Authorization: Bearer {TOKEN}`.

### Email

- `TALK_SMTP_EMAIL` (*required for email*) - the address to send emails from
  using the SMTP provider.
- `TALK_SMTP_USERNAME` (*required for email*) - username of the SMTP provider
  you are using.
- `TALK_SMTP_PASSWORD` (*required for email*) - password for the SMTP provider
  you are using.
- `TALK_SMTP_HOST` (*required for email*) - SMTP host url with format
  `smtp.domain.com`, note the lack of protocol on the domain.
- `TALK_SMTP_PORT` (*required for email*) - SMTP port.


### Recaptcha

- `TALK_RECAPTCHA_SECRET` (*required for reCAPTCHA support*) - server secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.
- `TALK_RECAPTCHA_PUBLIC` (*required for reCAPTCHA support*) - client secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.

### Trust

Trust can auto-moderate comments based on user history. By specifying this
option, the behavior can be changed to offer different results.

- `TRUST_THRESHOLDS` (_optional_) - configure the reliability thresholds for
  flagging and commenting. (Default `comment:2,-1;flag:2,-1`)

The form of the environment variable:

```
<name>:<RELIABLE>,<UNRELIABLE>;<name>:<RELIABLE>,<UNRELIABLE>;...
```

The default could be read as:

- When a commenter has one comment rejected, their next comment must be
  pre-moderated once in order to post freely again. If they instead get rejected
  again, then they must have two of their comments approved in order to get
  added back to the queue.
- At the moment of writing, behavior is not attached to the flagging
  reliability, but it is recorded.

### Cache

- `TALK_CACHE_EXPIRY_COMMENT_COUNT` (_optional_) - configure the duration for which
  comment counts are cached for. (Default `1hr`)

### Plugins

Plugins configuration can be found on the [Plugins]({{ "/docs/running/plugins/" | absolute_url }}) page.
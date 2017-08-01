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

### Server

- `TALK_ROOT_URL` (*required*) - root url of the installed application externally
  available in the format: `<scheme>://<host>` without the path.
- `TALK_KEEP_ALIVE` (_optional_) - The keepalive timeout that should be used to
  send keep alive messages through the websocket to keep the socket alive. (Default `30s`)
- `TALK_INSTALL_LOCK` (_optional for dynamic setup_) - When `TRUE`, disables the dynamic setup endpoint. (Default `FALSE`)

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
- `TALK_JWT_COOKIE_NAME` (_optional_) - the name of the cookie to extract the
  JWT from (Default `authorization`)
- `TALK_JWT_CLEAR_COOKIE_LOGOUT` (_optional_) - when `FALSE`, Talk will not
  clear the cookie with name `TALK_JWT_COOKIE_NAME` when logging out (Default
  `TRUE`)

**You must also specify secrets as either the `TALK_JWT_SECRET` or the `TALK_JWT_SECRETS`
variable. Refer to the [Secrets Documentation]({{ "/docs/running/secrets/" | absolute_url }})
on the contents of those variables.**

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

Trust can automoderate comments based on user history. By specifying this
option, the beheviour can be changed to offer different results.

- `TRUST_THRESHOLDS` (_optional_) - configure the reliability thresholds for
  flagging and commenting. (Default `comment:-1,-1;flag:-1,-1`)

The form of the environment variable:

```
<name>:<RELIABLE>,<UNRELIABLE>;<name>:<RELIABLE>,<UNRELIABLE>;...
```

The default could be read as:

- When a commenter has one comment rejected, their next comment must be
  premoderated once in order to post freely again. If they instead get rejected
  again, then they must have two of their comments approved in order to get
  added back to the queue.
- At the moment of writing, beheviour is not attached to the flagging
  reliability, but it is recorded.

### Cache

- `TALK_CACHE_EXPIRY_COMMENT_COUNT` (_optional_) - configure the duration for which
  comment counts are cached for. (Default `1hr`)

### Plugins

Plugins configuration can be found on the [Plugins]({{ "/docs/running/plugins/" | absolute_url }}) page.
---
title: Configuration
keywords: homepage
sidebar: talk_sidebar
permalink: configuration.html
summary:
---

The Talk application looks for the following configuration values either as environment variables:

- `TALK_MONGO_URL` (*required*) - the database connection string for the MongoDB database.
- `TALK_REDIS_URL` (*required*) - the database connection string for the Redis database.
- `TALK_ROOT_URL` (*required*) - root url of the installed application externally
available in the format: `<scheme>://<host>` without the path.
- `TALK_JWT_SECRET` (*required*) - a long and cryptographical secure random string which will be used to
sign and verify tokens via a `HS256` algorithm.
- `TALK_JWT_EXPIRY` (_optional_) - the expiry duration (`exp`) for the tokens issued for logged in sessions (Default `1 day`)
- `TALK_JWT_ISSUER` (_optional_) - the issuer (`iss`) claim for login JWT tokens (Default `process.env.TALK_ROOT_URL`)
- `TALK_JWT_AUDIENCE` (_optional_) - the audience (`aud`) claim for login JWT tokens (Default `talk`)
- `TALK_SMTP_EMAIL` (*required for email*) - the address to send emails from using the
  SMTP provider.
- `TALK_SMTP_USERNAME` (*required for email*) - username of the SMTP provider you are using.
- `TALK_SMTP_PASSWORD` (*required for email*) - password for the SMTP provider you are using.
- `TALK_SMTP_HOST` (*required for email*) - SMTP host url with format `smtp.domain.com`.
- `TALK_SMTP_PORT` (*required for email*) - SMTP port.
- `TALK_INSTALL_LOCK` (_optional for dynamic setup_) - Defaults to `FALSE`. When `TRUE`, disables the dynamic setup endpoint.
- `TALK_RECAPTCHA_SECRET` (*required for reCAPTCHA support*) - server secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.
- `TALK_RECAPTCHA_PUBLIC` (*required for reCAPTCHA support*) - client secret used for enabling reCAPTCHA powered logins. If not provided it will instead default to providing only a time based lockout.
- `TALK_PLUGINS_JSON` (_optional_) - used to specify the plugin config via the environment

Refer to the wiki page on [Configuration Loading](https://github.com/coralproject/talk/wiki/Configuration-Loading) for
alternative methods of loading configuration during development.

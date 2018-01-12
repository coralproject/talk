---
title: Advanced Configuration
permalink: /advanced-configuration/
class: configuration
---

Talk requires configuration in order to customize the installation. The default
behavior is to load its configuration from the environment, following the
[12 Factor App Manifesto](https://12factor.net/){:target="_blank"}.
In development, you can specify configuration in a file named `.env` and it will
be loaded into the environment when you run `yarn watch:server`.

The following variables have defaults, and are _optional_ to start your
instance of Talk:

{% include toc.html %}

If this is your first time configuring Talk, ensure you've also added the
[Required Configuration]({{ "/configuration/" | relative_url }}) as well,
otherwise the application will fail to start.

## TALK_CACHE_EXPIRY_COMMENT_COUNT

Configure the duration for which comment counts are cached for, parsed by
[ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `1hr`)

## TALK_DEFAULT_LANG

This is a **Build Variable** and must be consumed during build. If using the
[Docker-onbuild]({{ "/installation-from-docker/#onbuild" | relative_url }})
image you can specify it with `--build-arg TALK_DEFAULT_LANG=en`.

Specify the default translation language. (Default `en`)

## TALK_DEFAULT_STREAM_TAB

This is a **Build Variable** and must be consumed during build. If using the
[Docker-onbuild]({{ "/installation-from-docker/#onbuild" | relative_url }})
image you can specify it with `--build-arg TALK_DEFAULT_STREAM_TAB=all`.

Specify the default stream tab in the admin. (Default `all`)

## TALK_DISABLE_AUTOFLAG_SUSPECT_WORDS

When `TRUE`, disables flagging of comments that match the suspect word filter. (Default `FALSE`)

## TALK_DISABLE_EMBED_POLYFILL

When set to `TRUE`, the build process will not include the
[babel-polyfill](https://babeljs.io/docs/usage/polyfill/){:target="_blank"}
in the embed.js target that is loaded on the page that loads the embed. (Default
`FALSE`)

## TALK_DISABLE_STATIC_SERVER

When `TRUE`, it will not mount the static asset serving routes on the router.
This is used primarily in conjunction with [TALK_STATIC_URI](#talk_static_uri){: .param}
when the static assets are being hosted on an external domain. (Default `FALSE`)

## TALK_HELMET_CONFIGURATION

A JSON string representing the configuration passed to the
[helmet](https://github.com/helmetjs/helmet){:target="_blank"} middleware. It
can be used to disable features like [HSTS](https://helmetjs.github.io/docs/hsts/){:target="_blank"}
and others by simply providing the configuration as detailed on the
[helmet docs](https://helmetjs.github.io/docs/){:target="_blank"}. (Default `{}`)

For sites that do not have SSL enabled on all their pages across their domain,
it is critical that you specify the following to disable the
[HSTS](https://helmetjs.github.io/docs/hsts/){:target="_blank"} headers from
being sent:

```plain
TALK_HELMET_CONFIGURATION={"hsts": false}
```

To disable these headers from being sent.

## TALK_INSTALL_LOCK

When `TRUE`, disables the dynamic setup endpoint `/admin/install` from even
loading. This prevents hits to the database with enabled. This should always be
set to `TRUE` after you've deployed Talk. (Default `FALSE`)

## TALK_JWT_ALG

The algorithm used to sign/verify JWTs used for session management. Read up
about alternative algorithms on the
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken#algorithms-supported){:target="_blank"}
package. (Default `HS256`)

### Shared Secret
{:.no_toc}

You would use a shared secret when you have no need to share the tokens with
other applications in your organization.

Supported signing algorithms:

- HS256
- HS384
- HS512

These must be provided in the form:

```json
{
  "secret": "<my secret key>"
}
```
{: .no-copy}

### Asymmetric Secret
{:.no_toc}

You would use a asymmetric secret when you want to share the token in your
organization, and would like to pass an existing auth token to Talk in order to
authenticate your users.

Supported signing algorithms:

- RS256
- RS384
- RS512
- ES256
- ES384
- ES512

These must be provided in the form:

```json
{
  "public": "<the PEM encoded public key>",
  "private": "<the PEM encoded private key>"
}
```
{: .no-copy}

Note that when using the asymmetric keys as discussed above, the certificates
must have their newlines replaced with `\\n`, this is to ensure that the
newlines are preserved after JSON decoding. Not doing so will result in parsing
errors.

To assist with this process, we have developed a tool that can generate new
certificates that match our required format: [coralcert](https://github.com/coralproject/coralcert){:target="_blank"}.
This tool can generate RSA and ECDSA certificates, check it's [README](https://github.com/coralproject/coralcert){:target="_blank"}
for more details.

## TALK_JWT_AUDIENCE

The audience [aud](https://tools.ietf.org/html/rfc7519#section-4.1.3){:target="_blank"}
claim for login JWT tokens. (Default `talk`)

## TALK_JWT_CLEAR_COOKIE_LOGOUT

When `FALSE`, Talk will not clear the cookie with name
[TALK_JWT_SIGNING_COOKIE_NAME](#talk_jwt_signing_cookie_name){: .param} when logging out
but will still blacklist the token. (Default `TRUE`)

## TALK_JWT_COOKIE_NAME

The default cookie name to check for a valid JWT token to use for verifying a
user. (Default `authorization`)

## TALK_JWT_COOKIE_NAMES

The different cookie names to check for a JWT token in, separated by a `,`. By
default, we always use the value of [TALK_JWT_COOKIE_NAME](#talk_jwt_cookie_name){: .param}
and [TALK_JWT_SIGNING_COOKIE_NAME](#talk_jwt_signing_cookie_name){: .param} for this
value. Any additional cookie names specified here will be appended to the list
of cookie names to inspect.

For example, the value of:

```plain
TALK_JWT_COOKIE_NAME=talk
TALK_JWT_SIGNING_COOKIE_NAME=talk
TALK_JWT_COOKIE_NAMES=coralproject.talk,coralproject.auth
```

Would mean we would check the following cookies (in order) for a valid token:

1. `talk`
2. `coralproject.talk`
3. `coralproject.auth`

## TALK_JWT_DISABLE_AUDIENCE

When `TRUE`, Talk will not verify or sign JWT’s with an audience
[aud](https://tools.ietf.org/html/rfc7519#section-4.1.3){:target="_blank"}
claim, even if [TALK_JWT_AUDIENCE](#talk_jwt_audience){: .param} is set. (Default `FALSE`)

## TALK_JWT_DISABLE_ISSUER

When `TRUE`, Talk will not verify or sign JWT’s with an issuer
[iss](https://tools.ietf.org/html/rfc7519#section-4.1.1){:target="_blank"}
claim, even if [TALK_JWT_ISSUER](#talk_jwt_issuer){: .param} is set. (Default `FALSE`)

## TALK_JWT_EXPIRY

The expiry duration [exp](https://tools.ietf.org/html/rfc7519#section-4.1.4){:target="_blank"}
for the tokens issued for logged in sessions, parsed by
[ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `1 day`)

If the user logs out, then an entry is created in the token blacklist of it's
[jti](https://tools.ietf.org/html/rfc7519#section-4.1.7){:target="_blank"} for
set to be automatically removed at it's expiry time. It is important for this
reason to create reasonable expiry lengths as to minimize the storage overhead.

## TALK_JWT_ISSUER

The issuer [iss](https://tools.ietf.org/html/rfc7519#section-4.1.1){:target="_blank"}
claim for login JWT tokens. (Defaults to value of [TALK_ROOT_URL]({{ "/configuration/#talk_root_url" | relative_url }}){: .param})

## TALK_JWT_SECRET

Used to specify the application signing secret. You can specify this using a
simple string, we recommend using a password generator and pasting it's output.
An example for `TALK_JWT_SECRET` could be:

```plain
TALK_JWT_SECRET=jX9y8G2ApcVLwyL{$6s3
```
{: .no-copy}

You can also express this secret in the JSON syntax:

```plain
TALK_JWT_SECRET={"secret": "jX9y8G2ApcVLwyL{$6s3"}
```

Refer to the documentation for [TALK_JWT_ALG](#talk_jwt_alg){: .param} for other signing
methods and other forms of the `TALK_JWT_SECRET`. If you are interested in using
multiple keys, then refer to [TALK_JWT_SECRETS](#talk_jwt_secrets){: .param}.

## TALK_JWT_SECRETS

Used when specifying multiple secrets used for key rotations. This is a JSON
encoded array, where each element matches the JWT Secret pattern. When this is
used, you do not need to specify a [TALK_JWT_SECRET](#talk_jwt_secret){: .param} as this
will take precedence. **The first secret in `TALK_JWT_SECRETS` will be used for
signing, and must contain a private key if used with an asymmetric algorithm.**

All secrets should specify a `kid` field which uniquely identifies a given key
and will sign all tokens with that `kid` for later identification.

When the value of [TALK_JWT_ALG](#talk_jwt_alg){: .param} is a `HS*` value, then the value
of the `TALK_JWT_SECRETS` should take the form:

```plain
TALK_JWT_SECRETS=[{"kid": "1", "secret": "my-super-secret"}, {"kid": "2", "secret": "my-other-super-secret"}]
```
{: .no-copy}

Note that the secret is stored in a JSON object, keyed by `secret`. This is only
needed when specifying in the multiple secrets for `TALK_JWT_SECRETS`, but may
be used to specify the single [TALK_JWT_SECRET](#talk_jwt_secret){: .param}.
{: .code-aside}

When the value of [TALK_JWT_ALG](#talk_jwt_alg){: .param} is **not** a `HS*` value, then
the value of the `TALK_JWT_SECRETS` should take the form:

```plain
TALK_JWT_SECRETS=[{"kid": "1", "private": "<my private key>", "public": "<my public key>"}, ...]
```
{: .no-copy}

Refer to the documentation on the [TALK_JWT_ALG](#talk_jwt_alg){: .param} for more
information on what to store in these parameters.
{: .code-aside}

## TALK_JWT_SIGNING_COOKIE_NAME

The default cookie name that is use to set a cookie containing a JWT that was
issued by Talk. (Defaults to value of [TALK_JWT_COOKIE_NAME](#talk_jwt_cookie_name){: .param})

## TALK_JWT_USER_ID_CLAIM

Specify the claim using dot notation for where the user id should be stored/read
to/from. (Default `sub`)

If for example, the JWT's claims looks something like this:

```json
{
  "user": {
    "id": "123123"
  }
}
```

Then we would set `TALK_JWT_USER_ID_CLAIM` to:

```plain
TALK_JWT_USER_ID_CLAIM=user.id
```

## TALK_KEEP_ALIVE

The keepalive timeout that should be used to send keep alive messages through
the websocket to keep the socket alive, parsed by
[ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `30s`)

## TALK_RECAPTCHA_PUBLIC

Client secret used for enabling reCAPTCHA powered logins. If
[TALK_RECAPTCHA_SECRET](#talk_recaptcha_secret){: .param} and
[TALK_RECAPTCHA_PUBLIC](#talk_recaptcha_public){: .param} are not provided it will instead
default to providing only a time based lockout. Refer to
[reCAPTCHA](https://www.google.com/recaptcha/intro/index.html) for information
on getting an account setup.

## TALK_RECAPTCHA_SECRET

Server secret used for enabling reCAPTCHA powered logins. If
[TALK_RECAPTCHA_SECRET](#talk_recaptcha_secret){: .param} and
[TALK_RECAPTCHA_PUBLIC](#talk_recaptcha_public){: .param} are not provided it will instead
default to providing only a time based lockout. Refer to
[reCAPTCHA](https://www.google.com/recaptcha/intro/index.html) for information
on getting an account setup.

## TALK_REDIS_CLIENT_CONFIGURATION

Configuration overrides for the redis client configuration in a JSON encoded
string. Configuration is overridden as the second parameter to the redis client
constructor, and is merged with default configuration. Refer to the
[ioredis](https://github.com/luin/ioredis){:target="_blank"} docs on the
available options. (Default `{}`)

## TALK_REDIS_CLUSTER_CONFIGURATION

The JSON encoded form of the cluster nodes. Only required when
[TALK_REDIS_CLUSTER_MODE](#talk_redis_cluster_mode){: .param} is `CLUSTER`. See
[https://github.com/luin/ioredis#cluster](https://github.com/luin/ioredis#cluster){:target="_blank"}
for configuration details. (Default `[]`)

## TALK_REDIS_CLUSTER_MODE

The cluster mode of the redis client. Can be either `NONE` or `CLUSTER`.
(Default `NONE`)

## TALK_REDIS_RECONNECTION_BACKOFF_FACTOR

The time factor that will be multiplied against the current attempt count
between attempts to connect to redis, parsed by
[ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `500 ms`)

## TALK_REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME

The minimum time used to delay before attempting to reconnect to redis, parsed
by [ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `1 sec`)

## TALK_ROOT_URL_MOUNT_PATH

When set to `TRUE`, the routes will be mounted onto the `<PATHNAME>` component
of the [TALK_ROOT_URL]({{ "/configuration/#talk_root_url" | relative_url }}){: .param}.
You would use this when your upstream proxy cannot strip the prefix from the
url. (Default `FALSE`)

If for example, you had the following configuration:

```plain
TALK_ROOT_URL=https://coralproject.net/talk/
TALK_ROOT_URL_MOUNT_PATH=TRUE
```

Then all the routes for the API will be expecting to be hit on `/talk/`, such as
`/talk/api/v1/graph/ql` instead of `/api/v1/graph/ql`. Most modern webservers
can perform the path stripping when serving an upstream proxy, but some CDN's
cannot. You would use this option in the latter situation.

## TALK_SMTP_FROM_ADDRESS

The email address to send emails from using the SMTP provider in the format:

```plain
TALK_SMTP_FROM_ADDRESS="The Coral Project" <support@coralproject.net>
```

Including the name and email address.

## TALK_SMTP_HOST

The domain for the SMTP provider that you are using.

## TALK_SMTP_PASSWORD

The password for the SMTP provider you are using.

## TALK_SMTP_PORT

The port for the SMTP provider that you are using.

## TALK_SMTP_USERNAME

The username of the SMTP provider you are using.

## TALK_STATIC_URI

Used to set the uri where the static assets should be served from. This is used
when you want to upload the static assets through your build process to a
service like Google Cloud Storage or Amazon S3 and you would then specify the
CDN/Storage url. (Defaults to value of
[TALK_ROOT_URL]({{ "/configuration/#talk_root_url" | relative_url }}){: .param})

## TALK_THREADING_LEVEL

This is a **Build Variable** and must be consumed during build. If using the
[Docker-onbuild]({{ "/installation-from-docker/#onbuild" | relative_url }})
image you can specify it with `--build-arg TALK_THREADING_LEVEL=3`.

Specify the maximum depth of the comment thread. (Default `3`)

**Note that a high value for `TALK_THREADING_LEVEL` will result in large
performance impacts.**

## TALK_WEBSOCKET_LIVE_URI

Used to override the location to connect to the websocket endpoint to
potentially another host. This should be used when you need to route websocket
requests out of your CDN in order to serve traffic more efficiently.

If the value of [TALK_ROOT_URL]({{ "/configuration/#talk_root_url" | relative_url }}){: .param}
is a https url, then this defaults to `wss://${location.host}${MOUNT_PATH}api/v1/live`.
Otherwise, it defaults to `ws://${location.host}${MOUNT_PATH}api/v1/live`.

Where `MOUNT_PATH` is either `/` if [TALK_ROOT_URL_MOUNT_PATH](#talk_root_url_mount_path){: .param}
is `FALSE`, or the path component of
[TALK_ROOT_URL]({{ "/configuration/#talk_root_url" | relative_url }}){: .param} if it's `TRUE`.

**Warning: if used without managing the auth state manually, auth
cannot be persisted due to browser restrictions.**

## TRUST_THRESHOLDS

Configure the reliability thresholds for flagging and commenting. (Default
`comment:2,-1;flag:2,-1`)

The form of the environment variable:

```plain
TRUST_THRESHOLDS=comment:<RELIABLE COMMENTER>,<UNRELIABLE COMMENTER>;flag:<RELIABLE FLAGGER>,<UNRELIABLE FLAGGER>
```

The default value of:

```plain
TRUST_THRESHOLDS=comment:2,-1;flag:2,-1
```

Could be read as:

- When a commenter has one comment rejected, their next comment must be
  pre-moderated once in order to post freely again. If they instead get rejected
  again, then they must have two of their comments approved in order to get
  added back to the queue.
- At the moment of writing, behavior is not attached to the flagging
  reliability, but it is recorded.

## TALK_DISABLE_IGNORE_FLAGS_AGAINST_STAFF

When `TRUE`, staff members will have their accounts and comments moderated the
same as any other user in the system. (Default `FALSE`)

## TALK_EMAIL_SUBJECT_PREFIX

The prefix for the subject of emails sent. An email with the specified subject
of `Email Confirmation` would then be sent as `[Talk] Email Confirmation`.
(Default `[Talk]`)

## DISABLE_CREATE_MONGO_INDEXES

When `TRUE`, Talk will not attempt to create any indices. This is recommended
for production systems that have ran Talk at least once during setup while unset
or set to `FALSE`.

## TALK_SETTINGS_CACHE_TIME

The duration of time that the settings object will be kept in the Redis cache,
parsed by [ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default
`1hr`)

## APOLLO_ENGINE_KEY

Used to set the key for use with
[Apollo Engine](https://www.apollographql.com/engine/){:target="_blank"} for
tracing of GraphQL requests.

**Note: Apollo Engine is a premium service, charges may apply.**
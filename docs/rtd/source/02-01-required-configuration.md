# Required Configuration

* [TALK_MONGO_URL](#talk-mongo-url)
* [TALK_REDIS_URL](#talk-redis-url)
* [TALK_ROOT_URL](#talk-root-url)
* [TALK_JWT_SECRET](#talk-jwt-secret)

Talk requires configuration in order to customize the installation. The default
behavior is to load it's configuration from the environment, following the
[12 Factor App Manifesto](https://12factor.net/).
In development, you can specify configuration in a file named `.env` and it will
be loaded into the environment when you run `yarn watch:server`.

The above variables do not have defaults, and are **required** to start your
instance of Talk.

If you've already configured your application with the required configuration,
you can further customize it's behavior by applying
[Advanced Configuration](./02-02-advanced-configuration.html).

## TALK_MONGO_URL

The database connection string for the MongoDB database. This usually takes the
form of:

```
TALK_MONGO_URL=mongodb://<DATABASE USER>:<DATABASE PASSWORD>@<DATABASE HOST>:<DATABASE PORT>/<DATABASE NAME>
```

Refer to [connection string uri format](https://docs.mongodb.com/manual/reference/connection-string/)
for the detailed url scheme of the MongoDB url.

## TALK_REDIS_URL

The database connection string for the Redis database. This usually takes the
form of:

```
TALK_REDIS_URL=redis://user:<DATABASE PASSWORD>@<DATABASE HOST>:<DATABASE PORT>/<DATABASE NUMBER>
```

If we for example, had Redis running on our local machine without a password,
where I want to use database #2, I could set the `TALK_REDIS_URL` to:

```
TALK_REDIS_URL=redis://127.0.0.1:6379/2
```

Refer to [uri scheme](http://www.iana.org/assignments/uri-schemes/prov/redis)
for the detailed url scheme of the Redis url.

## TALK_ROOT_URL

The root url of the installed application externally available in the format:

```
TALK_ROOT_URL=<SCHEME>://<HOST>:<PORT?>/<PATHNAME>
```

For example, if we installed our application onto the `talk.coralproject.net`
domain, where we used a proxy like [Caddy](https://caddyserver.com)
or [Nginx](https://nginx.org) to perform SSL termination, then
`TALK_ROOT_URL` would be:

```
TALK_ROOT_URL=https://talk.coralproject.net/
```

_Note that we omitted the `PORT`, as it was implied by setting the `SCHEME` to
`https`._

## TALK_JWT_SECRET

Used to specify the application signing secret. You can specify this using a
simple string, we recommend using a password generator and pasting it's output.
An example for `TALK_JWT_SECRET` could be:

```
TALK_JWT_SECRET=jX9y8G2ApcVLwyL{$6s3
```

Be default, we sign our tokens with HMAC using a SHA-256 hash algorithm. If you
want to change the signing algorithm, or use multiple signing/verifying keys,
refer to our [Advanced Configuration](./02-02-advanced-configuration.html#talk-jwt-secret) documentation.

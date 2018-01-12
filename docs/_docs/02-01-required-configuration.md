---
title: Required Configuration
permalink: /configuration/
class: configuration
---

Talk requires configuration in order to customize the installation. The default
behavior is to load it's configuration from the environment, following the
[12 Factor App Manifesto](https://12factor.net/){:target="_blank"}.
In development, you can specify configuration in a file named `.env` and it will
be loaded into the environment when you run `yarn watch:server`.

The following variables do not have defaults, and are **required** to start your
instance of Talk:

{% include toc.html %}

If you've already configured your application with the required configuration,
you can further customize it's behavior by applying
[Advanced Configuration]({{ "/advanced-configuration/" | relative_url }}).

## TALK_MONGO_URL

The database connection string for the MongoDB database. This usually takes the
form of:

```plain
TALK_MONGO_URL=mongodb://<DATABASE USER>:<DATABASE PASSWORD>@<DATABASE HOST>:<DATABASE PORT>/<DATABASE NAME>
```

Refer to [connection string uri format](https://docs.mongodb.com/manual/reference/connection-string/){:target="_blank"}
for the detailed url scheme of the MongoDB url.

## TALK_REDIS_URL

The database connection string for the Redis database. This usually takes the
form of:

```plain
TALK_REDIS_URL=redis://user:<DATABASE PASSWORD>@<DATABASE HOST>:<DATABASE PORT>/<DATABASE NUMBER>
```

If we for example, had Redis running on our local machine without a password,
where I want to use database #2, I could set the `TALK_REDIS_URL` to:

```plain
TALK_REDIS_URL=redis://127.0.0.1:6379/2
```

Refer to [uri scheme](http://www.iana.org/assignments/uri-schemes/prov/redis){:target="_blank"}
for the detailed url scheme of the Redis url.

## TALK_ROOT_URL

The root url of the installed application externally available in the format:

```plain
TALK_ROOT_URL=<SCHEME>://<HOST>:<PORT?>/<PATHNAME>
```

For example, if we installed our application onto the `talk.coralproject.net`
domain, where we used a proxy like [Caddy](https://caddyserver.com){:target="_blank"}
or [Nginx](https://nginx.org){:target="_blank"} to perform SSL termination, then
`TALK_ROOT_URL` would be:

```plain
TALK_ROOT_URL=https://talk.coralproject.net/
```

_Note that we omitted the `PORT`, as it was implied by setting the `SCHEME` to
`https`._

## TALK_JWT_SECRET

Used to specify the application signing secret. You can specify this using a
simple string, we recommend using a password generator and pasting it's output.
An example for `TALK_JWT_SECRET` could be:

```plain
TALK_JWT_SECRET=jX9y8G2ApcVLwyL{$6s3
```
{: .no-copy}

Be default, we sign our tokens with HMAC using a SHA-256 hash algorithm. If you
want to change the signing algorithm, or use multiple signing/verifying keys,
refer to our [Advanced Configuration]({{ "/advanced-configuration/" | relative_url }}) documentation.

## TALK_FACEBOOK_APP_ID

The Facebook App ID for your Facebook Login enabled app. You can learn more
about getting a Facebook App ID at the
[Facebook Developers Portal](https://developers.facebook.com){:target="_blank"}
or by visiting the
[Creating an App ID](https://developers.facebook.com/docs/apps/register){:target="_blank"}
guide. This is only required while the `talk-plugin-facebook-auth` plugin is
enabled.

## TALK_FACEBOOK_APP_SECRET

The Facebook App Secret for your Facebook Login enabled app. You can learn more
about getting a Facebook App Secret at the
[Facebook Developers Portal](https://developers.facebook.com){:target="_blank"}
or by visiting the
[Creating an App ID](https://developers.facebook.com/docs/apps/register){:target="_blank"}
guide. This is only required while the `talk-plugin-facebook-auth` plugin is
enabled.

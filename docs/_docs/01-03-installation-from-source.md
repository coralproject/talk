---
title: Installation from Source
permalink: /installation-from-source/
---

{% include badges.html %}

To install Talk from Source, ensure that you have Node version
{{ site.versions.node }}. Installing via source is the recommended method when
developing as it give you the best tooling. We release versions using semantic
versioning, and do so to our
[Github Releases](https://github.com/coralproject/talk/releases){:target="_blank"}
page. There you can download archives of older versions or the latest release.
The examples following will download the latest code on our master branch.

## Installing

First we will download and extract the latest codebase of Talk:

```bash
curl -sLo talk.tar.gz https://github.com/coralproject/talk/archive/master.tar.gz
mkdir -p talk
tar xzf talk.tar.gz -C talk --strip-components 1
cd talk
```

From here we need to fetch the dependencies and build the static assets using
Yarn:

```bash
yarn
yarn build
```

You can either setup the required databases by visiting the docs for [MongoDB](https://docs.mongodb.com/manual/installation/){:target="_blank"} and
[Redis](https://redis.io/topics/quickstart){:target="_blank"}, or using the following commands which will leverage Docker:

```bash
docker run -p 127.0.0.1:6379:6379 -d redis
docker run -p 127.0.0.1:27017:27017 -d mongo
```

Didn't work? Sometimes you may already have a container running on these ports,
run `docker ps` to see what other containers you have running and running
`docker stop <id>` on those containers to stop them.
{: .code-aside}

_This documentation assumes that you will be running MongoDB on
`127.0.0.1:27017` and Redis on `127.0.0.1:6379`. The above Docker commands bind
MongoDB and Redis on these interfaces for you._

We should then specify the configuration variables that can be used to run the
application locally in a file named `.env`. This will be read by the application
when running in development mode:

```bash
NODE_ENV=development
TALK_MONGO_URL=mongodb://127.0.0.1:27017/talk
TALK_REDIS_URL=redis://127.0.0.1:6379
TALK_ROOT_URL=http://127.0.0.1:3000
TALK_PORT=3000
TALK_JWT_SECRET=password
TALK_FACEBOOK_APP_ID=A-Facebook-App-ID
TALK_FACEBOOK_APP_SECRET=A-Facebook-App-Secret
```

This is the bare minimum needed to start Talk, for more configuration
variables, check out the [Configuration]({{ "/configuration/" | relative_url }})
section. Facebook login above will definitely not work unless you change those
values as well.
{: .code-aside}

You can now start the application by running:

```bash
yarn dev-start
```

At this stage, you should refer to the [configuration]({{ "/configuration/" | relative_url }}) for
configuration variables that are specific to your installation.
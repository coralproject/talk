---
title: Talk Quickstart
permalink: /
---

Online comments are broken. Our open-source Talk tool rethinks how moderation,
comment display, and conversation function, creating the opportunity for safer,
smarter discussions around your work. Read more about our product features and
goals [here](https://coralproject.net/talk). The
documentation available here is pertaining to the technical details for
installing, configuring, and deploying Talk.

Talk is a [Node](https://nodejs.org/) application with
dependencies managed by
[Yarn](https://yarnpkg.com/en/docs/install) that connects to
[MongoDB](https://docs.mongodb.com/manual/installation/) and
[Redis](https://redis.io/topics/quickstart) databases in order
to persist data. The following versions are supported:

- Node 8+
- Yarn 1.3.2+
- MongoDB 3.2+
- Redis 3.2.5+

An optional dependency for Talk is
[Docker](https://www.docker.com/community-edition#/download).
It is used during development to set up the database and can be
used to [install via Docker](#installation-from-docker).  We have tested Talk
and this documentation with versions 17.06.2+.

Another optional dependency for Talk is
[Docker Compose](https://docs.docker.com/compose/install/). It
can be used to setup your environment easily for testing. We have tested Talk
and this documentation with versions 1.14.0+.

## Installation

### Installation from Docker

To use Talk without major customization you can run the application using our
provided docker image. The following is a `docker-compose.yml` file that can
be used to setup Talk:

```yml
# For details on the syntax of docker-compose.yml files, check out:
# https://docs.docker.com/compose/compose-file/compose-file-v2/

version: '2'
services:
  talk:
    image: coralproject/talk:4.5
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - mongo
      - redis
    environment:
      - NODE_ENV=development # remove this line in production
      - TALK_MONGO_URL=mongodb://mongo/talk
      - TALK_REDIS_URL=redis://redis
      - TALK_ROOT_URL=http://127.0.0.1:3000
      - TALK_PORT=3000
      - TALK_JWT_SECRET=password
  mongo:
    image: mongo:latest
    restart: always
    volumes:
      - mongo:/data/db
  redis:
    image: redis:latest
    restart: always
    volumes:
      - redis:/data
volumes:
  mongo:
    external: false
  redis:
    external: false
```

This is the bare minimum needed to run the demo, for more configuration
variables, check out the [Configuration](/talk/configuration/) section.


And you can then start it with:

```bash
docker-compose up -d
```

This process will take a minute or two, it has to download docker images for the
required databases and Talk as well as setup the environments.

Now that you've started the services started using compose, you should see
output that resembles the following:

```
Creating mongo_1 ...
Creating redis_1 ...
Creating mongo_1 ... done
Creating redis_1 ... done
Creating talk_1 ...
Creating talk_1 ... done
```


And when you run `docker-compose ps`, you should see something like:

```
    Name                   Command               State           Ports
-------------------------------------------------------------------------------
mongo_1   docker-entrypoint.sh mongod      Up      27017/tcp
redis_1   docker-entrypoint.sh redis ...   Up      6379/tcp
talk_1    yarn start                       Up      0.0.0.0:3000->3000/tcp
```


Continue onto the [Running](#running) section for details on how to complete the
installation and get started using Talk.

### Installation from Source

To install Talk from Source, ensure that you have the version of Node as
specified above. First we will download and extract the latest codebase of Talk:

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

You can either setup the required databases by visiting the docs for [MongoDB](https://docs.mongodb.com/manual/installation/) and
[Redis](https://redis.io/topics/quickstart), or using the following commands which will leverage Docker:

```bash
docker run -p 127.0.0.1:6379:6379 -d redis
docker run -p 127.0.0.1:27017:27017 -d mongo
```

Didn't work? Sometimes you may already have a container running on these ports,
run `docker ps` to see what other containers you have running and running
`docker stop <id>` on those containers to stop them.


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
```

This is only the bare minimum needed to run the demo, for more configuration
variables, check out the [Configuration](/talk/configuration/) section.

You can now start the application by running:

```bash
yarn watch:server
```

Continue onto the [Running](#running) section for details on how to complete the
installation and get started using Talk.

## Running

You can now navigate to
[http://127.0.0.1:3000/admin/install](http://127.0.0.1:3000/admin/install)
and go through the admin installation. There you will be prompted to create your
first admin account, and specify the domain whitelist for domains that are
allowed to have the comment box on.

_During development, ensure you whitelist 127.0.0.1:3000 otherwise the
[http://127.0.0.1:3000/](http://127.0.0.1:3000/) page will not
load._

Once you've completed the installation, you can visit
[http://127.0.0.1:3000/](http://127.0.0.1:3000/) where you can
view our development area where we test out features in Talk where you can write
comments and see them in the admin interface where you can do moderation and
reconfigure the user experience.

## Demo

If you've followed the documentation above, you'll now have a running copy of
Talk. To demonstrate what your own self-hosted copy of Talk can do, below
you'll find a demo that can be used to test the copy that is running now on your
machine.

In order for the demo to work, you must add
`https://docs.coralproject.net/` to your
permitted domains list. You can do this by visiting
[http://127.0.0.1:3000/admin/configure](http://127.0.0.1:3000/admin/configure)
now and selecting *Tech Settings* from the sidebar.

Once you have added the domain of these docs, you can click the button below.

<div class="demo">
  <button id="talk-demo-embed-button" type="button" class="btn btn-block btn-coral">Start Demo</button>
  <div class="alert" role="alert"></div>
  <div class="mount"></div>
</div>

At this point you've successfully installed, configured, and ran your very own
instance of Talk! Continue through this documentation on this site to learn more
on how to configure, develop with, and contribute to Talk!

---
title: Talk Quickstart
permalink: /
---

{% include badges.html %}

Online comments are broken. Our open-source Talk tool rethinks how moderation,
comment display, and conversation function, creating the opportunity for safer,
smarter discussions around your work. Read more about our product features and
goals [here](https://coralproject.net/products/talk.html){:target="_blank"}. The
documentation available here is pertaining to the technical details for
installing, configuring, and deploying Talk.

Talk is a [Node](https://nodejs.org/){:target="_blank"} application with
dependencies managed by
[Yarn](https://yarnpkg.com/en/docs/install){:target="_blank"} that connects to
[MongoDB](https://docs.mongodb.com/manual/installation/){:target="_blank"} and
[Redis](https://redis.io/topics/quickstart){:target="_blank"} databases in order
to persist data. The following versions are supported:

- Node {{ site.versions.node }}
- Yarn {{ site.versions.yarn }}
- MongoDB {{ site.versions.mongodb }}
- Redis {{ site.versions.redis }}

An optional dependency for Talk is
[Docker](https://www.docker.com/community-edition#/download){:target="_blank"}.
It is used during [development](#development) to set up the database and can be
used to [install via Docker](#installation-from-docker).  We have tested Talk
and this documentation with versions {{ site.versions.docker }}.

Another optional dependency for Talk is
[Docker Compose](https://docs.docker.com/compose/install/){:target="_blank"}. It
can be used to setup your environment easily for testing. We have tested Talk
and this documentation with versions {{ site.versions.docker_compose }}.

## Installation

### Installation from Docker

To use Talk without major customization you can run the application using our
provided docker image. The following is a `docker-compose.yml` file that can
be used to setup Talk:

```yml
{% include files/docker-compose.yml %}
```

This is the bare minimum needed to run the demo, for more configuration
variables, check out the [Configuration]({{ "/configuration/" | relative_url }}) section.
{: .code-aside}

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
{: .no-copy }

And when you run `docker-compose ps`, you should see something like:

```
    Name                   Command               State           Ports
-------------------------------------------------------------------------------
mongo_1   docker-entrypoint.sh mongod      Up      27017/tcp
redis_1   docker-entrypoint.sh redis ...   Up      6379/tcp
talk_1    yarn start                       Up      0.0.0.0:3000->3000/tcp
```
{: .no-copy }

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

This is only the bare minimum needed to run the demo, for more configuration
variables, check out the [Configuration]({{ "/configuration/" | relative_url }}) section. Facebook login above
will definitely not work unless you change those values as well.
{: .code-aside}

You can now start the application by running:

```bash
yarn watch:server
```

Continue onto the [Running](#running) section for details on how to complete the
installation and get started using Talk.

## Running

You can now navigate to
[http://127.0.0.1:3000/admin/install](http://127.0.0.1:3000/admin/install){:target="_blank"}
and go through the admin installation. There you will be prompted to create your
first admin account, and specify the domain whitelist for domains that are
allowed to have the comment box on.

_During development, ensure you whitelist 127.0.0.1:3000 otherwise the
[http://127.0.0.1:3000/](http://127.0.0.1:3000/){:target="_blank"} page will not
load._

Once you've completed the installation, you can visit
[http://127.0.0.1:3000/](http://127.0.0.1:3000/){:target="_blank"} where you can
view our development area where we test out features in Talk where you can write
comments and see them in the admin interface where you can do moderation and
reconfigure the user experience.

## Demo

If you've followed the documentation above, you'll now have a running copy of
Talk. To demonstrate what your own self-hosted copy of Talk can do, below
you'll find a demo that can be used to test the copy that is running now on your
machine.

{% include demo.html %}

At this point you've successfully installed, configured, and ran your very own
instance of Talk! Continue through this documentation on this site to learn more
on how to configure, develop with, and contribute to Talk!

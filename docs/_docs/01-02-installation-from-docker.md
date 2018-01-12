---
title: Installation from Docker
permalink: /installation-from-docker/
---

{% include badges.html %}

[Docker](https://www.docker.com/community-edition#/download){:target="_blank"} {{ site.versions.docker }} and
[Docker Compose](https://docs.docker.com/compose/install/){:target="_blank"} {{ site.versions.docker_compose }} are required
to perform installation via Docker. This is the recommended way to deploy the
application when used in production.

Available as [coralproject/talk](https://hub.docker.com/r/coralproject/talk/){:target="_blank"} on
Docker Hub. [(latest/Dockerfile)](https://github.com/coralproject/talk/blob/master/Dockerfile){:target="_blank"}

Images are tagged using the following notation:

- `x` (where `x` is the major version number): any minor or patch updates will
  be included in this. If you're ok getting new features occasionally and all
  the bug fixes, this is the tag for you. Any changes to this image tag will not
  require a database migration.
- `x.y` (where `y` is the minor version number): any patch updates will be
  included with this tag. If you like getting fixes and having features change
  only when you want, this is the tag for you. **(recommended)**
- `x.y.z` (where `z` is the patch version): this tag never gets updated, and
  essentially freezes your version, this should only be used when you are either
  extending Talk or are sure of a specific version you want to freeze.

We provide tags with `*-onbuild`
[(onbuild/Dockerfile)](https://github.com/coralproject/talk/blob/master/Dockerfile.onbuild){:target="_blank"}
that can be used for easy plugin integration and acts as a customization
endpoint. To use this image tag, refer to the
[onbuild](#onbuild) section.

## Installing

To use Talk without major customization you can run the application using our
provided docker image. The following is a `docker-compose.yml` file that can
be used to setup Talk:

```yml
{% include files/docker-compose.yml %}
```

This is the bare minimum needed to start Talk, for more configuration
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

At this stage, you should refer to the [configuration]({{ "/configuration/" | relative_url }}) for
configuration variables that are specific to your installation.

## Onbuild

We provide `*-onbuild` images to assist and automate the customization of our
base installation with additional custom plugins. Images can be created with the
most basic of `Dockerfile`'s:

```docker
FROM coralproject/talk:latest-onbuild
```

And running the following to build the docker image:

```bash
docker build -t my-awesome-talk-image --build-arg TALK_DEFAULT_LANG=es .
```

Don't forget to replace `my-awesome-talk-image` with your own image name, and
specify your build variables with the `--build-arg`. Refer to [Dockerfile.onbuild](https://github.com/coralproject/talk/blob/master/Dockerfile.onbuild){:target="_blank"} for the
available build variables.
{: .code-aside}

This accomplishes a lot:

1. Copies all the files alongside the `Dockerfile` into the application
   directory in the Docker image.
2. Installs any new dependencies that were required by any new plugins.
3. Builds the new static bundles so that they are ready to serve when the image
   is running.
4. Specifies a build time variable [TALK_DEFAULT_LANG]({{ "/advanced-configuration/#talk_default_lang" | relative_url }}){:.param}. Refer
to [Dockerfile.onbuild](https://github.com/coralproject/talk/blob/master/Dockerfile.onbuild){:target="_blank"} for the
available build variables.

This means that you can create a repository for your organization that simply
includes the above `Dockerfile`, a directory of `plugins`, and a `plugins.json`
file which specifies the activated plugins, and you can deploy Talk easily to
your containerized infrastructure. The versioning of our Docker tags as well
lets you do something like:

```docker
FROM coralproject/talk:4.0-onbuild
```

Which would pin your image to `4.0` release's.
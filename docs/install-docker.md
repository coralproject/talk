---
title: Installation From Docker
sidebar: talk_sidebar
permalink: install-docker.html
summary:
---

We currently support packaging the Talk application via Docker, which automates
the dependency install and asset build process. This is the recommended way to
deploy the application when used in production.

Available as [coralproject/talk](https://hub.docker.com/r/coralproject/talk/) on Docker Hub.

Images are tagged using the following notation:

- `x` (where `x` is the major version number): any minor or patch updates will be included in this. If you're ok getting
  new features occasionally and all the bug fixes, this is the tag for you.
- `x.y` (where `y` is the minor version number): any patch updates will be
  included with this tag. If you like getting fixes and having features change
  only when you want, this is the tag for you. **(recommended)**
- `x.y.z` (where `z` is the patch version): this tag never gets updated, and
  essentially freezes your version, this should only be used when you are either
  extending Talk or are sure of a specific version you want to freeze.

We provide tags with `*-onbuild` that can be used for easy plugin integration and
acts as a customization endpoint. Instructions are provided in the `PLUGINS.md`
document as to how to use it.

### Requirements

There are some runtime requirements for running Talk for Docker:

- [Docker](https://www.docker.com/) v1.13.0 or later
- [Docker Compose](https://docs.docker.com/compose/) v1.10.0 or later

_Please be sure to check the versions of these requirements. Incorrect versions
of these may lead to unexpected errors!_

### Installing

An example docker-compose.yml:

```yaml
version: '2'
services:
  talk:
    image: coralproject/talk:1.5
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - TALK_MONGO_URL=mongodb://mongo/talk
      - TALK_REDIS_URL=redis://redis
  mongo:
    image: mongo:3.2
    restart: always
    volumes:
      - mongo:/data/db
  redis:
    image: redis:3.2
    restart: always
    volumes:
      - redis:/data
volumes:
  mongo:
    external: false
  redis:
    external: false
```

At this stage, you should refer to the `README.md` for configuration variables
that are specific to your installation. Some pre-defined fields have been filled
in the above example which are consistent with Docker Compose naming conventions
for [Docker Links](https://docs.docker.com/compose/networking/#links).

### Scaling

If you are interested in splitting apart services, you can simply adjust the
command being executed in the container to optimize for your use case. An
example would be if you wanted to run the API server and the job processor
on different machines. You can achieve this easily with docker compose:

```yaml
version: '2'
services:
  talk-api:
    image: coralproject/talk:1.5
    command: cli serve
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - TALK_MONGO_URL=mongodb://mongo/talk
      - TALK_REDIS_URL=redis://redis
  talk-jobs:
    image: coralproject/talk:1.5
    command: cli jobs process
    restart: always
    ports:
      - "5001:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - TALK_MONGO_URL=mongodb://mongo/talk
      - TALK_REDIS_URL=redis://redis
  mongo:
    image: mongo:3.2
    restart: always
    volumes:
      - mongo:/data/db
  redis:
    image: redis:3.2
    restart: always
    volumes:
      - redis:/data
volumes:
  mongo:
    external: false
  redis:
    external: false
```

Note that the only difference is in the `command` key. From this, you are able
to discretely control which modules are running in order to have the maximum
flexibility when managing your application.

### Running

If you're using docker compose:

```bash
# Start the services using compose
docker-compose up -d
```

If you're using plain docker:

```bash
docker run -d -P coralproject/talk:latest
```

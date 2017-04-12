# Installation

## Requirements

- Any flavour of Linux, OSX or Windows
- 1GB memory (minimum)
- 5GB storage (minimum)
- [MongoDB](https://www.mongodb.com/) v3.4 or later
- [Redis](https://redis.io/) v3.2 or later

## Installation From Source

### Requirements

There are some runtime requirements for running Talk from source:

- [Node](https://nodejs.org/) v7.9 or later
- [Yarn](https://yarnpkg.com/) v0.22.0 or later

_Please be sure to check the versions of these requirements. Incorrect versions
of these may lead to unexpected errors!_

### Installing

#### Download

It is highly recommended that you download a released version as the code
available in `master` may not be stable. You can download the latest release
from the [releases page](https://github.com/coralproject/talk/releases).

You can also clone the git repository via:

```bash
git clone https://github.com/coralproject/talk.git
```

#### Setup

We now have to install the dependancies and build the static assets.

```bash
# Install package dependancies
yarn

# Build static files
yarn build
```

After you create/modify the `plugins.json` (refer to `PLUGINS.md` for plugin
docs) file, you can re-run the following to install their dependancies:

```bash
# Reconcile plugins
./bin/cli plugins reconcile

# Build static files
yarn build
```

### Running

Refer to the `README.md` file for required configuration variables to add to the
environment.

You can start the server after configuring the server using the command:

```bash
yarn start
```

This will setup the server to serve everything on a single node.js process and
is designed to be used in production.

You can see other scripts we've made available by consulting the `package.json`
file under the `scripts` key including:

- `yarn test` run unit tests
- `yarn e2e` run end to end tests
- `yarn build-watch` watch for changes to client files and build static assets
- `yarn dev-start` watch for changes to server files and reload the server while
  also sourcing a `.env` file in your local directory for configuration

## Installation From Docker

We currently support packaging the Talk application via Docker, which automates
the dependancy install and asset build process.

https://hub.docker.com/r/coralproject/talk/

Images are tagged using the following notation:

- `x` (where `x` is the major version number): any minor or patch updates will be included in this. If you're ok getting
  new features occationally and all the bug fixes, this is the tag for you.
- `x.y` (where `y` is the minor version number):
- `x.y.z` (where `z` is the patch version):

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
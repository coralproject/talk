## Contents

- [Installation](#installation) - install the application on a machine
	- [Via Docker](#installation-from-docker)
	- [Via Source](#installation-from-source)
- [Setup](#setup) - setup the application for first use
- [Usage](#usage) - connect the application to a website

# Installation

## Requirements

- Any flavour of Linux, OSX or Windows
- 1GB memory (minimum)
- 5GB storage (minimum)
- [MongoDB](https://www.mongodb.com/) v3.4 or later
- [Redis](https://redis.io/) v3.2 or later
- SSL Certificate
  - This application assumes that you will be serving this application in a
    production environment, and therefore requires that you serve it behind a
    webserver with a valid SSL certificate. This is chosen in order to secure
    user's sessions.

## Installation From Docker

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

## Installation From Source

This provides information on how to setup the application from source. Note that
this is not recommended for production deploys, but will work for development
and testing purposes.

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

#### Building

We now have to install the dependencies and build the static assets.

```bash
# Install package dependancies
yarn

# Build static files
yarn build
```

After you create/modify the `plugins.json` (refer to `PLUGINS.md` for plugin
docs) file, you can re-run the following to install their dependencies:

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

# Setup

Once you've installed Talk (either via Docker or source), you still need to
setup the application. If you are unfamiliar with any terminoligy used in the
setup process, refer to the `TERMINOLOGY.md` document.

## Via Web

If you want to perform your setup via the web, you can navigate to your
installation of Talk at the path `/admin/install`. There you will be asked a
series of questions for your installation.

## Via CLI

If you want to perform your setup through the terminal, you can simply run:

```bash
cli setup
```

And follow the instructions to perform initial setup and create your first user
account.


# Usage

After setup is complete, you can then refer to the `/admin/configure` path to
get the embed code that you can copy/paste onto your blog or website in order to
start using Talk.

_In order for the embed to work correctly, you will need to whitelist the domain
that is allowed to embed your site on the `/admin/configure` page, failure to do
so will result in the comment stream not loading._

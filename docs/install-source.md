---
title: Installation From Source
sidebar: talk_sidebar
permalink: install-source.html
summary:
---

This provides information on how to setup the application from source. Note that
this is not recommended for production deploys, but will work for development
and testing purposes.

## Requirements

There are some runtime requirements for running Talk from source:

- [Node](https://nodejs.org/) ~7.8
- [Yarn](https://yarnpkg.com/) ^0.22.0

_Please be sure to check the versions of these requirements. Incorrect versions
of these may lead to unexpected errors!_

## Installing

### Download

It is highly recommended that you download a released version as the code
available in `master` may not be stable. You can download the latest release
from the [releases page](https://github.com/coralproject/talk/releases).

You can also clone the git repository via:

```bash
git clone https://github.com/coralproject/talk.git
```

### Building

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

## Running

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

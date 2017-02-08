# Installation

## Requirements

### System

- Any flavour of Linux, OSX or Windows
- 1GB memory (minimum)
- 5GB storage (minimum)

## Installation From Source

### Requirements

There are some runtime requirements for running Talk from source:

- [Node](https://nodejs.org/) v7 or later
- [MongoDB](https://www.mongodb.com/) v3.2 or later
- [Redis](https://redis.io/) v3.2 or later
- [Yarn](https://yarnpkg.com/) v0.19.1 or later

_Please be sure to check the versions of these requirements. Insufficient versions of these may lead to unexpected errors!_

### Installing

```bash
# Download the tarball containing the repository
curl -L https://github.com/coralproject/talk/tarball/master -o coralproject-talk.tar.gz

# Untar that file and change to that directory
tar xpf coralproject-talk.tar.gz
mv coralproject-talk-* coralproject-talk
cd coralproject-talk

# Install package dependancies
yarn

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

You can see other scripts we've made available by consulting the `package.json`
file under the `scripts` key including:

- `yarn test` run unit tests
- `yarn e2e` run end to end tests
- `yarn build-watch` watch for changes to client files and build static assets
- `yarn dev-start` watch for changes to server files and reload the server

## Installation From Docker Hub

### Requirements

There are some runtime requirements for running Talk for Docker:

- [MongoDB](https://www.mongodb.com/) v3.2 or later
- [Redis](https://redis.io/) v3.2 or later
- [Docker](https://www.docker.com/) v1.13.0 or later
- [Docker Compose](https://docs.docker.com/compose/) v1.10.0 or later

_Please be sure to check the versions of these requirements. Insufficient versions of these may lead to unexpected errors!_

### Installing

```bash
# Create a directory for talk
mkdir coralproject-talk
cd coralproject-talk

# Download the docker-compose.yml file from the repository
curl -LO https://raw.githubusercontent.com/coralproject/talk/master/docker-compose.yml
```

At this stage, you should refer to the `README.md` file for required
configuration variables to add to the environment key for the `talk` service
listed in the `docker-compose.yml` file.

### Running

```bash
# Start the services using compose
docker-compose up -d
```

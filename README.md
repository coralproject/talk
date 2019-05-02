# talk ![CircleCI](https://img.shields.io/circleci/project/github/coralproject/talk/next.svg)

Online comments are broken. Our open-source commenting platform, Talk, rethinks
how moderation, comment display, and conversation function, creating the
opportunity for safer, smarter discussions around your work.
[Read more about Talk here](https://coralproject.net/talk).

Built with <3 by The Coral Project, a part of [Vox Media](https://product.voxmedia.com/).

Preview Talk easily by running Talk via a Heroku App:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/coralproject/talk/tree/next)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Requirements](#requirements)
- [Running](#running)
  - [Docker](#docker)
  - [Source](#source)
  - [Development](#development)
    - [Email](#email)
    - [Design Language System (UI Components)](#design-language-system-ui-components)
- [Configuration](#configuration)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- MongoDB >=3.6
- Redis >=3.2
- NodeJS >=10
- NPM >=6.7

## Running

You can install Talk using Docker or via Source. We recommend Docker, as it
provides the easiest deployment solution going forward, as all the dependencies
are baked and shipped with the provided
[coralproject/talk:next](https://hub.docker.com/r/coralproject/talk) image.
When v5 releases to master, you'll be able to select it using
`coralproject/talk:5`.

### Docker

The easiest way to get started with Talk is through our published Docker image
and provided example `docker-compose.yml` file. The following assumes that you
have Docker and Docker Compose installed on your local machine:

- Install Docker: https://docs.docker.com/install/
- Install Docker Compose: https://docs.docker.com/compose/install/ (this is typically included in the Docker Desktop editions already)

```bash
# Create directories to persist the data in MongoDB and Redis.
mkdir -p data/{mongo,redis}

# Create the `docker-compose.yml` file to get started.
cat > docker-compose.yml <<EOF
version: "2"
services:
  talk:
    image: coralproject/talk:next
    restart: always
    ports:
      - "127.0.0.1:3000:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - MONGODB_URI=mongodb://mongo:27017/talk
      - REDIS_URI=redis://redis:6379
      - SIGNING_SECRET=<replace me with something secret>
  mongo:
    image: mongo:3.6
    volumes:
      - ./data/mongo:/data/db
  redis:
    image: redis:3.2
    volumes:
      - ./data/redis:/data
EOF

# Start up Talk using Docker.
docker-compose up -d
```

Then head on over to http://localhost:3000 to install Talk!

### Source

Talk requires NodeJS >=10, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Talk directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install

# Build the application dependencies.
# This might take a while.
npm run build
```

This should output all the compiled application code to `./dist`.

Running Talk with default settings assumes that you have:

- MongoDB >=3.6 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:3.6
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

Then start Talk with:

```bash
# Start the server in production mode.
npm run start
```

Then head on over to http://localhost:3000 to install Talk!

### Development

Running Talk for development is very similar to installing Talk via Source as
described above.

Talk requires NodeJS >=10, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Talk directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install
```

Running Talk with default settings assumes that you have:

- MongoDB >=3.6 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:3.6
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

Then start Talk with:

```bash
# Run the server in development mode in order to facilitate auto-restarting and
# rebuilding when file changes are detected. This might take a while to fully run.
npm run watch
```

When the client code has been built, navigate to http://localhost:8080/install
to start the installation wizard. **Note: Ensure `localhost:8080` is used in the permitted domains list.**

To see the comment stream goto http://localhost:8080/.

To run linting and tests use the following commands:

```bash
# Run the linters.
npm run lint

# Run our unit and integration tests.
npm run test
```

#### Email

To test out the email sending functionality, you can run [inbucket](https://www.inbucket.org/)
which provides a test SMTP server that can visualize emails in the browser:

```bash
docker run -d --name inbucket -p 2500:2500 -p 9000:9000 inbucket/inbucket
```

You can then configure the email server on Talk by updating the Tenant with:

```js
{
  // ...
  "email": {
    "enabled": true,
    "smtpURI": "smtp://localhost:2500",
    "fromAddress": "community@test.com"
  },
  // ...
}
```

Restarting Talk will be needed. Navigate to http://localhost:9000, click the
"Monitor" tab. New emails received on this screen.

#### Design Language System (UI Components)

We use [docz](https://docz.site) to document and develop our Design Language System. To start docz run:

```bash
# Make sure CSS types are generated.
# This is not required when `npm run watch` is already running.
npm run generate:css-types

# Run docz in development.
npm run docz -- dev
```

After compilation has finished you can access docz at http://localhost:3030/.

## Configuration

The following environment variables can be set to configure the Talk Server. You
can expose them in your shell via `export NODE_ENV=development` or by placing
the variables in a `.env` file in the root of the project in a simple
`NODE_ENV=development` format delimited by newlines.

- `NODE_ENV` - Can be one of `production` or `development`. All production
  deployments should use `production`. Defaults to `production` when ran with
  `npm run start` and `development` when run with `npm run start:development`.
- `PORT` - The port to listen for HTTP and Websocket requests. (Default `3000`)
- `MONGODB_URI` - The MongoDB database URI to connect to.
  (Default `mongodb://127.0.0.1:27017/talk`)
- `REDIS_URI` - The Redis database URI to connect to.
  (Default `redis://127.0.0.1:6379`)
- `SIGNING_SECRET` - The shared secret to use to sign JSON Web Tokens (JWT) with
  the selected signing algorithm. 🚨 **Don't forget to set this variable!** 🚨
  (Default: `keyboard cat`)
- `SIGNING_ALGORITHM` - The signing algorithm to use for signing JWT's.
  (Default `HS256`).
- `LOGGING_LEVEL` - The logging level that can be set to one of `fatal`,
  `error`, `warn`, `info`, `debug`, or `trace`. (Default `info`)
- `STATIC_URI` - The URI that static assets can be accessed from. This URI can
  be to a proxy that uses this Talk server on `PORT` as the upstream. Disabled
  by default.
- `DISABLE_TENANT_CACHING` - When `true`, all tenants will be loaded from the
  database when needed rather than keeping a in-memory copy in sync via
  published events on Redis. (Default `false`)
- `DISABLE_MONGODB_AUTOINDEXING` - When `true`, Talk will not perform indexing
  operations when it starts up. This can be desired when you've already
  installed Talk on the target MongoDB, but want to improve start performance.
  (Default `false`)
- `LOCALE` - Specify the default locale to use for all requests without a locale
  specified. (Default `en-US`)
- `ENABLE_GRAPHIQL` - When `true`, it will enable the `/graphiql` even in
  production, use with care. (Default `false`)
- `CONCURRENCY` - The number of worker nodes to spawn to handle web traffic,
  this should be tied to the number of CPU's available. (Default
  `os.cpus().length`)
- `DEV_PORT` - The port where the Webpack Development server is running on.
  (Default `8080`)

## License

Talk is released under the [Apache License, v2.0](/LICENSE).

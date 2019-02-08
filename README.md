# talk

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

Then head on over to http://127.0.0.1:3000 to install Talk!

### Source

Talk requires NodeJS >=10, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Install dependencies.
npm install

# Build the application dependencies.
npm run build
```

This should output all the compiled application code to `./dist`.

Running Talk with default settings assumes that you have:

- MongoDB >=3.6 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can run the following
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

Then head on over to http://127.0.0.1:3000 to install Talk!

## Configuration

The following environment variables can be set to configure the Talk Server:

- `NODE_ENV` - Can be one of `production`, `development`, `test`. All production
  deployments should use `production`. Defaults to `production` when ran with
  `npm run start` and `development` when run with `npm run start:development`.
- `PORT` - The port to listen for HTTP and Websocket requests. (Default `3000`)
- `MONGODB_URI` - The MongoDB database URI to connect to.
  (Default `mongodb://127.0.0.1:27017/talk`)
- `REDIS_URI` - The Redis database URI to connect to.
  (Default `redis://127.0.0.1:6379`)
- `SIGNING_SECRET` - The shared secret to use to sign JSON Web Tokens (JWT) with
  the selected signing algorithm. (Default: `keyboard cat`)
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
- `ENABLE_GRAPHIQL` - When `true`, it will enable the `/tenant/graphiql` even in
  production, use with care. (Default `false`)
- `CONCURRENCY` - The number of worker nodes to spawn to handle web traffic,
  this should be tied to the number of CPU's available. (Default
  `os.cpus().length`)
- `DEV_PORT` - The port where the Webpack Development server is running on.
  (Default `8080`)

## License

Talk is released under the [Apache License, v2.0](/LICENSE).

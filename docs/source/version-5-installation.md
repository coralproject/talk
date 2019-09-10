---
title: Installing Version 5
permalink: /
---

Online comments are broken. Our open-source commenting platform, Coral, rethinks
how moderation, comment display, and conversation function, creating the
opportunity for safer, smarter discussions around your work.
[Read more about Coral here](https://coralproject.net/talk).

Built with ❤️ by The Coral Project, a part of [Vox Media](https://product.voxmedia.com/).

Preview Coral easily by running Coral via a Heroku App:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/coralproject/talk)

## Requirements

- MongoDB >=3.6
- Redis >=3.2
- NodeJS >=10
- NPM >=6.7

## Running

You can install Coral using Docker or via Source. We recommend Docker, as it
provides the easiest deployment solution going forward, as all the dependencies
are baked and shipped with the provided
[coralproject/talk:next](https://hub.docker.com/r/coralproject/talk) image.
When v5 releases to master, you'll be able to select it using
`coralproject/talk:5`.

### Docker

The easiest way to get started with Coral is through our published Docker image
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
      - MONGODB_URI=mongodb://mongo:27017/coral
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

# Start up Coral using Docker.
docker-compose up -d
```

Then head on over to http://localhost:3000 to install Coral!

### Source

Coral requires NodeJS >=10, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Coral directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install

# Build the application dependencies.
# This might take a while.
npm run build
```

This should output all the compiled application code to `./dist`.

Running Coral with default settings assumes that you have:

- MongoDB >=3.6 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:3.6
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

Then start Coral with:

```bash
# Start the server in production mode.
npm run start
```

Then head on over to http://localhost:3000 to install Coral!

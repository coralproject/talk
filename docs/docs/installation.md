---
id: installation
title: Installation
sidebar_label: Installation
description: Learn how to get Coral powering your commenting experience.
slug: /
---

Online comments are broken. Our open-source commenting platform, Coral,
reimagines moderation, comment display, and conversation. Use Coral to add
smarter, safer discussions to your site without giving away your data.

More than 280 newsrooms in 23 countries trust Coral to power their on-site
communities, including The Washington Post, The Financial Times, Wired, The Wall Street Journal, and Der
Spiegel. [Read more about Coral here](https://coralproject.net/).

Built with ❤️ by Coral by [Vox Media](https://product.voxmedia.com/).

## Requirements

- MongoDB ^4.2
- Redis ^3.2
- NodeJS ^14.18
- NPM ^8.0

## Running

You can install Coral using Docker or via Source. We recommend Docker, as it
provides the easiest deployment solution going forward, as all the dependencies
are baked and shipped with the provided
[coralproject/talk](https://hub.docker.com/r/coralproject/talk) image.

### Docker

The easiest way to get started with Coral is through our published Docker
images. The following assumes that you have Docker and Docker Compose installed
on your machine:

- Install Docker: https://docs.docker.com/get-docker/
- Install Docker Compose: https://docs.docker.com/compose/install/

```bash
# Create directories to persist the data in MongoDB and Redis.
mkdir -p data/{mongo,redis}

# Create a secret using a tool like openssl.
SIGNING_SECRET="$(openssl rand -base64 48)"

# Create the docker-compose.yml file to get started.
cat > docker-compose.yml <<EOF
version: "2"
services:
  talk:
    image: coralproject/talk:7
    restart: always
    ports:
      - "127.0.0.1:5000:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - MONGODB_URI=mongodb://mongo:27017/coral
      - REDIS_URI=redis://redis:6379
      - SIGNING_SECRET=${SIGNING_SECRET}
  mongo:
    image: mongo:4.2
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

Then head on over to http://localhost:5000 to install Coral!

### Source

Coral requires NodeJS >=14, we recommend using `nvm` to help manage node
versions https://github.com/nvm-sh/nvm.

```bash
# Clone and cd into the Coral directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install

# Build the application dependencies, this may take some time.
npm run build
```

This should output all the compiled application code to `./dist`.

Running Coral with default settings assumes that you have:

- MongoDB ^4.2 running on `127.0.0.1:27017`
- Redis ^3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:4.2
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

Then start Coral with:

```bash
npm run start:development
```

Then head on over to http://localhost:3000 to install Coral!

Note that if you want to run Coral in production from source, you'll need to
create a secret for signing that differs from the unsafe default. You can run
the following from your `talk` directory to do this:

```bash
# Create a secret using a tool like openssl.
SIGNING_SECRET="$(openssl rand -base64 48)"

# Add a randomly generated secret to your .env file.
cat >> .env <<EOF
SIGNING_SECRET=${SIGNING_SECRET}
EOF
```

You can then run Coral with the production command instead:

```bash
# Start the server in production mode.
npm run start
```

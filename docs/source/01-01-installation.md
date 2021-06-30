---
title: Installing Coral
permalink: /
---

Online comments are broken. Our open-source commenting platform, Coral, reimagines
moderation, comment display, and conversation. Use Coral to add smarter, safer discussions to your site without giving away your data.

More than 130 newsrooms in 16 countries trust Coral to power their on-site communities, including The Washington Post, The Wall Street Journal, and Der Spiegel. [Read more about Coral here](https://coralproject.net/).

<div class="callout">
  We offer hosting and support packages for Coral, as well as exclusive, customer-only features. <a href="https://coralproject.net/pricing/">Contact us for more information.</a>.
</div>

Built with ❤️ by Coral by [Vox Media](https://product.voxmedia.com/).

## Requirements

- MongoDB >=4.2
- Redis >=3.2
- NodeJS >=12
- NPM >=6.7

## Running

You can install Coral using Docker or via Source. We recommend Docker, as it
provides the easiest deployment solution going forward, as all the dependencies
are baked and shipped with the provided
[coralproject/talk:6](https://hub.docker.com/r/coralproject/talk) image.

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
    image: coralproject/talk:6
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
    image: mongo:4.2
    restart: always
    volumes:
      - ./data/mongo:/data/db
  redis:
    image: redis:3.2
    restart: always
    volumes:
      - ./data/redis:/data
EOF

# Start up Coral using Docker.
docker-compose up -d
```

Then head on over to http://localhost:3000 to install Coral!

### Source

Coral requires NodeJS >=12, we recommend using `nvm` to help manage node
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

- MongoDB >=4.2 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:4.2
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

Then start Coral with:

```bash
# Start the server in development mode.
npm run start:development
```

Then head on over to http://localhost:3000 to install Coral!

Note that if you want to run Coral in production from source, you'll need to
create a secret for signing that differs from the unsafe default. You can do
this by using something like `openssl rand -base64 32`. You can then place this
secret in a `.env` file in your `talk` directory as such:

```bash
SIGNING_SECRET=<replace me with something secret>
```

You can then run Coral with the production command instead:

```bash
# Start the server in production mode.
npm run start
```

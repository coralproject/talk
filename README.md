# Coral ![CircleCI](https://img.shields.io/circleci/project/github/coralproject/talk/next.svg)

Online comments are broken. Our open-source commenting platform, Coral, rethinks
how moderation, comment display, and conversation function, creating the
opportunity for safer, smarter discussions around your work.
[Read more about Coral here](https://coralproject.net/talk).

Built with <3 by The Coral Project, a part of [Vox Media](https://product.voxmedia.com/).

Preview Coral easily by running Coral via a Heroku App:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/coralproject/talk)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Requirements](#requirements)
- [Running](#running)
  - [Docker](#docker)
  - [Source](#source)
  - [Embed On Your Site](#embed-on-your-site)
  - [Single Sign On](#single-sign-on)
    - [External Integrations](#external-integrations)
    - [Login Prompts](#login-prompts)
  - [Development](#development)
    - [Email](#email)
    - [Design Language System (UI Components)](#design-language-system-ui-components)
- [GraphQL API](#graphql-api)
  - [Making your first request](#making-your-first-request)
  - [Understanding the response](#understanding-the-response)
  - [Authorizing a request](#authorizing-a-request)
    - [Bearer Token](#bearer-token)
    - [Cookie](#cookie)
  - [Persisted Queries](#persisted-queries)
- [Configuration](#configuration)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Embed On Your Site

With Coral setup and running locally you can test embeding the comment stream with this sample embed script:

```
<div id="coral_thread"></div>
<script type="text/javascript">
(function() {
    var talk = document.createElement('script'); talk.type = 'text/javascript'; talk.async = true;
    var url = '{{ CORAL_DOMAIN_NAME }}';
    talk.src = '//' + url + '/assets/js/embed.js';
    talk.onload = function() {
        Coral.createStreamEmbed({
            id: "coral_thread",
            autoRender: true,
            rootURL: '//' + url,
        });
    };
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(talk);
})();
</script>
```

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

### Single Sign On

In order to allow seamless connection to an existing authentication system,
Coral utilizes the industry standard [JWT Token](https://jwt.io/) to connect. To
learn more about how to create a JWT token, see [this introduction](https://jwt.io/introduction/).

1. Visit: `https://{{ CORAL_DOMAIN_NAME }}/admin/configure/auth`
2. Scroll to the `Login with Single Sign On` section
3. Enable the Single Sign On Authentication Integration
4. Enable `Allow Registration`
5. Copy the string in the `Key` box
6. Click Save

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

You will then have to generate a JWT with the following claims:

- `jti` (_optional_) - A unique ID for this particular JWT token. We recommend
  using a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)
  for this value. Without this parameter, the logout functionality inside the
  embed stream will not work and you will need to call logout on the embed
  itself.
- `exp` (_optional_) - When the given SSO token should expire. This is
  specified as a unix time stamp in seconds. Once the token has expired, a new
  token should be generated and passed into Coral. Without this parameter, the
  logout functionality inside the embed stream will not work and you will need
  to call logout on the embed itself.
- `iat` (_optional_) - When the given SSO token was issued. This is required to
  utilize the automatic user detail update system. If this time is newer than
  the time we received the last update, the contents of the token will be used
  to update the user.
- `user.id` (**required**) - the ID of the user from your authentication system.
  This is required to connect the user in your system to allow a seamless
  connection to Coral.
- `user.email` (**required**) - the email address of the user from your
  authentication system. This is required to facilitate notification email's
  about status changes on a user account such as bans or suspensions.
- `user.username` (**required**) - the username that should be used when being
  presented inside Coral to moderators and other users.
- `user.badges` (_optional_) - array of strings to be displayed as badges beside
  username inside Coral, visible to other users and moderators. For example, to indicate
  a user's subscription status.
- `user.role` (_optional_) - one of "COMMENTER", "STAFF", "MODERATOR", "ADMIN". Will create/update
  Coral user with this role.

An example of the claims for this token would be:

```json
{
  "jti": "151c19fc-ad15-4f80-a49c-09f137789fbb",
  "exp": 1572172094,
  "iat": 1562172094,
  "user": {
    "id": "628bdc61-6616-4add-bfec-dd79156715d4",
    "email": "bob@example.com",
    "username": "bob"
  }
}
```

With the claims provided, you can sign them with the `Key` obtained from the
Coral administration panel in the previous steps with a `HS256` algorithm. This
token can be provided in the above mentioned embed code by adding it to the
`createStreamEmbed` function:

```js
Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
  accessToken: "{{ SSO_TOKEN }}",
});
```

Or by calling the `login/logout` method on the embed object:

```js
var embed = Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
});

// Login the current embed with the generated SSO token.
embed.login("{{ SSO_TOKEN }}");

// Logout the user.
embed.logout();
```

#### External Integrations

You can integrate directly with the Coral GraphQL API in order to facilitate
account updates for your users when using Coral SSO. The relevant mutations are
as follows:

- `updateUserUsername` lets you update a given user with a new username using
  an admin token.
- `updateUserEmail` lets you update a given user with a new email address
  using an admin token.
- `deleteUser` lets you delete a given account using an admin token.
  Note that even with an admin token, you may not delete yourself via
  this method, and instead must use the `requestAccountDeletion`
  mutation instead. This differs from the `requestAccountDeletion` as
  it does the operation immediately instead of scheduling it as
  `requestAccountDeletion` does.
- `requestUserCommentsDownload` lets you retrieve a given account's comments download. This mutation will provide you with a `archiveURL` that can be used to download a ZIP file containing the user's comment export.

If you're unsure on how to call GraphQL API's, refer to the section here on [Making your first GraphQL request](#making-your-first-request).

#### Login Prompts

In order to handle login prompts (e.g. a user clicks on the sign in button) you can listen to the `loginPrompt` event.

```js
var embed = Coral.createStreamEmbed({
  // Don't forget to include the parameters from the
  // "Embed On Your Site" section.
  events: function(events) {
    events.on("loginPrompt", function() {
      // Redirect user to a login page.
      location.href = "http://example.com/login";
    });
  },
});
```

### Development

Running Coral for development is very similar to installing Coral via Source as
described above.

Coral requires NodeJS >=10, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Coral directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install
```

Running Coral with default settings assumes that you have:

- MongoDB >=3.6 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:3.6
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

We recommend installing [watchman](https://facebook.github.io/watchman/docs/install.html) for better watch
performance.

```bash
# On macOS, you can run the following with Homebrew.
brew update
brew install watchman
```

Then start Coral with:

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
docker run -d --name inbucket --restart always -p 2500:2500 -p 9000:9000 inbucket/inbucket
```

You can then configure the email server on Coral
by setting the email settings in
`Configure -> Email` in the admin:

| Field          | Value                |
| -------------- | -------------------- |
| From Address   | `community@test.com` |
| Secure         | `No`                 |
| Host           | `localhost`          |
| Port           | `2500`               |
| Authentication | `No`                 |

Navigate to http://localhost:9000, click the "Monitor" tab. New emails received
on this screen.

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

## GraphQL API

Our API is generally served via GraphQL at `/api/graphql` on your Coral installation. If you're running Coral locally, this would be https://localhost:8080/api/graphql.

You can enable the GraphiQL interface at https://localhost:3000/graphiql (Note the port number here is not 8080, this is because this route is directly served by the server, and not the webpack development server) when running in development to access a GraphQL playground to use with documentation provided in the sidebar on what edges are available to you. You can do this by setting `ENABLE_GRAPHIQL=true`. **(🚨 Note 🚨) we do not recommend using this in production environments as it disables many safety features used by the application**.

### Making your first request

To learn a bit about how to interact with Coral, we'll query for comments on a
page of Coral.

The GraphQL endpoint we have can be used with any HTTP client available, but our
examples below will use the common `curl` tool:

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

When you unpack that, it's really quite simple. We're executing a `POST` request
to the `/api/graphql` route of the local Talk server with the GraphQL
request we want to make. It's composed of the `query`, `variables`, and
`operationName`.

```graphql
query GetComments($url: String!) {
  story(url: $url) {
    metadata {
      title
    }
    url
    comments {
      nodes {
        body
        author {
          username
        }
      }
    }
  }
}
```

We are grabbing the asset with the specified `$url`, and grabbing it's title and the comments under it.

We can then also specify our variables to the query being executed (in this
case, the url for the page where we have comments on our local install of Coral):

```json
{
  "url": "http://localhost:8080/"
}
```

It's also sometimes common to have multiple queries within a query, which is
where the `operationName` comes into play, where we simply specify the named
query that we want to execute (in this case, `GetComments`).

To get a deeper understanding of GraphQL queries, read up on
[GraphQL Queries and Mutations](http://graphql.org/learn/queries/).

### Understanding the response

Once you completed the above GraphQL query with `curl`, you'll get a response
sort of like this:

```json
{
  "data": {
    "story": {
      "metadata": {
        "title": "Coral 5.0 – Embed Stream"
      },
      "url": "http://localhost:8080/",
      "comments": {
        "nodes": [
          {
            "body": "First comment!",
            "author": {
              "username": "wyatt.johnson"
            }
          }
        ]
      }
    }
  }
}
```

All of the parameters you requested should be available under the `data`
property. Any errors that you get would appear in a `errors` array at the top
level, like this:

```json
{
  "errors": [
    {
      "message": "The specified story URL does not exist in the permitted domains list.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["story"],
      "extensions": {
        "code": "STORY_URL_NOT_PERMITTED",
        "id": "e255e860-d3ab-11e9-acdf-b9e9700f06fa",
        "type": "INVALID_REQUEST_ERROR",
        "message": "The specified story URL does not exist in the permitted domains list."
      }
    }
  ],
  "data": {
    "story": null
  }
}
```

You should know that any property that is marked with a `!` is considered
required, and non-nullable, which means you can always guarantee on it being
there in your request if there were no errors.

### Authorizing a request

Some queries you may notice seem to return an error of
`USER_NOT_ENTITLED`. It's likely the case that you are making a request to a
route that requires authorization. You can perform authorization a few ways in
Talk.

Essentially, you need to get access to a JWT token that you can use to authorize
your requests.

```sh
curl --request POST \
  --url http://localhost:3000/api/auth/local \
  --header 'content-type: application/json' \
  --data '{ "email": "${EMAIL}", "password": "${PASSWORD}"}'
```

Which returns a response similar to:

```json
{
  "token": "${TOKEN}"
}
```

Where `${EMAIL}` is the email address of an admin user, and `${PASSWORD}` is the password for that admin user. This will generate a short term token (valid for 90 days). To generate a long lived access token (or Personal Access Token), you have to exchange the token generated above to create a new long lived token:

```sh
curl --request POST \
  --url "http://localhost:3000/api/graphql" \
  --header 'authorization: Bearer ${TOKEN}' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation CreateAccessToken { createToken(input: { clientMutationId: \"\", name: \"My PAT\" }) { signedToken }}","operationName":"CreateAccessToken"}'
```

Which returns a response similar to:

```json
{
  "data": {
    "createToken": {
      "signedToken": "${TOKEN}"
    }
  }
}
```

Where `${TOKEN}` in the request being from the previous set of login steps and returning a new `signedToken` as `${TOKEN}` which can be used instead of the previous `${TOKEN}` value in the below examples.

Once you have your access token, you can substitute it as `${TOKEN}` in your
`curl` request as follows:

#### Bearer Token

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

#### Cookie

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --cookie "authorization=${TOKEN}"
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

### Persisted Queries

You might see an error like `RAW_QUERY_NOT_AUTHORIZED`. This means that you attempted to use either no token, or a token from a user without admin privileges. In Coral, we whitelist the GraphQL mutations and queries that are performed by the applications for security reasons meaning that only admin users can make arbitrary queries against the GraphQL API.

## Configuration

The following environment variables can be set to configure the Coral Server. You
can expose them in your shell via `export NODE_ENV=development` or by placing
the variables in a `.env` file in the root of the project in a simple
`NODE_ENV=development` format delimited by newlines.

- `NODE_ENV` - Can be one of `production` or `development`. All production
  deployments should use `production`. Defaults to `production` when ran with
  `npm run start` and `development` when run with `npm run start:development`.
- `PORT` - The port to listen for HTTP and Websocket requests. (Default `3000`)
- `MONGODB_URI` - The MongoDB database URI to connect to.
  (Default `mongodb://127.0.0.1:27017/coral`)
- `REDIS_URI` - The Redis database URI to connect to.
  (Default `redis://127.0.0.1:6379`)
- `REDIS_OPTIONS` - A JSON string with optional configuration options to be used
  when connecting to Redis as specified in the [ioredis](https://github.com/luin/ioredis/blob/1dac50a63753c2afc969315cfe38faf0edc50bc5/API.md#new_Redis_new) documentation.
  (Default: `{}`)
- `SIGNING_SECRET` - The shared secret to use to sign JSON Web Tokens (JWT) with
  the selected signing algorithm. 🚨 **Don't forget to set this variable!** 🚨
  (Default: `keyboard cat`)
- `SIGNING_ALGORITHM` - The signing algorithm to use for signing JWT's.
  (Default `HS256`).
- `LOGGING_LEVEL` - The logging level that can be set to one of `fatal`,
  `error`, `warn`, `info`, `debug`, or `trace`. (Default `info`)
- `STATIC_URI` - The URI that static assets can be accessed from. This URI can
  be to a proxy that uses this Coral server on `PORT` as the upstream. Disabled
  by default.
- `DISABLE_TENANT_CACHING` - When `true`, all tenants will be loaded from the
  database when needed rather than keeping a in-memory copy in sync via
  published events on Redis. (Default `false`)
- `DISABLE_MONGODB_AUTOINDEXING` - When `true`, Coral will not perform indexing
  operations when it starts up. This can be desired when you've already
  installed Coral on the target MongoDB, but want to improve start performance.
  **You should not use this parameter unless you know what you're doing! Upgrades
  may introduce additional indexes that the application relies on.**
  (Default `false`)
- `LOCALE` - Specify the default locale to use for all requests without a locale
  specified. (Default `en-US`)
- `ENABLE_GRAPHIQL` - When `true`, it will enable the GraphiQL interface at `/graphiql`. **(🚨 Note 🚨) we do not recommend using this in production environments as it disables many safety features used by the application**. (Default `false`)
- `CONCURRENCY` - The number of worker nodes to spawn to handle web traffic,
  this should be tied to the number of CPU's available. (Default
  `os.cpus().length`)
- `DEV_PORT` - The port where the Webpack Development server is running on.
  (Default `8080`)
- `METRICS_USERNAME` - The username for _Basic Authentication_ at the `/metrics` and `/cluster_metrics`
  endpoint.
- `METRICS_PASSWORD` - The password for _Basic Authentication_ at the `/metrics` and `/cluster_metrics`
  endpoint.
- `CLUSTER_METRICS_PORT` - If `CONCURRENCY` is more than `1`, the metrics are provided at this port under `/cluster_metrics`. (Default `3001`)
- `DISABLE_LIVE_UPDATES` - When `true`, disables subscriptions for the comment
  stream for all stories across all tenants (Default `false`)
- `WEBSOCKET_KEEP_ALIVE_TIMEOUT` - A duration in a parsable format (e.g. `30 seconds`
  , `1 minute`) that should be used to send keep alive messages through the
  websocket to keep the socket alive (Default `30 seconds`)
- `TRUST_PROXY` - When provided, it configures the "trust proxy" settings for Express (See https://expressjs.com/en/guide/behind-proxies.html)

## License

Coral is released under the [Apache License, v2.0](/LICENSE).

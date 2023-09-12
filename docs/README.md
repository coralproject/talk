# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Installation

First, you'll need to do at least one full build of Coral. In the root of the repository, peform the following.

```bash
sh npm-i.sh
sh build-development.sh
```

The reason for this is that the docs references the `client/` and `server/` generated types and components to populate the live docs information.

## Local Development

Then within `docs/` you can run the following:

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

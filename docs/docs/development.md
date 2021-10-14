---
id: development
title: Developing on Coral
sidebar_label: Development
description: A guide to developing and extending Coral.
---

Running Coral for development is very similar to installing Coral via Source as
described in our [Getting Started](/#source) guide.

Coral requires NodeJS ^14.18, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Coral directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install
```

Running Coral with default settings assumes that you have:

- MongoDB ^4.2 running on `127.0.0.1:27017`
- Redis ^3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:4.2
docker run -d -p 6379:6379 --restart always --name redis redis:3.2
```

We recommend installing
[watchman](https://facebook.github.io/watchman/docs/install.html) for better
watch performance.

```bash
# On macOS, you can run the following with Homebrew.
brew install watchman
```

Then start Coral in development mode with:

```bash
# Run the server in development mode in order to facilitate auto-restarting and
# rebuilding when file changes are detected. This might take a while to fully
# run.
npm run watch
```

When the client code has been built, navigate to http://localhost:8080/install
to start the installation wizard.

To see the comment stream goto http://localhost:8080/.

To run linting and tests use the following commands:

```bash
# Run the linters.
npm run lint

# Run our unit and integration tests.
npm run test
```

## Email

To test out the email sending functionality, you can run
[inbucket](https://www.inbucket.org/) which provides a test SMTP server that can
visualize emails in the browser:

```bash
docker run -d --name inbucket --restart always -p 2500:2500 -p 9001:9000 inbucket/inbucket
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

Navigate to http://localhost:9001, click the "Monitor" tab. New emails received
on this screen.

## Contributing

To get started contributing, check out our [Contribution Guidelines](https://github.com/coralproject/talk/blob/main/CONTRIBUTING.md).

### Contributing a Translation

We’re so proud to have received submissions from a lot of 3rd party contributors
translating Coral into their own languages.

You can see what languages Coral currently supports here:
https://github.com/coralproject/talk/tree/main/src/locales

Coral uses the [fluent](http://projectfluent.org/) library and store our
translations in [FTL](http://projectfluent.org/fluent/guide/) files in
`src/locales/` and `src/core/server/locales/`.

Strings are added or removed from localization bundles in the translation files
as needed. Strings **MUST NOT** be _changed_ after they've been committed and
pushed to `main`. Changing a string requires creating a new ID with a new name
(preferably descriptive instead of incremented) and deletion of the obsolete ID.
It's often useful to add a comment above the string with info about how and
where the string is used.

Once a language has enough coverage, it should be added to
`src/core/common/helpers/i18n/locales.ts`.

The [Perspective API](https://developers.perspectiveapi.com/s/about-the-api-methods)
also supports comments in specific languages. When the language is supported in
Coral and supported by the Perspective API, the language should be added to the
language map in `src/core/server/services/comments/pipeline/phases/toxic.ts`.

To assist with the translation process, we have a script that is based on the
work by @cristiandean in https://github.com/coralproject/talk/pull/2949 that
will detect missing, new, or changed translation keys for the specified
language. You can use this with:

```bash
# usage: ./scripts/i18n/validate.ts <locale>
./scripts/i18n/validate.ts pt-BR
```

---
title: Developing
permalink: /v5/developing/
---

Running Coral for development is very similar to installing Coral via Source as
described above.

Coral requires NodeJS >=12, we recommend using `nvm` to help manage node
versions: https://github.com/creationix/nvm.

```bash
# Clone and cd into the Coral directory.
git clone https://github.com/coralproject/talk.git
cd talk

# Install dependencies.
npm install
```

Running Coral with default settings assumes that you have:

- MongoDB >=4.2 running on `127.0.0.1:27017`
- Redis >=3.2 running on `127.0.0.1:6379`

If you don't already have these databases running, you can execute the following
assuming you have Docker installed on your local machine:

```bash
docker run -d -p 27017:27017 --restart always --name mongo mongo:4.2
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

## Email

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

## Design Language System (UI Components)

We use [docz](https://docz.site) to document and develop our Design Language System. To start docz run:

```bash
# Make sure CSS types are generated.
# This is not required when `npm run watch` is already running.
npm run generate:css-types

# Run docz in development.
npm run docz -- dev
```

After compilation has finished you can access docz at http://localhost:3030/.


## Contributing

We welcome contributions from the open source community!

To get started contributing, check out our [Contribution Guidelines](https://github.com/coralproject/talk/blob/master/CONTRIBUTING.md).

### Contributing a Translation

We’re so proud to have received submissions from a lot of 3rd party contributors translating Coral into their own languages.

You can see what languages Coral currently supports here: https://github.com/coralproject/talk/tree/master/src/locales

You can set the default language Coral uses in **Admin** > **Configure** > **General**. 

We use the fluent library and store our translations in FTL files in `src/locales/` and `src/core/server/locales/`. To add a new Coral translation, strings are added or removed from localization bundles in the translation files as needed. 

Strings MUST NOT be changed after they've been committed and pushed to master. Changing a string requires creating a new ID with a new name (preferably descriptive instead of incremented) and deletion of the obsolete ID. It's often useful to add a comment above the string with info about how and where the string is used.

If you are a developer contributing a new language, you’ll need to add the required i18n support in the i18n files (or you can leave that to us if you like). If you’re a non-developer, you can submit the translation via GitHub if you feel comfortable doing that, or feel free to email it to us via our Support: support@coralproject.net

If you want to suggest a new language or put a placeholder for a translation you’re working on, feel free to create a GitHub issue: https://github.com/coralproject/talk/issues/new

## Compatibility with IE11

We strive to make the Comment Stream Embed usable in IE11 without being pixel-perfect. If you develop on the Comment Stream you need to be aware of the following:

### CSS Variables

In order to support IE11 on the Comment Stream, every time new CSS is loaded, you need to call `polyfillCSSVarsForIE11()`.

```ts
import { polyfillCSSVarsForIE11 } from "coral-framework/helpers";

const loadProfileContainer = () =>
  import("./ProfileContainer" /* webpackChunkName: "profile" */).then(x => {
    // New css is loaded, take care of polyfilling those css vars for IE11.
    polyfillCSSVarsForIE11();
    return x;
  });
```

### CSS Calc

Various bugs exists around `calc` support in IE11 (see https://caniuse.com/#feat=calc). We work around most of them by pre-transforming `calc` values using `postcss-calc-function`. Some css attributes might have an issue if you use `css-variables` inside `calc`.

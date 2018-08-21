---
title: Plugins Overview
permalink: /plugins/
toc: true
---

Plugins are the integration point between the Talk core code and custom
functionality. We provide methods to inject behavior into the server side and
the client side application to affect different parts of the application
life cycle.

## Server and Client Plugins

When you're adding a plugin to Talk, you can specify it in the `client` and/or
the `server` section. If you only want to enable the server side component of a
plugin, you simply only specify the plugin in the `server` section. If you only
want the client side plugin, the `client` section.

Plugins listed in the [Plugins Directory](/talk/plugins-directory/) will
indicate if they have/support a client/server plugin, and should be activated
accordingly.

## Plugin Registration

In order for a plugin to be active in a Talk install, it must be _registered_.
The parsing order for the plugin registration is as follows:

- `TALK_PLUGINS_JSON` environment variable
- `plugins.json` file
- `plugins.default.json` file

If you need to "disable all plugins", you can simply provide `{}` as the
contents of `TALK_PLUGINS_JSON` or the `plugins.json`.

The format for this is thus:

```json
{
  "server": [
    "people"
  ]
}
```

Where we have a `server` key with an array of plugins that match the folder
name in the `plugins/` folder. For example, the above config would
require a plugin from `plugins/people`, which must provide a `index.js` file
that returns an object that matches the Plugin Specification.

If the package is external (available on NPM) you can specify the string for
the version by using an object instead, for example:

```json
{
  "server": [
    {"people": "^1.2.0"}
  ]
}
```

External plugins can be resolved by running:

```bash
./bin/cli plugins reconcile
```

This achieves two things:

1. It will traverse into local plugin folders and install their dependencies.
  _Note that if the plugin is already installed and available in the
  node_modules folder, it will not be fetched again unless there is a version
  mismatch._ This will result in the project `package.json` and `yarn.lock`
  files to be modified, this is normal as this ensures that repeated deployments
  (with the same config) will have the same config, these changes should not be
  committed to source control.
2. It will seek out dependencies that are listed in the object notation and try
  to install them from npm.

## Plugin Dependencies

You may also include additional external dependencies in your local packages by
specifying a `package.json` at your plugin root which will result in a
`node_modules` folder being generated at the plugin root with your specific
dependencies.

## Deployment Solutions

Plugins can be deployed with a production instance of Talk.

### Source

Source deployments can just modify the `plugins.json` file and include any
local plugins into the `plugins/` directory. After including the config, you
need to reconcile the plugins and build the static assets:

```bash
# get plugin dependencies and remote plugins
./bin/cli plugins reconcile

# build static assets (including enabled client side plugins)
yarn build
```

Then the application can be started as is.

### Docker

If you deploy using Docker, you can extend from the `*-onbuild` image, an
example `Dockerfile` for your project could be:

```Dockerfile
FROM coralproject/talk:4.5-onbuild
```

Where the directory for your instance would contain a `plugins.json` file
describing the plugin requirements and a `plugins` directory containing any
other local plugins that should be included.

Onbuild triggers will execute when the image is building with your custom
configuration and will ensure that the image is ready to use by building all
assets inside the image as well.

For more information on the onbuild image, refer to the
[Installation from Docker](/talk/installation-from-docker/) documentation.

## Recipes

Recipes are plugin templates provided by the Coral Core team. Developers can use
these recipes to build their own plugins. You can find all the Talk recipes
here: [github.com/coralproject/talk-recipes](https://github.com/coralproject/talk-recipes/).

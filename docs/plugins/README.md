# Plugins

The talk platform ships with a plugin architecture featuring that allows
developers to:

* extend or replace server side graph, rest and auth functionality
* inject functionality into front end embeds and the admin application
* create new front end build targets for embedding
* build plugins from local folders or published via npm/yarn
* deploy plugins throughout the application lifecycle

## Basic Concepts

All plugin code lives in the `/plugin` directory.

Each plugin is provided in a single folder named after the plugin.

### Naming a Plugin

Each plugin has a name which must be globally unique. Plugins with name
collisions will not be able to be run together in an instance of Talk.

If you are creating a plugin for the open source community, we recommend the
following naming convention:

```
coral-talk-plugin-[name]
```

If you are creating a variant of a plugin for an organization, we recommend
adding the organization's name:

```
coral-talk-plugin-[name]-[organization]
```

## Plugin Registration

In order for a Plugin to be active it must be _registered_.

The parsing order for the plugin registration is as follows:

- `TALK_PLUGINS_JSON` environment variable
- `plugins.json` file
- `plugins.default.json` file

If you need to "disable all plugins", you can simply provide `{}` as the
contents of `process.env.TALK_PLUGINS_JSON` or the `plugins.json`.

### Local Plugins

The format for plugins.json looks like this:

```json
{
  "server": [
    "coral-plugin-respect",
    "coral-plugin-facebook-auth"
  ],
  "client": [
    "coral-plugin-respect"
  ]
}
```

The `server` array specifies which plugins will be loaded when the server
starts. The `client` array specifies which plugins will be built into the
front end bundles.

Where we have a `server` key with an array of plugins that match the folder
name in the `plugins/` folder. For example, the above config would
require a plugin from `plugins/coral-plugin-respect` and
`plugins/coral-plugin-facebook-auth`.

### Published Plugins

If the package is external (available on NPM) you can specify the string for
the version by using an object instead, for example:

```json
{
  "server": [
    {"people": "^1.2.0"}
  ]
}
```

### Resolving Plugins

External plugins can be _resolved_ by running:

```bash
./bin/cli plugins reconcile
```

This achieves two things:

1. It will traverse into local plugin folders and install their dependencies.
  _Note that if the plugin is already installed and available in the node_modules folder, it will not be
  fetched again unless there is a version mismatch._ This will result in the
  project `package.json` and `yarn.lock` files to be modified, this is normal as
  this ensures that repeated deployments (with the same config) will have the
  same config, these changes should not be committed to source control.
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
# get plugin dependancies and remote plugins
./bin/cli plugins reconcile

# build staic assets (including enabled client side plugins)
yarn build
```

Then the application can be started as is.

If you are working on a plugin, our changes to the plugins will be picked up
naturally by our development scripts:

```bash
# Watch for changes to client files and rebuild
yarn build-watch
```

```bash
# Watch for changes to server files and restart
yarn dev-start
```


### Docker

If you deploy using Docker, you can extend from the `*-onbuild` image, an
example `Dockerfile` for your project could be:

```Dockerfile
FROM coralproject/talk:latest-onbuild
```

Where the directory for your instance would contain a `plugins.json` file
describing the plugin requirements and a `plugins` directory containing any
other local plugins that should be included.

Onbuild triggers will execute when the image is building with your custom
configuration and will ensure that the image is ready to use by building all
assets inside the image as well.

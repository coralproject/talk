---
title: Configuration with CLI tools in Version 5
sidebar_label: CLI Tools
---

Coral’s CLI tooling has been reinvented in version 5. We’ve replaced the former `./bin/cli` tools with a completely new CLI application which is available on GitHub at: https://github.com/coralproject/coral-cli

The new CLI was built on `oclif` ([View on GitHub](https://github.com/oclif)), the open source CLI Framework originally built by Heroku, and offers an extensible platform for interacting with Coral via CLI.

## Installation

To get started with the new CLI run:

```
npm install -g @coralproject/coral-cli
```

## Usage

Once installed, run:

```bash
coral-cli [COMMAND]
```

Below is a list of commands available:

```
CLI to interact with Coral

VERSION
  @coralproject/coral-cli/0.2.0 darwin-x64 node-v11.9.0

USAGE
  $ coral-cli [COMMAND]

COMMANDS
  help     display help for coral-cli
  login    grabs a token for interacting with Coral
  logout   removes credentials for logging in with Coral
  plugins  list installed plugins
  story    manage stories on Coral
  tenant   creates a new tenant
  token    creates tokens on the current user
```

### `coral-cli help [COMMAND]`

Displays help for `coral-cli`, or for the command specified.

```
USAGE
  $ coral-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

### `coral-cli login`

Grabs a session token for interacting with a specific Coral installation. Can be used to create a session prior to running other commands.

```
USAGE
  $ coral-cli login

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
```

### `coral-cli logout`

Removes credentials for logging in with Coral and terminates current login session.

```bash
USAGE
  $ coral-cli logout

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
```

### `coral-cli plugins`

Not to be confused with "Talk Plugins" that were available in prior versions of Coral, `coral-cli plugins` are extensions to the `coral-cli` application. See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins). Use this command to the list installed plugins.

```
USAGE
  $ coral-cli plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ coral-cli plugins
```

### `coral-cli plugins:install [PLUGIN]`

Installs a plugin into the CLI. Can be from npm or a git url. See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins)

_NOTE: Installation of a user-installed plugin will override a core plugin. e.g. If you have a core plugin that has a `hello` command, installing a user-installed plugin with a `hello` command will override the core plugin implementation._

```
USAGE
  $ coral-cli plugins:install PLUGIN

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ coral-cli plugins:add

EXAMPLES
  $ coral-cli plugins:install myplugin
  $ coral-cli plugins:install https://github.com/someuser/someplugin
  $ coral-cli plugins:install someuser/someplugin
```

### `coral-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.
See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins)

```
USAGE
  $ coral-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

EXAMPLE
  $ coral-cli plugins:link myplugin
```

### `coral-cli plugins:uninstall PLUGIN`

Removes a plugin from the CLI. See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins)

```
USAGE
  $ coral-cli plugins:uninstall PLUGIN

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ coral-cli plugins:unlink
  $ coral-cli plugins:remove
```

### `coral-cli plugins:update`

Update installed plugins. See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins).

```bash
USAGE
  $ coral-cli plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

### `coral-cli story:get`

Fetches a story by `id` or `url`, useful to view Story metadata obtained by the scraper.

```
USAGE
  $ coral-cli story:get

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
  --id=id              find a story by ID
  --url=url            find a story by URL
```

### `coral-cli story:merge`

Merge duplicate stories and their comments into a single story. Story metadata & url are maintained on destination.

```
USAGE
  $ coral-cli story:merge

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
  --from=from          (required) source Story ID that will be merged from
  --into=into          (required) destination Story ID that will be merged into
```

### `coral-cli story:update`

Target a story by `id` to update its `url`.

```
USAGE
  $ coral-cli story:update

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
  --id=id              (required) the ID of the story to update
  --url=url            (required) the new URL to update the story to
```

### `coral-cli token:create`

Creates a persistent token for the current user (based on running `coral-cli login` above). The token generated can be used to authenticate API requests as the associated user.

```
USAGE
  $ coral-cli token:create

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
  --name=name          (required) name of the token
```

### `coral-cli token:list`

Lists tokens on the current user (based on running `coral-cli login` above).

```
USAGE
  $ coral-cli token:list

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
```

### `coral-cli token:revoke`

Revokes token by `id`. Token must be on the current user (based on running `coral-cli login` above).

```
USAGE
  $ coral-cli token:revoke

OPTIONS
  -d, --domain=domain  (required) domain for tenant to run command against
  --id=id              (required) id of the token to revoke
```

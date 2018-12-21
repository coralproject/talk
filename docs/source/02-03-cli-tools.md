---
title: Configuration with CLI tools
permalink: /configuration-cli-tools/
class: configuration
toc: true
---

Talk can be configured using CLI tools. The CLI tools are available through `./bin/cli`. Below is a list of commands available:
```
  Usage: cli [options] [command]

  Options:

    -h, --help  output usage information

  Commands:

    serve       serve the application
    db          run database commands
    settings    interact with the application settings
    assets      interact with assets
    setup       setup the application
    jobs        work with the job queues
    token       work with the access tokens
    users       work with the application auth
    migration   provides utilities for migrating the database
    plugins     provides utilities for interacting with the plugin system
    help [cmd]  display help for [cmd]
```

## Serving the application
To serve the application, run `./bin/cli serve`. Please check that you have installed the Talk before doing this step. Below is a list of additional options available for this command:
```
  Usage: cli-serve [options]

  Options:

    -j, --jobs              enable job processing on this thread
    --disabled-jobs <jobs>  disable jobs specified if the -j option is passed, specified as a comma separated list (default: )
    -w, --websockets        enable the websocket (subscriptions) handler on this thread
    -h, --help              output usage information
```

## Database commands
You can also run database commands using `./bin/cli db`. Below is a list of additional options available for this command:
```
  Usage: cli-db [options] [command]

  Options:

    -h, --help     output usage information

  Commands:

    createIndexes  creates the database indexes and waits until they are created
```

## Application settings
You can also change application settings using `./bin/cli settings`. Below is a list of additional options available for this command:
```
  Usage: cli-settings [options] [command]

  Options:

    -h, --help       output usage information

  Commands:

    change-org-name  change the organization name
```

## Interaction with assets
You can also interact with your application's assets using `./bin/cli assets`. Below is a list of additional options available for this command:
```
Usage: cli-assets [options] [command]

  Options:

    -h, --help                            output usage information

  Commands:

    list [options]                        list all the assets in the database
    refresh [age]                         queues the assets that exceed the age requested
    update-url <assetID> <url>            update the URL of an asset
    merge <srcID> <dstID>                 merges two assets together by moving comments from src to dst and deleting the src asset
    rewrite [options] <search> <replace>  rewrites asset url's using the provided regex replacement pattern
```

## Setting up the application
You can also run a setup wizard to setup the wizard using `./bin/cli setup`. Below is a list of additional options available for this command:
```
  Usage: cli-setup [options]

  runs the setup wizard to setup the application

  Options:

    --defaults  apply defaults for config instead of prompting
    -h, --help  output usage information
```

## Working with job queues
You can also work with job queues using `./bin/cli jobs`. Below is a list of additional options available for this command:
```
  Usage: cli-jobs [options] [command]

  Options:

    -h, --help         output usage information

  Commands:

    process            starts job processing
    cleanup [options]  cleans up inactive jobs
```

## Working with access tokens
You can also work with access tokens using `./bin/cli token`. Below is a list of additional options available for this command:
```
  Usage: cli-token [options] [command]

  Options:

    -h, --help                   output usage information

  Commands:

    list <userID>                list tokens for a user
    revoke <tokenID>             revokes a token with a given id
    create <userID> <tokenName>  create a token for a user with a given name
```

## Working with your application's authentication
You can also work with your application's authentication using `./bin/cli users`. Below is a list of additional options available for this command:
```
Usage: cli-users [options] [command]

  Options:

    -h, --help               output usage information

  Commands:

    create                   creates a local user
    delete <userID>          delete a user
    list                     searches for a user based on their stored username and email
    set-role <userID>        sets the role on a user
    verify <userID> <email>  verifies the given user's email address
```

## Migrating your database
Talk provides utilities for migrating your database using `./bin/cli migration`. Below is a list of additional options available for this command:
```
  Usage: cli-migration [options] [command]

  Options:

    -h, --help     output usage information

  Commands:

    create <name>  creates a new migration
    run [options]  runs all pending migrations
```

## Interacting with the plugin system
Talk provides utilities to interact with the plugin system using `./bin/cli plugins`. Below is a list of additional options available for this command:
```
  Usage: cli-plugins [options] [command]

  Options:

    -h, --help           output usage information

  Commands:

    create               creates a seed plugin
    list
    reconcile [options]  reconciles dependencies by downloading external plugins
```

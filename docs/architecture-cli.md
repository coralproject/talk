---
title: The Talk cli
keywords: architecture
sidebar: talk_sidebar
permalink: architecture-cli.html
summary:
---

Talk ships with a cli tool that allows access to a wide variety of functionality.

It is designed to provide a convenient way for engineers to perform key tasks without the need to muck about in the UI. It also opens the door for scripts to perform operations programmatically.

Note: the cli tool requires [the Talk environment to be configured](configuration.html) either via env vars or by using a `.cli` file via `bin/cli -c .env [command] ....`

## Using the cli

In a terminal, try:

```
/path/to/talk/bin cli [options] [commands] [arguments]
```

Commonly, you'll be in the `talk/` folder, in which case you can:

```
bin/cli [options] [commands] [arguments]
```

If you're a heavy cli user, consider adding the `bin` folder to your PATH so you can run `cli` from anywhere!

If you are using [our Docker environment](install-docker.html), the bin folder will already be in the PATH.

## What can I do with the cli?

The Talk cli ships with 'unix style' help. To access the docs, simply run the cli with insufficient arguments.

Let's say I wanted to figure out how to change a user's password. I'd start be seeing what the cli has for me.

(Note: the following output may change, please reference at the `--help` output for your version as you use the cli.)

```
talk :) ]$ bin/cli --help

  Usage: cli [options] [command]


  Commands:

    serve       serve the application
    settings    interact with the application settings
    assets      interact with assets
    setup       setup the application
    jobs        work with the job queues
    token       work with the access tokens
    users       work with the application auth
    migration   provides utilities for migrating the database
    plugins     provides utilities for interacting with the plugin system
    help [cmd]  display help for [cmd]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config [path]  Specify the configuration file to load
    --pid [path]         Specify a path to output the current PID to
```

Most commands contain sub-commands. Running with cli with such a command generates the docs for the sub-commands and options therein.

Change user password is likely to be in the `users` command group.

```
talk :) ]$ bin/cli users

  Usage: cli-users [options] [command]


  Commands:

    create [options]               create a new user
    delete <userID>                delete a user
    passwd <userID>                change a password for a user
    update [options] <userID>      update a user
    list                           list all the users in the database
    merge <dstUserID> <srcUserID>  merge srcUser into the dstUser
    addrole <userID> <role>        adds a role to a given user
    removerole <userID> <role>     removes a role from a given user
    ban <userID>                   ban a given user
    uban <userID>                  unban a given user
    disable <userID>               disable a given user from logging in
    enable <userID>                enable a given user from logging in

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -c, --config [path]  Specify the configuration file to load
    --pid [path]         Specify a path to output the current PID to
```

I now see that I can change a password like so:

```
bin/cli users passwd [userID]
```

You can also read these help prompts by [exploring the source code](https://github.com/coralproject/talk/blob/master/bin/cli).

### Usage Notes

If you haven't used a cli enabled system before, think of it like this: generally, you'd make a rest call, rpc, etc... to perform an action. The cli's api is designed in the same way, just for the audience of command line wielding engineers and scripts.

The best way to understand what the cli does is to explore the help commands. Uses of cli are also scattered through this documentation in context of their topics.

For some real world uses of the cli, see the scripts in the  [package.json file](https://github.com/coralproject/talk/blob/d688f70c19d8dee48371784009fd07322dae4eb5/package.json#L8).

## What's really going on when I run the cli?

The cli tool is a standalone application. Running it starts up the internals of a talk process, executes the given command, then shuts it down. No server functionality is enabled by cli commands unless specifically noted.

The cli tool _does not require a talk server to be running._ This means that you can execute commands, for example, during and installation process before starting the server. The also means that you can execute commands using varying configurations (via the `-c [.env file]` flag).

### Accessing existing Talk installs with the cli

You may use the cli tool to 'remotely' control existing talk installs.

This is accomplished by running the cli tool on any box using the mongo/redis/etc... credentials for the environment that you would like to act on. For example, if you want something to happen periodically on your production Talk install, you could set up a utility box with a cron job that triggers the cli with the same db/cache credentials. If you want to do something quick on a staging server, you could run the cli locally with staging credentials.

The cli tool will connect directly with the install's db and redis instance(s) so ensure that your box can reach those servers on the appropriate ports.

Also, _please ensure your cli and the server(s) in an environment are using the same version of Talk._

Please secure your environments and credentials or the cli tool becomes a convenient way for someone to own your system.

## Extending the cli

The Talk cli is based on the excellent [commander](https://github.com/tj/commander.js/) library.

At the time of writing, there are no plugin hooks for the cli tool. If you would like to change this, whether by writing code yourself or recommending a need, please [write and issue](https://github.com/coralproject/talk/blob/053b687959d45bcd682a1a2a4b604ebfab7441bb/CONTRIBUTING.md#writing-code).

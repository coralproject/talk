---
title: Plugins Quickstart
keywords: plugins
sidebar: talk_sidebar
permalink: plugins-quickstart.html
summary:
---

I would like to create a plugin that allows my CMS to update asset information.

## Setup the environment

Before I begin working on the plugin, I've installed [Talk from source](/install-source.html).

### Watch the Server

In a terminal, I run `yarn dev-start`. This command:

* starts my server, showing plugin and configuration information
* restarts it when I save files
* shows my temporary `console.log()` statements here
* shows real time access logs
* shows verbose debug output if enabled (more on this later)



### Watch the Client build process

In another window I run `yarn build-watch`. This command:

* builds the client side javascript bundles
* watches relevant files and rebuilds the bundle on change
* displays _compile time_ errors, including (the many) syntax errors I cause

If you need to run `yarn install`, you will see missing module error messages here.

### Watch from the Browser

I open up `http://localhost:3000` in a web browser and see the default comment stream. I then open the dev tools console which:

* shows any _run time_ errors/warnings generated on the front end.
* shows any temporary `console.log()` statements I add during development.

I also often toggle to the Network Tab to see:

* which files are being loaded
* requests sent from my front end code, including headers, the payload/queries sent and the data returned

## Create a home for my new plugin

I want to build this plugin locally, using source control and eventually publish it to npm.

### Create a repo

I create a new repo called `talk-plugin-asset-manager`. (I use github, but this you could store this anywhere, bitbucket, svn, etc...)

_make sure to respect the naming convention `talk-plugin-*`. This will allow for easy identification of the repo and, eventually, easy searching on npm._

### Set up a local file structure

I like to put my plugins in a directory next to talk, but you could put this anywhere.

```
cd ..
git clone https://github.com/jde/talk-plugin-asset-manager.git
```

### Register your plugin

Add the plugin to the plugins.json file:

```
{
  "server": [
    ...
    "talk-plugin-asset-manager"
  ],
  "client": [
    ...
    // no client side components so I won't add it here
  ]
}
```

But wait! Talk looks in `talk/plugins/[plugin-name]` for plugin code. Why couldn't we just add that plugin there?

We could have.

This would make it _a little_ easier to register, but _a lot_ harder to cleanly manage in version control. In order to avoid it being sucked into your Talk repo, you would have to manually `.gitignore` it or use [sub modules]() or something similar.

As a user of a Linux_y_ os, I prefer to create a symbolic link.

```
cd /path/to/talk/plugins
ln -s /path/to/your/plugin
```

or in this case:

```
cd ../talk/plugins
ln -s ../../talk-plugin-asset-manager
```

Now, as far as Talk knows, our plugin is right there in the folder. Git is wise, however, and will not include it in the Talk repo. Best of all, our `yarn dev-start` based watch statement follows symbolic links and will restart our sever each time a file is saved.

### Create the initial index file

All plugins contain server and/or client index files, which export all plugin functionality.

```
// talk-plugin-asset-manager/index.js
module.exports = {};
```

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

or in this case, from the directory create above:

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

## Build the feature!

Now that the plugin is set up I can get down to writing the feature. My goal is to allow my CMS to push new assets as they are created into Talk. To accomplish this, I will create a POST endpoint using Talk's [route api](plugins-server.html#field-router).

### Create a route

When designing my api, I want to be careful to avoid conflicts with not only the existing Talk api, but other plugins in the open source ecosystem that may be creating routes. To do this, I'll follow the golden rule of creating universals with plugins:

_Always namespace all universals with your plugin's unique name._

To ensure everything is hooked up, I'll log the request body (POST payload in this case) to the console and echo it as the response:

```
// talk-plugin-asset-manager/index.js
module.exports = {
  router(router) {
    router.post('/api/v1/asset-manager', (req, res) => {
      console.log(req.body);
      res.json(req.body);
    });
  }
}
```

When I save this file, I reflexively check my console to be sure that the server restarts.

To test that this works, I can:

```
$ curl -H "Content-Type: application/json" -X POST -d '{"url":"http://localhost:3000/my-article.html","title":"My Article"}' http://localhost:3000/api/v1/asset-manager
{"url":"http://localhost:3000/my-article.html","title":"My Article"}
```

After hitting the endpoint, I can also look at the terminal running `yarn dev-start` and see the access log and my `console.log()` statement:

```
{ url: 'http://localhost:3000/my-article.html',
  title: 'My Article' }
POST /api/v1/asset-manager 200 1.379 ms - 682309
```

### Save the asset

When I save this asset, I will use Talk's [asset model](https://github.com/coralproject/talk/blob/master/models/asset.js).

Mongo has a handy method [findOneAndUpdate](https://docs.mongodb.com/v3.2/reference/method/db.collection.findOneAndUpdate/) that will take care determining whether or not this asset exists, then either updating or inserting it. Whenever possible, we recommend using these atomic patterns that prevent multiple queries to the db and the efficiency problems and race conditions that they cause.

```
// talk-plugin-asset-manager/index.js

const AssetModel = require('models/asset');

module.exports = {
  router(router) {
    router.post('/api/v1/asset-manager', (req, res) => {

      const asset = req.body;
      const update = {$setOnInsert: {url: asset.url}};

      AssetModel.findOneAndUpdate(asset, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
      .then((asset) => res.json(asset));
    });
  }
}
```

I can now run the `curl` command as before, then see my new asset in my db!

We have an alpha version of our plugin!

### More work to be done

The purpose of this tutorial is to follow the full lifecycle of a plugin, from conception through publication into deployment. With that in mind we'll move forward with this alpha version.

Some things to make this production ready:

* refactoring to separate concerns,
* commenting,
* adding tests,
* validating data,
* [adding security](https://github.com/coralproject/talk/blob/b805451d376d2892c81c58d8822a85563e469b88/routes/api/users/index.js#L14)  
* incorporating [domain whitelisting](https://github.com/coralproject/talk/blob/b805451d376d2892c81c58d8822a85563e469b88/services/assets.js#L60).

It is important to realize that when you're writing a Talk plugin you are writing a program that may be touched by other devs and could grow in size and complexity. Bring your best engineering sensibilities to bear.

## Publishing the plugin


### Publish to npm

In order to [register](http://localhost:4000/plugins.html#plugin-registration) your _published_ plugin, you will need to [publish it to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Once the package is published, update `plugins.json` to use the published plugin:

```
{
  "server": [
    ...
    {"talk-plugin-asset-manager": "^0.1"}
  ],
  ...
}
```

Finally, run the `reconcile` script to install the plugin from npm.

```
$ bin/cli plugins reconcile
```

### Publish to version control

This plugin is open source, so I'm also going to [publish it to github](https://github.com/jde/talk-plugin-asset-manager/commit/66b626caa85cb8030b3ddaa7c1a4821bf01e350a) and [cut a release](https://github.com/jde/talk-plugin-asset-manager/releases/tag/v0.1) that mirrors the npm relese.

## Done!

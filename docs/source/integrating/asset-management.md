---
title: Asset Management
permalink: /integrating/asset-management/
---

One of the most frequent questions that we get asked by organizations trying to
integrate Talk is: _How do we hook our CMS up to Talk so that articles are in
sync?_

This guide is designed to explain the steps to take your base installation of
Talk and configure it to allow only assets pushed into it from your CMS, and
keep your URL/title in sync. We won't cover here how to install the plugin, as
it is covered in our [Plugins Overview](/talk/plugins/).

## Why do we need to create a plugin?

By default, Talk will use "Lazy Asset Creation" to dynamically generate Assets
in Talk in order to make it easier for lighter installations. In order to have
more strict control over this flow, we will create a plugin that will:


1. Disable "Lazy Asset Creation" by [Overriding a Resolver](#Overriding%20a%20Resolver).
2. Create Assets from our CMS by [Creating a New Asset Route](#Creating%20a%20New%20Asset%20Route).
3. Facilitate updates from our CMS to keep Talk in sync by [Creating an Asset Update Route](#Creating%20an%20Asset%20Update%20Route).

We will then modify our embed so that we can [Target the Asset](#Target%20the%20Asset).

But first we should grab our basic plugin structure:

```sh
# clone our example repo (that comes with all the code below!)
git clone https://github.com/coralproject/talk-plugin-asset-manager-example.git

# checkout the step-1 tag that starts us off with the basic file structure of
# the plugin.
git checkout step-1
```

## Overriding a Resolver

First we'll replace the content of the `resolver.js` file with the following:

```js
// We'll need to modify the behavior of how assets are
// "resolved" in Talk, so we override the base asset resolver
// for the RootQuery type.
module.exports = {
  RootQuery: {
    asset: async (root, args, ctx) => {
      // We'll grab the id of the asset being requested
      // such that we'll be able to lookup the asset.
      const { id } = args;
      if (!id) {
        // If the ID isn't provided, we don't want to do
        // anything.
        return null;
      }

      // A mouthful for sure, but we need to use the loader
      // that is available on the graph context in order to
      // lookup the asset by ID.
      const asset = await ctx.loaders.Assets.getByID.load(id);
      if (!asset) {
        // If the asset can't be found, we don't want to do
        // anything.
        return null;
      }

      // Send the asset back.
      return asset;
    },
  },
};
```

This serves to override the default asset resolver. You can of course, override
any other field in the schema to perform whatever action your business needs
require, including adding additional resolvers! You can refer to our
[GraphQL API Docs](/talk/reference/graphql/) to see what other fields you can
override.

Without this, Talk will continue to use the "Lazy Asset Creation" to handle
resolving the `asset` edge, which is what we want to change.

_Note, you can also get to this point by running `git checkout step-2`!_

## Creating a New Asset Route

In order to create Assets now, we have to get our CMS to push those into Talk,
the easiest way to do this is by creating a custom route. We won't cover
specific CMS integrations, but will assume that there is some type of webhook
system you are able to utilize that will trigger when a new article is created.

We'll replace the contents of the `router.js` file with the following:

```js
// This file we'll create routes that will facilitate asset creation and
// updates.

const authz = require('middleware/authorization');

module.exports = router => {
  // We'll respond to a POST request on the following route where the request
  // must have a valid ADMIN access token.
  router.post(
    '/api/v1/plugin/asset-manager-example',
    authz.needed('ADMIN'),
    async (req, res, next) => {
      // Get the graph context from the request.
      const { context } = req;

      // Grab from the graph context, the AssetModel that we can use to create
      // the new Asset. Lots of object destructuring here, but this lets us keep
      // the important business logic cleaner.
      const { connectors: { models: { Assets } } } = context;

      try {
        // Now we can create the asset that was passed to us in the body of the
        // request as JSON. Check the schema of the Asset model by looking at:
        // https://github.com/coralproject/talk/blob/master/models/asset.js
        await Assets.create(req.body);

        // Let your webhook callback know we got it!
        return res.status(204).end();
      } catch (err) {
        return next(err);
      }
    }
  );
};
```

This request handler when mounted on Talk will allow your CMS to send a POST
request to `${TALK_ROOT_URL}/api/v1/plugin/asset-manager-example` with the
Asset as a JSON payload. In order to protect the endpoint from abuse, we add the
authorization middleware. This middleware essentially says, _you must be an
admin to hit this route_. We need to generate a token that can be used by your
CMS using the Talk cli tool:

```sh
# find or create an admin user that can be used as the basis for the token
./bin/cli users list

# create a token for the user with the given id
./bin/cli token create ${USER_ID} cms-token
```

You can attach the generated token to the request a few ways:

1. HTTP Header:

        curl ${TALK_ROOT_URL}/api/v1/plugin/asset-manager-example \
            -XPOST \
            -H "Authorization: Bearer ${TOKEN}" \
            -H "Content-Type: application/json" \
            --data "${ASSET_JSON}"

2. Query Parameter:

        curl ${TALK_ROOT_URL}/api/v1/plugin/asset-manager-example?access_token=${TOKEN}
            -XPOST \
            -H "Content-Type: application/json" \
            --data "${ASSET_JSON}"

Where `${ASSET_JSON}` is the JSON for your Asset matching the
[AssetSchema](https://github.com/coralproject/talk/blob/master/models/asset.js).

_Note, you can also get to this point by running `git checkout step-3`!_

## Creating an Asset Update Route

Now imagine the situation where you decide that you want to change the url slug
of the page, or update the title, now Talk is out of sync! Let's fix that.

Update your `router.js` to the following:

```js
// This file we'll create routes that will facilitate asset creation and
// updates.

const authz = require('middleware/authorization');

module.exports = router => {
  // We'll respond to a POST request on the following route where the request
  // must have a valid ADMIN access token.
  router.post(
    '/api/v1/plugin/asset-manager-example',
    authz.needed('ADMIN'),
    async (req, res, next) => {
      // Get the graph context from the request.
      const { context } = req;

      // Grab from the graph context, the AssetModel that we can use to create
      // the new Asset. Lots of object destructuring here, but this lets us keep
      // the important business logic cleaner.
      const { connectors: { models: { Assets } } } = context;

      try {
        // Now we can create the asset that was passed to us in the body of the
        // request as JSON. Check the schema of the Asset model by looking at:
        // https://github.com/coralproject/talk/blob/master/models/asset.js
        await Assets.create(req.body);

        // Let your webhook callback know we got it!
        return res.status(204).end();
      } catch (err) {
        return next(err);
      }
    }
  );

  // We'll respond to a PUT request on the following route where the request
  // must also have a valid ADMIN access token.
  router.put(
    '/api/v1/plugin/asset-manager-example/:id',
    authz.needed('ADMIN'),
    async (req, res, next) => {
      // Get the graph context from the request.
      const { context } = req;

      // Grab from the graph context, the AssetModel that we can use to update
      // the Asset. Lots of object destructuring here, but this lets us keep
      // the important business logic cleaner.
      const { connectors: { models: { Assets } } } = context;

      try {
        // Now we can lookup the asset we're updating and apply out updates to
        // the model atomically.
        const asset = await Assets.findOneAndUpdate(
          { id: req.params.id },
          req.body,
          {
            // We want to validate the model being updated.
            runValidators: true,
          }
        );
        if (!asset) {
          // The asset indicated by the ID wasn't found, let the webhook know!
          return res.status(404).end();
        }

        // Let your webhook callback know we got it!
        return res.status(204).end();
      } catch (err) {
        return next(err);
      }
    }
  );
};
```

As you can see from the previous step of [Creating a New Asset Route](#Creating%20a%20New%20Asset%20Route)
, we have added the new `PUT` route to the router. This is a simple addition
that allows your CMS to call into Talk when the asset has updated it's title,
it's url (or really anything in the [AssetSchema](https://github.com/coralproject/talk/blob/master/models/asset.js)) to keep the Talk Admin and links up to date.

Following the previous example, you can issue the request as follows:

```sh
curl ${TALK_ROOT_URL}/api/v1/plugin/asset-manager-example/${ASSET_ID} \
    -XPUT \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    --data "${ASSET_JSON}"
```

The difference from the previous curl example, is that this one changes the
method from a `POST` to a `PUT`, and we add the `${ASSET_ID}` to the end of the
url.

_Note, you can also get to this point by running `git checkout step-4`!_

## Target the Asset

Now that we have a way to create and update Assets, we now need a way to
reference it. One of the most important fields in the Asset model, is the `id`.
This `id` can be one generated from your CMS, or some other system, but must
be kept consistent.

When you install Talk, and visit the admin panel, we can see under
`/admin/configure` in the tab for Tech Settings, an embed snippet:

```html
<div id="coral_talk_stream"></div>
<script src="${TALK_ROOT_URL}static/embed.js" async onload="
  Coral.Talk.render(document.getElementById('coral_talk_stream'), {
    talk: '${TALK_ROOT_URL}'
  });
"></script>
```

We'll modify this to the following:

```html
<div id="coral_talk_stream"></div>
<script src="${TALK_ROOT_URL}static/embed.js" async onload="
  Coral.Talk.render(document.getElementById('coral_talk_stream'), {
    talk: '${TALK_ROOT_URL}',
    asset_id: '${ASSET_ID}'
  });
"></script>
```

Adding the `asset_id` parameter to the render function will accomplish a very
important task. It will provide Talk with the specific ID of the asset to
associate with the displayed page. This is important because even if you update
the URL in the future, the embed will still reference the correct Asset. The
`${ASSET_ID}` should be replaced by your CMS with the correct Asset id using
your desired scripting/templating tools.

At this point, you should have a fully built Talk plugin that can be paired with
some work on your CMS to create a fully integrated asset management pipeline!

To view the fully completed source code, visit
https://github.com/coralproject/talk-plugin-asset-manager-example.
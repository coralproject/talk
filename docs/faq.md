---
title: Frequently Asked Questions
sidebar: talk_sidebar
permalink: faq.html
summary:
---

### How are new stories/assets added to Talk? Is there an API?

There are three ways that new assets can make their way into Talk: _just in time_, _active_ and manual.

#### Just in Time asset creation

Talk ships with a _just in time_ mechanism that works out of the box without integration with any CMS or manual work needed.

The _just in time_ flow looks like this:

* Request comes in for a stream on an asset that doesn't yet exist.
* Talk screens the domain against the domain whitelist, fails if doesn't pass.
* Then, concurrently
  * Talk creates a new asset record and returns the stream data (which will be empty)
  * Schedules a job to scrape the new page and fill in asset information.

The scraping mechanism utilizes [metascraper](https://www.npmjs.com/package/metascraper) and is queued using the [Que](https://www.npmjs.com/package/kue). If your Talk deployments is configured to run separate job worker cluster, scraping will be performed by them.

#### Active (or push based) asset creation

If tighter CMS integration is required to push custom data into assets and/or keep data in sync as changes are made in a CMS an _active_ push based workflow must be implemented.

This is an ideal candidate for a plugin. If you are interested in working on it, please [contact us](https://coralproject.net/contact.html)!

#### Manual asset creation

Sometimes you want to load a lot of assets into the database. The most common use case for this is populating the database during an initial installation. We recommend writing a script that transforms the data from it's source and inserts it into the _assets_ collection.

For current schema information, please see the [asset model](https://github.com/coralproject/talk/blob/master/models/asset.js).

### Where are your http API docs?

Coral relies on GraphQL for the vast majority of it's client <-> server communication. All core queries, mutations and subscriptions are defined along with types and comments in our central [TypeDef](https://github.com/coralproject/talk/blob/master/graph/typeDefs.graphql). For plugin graph api typedefs, see each plugin's `/server/` directory.

In addition, Talk Server ships with [GraphiQL](https://github.com/graphql/graphiql). GraphiQL provides a full data layer IDE including interactive documentation. The autocompletes and documentation are populated from introspection meaning that Core _and plugin_ apis will be fully explorable.

To access GraphiQL:

* [Install Talk](install-source.html).
* Open http://localhost:3000/api/v1/graph/iql in your browser. (Note, your server an port may differ.)

### Where is documentation for a specific component?

We strive for clear inline documentation across our codebase, but have gaps. Contributions to documentation would be greatly appreciated and is a great way to start contributing to the project!

If you are considering changing a core component (aka, one that is not in a plugin), you are entering the realm of a core developer. We strongly ask that you reach out the coral team before forking and changing core code. We are glad to help talk through your product need and come up with a strategy for implementing as a plugin, or working with you to extend the plugin API for your use case.

### How do I contribue to these docs?

Contributions to the docs are much appreciated and a great way to get involved in the project.

Fork the Talk repo, clone it locally (no need to go through the install from source process), then:

```
cd docs
docker build --no-cache -t mydocs .
docker run -v "$PWD:/src" -p 4000:4000 mydocs serve -H 0.0.0.0
```

You can edit the files in docs with any editor and view the live updates in a browser by hitting `http://localhost:4000`.

Once you've made the changes, file a PR back to the `coralproject/talk` repo.

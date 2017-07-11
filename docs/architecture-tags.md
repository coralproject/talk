---
title: Tags
keywords: architecture
sidebar: talk_sidebar
permalink: architecture-tags.html
summary:
---

Tags are essentially strings that can be added to models. Currently, tags can be added to [Users, Comments and Assets](https://github.com/coralproject/talk/blob/ced449a1489d47c25d604020fa2e0b3b7a741353/graph/typeDefs.graphql#L144). If you would like to add tags to other models, you can extend this schema using [GraphQL hooks](plugins-server.html#graphql-hooks).

## Tag Definitions

When handling tags, the Talk Server references a set of definitions that describe how tags are handled. These definitions are keyed off the tag `name`, the simple string that is stored on items.

The schema for Tag definitions [can be found here](https://github.com/coralproject/talk/blob/3545bf01cd91044fdb738d337a0ac94d9f71fbc3/models/schema/tag.js).

Note that along with the `name`, tag definitions contains:

* `permissions` information about who can see and set the tag,
* `models` which `ITEM_TYPES` this tag can be applied to, and

Whenever a tag is 'handled' by the server, it references this definition to determine that tag's behavior.

See [Plugin API Documentation](plugins-server.html#field-tags) for more information.

### Creating a Tag Definition

Tag Definitions must be created in order for the system to determine what tags are permitted on the server side.

Tag Definitions do not contain any logic themselves but provide information that other parts of the system can use to specify which models a tag can be applied to (models) and perform authorization logic (permissions).

Take the tag created by `coral-plugin-offtopic` as an example.

```
// coral-plugin-offtopic/index.js
module.exports = {
  tags: [
    {
      name: 'OFF_TOPIC',
      permissions: {
        public: true,
        self: true,
        roles: []
      },
      models: ['COMMENTS'],
      created_at: new Date()
    }
  ]
};
```

This plugin allows users to self-report that their comment is "off topic" at the time of creation, then display a badge on those comments.

To accomplish this, the plugin creates the tag `OFF_TOPIC` with:

* `permissions.public: true` - will be sent over the wire to the client side
* `permissions.self: true` - can be added by the active user to themselves or assets they own
* `permissions.roles: []` - cannot be added by anyone based on their roles
* `models: ['COMMENTS']` - can only be added to COMMENTS (not to users/assets/etc...)

And [viola](https://youtu.be/Q0O9gFf-tiI?t=23s)! This tag is something that can only be created by the logged in user on their own comments and is sent over the wire to the client so it can display the badge.

## Tag Links

When tags are stored on objects in the database, they are represented by [TagLinks](https://github.com/coralproject/talk/blob/master/models/schema/tag_link.js).

A TagLinks says that `tag` was `assigned_by` a specific user at a specific time (`created_at`).

Note that the `tag` field in the TagLinkSchema is the full TagSchema itself. This allows for another level of flexibility. Server code may generate Tags on the fly, complete with programmatically generated permissions and item behaviors.

If a Tag definitions exists in the global/asset context then that definition will be used regardless of what is stored here. This allows high level controls on the behavior of tags, ensuring that plugins cannot produce unexpected definitions for already defined tags.

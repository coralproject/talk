---
title: Metadata
permalink: /docs/architecture/metadata/
---

_Metadata_ allows you to add fields to models that are not represented in the core schema.

## Goals

The metadata api is designed to satisfy two product goals:

* Give developers flexibility in extending datatypes.
* Protect core fields that are essential to Talk's operation.

## Design

Metadata is represented by an [subdocument in our Schemas](https://github.com/coralproject/talk/blob/c59c09e1f42c51eed3b0d57b7c2882fc7b5edc13/models/comment.js#L74). This takes advantage of Mongo's flexibility allowing for any data to be stored therein.

### Setting Metadata

Talk provides [a service layer](https://github.com/coralproject/talk/blob/c59c09e1f42c51eed3b0d57b7c2882fc7b5edc13/services/metadata.js) allowing developers to `set` and `unset` metadata on objects in a way similar to key-value stores.

Let's say that I want to add a custom field called `potency` to a comment.

```
const MetadataService = require('services/metadata');
const CommentModel = require('models/comment');

// Sets the property `potency` on the comment with `id=1`.
MetadataService.set(CommentModel, '1', 'potency', 42);
```

Note that the model passed here is the Model itself and not an individual comment object. This allows us to update the value on that document [in an atomic manner](https://github.com/coralproject/talk/blob/c59c09e1f42c51eed3b0d57b7c2882fc7b5edc13/services/metadata.js#L60) for efficiency and to prevent race conditions.

### Accessing Metadata

The metadata api does not contain a `get` method. The metadata object is retrieved via database queries along with the rest of the data.

## Metadata and the Graph

One of the first principles of GraphQL is that the shape of the graph does not need to be the same as the shape of the data in the database. In fact, it probably shouldn't be.

This enables us to treat metadata fields in any way that makes sense as we design our Graph. The fact that a value is stored in the metadata object is an implementation detail invisible to the front end.

Take for example, the `reason` field in the `FlagAction` type. This stores the user provided reason why they flagged a comment. As far as the front end knows, it's [just another field](https://github.com/coralproject/talk/blob/c59c09e1f42c51eed3b0d57b7c2882fc7b5edc13/graph/typeDefs.graphql#L453) alongside the core fields:

```
# graph/typeDefs.graphql
type FlagAction implements Action {

  ...

  # The reason for which the Flag Action was created.
  reason: String

  ...
}
```

If, however, we [look at the resolver](https://github.com/coralproject/talk/blob/a47e2378e96f34f25447782f3e7ce59fa48ec791/graph/resolvers/dont_agree_action.js) for that field, we see that `reason` is [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) from the metadata object and returned.

```
// graph/resolvers/dont_agree_action.js
const DontAgreeAction = {

  // Stored in the metadata, extract and return.
  reason({metadata: {reason}}) {
    return reason;
  }
};

module.exports = DontAgreeAction;
```

This is an extremely powerful pattern as it allows us absolute freedom in designing our graph and complete isolation of the added fields in the database.

## Some things to keep in mind

### Namespace your metadata fields

Since metadata can be added by the core and multiple plugins, collisions may occur. As you create your plugins, please be careful to pick unique names for metadata fields. We recommend namespacing all your fields in a subdocument named after your plugin.

```
[model].metadata.[your_plugin_name].[the_field]
```

### Querying by metadata fields

We currently do not have a clean way to index metadata fields. As a result queries that match against metadata fields will not scale. If you have a need to match, sort, etc... by a metadata field, [please let us know]({{ "/docs/development/contributing" | absolute_url }}#writing-code).

# Contributor's Guide

Welcome! We are very excited that you are interested in contributing to Coral.

This document is a companion to help you approach contributing. If it does not
do so, please [let us know how we can improve it](https://github.com/coralproject/talk/issues)!

By contributing to this project you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [What should I Contribute?](#what-should-i-contribute)
- [Writing Code](#writing-code)
  - [When should I create an issue?](#when-should-i-create-an-issue)
  - [What should I include?](#what-should-i-include)
- [Localization](#localization)
- [Contributing To Our Docs](#contributing-to-our-docs)
- [Understanding GraphQL Types](#understanding-graphql-types)
  - [Custom Defined `type`'s:](#custom-defined-types)
  - [`enum` Types](#enum-types)
  - [Mutation Types](#mutation-types)
  - [Access Permissions On Types](#access-permissions-on-types)
  - [Arrays of Items](#arrays-of-items)
  - [Commenting Types and Properties](#commenting-types-and-properties)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What should I Contribute?

There are at least three ways to contribute to Coral:

- Writing Code
- Providing Translations

## Writing Code

Conversation surrounding contributions begins in
[issues](https://github.com/coralproject/talk/issues).

### When should I create an issue?

File an issue as soon as you have an idea of something you'd like to contribute.
We would love to hear what you're thinking and help refine the idea to make it
into the Coral ecosystem.

Please file issues if you would like to contribute to Coral.

### What should I include?

Coral has adopted an iterative, agile development philosophy. All contributions
that make it into the Coral repository should start with a user story in this
form:

> As a [type of Coral user] I'd like to [do something] so that I can [get some result/value].

This exercise does two things:

- allows us to ground our technical choices in a clear, simple product need.
- expresses that product need in a way that doesn't imply a specific technical
  solution allowing for debate as to the best way to solve the problem.

Please feel free to provide as much detail as possible when filing the issue but
please do keep the initial issue specific to one need and try to avoid including
technical or design solutions.

If you have a specific technical or design solution in mind, please submit it as
the first comment on the thread.

## Localization

We use the [fluent](http://projectfluent.org/) library and store our
translations in [FTL](http://projectfluent.org/fluent/guide/) files in
`src/locales/` and `src/core/server/locales/`.

Strings are added or removed from localization bundles in the translation files
as needed. Strings **MUST NOT** be _changed_ after they've been committed and
pushed to master. Changing a string requires creating a new ID with a new name
(preferably descriptive instead of incremented) and deletion of the obsolete ID.
It's often useful to add a comment above the string with info about how and
where the string is used.

Once a language has enough coverage, it should be added to
`src/core/common/helpers/i18n/locales.ts`.

The [Perspective API](https://github.com/conversationai/perspectiveapi/blob/master/2-api/methods.md#analyzecomment-request)
also supports comments in specific languages. When the language is supported in
Coral and supported by the Perspective API, the language should be added to the
language map in `src/core/server/services/comments/pipeline/phases/toxic.ts`.

## Contributing To Our Docs

Documentation that is publicly shown on [docs.coralproject.net](https://docs.coralproject.net/coral/) is stored under the `release/4` branch as it contains information for versions 4.0 onwards of Coral.

It was originally created for v4 and continues to serve all later versions of the Coral codebase.

To contribute new docs:
1. Pull down Coral's [talk repo](https://github.com/coralproject/talk)
1. Switch to the [release/4](https://github.com/coralproject/talk/tree/release/4) branch
1. Edit the docs located under the [docs](https://github.com/coralproject/talk/tree/release/4/docs) directory
1. Make a new branch off of `release/4`
1. Perform doc changes as needed
1. Push up your branch to GitHub
1. Request a PR via GitHub to merge your changes back into `release/4`

## Understanding GraphQL Types

There are many GraphQL types in our `schema.graphql` that define the way we handle data in our API. We'll try to outline a few of them here with examples to help you understand their uses.

### Custom Defined `type`'s:

Similar to defining an interface or a struct definition, GraphQL has flexible types that can be used to define data types that are used for querying data from the API. This retrieval can happen directly via a query, or after executing an action using a mutation and querying its response result.

An example of these types is the `Comment` and its nested `CommentRevision` type.

Comment:

```graphql
"""
Comment is a comment left by a User on an Story or another Comment as a reply.
"""
type Comment {
  """
  id is the identifier of the Comment.
  """
  id: ID!

  """
  body is the content of the Comment, and is an alias to the body of the
  `revision.body`.
  """
  body: String

  """
  revision is the current revision of the Comment's body.
  """
  revision: CommentRevision

  """
  revisionHistory stores the previous CommentRevision's, with the most recent
  edit last.
  """
  revisionHistory: [CommentRevision!]!
    @auth(
      roles: [MODERATOR, ADMIN]
      userIDField: "author_id"
      permit: [SUSPENDED, BANNED, PENDING_DELETION]
    )

  """
  status represents the Comment's current status.
  """
  status: COMMENT_STATUS!

  ...
}
```

Notice how the `Comment` type can nest more custom defined types. A `Comment` can have a current `CommentRevision` named `revision`. It also has a list of its historical `revisionHistory`.

CommentRevision:

```graphql
type CommentRevision {
  """
  id is the identifier of the CommentRevision.
  """
  id: ID!

  """
  comment is the reference to the original Comment associated with the current
  Comment.
  """
  comment: Comment!

  """
  actionCounts stores the counts of all the actions for the CommentRevision
  specifically.
  """
  actionCounts: ActionCounts! @auth(roles: [MODERATOR, ADMIN])

  """
  body is the content of the CommentRevision. If null, it indicates that the
  body text was deleted.
  """
  body: String
```

Another thing to note, see how `CommentRevision` is not only referenced by `revision` and `revisionHistory` on the `Comment` type. The `CommentRevision` also references back to its parent `Comment` via the `comment: Comment!` property.

This is how defined types interact between each other in the GraphQL schema.

Our naming scheme is upper camel case (also known as Pascal Case) for these types:

- Start with a capital letter
- Following characters are lower case
- Every new word in the type name begins with a new capital letter

### `enum` Types

In the previous example with the `Comment` type. We also had a property called `status` which was of type `COMMENT_STATUS`.

This is another kind of defined type, an `enum`. Most devs are familiar with enum's, but we have to cover them none-the-less.

COMMENT_STATUS:

```graphql
enum COMMENT_STATUS {
  """
  The comment is not PREMOD, but was not applied a moderation status by a
  moderator.
  """
  NONE

  """
  The comment has been approved by a moderator.
  """
  APPROVED

  """
  The comment has been rejected by a moderator.
  """
  REJECTED

  ...
}
```

Like all enum's this definition enumerates out typed, named values that are reusable for state elsewhere on other types.

Our naming scheme follows:

- All capitals
- Spaces delimited with underscores

This is because they are treated as shared constant values across the schema. Rather than storing strings or int's to capture selected state, we prefer using enum's.

### Mutation Types

Mutations are a request to GraphQL to initiate an action which will result in a response. As such,they're broken up into an `Input` and `Payload` pair that matches a mutation's request and response pair.

An example is the `CreateCommentInput` and `CreateCommentPayload`:

CreateCommentInput:

The input contains some parameters that allow us to execute the mutation. These are:

- storyID: ID!
  - The story we are submitting the comment to.
- body
  - The body of our comment.
- nudge
  - Whether we should return validation prompts to the user about improper comment language.
- clientMutationId
  - An identifier used by Relay, our front-end state cache to process the mutation request.

Note: Some of the properties have an `!` beside their type (i.e `storyID: ID!`). This indicates that the property is required and cannot be null. GraphQL will validate the input request for these properties and ensure they are provided during the GraphQL request.

Note: The `clientMutationId` is required on all mutation inputs and payload responses. It is used by Relay (our front end state cache) to process the requests efficiently. Just always use a required `String!` type for it and put it on all your inputs and payloads and you should be fine.

```graphql
"""
CreateCommentInput provides the input for the createComment Mutation.
"""
input CreateCommentInput {
  """
  nudge when true will instead return an error related to recoverable moderation
  faults such as a toxic comment or spam comment to provide user feedback to
  nudge the user to correct the comment.
  """
  nudge: Boolean = false

  """
  storyID is the ID of the Story where we are creating a comment on.
  """
  storyID: ID!

  """
  body is the Comment body, the content of the Comment.
  """
  body: String!

  """
  clientMutationId is required for Relay support.
  """
  clientMutationId: String!
}
```

CreateCommentPayload:

The returned response for a mutation is a what we call a Payload. This usually has a response that is the full data type of whatever was modified by the earlier called mutation action.

We have a few props from the payload, let's have a look:

- edge
  - We return the full comment edge that was created by the previous input. This is done so that the mutation request can query whatever it needs to from the returned input to update state on the client.
- clientMutationId
  - An identifier used by Relay (our front-end client state cache) to process the mutation request.

```graphql
"""
CreateCommentPayload contains the created Comment after the createComment
mutation.
"""
type CreateCommentPayload {
  """
  edge is the possibly created comment edge.
  """
  edge: CommentEdge!

  """
  clientMutationId is required for Relay support.
  """
  clientMutationId: String!
}
```

### Access Permissions On Types

Sometimes, you only want specific users to be allowed to view certain information. For instance, we have roles that are defined in our schema so we can filter who can have access to what.

These roles are used with directives on our schema that GraphQL then enforces when trying to resolve requests a user makes. If the user has the specified role associated with their signed-in account, they are given access to the requested data.

An example of this is the `revisionHistory` on the `Comment` type.

```graphql
  ...

  """
  revisionHistory stores the previous CommentRevision's, with the most recent
  edit last.
  """
  revisionHistory: [CommentRevision!]!
    @auth(
      roles: [MODERATOR, ADMIN]
      userIDField: "author_id"
      permit: [SUSPENDED, BANNED, PENDING_DELETION]
    )

  ...
```

Here we see an `@auth` directive.

- The roles that are allowed to access this information are `MODERATOR` and `ADMIN`.
- We let the directive know that the author of the comment is `author_id` from the `Comment` by defining the `userIDField`.
- We permit returning comments where the author's status is `SUSPENDED`, `BANNED`, or `PENDING_DELETION`.

These directives can be simpler, for example the `metadata` property on the `CommentRevision`.

```graphql
  ...

  """
  metadata stores details on a CommentRevision.
  """
  metadata: CommentRevisionMetadata! @auth(roles: [ADMIN, MODERATOR])

  ...
```

Here we see an auth directive with only roles defined. This is sufficient to make sure that the metadata property is only accessible to `ADMIN` and `MODERATOR` user roles.

Note: Wondering how the user roles are defined? They're simply an `enum` that is also defined in the schema.

```graphql
enum USER_ROLE {
  COMMENTER
  STAFF
  MODERATOR
  ADMIN
}
```

### Arrays of Items

Sometimes you don't want a singular property, your property is instead a collection of items.

The `revisionHistory` from the `Comment` is again useful as an example:

```graphql
  ...

  """
  revisionHistory stores the previous CommentRevision's, with the most recent
  edit last.
  """
  revisionHistory: [CommentRevision!]!

  ...
```

The interior type `CommentRevision` is required using the `!` and the outer array is also required using `!`.

We do this for a couple of reasons:

- This ensures that we do not return null/undefined values within the array.
  - Why would we return a null when we can just return nothing for null values?
- We want the array to always be defined, if empty, we return and empty array (i.e. `[]`).
  - This can be handled nicely in our resolvers. We simply check if the retrieved values is null or undefined and simply return an empty array in its stead.

These little tweaks aren't necessary, but they ease the consumability of our API by making the results for arrays predictable and strongly typed.

### Commenting Types and Properties

As you may have noticed, there is quite a bit of documentation in the schema examples listed here.

We typically follow these two rules in commenting our GraphQL types:

- Always comment the property within a type describing its purpose on its parent type

  i.e. `createdAt` on our `Setting` type:
  ```graphql
  """
  createdAt is the time that the Settings was created at.
  """
  createdAt: Time! @auth(roles: [ADMIN])
  ```

- Always comment the purpose of each type

  i.e. the `Comment` type:
  ```graphql
  """
  Comment is a comment left by a User on an Story or another Comment as a reply.
  """
  type Comment {
    ...
  }
  ```

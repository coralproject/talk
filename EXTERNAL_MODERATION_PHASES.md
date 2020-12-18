# External Moderation Phases Guide

This document is in reference to external moderation phases emitted by Coral.
You can configure external moderation phases on your installation of Coral by
visiting `/admin/configure/moderation/phases`.

Once you've configured a external moderation phase in Coral, you will start to
receive moderation requests in the form of a
[External Moderation Requests](#external-moderation-request) at the provided
callback URL. These will be in the form of `POST` requests with a `JSON`
payload.

When a comment is created or edited, it will be processed by moderation phases in
a predefined order. Any external moderation phase is run last, and only if all
other moderation phases before it do not return a status. The current set of
moderation phases is listed in order [here](https://github.com/coralproject/talk/blob/main/src/core/server/services/comments/pipeline/phases/index.ts).

Once you have received a moderation request, you must respond within the
provided timeout else the phase will be skipped and it will continue. It is
strongly recommended to [verify the request signature](#request-signing).

The external moderation phase must respond with one of the following:

1. Do not moderate the comment, and return a 204 without a body.
2. Perform a moderation action and return a 200 with a [External Moderation Response](#external-moderation-response)
   as a `JSON` encoded body containing the operations you want to perform on the
   comment.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Request Signing](#request-signing)
- [Schema](#schema)
  - [External Moderation Request](#external-moderation-request)
  - [External Moderation Response](#external-moderation-response)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Request Signing

Requests sent by Coral for external moderation phases use the same process as
those used by webhooks. Refer to the [webhooks documentation](WEBHOOKS.md#webhook-signing)
for instructions on how to verify signatures sent by Coral.

## Schema

### External Moderation Request

```ts
interface ExternalModerationRequest {
  /**
   * action refers to the specific operation being performed. If `NEW`, this
   * is referring to a new comment being created. If `EDIT`, then this refers to
   * an operation involving an edit operation on an existing Comment.
   */
  action: "NEW" | "EDIT";

  /**
   * comment refers to the actual Comment data for the Comment being
   * created/edited.
   */
  comment: {
    /**
     * body refers to the actual body text of the Comment being created/edited.
     */
    body: string;

    /**
     * parentID is the identifier for the parent comment (if this Comment is a
     * reply, null otherwise).
     */
    parentID: string | null;
  };

  /**
   * author refers to the User that is creating/editing the Comment.
   */
  author: {
    /**
     * id is the identifier for this User.
     */
    id: string;

    /**
     * role refers to the role of this User.
     */
    role: "COMMENTER" | "STAFF" | "MODERATOR" | "ADMIN";
  };

  /**
   * story refers to the Story being commented on.
   */
  story: {
    /**
     * id is the identifier for this Story.
     */
    id: string;

    /**
     * url is the URL for this Story.
     */
    url: string;
  };

  /**
   * site refers to the Site that the story being commented on belongs to.
   */
  site: {
    /**
     * id is the identifier for this Site.
     */
    id: string;
  };

  /**
   * tenantID is the identifer of the Tenant that this Comment is being
   * created/edited on.
   */
  tenantID: string;

  /**
   * tenantDomain is the domain that is associated with this Tenant that this
   * Comment is being created/edited on.
   */
  tenantDomain: string;
}
```

#### Example

New comment on a story:

```json
{
  "action": "NEW",
  "comment": {
    "body": "Here's a comment!",
    "parentID": null
  },
  "author": {
    "id": "baf4e943-3594-4fcc-b2ba-3e8de7a76352",
    "role": "COMMENTER"
  },
  "story": {
    "id": "245b3856-b0a0-4d2f-a6bb-58c71f18d6a6",
    "url": "http://localhost:1313/posts/a-story-url/"
  },
  "site": {
    "id": "a4bede88-2d2c-4424-bc18-4322a9e285a6"
  },
  "tenantID": "19ba5794-7eeb-4d46-a81b-c00c61672501",
  "tenantDomain": "localhost"
}
```

New reply on a comment on a story:

```json
{
  "action": "NEW",
  "comment": {
    "body": "Here's a reply!",
    "parentID": "d79b787f-f406-49a0-a179-72e3652e54be"
  },
  "author": {
    "id": "baf4e943-3594-4fcc-b2ba-3e8de7a76352",
    "role": "COMMENTER"
  },
  "story": {
    "id": "245b3856-b0a0-4d2f-a6bb-58c71f18d6a6",
    "url": "http://localhost:1313/posts/a-story-url/"
  },
  "site": {
    "id": "a4bede88-2d2c-4424-bc18-4322a9e285a6"
  },
  "tenantID": "19ba5794-7eeb-4d46-a81b-c00c61672501",
  "tenantDomain": "localhost"
}
```

### External Moderation Response

```ts
interface ExternalModerationResponse {
  /**
   * actions is an optional list of any flags to be added to this Comment.
   */
  actions?: Array<{
    actionType: "FLAG";
    reason: "COMMENT_DETECTED_TOXIC" | "COMMENT_DETECTED_SPAM";
  }>;

  /**
   * tags are any listed tags that should be added to the comment.
   */
  tags?: Array<"FEATURED" | "STAFF">;

  /**
   * status when provided decides and terminates the moderation process by
   * setting the status of the comment.
   */
  status?: "NONE" | "APPROVED" | "REJECTED" | "PREMOD" | "SYSTEM_WITHHELD";
}
```

#### Examples

Add a flag to a comment and do not set a status:

```json
{
  "actions": [{ "actionType": "FLAG", "reason": "COMMENT_DETECTED_TOXIC" }]
}
```

Reject a comment:

```json
{
  "status": "REJECTED"
}
```

Feature a comment and do not set a status:

```json
{
  "tags": ["FEATURED"]
}
```

Approve a comment and mark it as featured:

```json
{
  "status": "APPROVED",
  "tags": ["FEATURED"]
}
```

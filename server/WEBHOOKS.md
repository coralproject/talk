# Webhooks Guide

This document is in reference to webhooks emitted by Coral. You can configure
webhooks on your installation of Coral by visiting `/admin/configure/webhooks`.

Once you've configured a webhook endpoint in Coral, you will receive updates
from Coral when those events occur. These will be in the form of `POST` requests
with a `JSON` payload consisting of the schema represented below.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Webhook Signing](#webhook-signing)
  - [How to verify the signature(s)](#how-to-verify-the-signatures)
- [Schema](#schema)
- [Events Listing](#events-listing)
- [Events](#events)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Webhook Signing

Each webhook sent by Coral is signed by your webhook endpoint signing secret.
The signature method closely resembles the signing method used by Stripe for
their `v1` signing method. The `X-Coral-Signature` header contains one or more
signatures prefixed by `sha256=`.

If you receive a signature containing multiple signatures, it is typically when
you have rolled the signing secret from the administrative panel, and chosen to
keep the previous secret active for a duration of time.

### How to verify the signature(s)

```js
// Set your signing secret here from the administration panel.
const SIGNING_SECRET = "< YOUR SIGNING SECRET HERE >";

// We're using crypto to verify the signatures.
const crypto = require("crypto");

// We're using express to receive webhooks here.
const app = require("express")();

// Use the body-parser to get the raw body as a buffer so we can use it with the
// hashing functions.
const parser = require("body-parser");

function extractEvent(body, sig) {
  // Step 1: Extract signatures from the header.
  const signatures = sig
    // Split the header by `,` to get a list of elements.
    .split(",")
    // Split each element by `=` to get a prefix and value pair.
    .map(element => element.split("="))
    // Grab all the elements with the prefix of `sha256`.
    .filter(([prefix]) => prefix === "sha256")
    // Grab the value from the prefix and value pair.
    .map(([, value]) => value);

  // Step 2: Prepare the `signed_payload`.
  const signed_payload = body;

  // Step 3: Calculate the expected signature.
  const expected = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(signed_payload)
    .digest()
    .toString("hex");

  // Step 4: Compare signatures.
  if (
    // For each of the signatures on the request...
    !signatures.some(signature =>
      // Compare the expected signature to the signature on in the header. If at
      // least one of the match, we should continue to process the event.
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
  ) {
    throw new Error("Invalid signature");
  }

  // Parse the JSON for the event.
  return JSON.parse(body.toString());
}

app.post("/webhook", parser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["x-coral-signature"];

  let event;

  try {
    // Parse the JSON for the event.
    event = extractEvent(req.body, sig);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event.
  switch (event.type) {
    case "STORY_CREATED":
      const data = event.data;
      console.log(
        `A Story with ID ${data.storyID} and URL ${data.storyURL} was created!`
      );
      break;
    case "COMMENT_CREATED":
      // ... handle COMMENT_CREATED event
      break;
    case "COMMENT_REPLY_CREATED":
      // ... handle COMMENT_REPLY_CREATED event
      break;
    // ... handle other event types.
    default:
      // Unexpected event type
      return response.status(400).end();
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

app.listen(4242, () => console.log("Running on port 4242"));
```

The procedure of how to verify the signatures follows.

#### **Step 1**: Extract signatures from the header

Split the header using `,` as the separator, to get a list of elements. Then
split each of these elements using `=` as the separator, to get a prefix and
value pair. The value for the prefix `sha256` corresponds to the signature(s).

#### **Step 2**: Prepare the `signed_payload` string

You can do this by taking the string contents of the body (before parsing or the
request body).

#### **Step 3**: Calculate the expected signature

Compute an HMAC signature using the SHA256 hash function. You can use the
webhook endpoint's signing secret as the key, and the above calculated
`signed_payload` as the message.

#### **Step 4**: Compare signatures

Compare the signature(s) in the header to the expected signature. To protect
against timing attacks, ensure you use a constant-time string comparison
function when comparing signatures.

## Schema

```ts
{
  /**
   * id is the identifier for this event, each event
   * will have a unique id.
   */
  id: string;

  /**
   * type is the name of this event, this indicates
   * what is stored in the following `data` property.
   * Refer to the `Events List` below to see what the
   * type is for each event.
   */
  type: string;

  /**
   * data is the object representing this particular
   * event. Each type of event has a different shape
   * to the data property. Refer to the `Events List`
   * below to see what the data looks like for each
   * event.
   */
  data: object;

  /**
   * createdAt is the ISO 8601 representation of the
   * date when this event was created.
   */
  createdAt: string;

  /**
   * tenantID is the ID of the Tenant that this event originated at.
   */
  tenantID: string;

  /**
   * tenantDomain is the domain that is associated with this Tenant that this event originated at.
   */
  tenantDomain: string;
}
```

## Events Listing

- [`STORY_CREATED`](#story-created-event)
- [`COMMENT_CREATED`](#comment-created-event)
- [`COMMENT_REPLY_CREATED`](#comment-reply-created-event)

## Events

- <a id="story-created-event">**STORY_CREATED**</a>

```ts
{
  id: string;
  type: "STORY_CREATED";
  tenantID: string;
  tenantDomain: string;
  data: {
    /**
     * storyID is the ID of the newly created Story.
     */
    storyID: string;

    /**
     * storyURL is the URL of the newly created Story.
     */
    storyURL: string;

    /**
     * siteID is the Site that the newly created Story was created on.
     */
    siteID: string;
  }
  createdAt: string;
}
```

- <a id="comment-created-event">**COMMENT_CREATED**</a>

```ts
{
  id: string;
  type: "COMMENT_CREATED";
  tenantID: string;
  tenantDomain: string;
  data: {
    /**
     * storyID is the ID of the story on which the comment was created.
     */
    storyID: string;

    /**
     * siteID is the ID of the site to which the story belongs.
     */
    siteID: string

    /**
     * commentID is the ID of the newly created comment.
     */
    commentID: string;
  }
  createdAt: string;
}
```

- <a id="comment-reply-created-event">**COMMENT_REPLY_CREATED**</a>

```ts
{
  id: string;
  type: "COMMENT_REPLY_CREATED";
  tenantID: string;
  tenantDomain: string;
  data: {
    /**
     * commentID is the ID of the reply comment.
     */
    commentID: string;

    /**
     * storyID is the ID of the story on which the reply comment was made.
     */
    storyID: string;

    /**
     * siteID is the ID of the site to which the story belongs.
     */
    siteID: string;

    /**
     * ancestorIDs are the IDs of the ancestoral comments like parent, grandparent, etc
     */
    ancestorIDs: string[];
  }
  createdAt: string;
}
```

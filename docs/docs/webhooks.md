---
title: Webhooks
---

# Webhooks Guide

Webhooks are a powerful feature that allows you to subscribe to events in Coral and receive real-time updates via HTTP. This guide will walk you through configuring, verifying, and handling webhooks effectively.

## What Are Webhooks?

Webhooks enable your application to listen for specific events in Coral, such as when a story is created or a comment is posted. When these events occur, Coral sends an HTTP `POST` request to your configured webhook endpoint with a `JSON` payload containing event details.

For example, you can configure a webhook to notify your application whenever a new comment is created. This allows you to build integrations, automate workflows, or trigger custom actions based on Coral events.

## Configuring Webhooks

To configure webhooks in Coral:

1. Navigate to `/admin/configure/webhooks` in your Coral admin panel.
2. Add your webhook endpoint URL.
3. Save your changes.

Once configured, Coral will send event notifications to your endpoint.

## Webhook Signing

To ensure the integrity and authenticity of webhook requests, Coral signs each webhook using your webhook signing secret. The signature is included in the `X-Coral-Signature` header. This header contains one or more signatures prefixed by `sha256=`.

### Why Verify Signatures?

Verifying signatures ensures that the webhook request is genuinely from Coral and has not been tampered with. This is especially important for security when handling sensitive data.

### How to Verify Signatures

Here’s a step-by-step guide to verifying webhook signatures:

#### **Step 1**: Extract Signatures from the Header

The `X-Coral-Signature` header may contain multiple signatures, especially if you’ve rotated your signing secret. Split the header by `,` to get a list of elements, then split each element by `=` to extract the `sha256` signatures.

#### **Step 2**: Prepare the `signed_payload`

The `signed_payload` is the raw body of the webhook request. Ensure you use the unparsed body for this step.

#### **Step 3**: Calculate the Expected Signature

Use the HMAC-SHA256 algorithm to compute the expected signature. The signing secret is the key, and the `signed_payload` is the message.

#### **Step 4**: Compare Signatures

Compare the expected signature with the signatures from the header using a constant-time comparison function to prevent timing attacks.

Here’s an example implementation in Node.js:

```js
// Set your signing secret here from the administration panel.
const SIGNING_SECRET = "< YOUR SIGNING SECRET HERE >";

// Import required modules.
const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Middleware to parse raw body.
app.use(bodyParser.raw({ type: "application/json" }));

// Function to verify webhook signatures.
function verifySignature(body, sig) {
  const signatures = sig
    .split(",")
    .map((element) => element.split("="))
    .filter(([prefix]) => prefix === "sha256")
    .map(([, value]) => value);

  const expected = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(body)
    .digest("hex");

  if (
    !signatures.some((signature) =>
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
  ) {
    throw new Error("Invalid signature");
  }
}

// Webhook endpoint.
app.post("/webhook", (req, res) => {
  const sig = req.headers["x-coral-signature"];

  try {
    verifySignature(req.body, sig);
    const event = JSON.parse(req.body.toString());

    // Handle the event.
    switch (event.type) {
      case "STORY_CREATED":
        console.log(`Story created: ${event.data.storyID}`);
        break;
      case "COMMENT_CREATED":
        console.log(`Comment created: ${event.data.commentID}`);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(4242, () => console.log("Webhook server running on port 4242"));
```

## Testing Webhooks

Testing your webhook implementation is crucial to ensure it works as expected. Here are some tools you can use:

- **[Beeceptor](https://beeceptor.com/)**: Quickly create a mock endpoint to inspect incoming webhook requests.
- **[Pipedream](https://pipedream.com/requestbin)**: Set up a request bin to capture and debug webhook payloads.
- **[TypedWebhook.tools](https://typedwebhook.tools/)**: Test and validate webhook payloads with schema validation.

## Webhook Event Schema

Each webhook event has a specific schema. Here’s an example of the `STORY_CREATED` event:

```ts
{
  id: string;
  type: "STORY_CREATED";
  tenantID: string;
  tenantDomain: string;
  data: {
    storyID: string;
    storyURL: string;
    siteID: string;
  };
  createdAt: string;
}
```

Refer to the [Events Listing](#events-listing) section for details on other event types.

## Events Listing

Here are the supported events:

| Event Type                        | Description                                      |
|-----------------------------------|--------------------------------------------------|
| `STORY_CREATED`                   | Triggered when a new story is created.           |
| `COMMENT_CREATED`                 | Triggered when a new comment is created.         |
| `COMMENT_REPLY_CREATED`           | Triggered when a reply to a comment is created.  |
| `COMMENT_ENTERED_MODERATION_QUEUE`| Triggered when a comment enters moderation.      |
| `COMMENT_LEFT_MODERATION_QUEUE`   | Triggered when a comment leaves moderation.      |

For detailed schemas, see the [Events](#events) section.

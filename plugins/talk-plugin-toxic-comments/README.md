---
title: talk-plugin-toxic-comments
permalink: /plugin/talk-plugin-toxic-comments/
layout: plugin
plugin:
    name: talk-plugin-toxic-comments
    provides:
        - Server
        - Client
---

Using the [Perspective API](http://perspectiveapi.com/), this
plugin will warn users when comments exceed the predefined toxicity 
threshold. Toxic comments will be flagged and are held back from being posted until reviewed by a moderator. 

For more information on what Toxic Comments are, check out the [Toxic Comments](/talk/toxic-comments/) documentation, and you can see how the plugin works on [this blog post](https://coralproject.net/blog/toxic-avenging/).

Configuration:

- `TALK_PERSPECTIVE_API_KEY` (**required**) - The API Key for Perspective. You
  can register and get your own key at [http://perspectiveapi.com/](http://perspectiveapi.com/).
- `TALK_TOXICITY_THRESHOLD` - If the comments toxicity exceeds this threshold,
  the comment will be rejected. (Default `0.8`)
- `TALK_PERSPECTIVE_API_ENDPOINT` - API Endpoint for hitting the
  perspective API. (Default `https://commentanalyzer.googleapis.com/v1alpha1`)
- `TALK_PERSPECTIVE_TIMEOUT` - The timeout for sending a comment to
  be processed before it will skip the toxicity analysis, parsed by
  [ms](https://www.npmjs.com/package/ms). (Default `300ms`)
- `TALK_PERSPECTIVE_DO_NOT_STORE` - Whether the API stores or deletes the comment text and context from this request after it has been evaluated. Stored comments will be used for future research and community model building purposes to improve the API over time. (Default `true`) [Perspective API - Analyze Comment Request](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#analyzecomment-request)
- `TALK_PERSPECTIVE_SEND_FEEDBACK` - If set to `TRUE`, this plugin will send back moderation actions as feedback to [Perspective](http://perspectiveapi.com/) to improve their model. (Default `FALSE`)

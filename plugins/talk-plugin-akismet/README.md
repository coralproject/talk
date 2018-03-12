---
title: talk-plugin-akismet
permalink: /plugin/talk-plugin-akismet/
layout: plugin
plugin:
    name: talk-plugin-akismet
    provides:
        - Server
        - Client
---

Enables spam detection from [Akismet](https://akismet.com/). Comments will be passed to the Akismet API for spam detection. If a comment
is determined to be spam, it will prompt the user, indicating that the comment might be considered spam. If the user continues after this
point with the still spam-like comment, the comment will be reported as containing spam, and sent for moderator approval.

**Note: [Akismet](https://akismet.com/) is a premium service, charges may apply.**

Configuration:

- `TALK_AKISMET_API_KEY` (**required**) - The Akismet API key located on your account page.
- `TALK_AKISMET_SITE` (**required**) - The URL where you are embedding the comment stream on to provide context to Akismet. If you're hosting talk on https://talk.mynews.org/, and your news site is https://mynews.org/, then you should set this parameter to `https://mynews.org/`
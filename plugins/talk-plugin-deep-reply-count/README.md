---
title: talk-plugin-deep-reply-count
permalink: /plugin/talk-plugin-deep-reply-count/
layout: plugin
plugin:
    name: talk-plugin-deep-reply-count
    provides:
        - Server
---

The Deep Reply Count plugin will add a new graph edge, `Comment.deepReplyCount`
that will return the count of all descendant replies.

**Warning: Enabling the talk-plugin-deep-reply-count plugin introduces a significant
performance impact on larger sites, use with care.**
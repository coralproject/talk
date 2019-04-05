---
title: talk-plugin-featured-comments
permalink: /plugin/talk-plugin-featured-comments/
layout: plugin
plugin:
    name: talk-plugin-featured-comments
    default: true
    provides:
        - Server
        - Client
---

Enables the ability for Moderators to feature and un-feature comments via the
Stream and the Admin. Featured comments show in a first-place tab on the Stream
if there are any featured comments on that story.

When paired with the [talk-plugin-moderator-actions](/talk/plugin/talk-plugin-moderator-actions)
plugin, moderators will have the option of featuring comments from the comment
stream.

## Default Comments Tab

You can also change the default tab when rendering the comment stream to the
featured tab so when a user reaches a comment stream, they will see the featured
comments first by setting the [TALK_DEFAULT_STREAM_TAB](/talk/advanced-configuration/#talk-default-stream-tab)
variable to `talk-plugin-featured-comments`.

This is a **Build Variable** and must be consumed during build. If using the
[Docker-onbuild](/talk/installation-from-docker/#onbuild)
image you can specify it with `--build-arg TALK_DEFAULT_STREAM_TAB=talk-plugin-featured-comments`.

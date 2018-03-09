---
title: talk-plugin-comment-content
permalink: /plugin/talk-plugin-comment-content/
layout: plugin
plugin:
    name: talk-plugin-comment-content
    default: true
    provides:
        - Client
---

Pluginizes the text of a comment to support custom treatment of this text. This
plugin currently parses the given text to see if it contains a link, and makes
them clickable using
[react-linkify](https://www.npmjs.com/package/react-linkify).
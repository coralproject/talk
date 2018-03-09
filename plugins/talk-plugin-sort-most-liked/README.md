---
title: talk-plugin-sort-most-liked
permalink: /plugin/talk-plugin-sort-most-liked/
layout: plugin
plugin:
    name: talk-plugin-sort-most-liked
    depends:
        - name: talk-plugin-like
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the comments with the most `like` reactions first.
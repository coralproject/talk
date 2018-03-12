---
title: talk-plugin-sort-most-respected
permalink: /plugin/talk-plugin-sort-most-respected/
layout: plugin
plugin:
    name: talk-plugin-sort-most-respected
    default: true
    depends:
        - name: talk-plugin-respect
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the comments with the most `respect` reactions first.
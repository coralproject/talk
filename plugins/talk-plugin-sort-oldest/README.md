---
title: talk-plugin-sort-oldest
permalink: /plugin/talk-plugin-sort-oldest/
layout: plugin
plugin:
    name: talk-plugin-sort-oldest
    default: true
    depends:
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the oldest comments first.
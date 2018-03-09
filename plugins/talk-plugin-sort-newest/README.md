---
title: talk-plugin-sort-newest
permalink: /plugin/talk-plugin-sort-newest/
layout: plugin
plugin:
    name: talk-plugin-sort-newest
    default: true
    depends:
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the newest comments first.
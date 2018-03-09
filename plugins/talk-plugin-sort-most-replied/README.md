---
title: talk-plugin-sort-most-replied
permalink: /plugin/talk-plugin-sort-most-replied/
layout: plugin
plugin:
    name: talk-plugin-sort-most-replied
    default: true
    depends:
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the comments with the most replies first.
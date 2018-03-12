---
title: talk-plugin-sort-most-loved
permalink: /plugin/talk-plugin-sort-most-loved/
layout: plugin
plugin:
    name: talk-plugin-sort-most-loved
    depends:
        - name: talk-plugin-love
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
---

Provides a sort for the comments with the most `love` reactions first.
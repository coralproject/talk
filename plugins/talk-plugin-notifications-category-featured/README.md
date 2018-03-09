---
title: talk-plugin-notifications-category-featured
permalink: /plugin/talk-plugin-notifications-category-featured/
layout: plugin
plugin:
    name: talk-plugin-notifications-category-featured
    depends:
        - name: talk-plugin-notifications
        - name: talk-plugin-featured-comments
    provides:
        - Server
        - Client
---

When a comment is featured (via the
[talk-plugin-featured-comments](/talk/plugin/talk-plugin-featured-comments)
plugin), the user will receive a notification email.
---
title: talk-plugin-notifications-category-reply
permalink: /plugin/talk-plugin-notifications-category-reply/
layout: plugin
plugin:
    name: talk-plugin-notifications-category-reply
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

Replies made to each user will trigger an email to be sent with the notification
details if enabled.
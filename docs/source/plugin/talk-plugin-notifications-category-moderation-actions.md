---
title: talk-plugin-notifications-category-moderation-actions
permalink: /plugin/talk-plugin-notifications-category-moderation-actions/
layout: plugin
plugin:
    name: talk-plugin-notifications-moderation-actions
    default: true
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

When a comment that is initially withheld from publication and is then approved or rejected, the user will receive a notification email.

Configuration:
`TALK_MODERATION_NOTIFICATION_TYPES`. This plugin requires values to be set. Available options: `APPROVED`, `REJECTED` as a single string (comma separated).

---
title: talk-plugin-notifications-category-staff
permalink: /plugin/talk-plugin-notifications-category-staff/
layout: plugin
plugin:
    name: talk-plugin-notifications-category-staff
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

Replies made to each user by a staff member will trigger an email to be sent
with the notification details if enabled.

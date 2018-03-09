---
title: talk-plugin-notifications-digest-hourly
permalink: /plugin/talk-plugin-notifications-digest-hourly/
layout: plugin
plugin:
    name: talk-plugin-notifications-digest-hourly
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

Enables a digesting option for users to digest their notifications on an `HOURLY`
basis, where the notification batching occurs every hour in the
`America/New_York` timezone.
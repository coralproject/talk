---
title: talk-plugin-notifications-digest-daily
permalink: /plugin/talk-plugin-notifications-digest-daily/
layout: plugin
plugin:
    name: talk-plugin-notifications-digest-daily
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

Enables a digesting option for users to digest their notifications on an `DAILY`
basis, where the notification batching occurs every day at midnight in the
`America/New_York` timezone.
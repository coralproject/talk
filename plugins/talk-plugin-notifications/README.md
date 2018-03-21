---
title: talk-plugin-notifications
permalink: /plugin/talk-plugin-notifications/
layout: plugin
plugin:
    name: talk-plugin-notifications
    provides:
        - Server
        - Client
---

Enables the Notification system for sending out enabled email notifications to
users when they interact with Talk. By itself, this plugin will not send
anything. You need to enable one of the `talk-plugin-notifications-category-*` plugins.

Configuration:

- `DISABLE_REQUIRE_EMAIL_VERIFICATIONS` - When `TRUE`, it will disable the verification email check before sending notifications for those emails. **Note that organizations implementing a custom authentication system _must_ disable this feature, as they don't use our integrated auth**. (Default `FALSE`).
- `TALK_CLIENT_FORCE_NOTIFICATION_SETTINGS` - When `TRUE`, the settings pane for notifications will show always, even if the user does not have a `local` profile. (Default `FALSE`).

You can enable other notification options by adding more
`talk-plugin-notification-*` plugins!
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

- `TALK_DISABLE_REQUIRE_EMAIL_VERIFICATIONS_NOTIFICATIONS` - When `TRUE`, it will disable the verification email check before sending notifications for those emails. **Note that organizations implementing a custom authentication system _must_ disable this feature, as they don't use our integrated auth**. (Default `FALSE`).
- `TALK_CLIENT_FORCE_NOTIFICATION_SETTINGS` - When `TRUE`, the settings pane for notifications will show always, even if the user does not have a `local` profile. (Default `FALSE`).

You can enable other notification options by adding more
`talk-plugin-notification-*` plugins!

## Email Subjects

While it seems in your notification category plugin you can set the subject
line by adjusting the translation, Talk's default behavior is to add a prefix
before the subject of each email sent. This is always set to the
[TALK-EMAIL-SUBJECT-PREFIX](/talk/advanced-configuration/#TALK-EMAIL-SUBJECT-PREFIX)
configuration variable. You should change this parameter if you want to affect
how the subject is rendered.
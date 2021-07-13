---
title: Emails & Notifications
---

There are several email notifications included with Coral by default that will be sent to users based on user activity.

_NOTE: Notifications are only supported for users that have a valid email address! If you are using authenticate via Facebook, Google, or OpenIDConnect, user emails are not automatically required._

### Configuring SMTP

You must setup SMTP to send email notifications.
See our documentation on [Email SMTP Settings](/administration#email-smtp-settings) for reference.

When running in production we recommend using a 3rd party mail service provider like SendGrid or Mailgun.

### Notification Types

In addition to the comment activity notifications, Coral also provides users with several transactional notifications about their user profile.

Comment activity notifications are set to OFF for individual users by default, and commenters must opt-in to enable activity notifications. Commenters cannot enable notifications until they have verified their email, and are not able to opt-out of transactional notifications such as when a user has been Banned or Suspended.

#### Type: User Profile Notifications

- When a new Staff, Moderator, or Admin user is invited, sends invitation
- When any user registers, sends confirmation and email verification link
- When user requests password reset, sends reset link
- When user changes username, sends change confirmation
- When user changes their email address, sends change confirmation and email verification link
- When a user is banned or suspended, sends notice
- When comment history is ready for download (only one link can be generated every 7 days, and the link is valid for 24 hours), sends download link
- When user requests account deletion, cancels account deletion, or account deletion has been completed, sends confirmation

_NOTE: Users can not opt-out of User Profile Notifications_

#### Type: Comment Activity Notifications

Commenter users can subscribe to the following comment activity notifications:

- When one of my comments receives a reply
- When a Staff, Moderator, or Admin user replies to one of my comments
- When a Moderator Features one of my comments
- When one of my pending comments has been APPROVED or REJECTED

Commenters have 3 options for activity notification frequency:

- Immediately
- Hourly
- Daily

Immediately will send one email notification per occurrence, versus sending an hourly or daily summary with all occurrences listed.

### Email Templates

Email templates are text based and support translations. Many of the transactional emails can be modified by Moderators at the time of sending to provide additional context to users.

Coral does not currently support customizing email templates beyond the default templates.

To view the current email text strings for US English visit: https://github.com/coralproject/talk/blob/main/src/core/server/locales/en-US/email.ftl

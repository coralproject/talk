---
title: Notifications
permalink: /integrating/notifications/
---

There are several plugins included with Talk that once enabled will control how and when Talk sends emails to users based on user activity. Only basic user profile notifications are enabled by default. 

_NOTE: Notifications are only supported for users that have an email address in Talk! If you are using authenticate via Facebook, Google, or SSO and you want to persist the user’s email, you will also need to enable `talk-plugin-local-auth` ([See Authentication](/talk/integrating/authentication/))_

### Configuring SMTP

You must setup SMTP to send email notifications. The following ENV variables must be set:

```
TALK_SMTP_FROM_ADDRESS=email@email.com
TALK_SMTP_USERNAME=username
TALK_SMTP_PASSWORD=password
TALK_SMTP_HOST=smtp.domain.net
TALK_SMTP_PORT=2525
```

See our documentation on [setting env variables](/talk/advanced-configuration/#talk-smtp-from-address) for reference. 

When running Talk in production we recommend using a 3rd party mail service provider like SendGrid or MailGun. 

If you are having difficulty with your SMTP settings you can add `DEBUG=talk:jobs:mailer` to your .env to see additional logs from the mailer service.

All notifications require SMTP settings to be correctly configured first, then enable the corresponding plugin, and configure any settings in the Talk Admin. If SMTP is not enabled, it will log to the server console that some variables were not provided.

### Notification Types & Plugins

In addition to the core notifications included with Talk, some plugins add features that are supported by and will add additional types of email notifications. Commenters can opt-out of most email notifications, and comment activity notifications are set to OFF by default. Commenters cannot enable notifications until they have verified their email.

You can see a list of all the plugins related to notifications by visiting:
https://docs.coralproject.net/talk/plugins-directory/?q=notifications

#### Type: User Profile Notifications (Included by Talk core)

* When user registers, sends email confirmation and verification 
* When user requests password reset 
* When user changes username, sends confirmation
* When a user is banned or suspended

_NOTE: Users can not opt-out of User Profile Notifications_

#### Type: GDPR Notifications (optional)
`talk-plugin-profile-data:`
* When my comment history is ready for download (only one link can be generated every 7 days, and the link is valid for 24 hours)

`talk-plugin-local-auth:`
* When user changes their email address
* When a user adds a new email address 

#### Type: Comment Activity Notifications (optional)
Talk support 3 options for notification frequency for this type of notification: 
* immediately
* hourly 
* daily

`talk-plugin-notifications:`
* Enables notifications configuration (required for all comment activity notifications below)

`talk-plugin-notifications-category-reply:`
* When someone replies to my comment

`talk-plugin-notifications-category-staff-reply:`
* When a staff member replies to my comment

`talk-plugin-notifications-category-featured:`
* When my comment gets featured

### Notification Digests

Notification digests are enabled by enabling the corresponding plugin, otherwise comment activity notifications are sent immediately.
* `talk-plugin-notifications-digest-daily`
* `talk-plugin-notifications-digest-hourly`

Talk supports hourly and daily digests out the box, if you would like to create your own, refer to the below:

https://github.com/coralproject/talk/blob/9cc9969320dca47bb0f8f81e8d944ae4d19e548b/plugins/talk-plugin-notifications/server/connect.js#L69-L102
        

### Customizing Notifications

Enabling the `talk-plugin-notifications` creates a NotificationManager that creates and manages events send from the event emitter that is linked to the Graph API PubSub system. This allows the instance that received the mutation to also fire off a notification job that can be handled. It also enabels the `notifications` plugin hook. Any plugin that registers after the `talk-plugin-notifications` can export the notifications plugin to reference it.

See https://github.com/coralproject/talk/blob/8b669a31c551a042f0f079d8cfc16825673eb8f0/plugins/talk-plugin-notifications-reply/index.js for an example.


### Connect API

This exposes the `graph/connectors.js` via the `connect` hook.

```
  module.exports = {
    connect(connectors) {
      // use `connectors`, contents of https://github.com/coralproject/talk/blob/b758dc91cb1f1969ecd895b6059306b318995b33/graph/connectors.js#L104
    }
  }
```

See https://github.com/coralproject/talk/blob/90290cfa2de88e62f687e1ed0235ba6dfe4cde26/plugins/talk-plugin-notifications/server/connect.js for an example.
        
### Email Templates

Email templates are text based and support translations. If you would like to create a new email template, you can register it via the Connect API, see https://github.com/coralproject/talk/blob/8b669a31c551a042f0f079d8cfc16825673eb8f0/plugins/talk-plugin-notifications/server/connect.js#L12-L28### 

Any email template registered with the same name as another template will replace the existing template for that type of email.  _NOTE: that also means that the template data sent to each email template will __not__ change, so bear that in mind when designing templates that you may not have rich access to data._

An example of this is with the `talk-plugin-notifications-category-featured` plugin:

Notification translation is located: https://github.com/coralproject/talk/blob/dd0601a80132d2849c53ef7eaf12ff382f3920b9/plugins/talk-plugin-notifications-category-featured/translations.yml#L13

Where the template content is provided: https://github.com/coralproject/talk/blob/dd0601a80132d2849c53ef7eaf12ff382f3920b9/plugins/talk-plugin-notifications-category-featured/index.js#L79


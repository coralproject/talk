# Notifications


Talk currently supports 3 types of email notifications.


1. When someone replies to my comment
2. When a staff member replies to my comment
3. When my comment gets featured

Talk support 3 options for notification frequency: immediately, hourly or daily. Commenters can also opt-out of email notifications. Notifications are set to OFF by default.

Commenters cannot enable notifications until they have verified their email.

Note: Notifications are not currently supported for users that sign-up via Facebook or Google auth, or don't have an email attached to their account for any other reason.

### Configuring SMTP

You must setup SMTP to use notifications. The following ENV variables must be set:

```
TALK_SMTP_FROM_ADDRESS=email@email.com
TALK_SMTP_USERNAME=username
TALK_SMTP_PASSWORD=password
TALK_SMTP_HOST=smtp.domain.net
TALK_SMTP_PORT=2525
```

### Enabling Notifications

Enabling the `talk-plugin-notifications` creates a NotificationManager that creates and manages events send from the event emitter that is linked to the Graph API PubSub system.

Adding the `talk-plugin-notifications` plugin will also enable the `notifications` plugin hook. Any plugin that registers before the `talk-plugin-notifications` plugin will get picked up by.

See https://github.com/coralproject/talk/blob/8b669a31c551a042f0f079d8cfc16825673eb8f0/plugins/talk-plugin-notifications-reply/index.js for an example.

### Notification Categories

Talk currently supports the following Notifications options out of the box:

`talk-plugin-notifications-category-reply`
`talk-plugin-notifications-category-staff-reply`
`talk-plugin-notifications-category-featured`

### Notification Digests

Talk supports hourly and daily digests out the box, if you would like to create your own, refer to the below:

https://github.com/coralproject/talk/blob/9cc9969320dca47bb0f8f81e8d944ae4d19e548b/plugins/talk-plugin-notifications/server/connect.js#L69-L102
        
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

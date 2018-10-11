
# talk-plugin-slack-notifications
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-slack-notifications/)

```
    name: talk-plugin-slack-notifications
    provides:
        - Server
```


Enables all new comments that are written to be posted to a Slack channel as
well. Configure an
[Incoming Webhook](https://api.slack.com/incoming-webhooks)
app and provide that url in the form of the `SLACK_WEBHOOK_URL`
detailed below.

*Warning: On high volume sites, this means every single comment will flow into
Slack, if this isn't what you want, be sure to use the provided plugin as a
recipe to further customize the behavior*.

Configuration:

- `SLACK_WEBHOOK_URL` (**required**) - The webhook url that will be
  used to post new comments to.
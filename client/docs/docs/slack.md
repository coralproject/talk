---
title: Slack
sidebar_label: Moderating with Slack
---

Coral version 5.4+ supports built-in Slack integration to help you forward comments from your moderation queues into appropriate Slack channels.

## Creating a Slack App

To enable web hooks that we will use to forward comments, you'll need to create an App and give it permissions over a channel.

For details on how to create a Slack app with webhooks, please go to:

https://slack.com/intl/en-ca/help/articles/115005265063-incoming-webhooks-for-slack

After you have created a Slack app with a webhook, you can use it in your Coral configuration.

1. Sign into the administration side of your Coral deployment.
2. Select _Configure_ from the top navigation.
3. Select _Slack_ from the side navigation for the configuration area.
4. Here you can configure a Slack channel.
5. Paste in the webhook URL you created for your Slack app and select which comment categories you want to receive notifications for.

## I need to find the webhook URL again, where is it?

Webhooks options are tied to a Slack app and can be found under your app settings at:

https://api.slack.com/apps

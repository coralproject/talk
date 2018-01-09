---
title: Additional Plugins
permalink: /additional-plugins/
class: configuration
---

Talk ships with several plugins that aren't enabled by default:

{% include toc.html %}

These plugins can be enabled by consulting the
[Plugins Overview]({{ "/plugins/" | relative_url }}) page.

## talk-plugin-like

Source: [plugins/talk-plugin-like](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-like){:target="_blank"}

Enables a `like` reaction button.

## talk-plugin-sort-most-liked

Source: [plugins/talk-plugin-sort-most-liked](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-liked){:target="_blank"}

Requires: [talk-plugin-viewing-options]({{ "/default-plugins/#talk-plugin-viewing-options" | relative_url }}){:.param}, [talk-plugin-like](#talk-plugin-like){:.param}

Provides a sort for the comments with the most `like` reactions first.

## talk-plugin-love

Source: [plugins/talk-plugin-love](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-love){:target="_blank"}

Enables a `love` reaction button.

## talk-plugin-sort-most-loved

Source: [plugins/talk-plugin-sort-most-loved](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-loved){:target="_blank"}

Requires: [talk-plugin-viewing-options]({{ "/default-plugins/#talk-plugin-viewing-options" | relative_url }}){:.param}, [talk-plugin-love](#talk-plugin-love){:.param}

Provides a sort for the comments with the most `love` reactions first.

## talk-plugin-remember-sort

Source: [plugins/talk-plugin-remember-sort](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-remember-sort){:target="_blank"}

Requires: [talk-plugin-viewing-options]({{ "/default-plugins/#talk-plugin-viewing-options" | relative_url }}){:.param}

Enables saving a user’s last sort selection as they browse other articles.

## talk-plugin-deep-reply-count

Source: [plugins/talk-plugin-deep-reply-count](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-deep-reply-count){:target="_blank"}

Enables counting of comments to include replies via a new graph edge. Not
recommended for large installations as it will unreasonably reduce the query
efficiency to compute this number.

## talk-plugin-slack-notifications

Source: [plugins/talk-plugin-slack-notifications](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-slack-notifications){:target="_blank"}

Enables all new comments that are written to be posted to a Slack channel as
well. Configure an
[Incoming Webhook](https://api.slack.com/incoming-webhooks){:target="_blank"}
app and provide that url in the form of the `SLACK_WEBHOOK_URL`
detailed below.

*Warning: On high volume sites, this means every single comment will flow into
Slack, if this isn't what you want, be sure to use the provided plugin as a
recipe to further customize the behavior*.

Configuration:

- `SLACK_WEBHOOK_URL` (**required**) - The webhook url that will be
  used to post new comments to.

## talk-plugin-toxic-comments

Source: [plugins/talk-plugin-toxic-comments](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-toxic-comments){:target="_blank"}

Using the [Perspective API](http://perspectiveapi.com/){:target="_blank"}, this
plugin will warn users and reject comments that exceed the predefined toxicity
threshold. For more information on what Toxic Comments are, check out the
[Toxic Comments]({{ "/toxic-comments/" | relative_url }}) documentation.

Configuration:

- `TALK_PERSPECTIVE_API_KEY` (**required**) - The API Key for Perspective. You
  can register and get your own key at [http://perspectiveapi.com/](http://perspectiveapi.com/){:target="_blank"}.
- `TALK_TOXICITY_THRESHOLD` - If the comments toxicity exceeds this threshold,
  the comment will be rejected. (Default `0.8`)
- `TALK_PERSPECTIVE_API_ENDPOINT` - API Endpoint for hitting the
  perspective API. (Default `https://commentanalyzer.googleapis.com/v1alpha1`)
- `TALK_PERSPECTIVE_TIMEOUT` - The timeout for sending a comment to
  be processed before it will skip the toxicity analysis, parsed by
  [ms](https://www.npmjs.com/package/ms){:target="_blank"}. (Default `300ms`)
- `TALK_PERSPECTIVE_DO_NOT_STORE` - Whether the API is permitted to store comment and context from this request. Stored comments will be used for future research and community model building purposes to improve the API over time. (Default `true`) [Perspective API - Analize Comment Request](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#analyzecomment-request){:target="_blank"}

## talk-plugin-subscriber

Source: [plugins/talk-plugin-subscriber](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-subscriber){:target="_blank"}

Enables a `Subscriber` badge to be added to comments where the author has the
`SUBSCRIBER` tag. This must match with a custom auth integration that adds the
tag to the users that are subscribed to the service.

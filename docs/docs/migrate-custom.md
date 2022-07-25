---
title: "Migrating from Talk v4.x to Coral v7+: Replacing plugin functionality"
---

Coral v7+ does not support custom plugins, however there are other options for customizing the functionality of the platform to suit your use cases. The functionality from all of the [default plugins](https://legacy.docs.coralproject.net/talk/plugins-directory/?q=default) is now built in to Coral.

## External Moderation Phases

External Moderation Phases allow you to hook into Coral's moderation pipeline and make moderation decisions programatically. If you were using a plugin to integrate with any automated moderation tools in v4, you would use an external moderaiton phase for that in v7+.

[Read more about external moderation phases](/external-moderation-phases)

## Webhooks

Coral emits webhooks for Story Creation, Comment Creation, and Comment Reply Creation. You can configure Coral to send a webhook to a custom endpoint for any or all of these events.

[Read more about webhooks](/webhooks)

## Custom CSS

Most visual customizations or most customizations to show or hide elements of the stream UI can be achieved thorugh custom CSS.

[Read more about custom CSS](/css)

## Replacements for specific plugins

### talk-plugin-slack-notifications

[Configure slack integration](/slack)

### talk-plugin-akismet

[Configure spam detection](/administration#spam-detection-filter)

### talk-plugin-comment-content

Coral v7 supports pasted links in comment content if they are valid. You can configure pre-moderation for all comments containing links via **Configuration > Moderation > Comments**.

### talk-plugin-comment-count

Coral v7 includes a script that will embed comment counts for a story on a given page via JSONP.
[Learn more about the count script](/counts)

### talk-plugin-toxic-comments

[Configure the Toxic Comments Filter](/administration#toxic-comment-filter)

### talk-plugin-rich-text

Coral v7 includes optional rich-text by default, configure via **Configuration > General > Rich-text Comments**

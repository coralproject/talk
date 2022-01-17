# Replacing plugin functionality

Coral v6+ does not support custom plugins, however there are other options for customizing the functionality of the platform to suit your use cases.

## External Moderation Phases

External Moderation Phases allow you to hook into Coral's moderation pipeline and make moderation decisions programatically. If you were using a plugin to integrate with any automated moderation tools in v4, you would use an external moderaiton phase for that in v6+.

[Read more about external moderation phases]()

## Webhooks

Coral emits webhooks for Story Creation, Comment Creation, and Comment Reply Creation. You can configure Coral to send a webhook to a custom endpoint for any or all of these events.

[Read more about webhooks]()

## Custom CSS

Most visual customizations or most customizations to show or hide elements of the stream UI can be achieved thorugh custom CSS.

[Read more about custom CSS](https://docs.coralproject.net/css)

## Replacements for specific plugins

### Slack bouncer

[Configure slack integration](https://docs.coralproject.net/slack)

### Akismet

[Configure spam detection](https://docs.coralproject.net/administration#spam-detection-filter)

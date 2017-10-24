---
title: Default Plugins
permalink: /default-plugins/
class: configuration
---

The default Talk plugins can be found in the `plugins.default.json` file
[here](https://github.com/coralproject/talk/blob/master/plugins.default.json).

Talk ships out of the box with these plugins enabled:

{% include toc.html %}

We ship [Additional Plugins]({{ "/additional-plugins/" | relative_url }}) with
Talk that are not enabled by default. You can enable these or disable these
default plugins by consulting the [Plugins Overview]({{ "/plugins/" | relative_url }})
page.

## talk-plugin-auth

Source: [plugins/talk-plugin-auth](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-auth){:target="_blank"}

Enables generic registration via an email address, a username, a password, and a
password confirmation. To sync Talk auth with your own auth systems, you can use
this plugin as a template.

## talk-plugin-facebook-auth

Source: [plugins/talk-plugin-auth](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-auth){:target="_blank"}

Requires: [talk-plugin-facebook-auth](#talk-plugin-facebook-auth){:.param}

Enables sign-in via Facebook via the server side passport middleware.

Configuration:

- [TALK_FACEBOOK_APP_ID]({{ "/configuration/#talk_facebook_app_id" | relative_url }}){:.param} (**required**) - See the existing documentation for the [TALK_FACEBOOK_APP_ID]({{ "/configuration/#talk_facebook_app_id" | relative_url }}){:.param}.
- [TALK_FACEBOOK_APP_SECRET]({{ "/configuration/#talk_facebook_app_secret" | relative_url }}){:.param} (**required**) - See the existing documentation for the [TALK_FACEBOOK_APP_SECRET]({{ "/configuration/#talk_facebook_app_secret" | relative_url }}){:.param}.

## talk-plugin-featured-comments

Source: [plugins/talk-plugin-featured-comments](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-featured-comments){:target="_blank"}

Enables the ability for Moderators to feature and un-feature comments via the
Stream and the Admin. Featured comments show in a first-place tab on the Stream
if there are any featured comments on that story.

## talk-plugin-respect

Source: [plugins/talk-plugin-respect](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-respect){:target="_blank"}

Enables a `respect` reaction button. Why a "respect" button, you ask?
[Read more here](https://mediaengagement.org/research/engagement-buttons/).

## talk-plugin-comment-content

Source: [plugins/talk-plugin-comment-content](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-comment-content){:target="_blank"}

Pluginizes the text of a comment to support custom treatment of this text. This
plugin currently parses the given text to see if it contains a link, and makes
them clickable.

## talk-plugin-ignore-user

Source: [plugins/talk-plugin-ignore-user](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-ignore-user){:target="_blank"}

Enables ability for users to ignore (or "mute") other users. If a user is
ignored, you will not see any of their comments. You can un-ignore a user via
the My Profile tab.

## talk-plugin-permalink

Source: [plugins/talk-plugin-permalink](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-permalink){:target="_blank"}

Enables a `Link` button that will provide a permalink to the comment that can be
shared with others.

## talk-plugin-viewing-options

Source: [plugins/talk-plugin-viewing-options](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-viewing-options){:target="_blank"}

Pluginizes the sorting/viewing options for a comment stream.

## talk-plugin-sort-newest

Source: [plugins/talk-plugin-sort-newest](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-newest){:target="_blank"}

Requires: [talk-plugin-viewing-options](#talk-plugin-viewing-options){:.param}

Provides a sort for the newest comments first. This isn't necessarily required
as the default sort without options/plugins is newest first.

## talk-plugin-sort-oldest

Source: [plugins/talk-plugin-sort-oldest](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-oldest){:target="_blank"}

Requires: [talk-plugin-viewing-options](#talk-plugin-viewing-options){:.param}

Provides a sort for the newest comments first.

## talk-plugin-sort-most-respected

Source: [plugins/talk-plugin-sort-most-respected](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-respected){:target="_blank"}

Requires: [talk-plugin-viewing-options](#talk-plugin-viewing-options){:.param}, [talk-plugin-respect](#talk-plugin-respect){:.param}

Provides a sort for the comments with the most `respect` reactions first.

## talk-plugin-sort-most-replied

Source: [plugins/talk-plugin-sort-most-replied](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-replied){:target="_blank"}

Requires: [talk-plugin-viewing-options](#talk-plugin-viewing-options){:.param}

Provides a sort for the comments with the most replies first.

## talk-plugin-offtopic

Source: [plugins/talk-plugin-offtopic](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-offtopic){:target="_blank"}

Allows the comment authors to tag their comment as `Off-Topic` which will add a
visible badge on the frontend to other users that their comment is off-topic.

## talk-plugin-author-menu

Source: [plugins/talk-plugin-author-menu](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-author-menu){:target="_blank"}

Pluginizes the author's name on hover.

## talk-plugin-member-since

Source: [plugins/talk-plugin-member-since](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-member-since){:target="_blank"}

Requires: [talk-plugin-author-menu](#talk-plugin-author-menu){:.param}

Displays the date that the user was created as a `Member Since ${created_at}`.

## talk-plugin-moderation-actions

Source: [plugins/talk-plugin-moderation-actions](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-moderation-actions){:target="_blank"}

Enables in-stream moderation so that Moderators can reject, approve comments,
as well as ban users, directly from the comment stream. When [talk-plugin-featured-comments](#talk-plugin-featured-comments){:.param} is enabled

## talk-plugin-flag-details

Source: [plugins/talk-plugin-flag-details](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-flag-details){:target="_blank"}

Pluginizes the Flag Details area of comments in the Moderation Queues to display
data. Some basic details are already included on flags by default.

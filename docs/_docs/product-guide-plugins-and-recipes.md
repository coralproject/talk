---
title: Plugins & Recipes
permalink: /plugins-and-recipes/
class: product-guide
---

### Default Plugins

The default Talk plugins can be found in the `plugins.default.json` file [here](https://github.com/coralproject/talk/blob/master/plugins.default.json).

Talk ships out of the box with these plugins:

#### Auth `talk-plugin-auth`

Enables generic registration via an email address, a username, a password, and a password confirmation. To sync Talk auth with your own auth systems, you can use this plugin as a template.

#### Facebook Auth `talk-plugin-facebook-auth`

Enables sign-in via Facebook.

#### Comment Content `talk-plugin-comment-content`

Pluginizes the text of a comment to support custom treatment of this text. By default, we linkify urls so they are clickable.  

#### Respect `talk-plugin-respect`

Enables a Respect reaction button. Why a “respect” button, you ask? [Read more here](https://mediaengagement.org/research/engagement-buttons/). 

#### Ignore User `talk-plugin-ignore-user`

Enables ability for users to ignore (or “mute”) other users. If a user is ignored, you will not see any of their comments. You can un-ignore a user via the My Profile tab.

#### Permalinks `talk-plugin-permalink`

#### Featured Comments `talk-plugin-featured-comments`   

Enables the ability for Moderators to feature and un-feature comments via the Stream and the Admin. Featured comments show in a first-place tab on the Stream if there are any featured comments on that story.  

#### Viewing Options `talk-plugin-viewing-options`

##### Sorting Options `talk-plugin-sort-newest`, `talk-plugin-sort-oldest`, `talk-plugin-most-respected`, `talk-plugin-most-replied`

##### Off-topic `talk-plugin-offtopic`

#### Author Menu `talk-plugin-author-menu`

##### Member Since `talk-plugin-member-since`

#### In-Stream Moderation `talk-plugin-moderation-actions`

Enables in-stream moderation so that Moderators can reject, approve, and feature comments, as well as ban users, directly from the comment stream.

#### Moderation Flag Details `talk-plugin-flag-details`

Enables other plugins to use the Flag Details area of comments in the Moderation Queues to display data. 
 

### Additional Plugins

#### Like `talk-plugin-like`

Provides a `like` reaction button. Can also be added to the Viewing Options sorts by including `talk-plugin-most-liked`.

#### Love `talk-plugin-love`

Provides a `love` reaction button. Can also be added to the Viewing Options sorts by including `talk-plugin-most-loved`.

#### Remember Sort `talk-plugin-remember-sort`

Enables saving a user’s last sort selection as they browse other articles.

#### Deep Reply Count `talk-plugin-deep-reply-count`

Enables counting of comments to include replies. Requires dev work to enable this fully.

### Recipes 

Recipes are available here: 
https://github.com/coralproject/talk-recipes 

#### Avatars `recipe-avatar`

Provides support for commenter avatars.

#### Subscriber Badge `recipe-subscriber`

Provides support for badges for `subscribers`.

#### Author Name `recipe-author-name`

Enables the ability to hover over a commenter’s name and add plugin functionality there. The Member Since plugin is an example of this.

# Configuring the Talk Comment Stream


Using plugins and configuration variables, you can modify the way the Talk comment stream behaves. Here are some common configuration options:


### Rich Text Editor

To enable our default rich text editor plugin, you'll need to:

1. Enable `talk-plugin-rich-text` as a server-side and client-side plugin
2. If you have `talk-plugin-comment-content` enabled, you will need to disable this (this supports hyperlinks in the comment body)

Out of the box, our Talk Editor supports Bold, Italic, and Blockquote.

If you want to support another editor, you can create a plugin and replace the client-side one with the editor of your choice.

### Sorting/Filtering the Stream

To enable sorting and filtering plugins, you will first need to enable the viewing options plugin:

`talk-plugin-viewing-options`

Then you can enable these sorting options:

`talk-plugin-sort-most-replied`
`talk-plugin-sort-most-respected`
`talk-plugin-sort-newest`
`talk-plugin-sort-oldest`

And/or this filtering option:

`talk-plugin-offtopic`

### Comment Timestamp Display

You can customize the way timestamps display to commenters on both the comment stream and their My Profile tab. The default display is via relative timestamps, e.g. "2 minutes ago", "20 days ago", "3 months ago".

Customizing this will require creating a plugin that leverages the two plugin slots `commentTimestamp` and `historyCommentTimestamp` to replace this with a custom component.

For more information, please see https://github.com/coralproject/talk/pull/979.

### Comment Author Menu

The comment author menu can house plugins related to the comment author. We have recipes for showing the commenter's "member since" date, and to show a subscriber badge. These will require some integration on your side to connect them to the data source that houses this information.

`talk-plugin-member-since`

`talk-plugin-subscriber`

To get started, check out our Talk Recipes: https://github.com/coralproject/talk-recipes

### Ignoring Users

To enable the ignore user functionality, you will need to enable a few things.

First, you'll enable `talk-plugin-author-menu`, as this houses the Ignore button.

And then we will enable the Ignore User plugin: `talk-plugin-ignore-user`. 

### Featured Comments

To enable the featuring of comments, you'll need to activate `talk-plugin-featured-comments`. If you would like the Featured Comments tab to be the default tab you land on for the stream, you will need to set the default tab ENV variable:

`TALK_DEFAULT_STREAM_TAB=talk-plugin-featured-comments`

### Reactions

Talk supports a myriad of commenter reactions, such as:

`talk-plugin-like`
`talk-plugin-love`
`talk-plugin-respect`

If you want to build your own reaction plugin, check out our Plugins docs and tutorials.




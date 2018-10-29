
# talk-plugin-featured-comments
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-featured-comments/)

```
    name: talk-plugin-featured-comments
    default: true
    provides:
        - Server
        - Client
```


Enables the ability for Moderators to feature and un-feature comments via the
Stream and the Admin. Featured comments show in a first-place tab on the Stream
if there are any featured comments on that story.

When paired with the [talk-plugin-moderator-actions](talk-plugin-moderation-actions.html)
plugin, moderators will have the option of featuring comments from the comment
stream.
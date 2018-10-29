
# talk-plugin-comment-content
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-comment-content/)

```
    name: talk-plugin-comment-content
    default: true
    provides:
        - Client
```


Pluginizes the text of a comment to support custom treatment of this text. This
plugin currently parses the given text to see if it contains a link, and makes
them clickable using
[react-linkify](https://www.npmjs.com/package/react-linkify).
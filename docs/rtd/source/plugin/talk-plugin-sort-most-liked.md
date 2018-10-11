
# talk-plugin-sort-most-liked
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-liked/)

```
    name: talk-plugin-sort-most-liked
    depends:
        - name: talk-plugin-like
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
```


Provides a sort for the comments with the most `like` reactions first.
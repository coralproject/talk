
# talk-plugin-sort-most-respected
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-respected/)

```
    name: talk-plugin-sort-most-respected
    default: true
    depends:
        - name: talk-plugin-respect
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
```


Provides a sort for the comments with the most `respect` reactions first.
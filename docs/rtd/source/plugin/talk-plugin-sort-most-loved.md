
# talk-plugin-sort-most-loved
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-sort-most-loved/)

```
    name: talk-plugin-sort-most-loved
    depends:
        - name: talk-plugin-love
        - name: talk-plugin-viewing-options
    provides:
        - Server
        - Client
```


Provides a sort for the comments with the most `love` reactions first.
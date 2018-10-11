
# talk-plugin-notifications-category-featured
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-category-featured/)

```
    name: talk-plugin-notifications-category-featured
    depends:
        - name: talk-plugin-notifications
        - name: talk-plugin-featured-comments
    provides:
        - Server
        - Client
```


When a comment is featured (via the
[talk-plugin-featured-comments](/talkhttps://github.com/coralproject/talk/tree/master/plugins/talk-plugin-featured-comments)
plugin), the user will receive a notification email.
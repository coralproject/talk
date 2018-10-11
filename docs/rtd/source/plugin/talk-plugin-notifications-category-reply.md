
# talk-plugin-notifications-category-reply
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-category-reply/)

```
    name: talk-plugin-notifications-category-reply
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
```


Replies made to each user will trigger an email to be sent with the notification
details if enabled.
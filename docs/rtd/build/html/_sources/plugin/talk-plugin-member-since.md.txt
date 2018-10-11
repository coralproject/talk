
# talk-plugin-member-since
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-member-since/)

```
    name: talk-plugin-member-since
    default: true
    depends:
        - name: talk-plugin-author-menu
    provides:
        - Client
```


It will show the date that the member/user joined when you hover over the
username as retrieved from the `createdAt` time on the user.
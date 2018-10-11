
# talk-plugin-notifications-digest-hourly
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-notifications-digest-hourly/)

```
    name: talk-plugin-notifications-digest-hourly
    depends:
        - name: talk-plugin-notifications
    provides:
        - Server
        - Client
```


Enables a digesting option for users to digest their notifications on an `HOURLY`
basis, where the notification batching occurs every hour in the
`America/New_York` timezone.
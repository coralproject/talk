
# talk-plugin-subscriber
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-subscriber/)

```
    name: talk-plugin-subscriber
    provides:
        - Server
        - Client 
```


Enables a `Subscriber` badge to be added to comments where the author has the
`SUBSCRIBER` tag. This must match with a custom auth integration that adds the
tag to the users that are subscribed to the service.

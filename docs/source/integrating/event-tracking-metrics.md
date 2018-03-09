---
title: Tracking Talk Events and Metrics
permalink: /integrating/event-tracking-metrics/
---

Talk supports event emitting via Redux, Apollo and GraphQL. This means that common actions taken within Talk, such as successfully posting a comment, posting a reaction, or changing a setting, are automatically emitted from Talk. To send these events to your analytics tool of choice, however, will require some integration on your part.

First, we want to uncomment the tracking code in `article.ejs` (https://github.com/coralproject/talk/blob/93bda87ad061a2dc5eb8dc5b65a579a20efb76f7/views/article.ejs#L34). This will enable events to be sent via the Talk embed that is on your article pages. This will start a stream of events to the browser console, so that you can see which events are available.

```
    events: function(events) {
      events.onAny(function(eventName, data) {
        // logs all available events.
        console.log(eventName, data);
     });
   },
```

Now, we want to add our code that sends the events to our analytics system. In this case, we're sending the `PostComment.success` event. The particular way you send this will depend on what tool you're using. Refer to your tool's API and docs to determine this.

```
    events: function(events) {
      events.onAny(function(eventName, data) {
        console.log(eventName, data);
        if (eventName === 'mutation.PostComment.success') {
          my_event_tracker.send('postComment', data);
        }
      });
    },
```
You can continue this process for any specific events you'd like to track. You can also remove the `console.log` to stop events being emitted to the browser and instead only send the events to your analytics tool.

PR for Reference: https://github.com/coralproject/talk/pull/785

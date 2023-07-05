---
title: Event Tracking
---

The Coral embed script can emit events to the analytics tool of your choice. Common user actions, such as successfully posting a comment, posting a reaction, or changing a setting are all capturable with events.

## Analytics Tool Integration

To enable event tracking, modify your embed script to subscribe to the events hook. You will also need to add code to your page that sends the events to your analytics system. The particular way you send this will depend on what tool you’re using. Refer to your tool’s API and docs to determine this.

In this example, we’re logging all events to the console as well as sending the `createComment.success` event.

```html
<script>
  const CoralStreamEmbed = Coral.createStreamEmbed({
    events: function(events) {
      events.onAny(function(eventName, data) {
        console.log(eventName, data);
        if (eventName === 'createComment.success') {
          my_event_tracker.send('createComment', data);
        }
      });
    },
  });
</script>
```

## Available Events

A complete list of trackable events is available on GitHub: https://github.com/coralproject/talk/blob/main/CLIENT_EVENTS.md

_Note: only events that occur on the comment embed stream will be emitted. No events are emitted from Coral's Moderation/Admin interface._

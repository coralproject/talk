---
title: Trust
permalink: /trust//
class: product-guide
---

“Trust” are components within Talk that incorporate automated moderation features based on a user’s previous behavior.

### User Karma Score

Using Trust’s calculations, Talk will automatically pre-moderate comments of users who have a negative karma score. All users start out with a `0` neutral karma score. If they have a comment approved by a moderator, their score increases by 1; if they have a comment rejected by a moderator, it decreases by 1. When a commenter is labeled as Unreliable, their comments must be moderated before they are posted.

When a commenter has one comment rejected, their next comment must be moderated once in order to post freely again. If they instead get rejected again, then they must have two of their comments approved in order to get added back to the queue.

Here are the default thresholds:

-2 and lower: Unreliable
-1 to +2: Neutral
+3 and higher: Reliable

You can configure your own Trust thresholds by using `TRUST_THRESHOLD` in your configuration. [https://coralproject.github.io/talk/advanced-configuration/#trust_thresholds](Learn more about how to configure Trust here).


### Reliable and Unreliable Flaggers

Details coming soon.

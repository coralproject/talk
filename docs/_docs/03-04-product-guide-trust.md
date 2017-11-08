---
title: Trust
permalink: /trust/
---

Trust is a set of components within Talk that incorporate automated moderation
features based on a user's previous behavior.

## User Karma Score

Using Trust’s calculations, Talk will automatically pre-moderate comments of
users who have a negative karma score. All users start out with a `0` neutral
karma score. If they have a comment approved by a moderator, their score
increases by `1`; if they have a comment rejected by a moderator, it decreases
by `1`. When a commenter is labeled as Unreliable, their comments must be
moderated before they are posted.

When a commenter has one comment rejected, their next comment must be moderated
once in order to post freely again. If they instead get rejected again, then
they must have two of their comments approved in order to get added back to the
queue.

Here are the default thresholds:

```text
-2 and lower: Unreliable
-1 to +2: Neutral
+3 and higher: Reliable
```

You can configure your own Trust thresholds by using [TRUST_THRESHOLD]({{"/advanced-configuration/#trust_thresholds" | relative_url }}{:.param}) in your
configuration.


## Reliable and Unreliable Flaggers

Trust also calculates how reliable users are in terms of the comments they
report. This information is displayed to moderators in the User History drawer,
which is accessed by clicking on a user’s name in the Admin.

If a user's reports mostly match what moderators reject, their Report status
will display to moderators as Reliable in the user information drawer. If a
user's reports mostly differ from what moderators reject, their Report status
will show as Unreliable.

If we don't have enough reports to make a call, or the reports even out, their
status is Neutral.

Note: Report Karma doesn't include reports of "I don't agree with this comment".

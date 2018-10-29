# Trust


Trust is a set of components within Talk that incorporate basic automated moderation features based on a user's previous behavior. 

## User Karma Score

Using Trust’s calculations, Talk will automatically hold back, move to the Reported queue, and tag with a 'History' marker, any comments by users who have an Unreliable karma score. (This is for sites who practice post-moderation. If you set pre-moderation of all comments sitewide, this feature has limited use.)

All users start out with a Neutral karma score (`0`). If they have a comment approved by a moderator, their score increases by `1`; if they have a comment rejected by a moderator, it decreases by `1`. When a commenter's score is labeled as Unreliable, their comments must be approved from the Reported queue before they are posted. Commenters are shown a message stating that a moderator will review their comment shortly.

Here are the default thresholds:

```text
-1 and lower: Unreliable
0 to +1: Neutral
+2 and higher: Reliable (we don't do anything with this label right now)
```

So in this case, when a new commenter has their first comment rejected, their user karma score becomes `-1`, which triggers the Unreliable threshhold, and they must then have a comment approved by a moderator in order to post freely again. Until that occurs, all of their comments will be held back temporarily in the Reported queue, marked with a `History` tag. 

If their next comment is also rejected, their user karma score is now `-2`, and they must have two comments approved in order to reach a Neutral score, and post without pre-approval.

We strongly recommend not telling your community how this system works, or where the threshholds lie. Firstly, they might try to game the system to meet approval, and secondly, it makes it harder for you to change the threshhold in the future. We suggest using language such as "We hold back comments for approval for a variety of reasons, including content, account history, and more."

If you see that a high proportion of first-time commenters on your site are abusive, you might want to change the threshhold to `0`, at least temporarily. You can configure your own Trust thresholds by using [TRUST_THRESHOLDS](./02-02-advanced-configuration.html#trust-thresholds) in your site configuration.


## Reliable and Unreliable Flaggers

Trust also calculates how reliable users are in terms of the comments they
report. This information is displayed to moderators in the User History drawer,
which is accessed by clicking on a user’s name in the Admin. Currently, no other action is taken based on this score.

If a user's reports mostly match what moderators reject, their Report status
will display to moderators as Reliable in the user information drawer. If a
user's reports mostly differ from what moderators reject, their Report status
will show as Unreliable.

If Talk doesn't have enough reports to make a call, or the reports even out, their
status is Neutral.

Here are the default thresholds:

```text
-1 and lower: Unreliable
0 to +1: Neutral
+2 and higher: Reliable
```
You can configure your own Trust thresholds by using [TRUST_THRESHOLDS](./02-02-advanced-configuration.html#trust-thresholds) in your
configuration.

Note: Report Karma doesn't include reports of "I don't agree with this comment".

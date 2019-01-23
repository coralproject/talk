---
title: Moderator Features
permalink: /moderator-features/
---

## The Talk Admin

The Admin is where your moderators will moderate your comments, and your Admins will
configure and manage the different parts of Talk.

### Moderate

This is the tab where Moderators will spend the majority of their time. They can
choose (via the dropdown) which story they would like to moderate, or moderate
site-wide.

#### Default Mod Queues

**New**

>_Conditions:_ Pre-Mod disabled

Comments have been published? _**Yes**_

The New queue contains all comments that have not been moderated yet. This queue contains comments that haven’t yet been Accepted or Rejected by a moderator

**Pre-mod**

>_Conditions:_ Pre-Mod enabled

Comments have been published? _**No**_

This queue contains comments that haven’t yet been Accepted or Rejected by a moderator

**Accepted**

Comments have been published? _**Yes**_

Comments that have been approved by a moderator, written by a Staff member (and so auto approved), or Featured (and so auto approved). Tags for reports still appear on comments in this queue, but the comments will not go back into Reported.

**Rejected**

Comments have been published? _**No**_

Comments that have been rejected by a moderator, or rejected because they contained a banned word/phrase. Tags for reports still appear on comments in this queue, but the comments will not go back into Reported.


**Reported**

>_Conditions:_ Pre-Mod disabled

Comments have been published? _**depends**_

This queue contains comments that have been reported for moderator review, either by users or automatically by Talk, and have not yet been Approved or Rejected. If there are comments to review in this queue, a red dot will be displayed in the top menu. 

**All**

The All queue contains all comments that have been submitted either article or
site-wide.

#### Moderation Tags that appear in Reported/other queues

**Pre-mod**

_Comment published? No_

The Pre-mod tag signifies comments that are being pre-modded.

**User**

_Comment published? Yes_

Comment has been reported by a user. The ‘More Details’ box contains the name/s of the users who reported the comment, and any additional information they provided.

**Staff**

_Comment published? Yes_

Comment has been reported by a staff member. The ‘More Details’ box contains the name/s of the staff member who reported the comment, and any additional information they provided.

**Suspect Word**

_Comment published? Yes_

Comment contains a word or phrase that is on the ’Suspect words’ list in the Configure > Moderation tab (administrators only). The word/phrase will be highlighted in yellow.

**Karma**

_Comment published? No_

The History tag signifies comments that have been flagged because the user’s history indicates their Accepted:Rejected ratio has reached below the karma threshold. [Read more about karma here.](/talk/trust/#user-karma-score)

**Spam**

_Comment published? No_

If you are using the Akismet anti-spam plugin, this tag means that Akismet has flagged the comment as spam. You must Approve it for it to appear in the stream. **Requires:** [talk-plugin-akismet](/talk/plugin/talk-plugin-akismet/)


**Toxic**

_Comment published? No_

If you are using the Toxic Comments plugin, this tag means that Perspective API has flagged the comment as likely to be toxic, above the threshold you have set (default: 80%). You must Approve it for it to appear in the stream. **Requires:** [talk-plugin-toxic-comments](/talk/additional-plugins/#talk-plugin-toxic-comments). 
Read more about [Toxic Comments here](/talk/toxic-comments/).


**Contains Link**

The Contains Link tag signifies a comment that contains a link, which can
sometimes mean it is a spam or ad comment.

**More Details View**

At the bottom of each comment in the moderation queues, you can see more
information about a comment’s flags by clicking on More Detail.

#### Moderator Actions

**Accept**

Accepting a comment ensures that the comment is displayed on the stream.

**Reject**

Rejecting a comment removes the comment from the stream.

**Feature**

Featuring a comment adds that comment to the Featured Comments tab on the
stream.

#### Keyboard Shortcuts

Talk also supports a number of keyboard shortcuts that moderators can leverage
to moderate queues quickly:

| Shortcut | Action                     |
| -------- | -------------------------- |
| `j`      | Go to the next comment     |
| `k`      | Go to the previous comment |
| `ctrl+f` | Open search                |
| `1-5`    | Switch queues              |
| `z`      | Zen mode                   |
| `?`      | Open shortcuts menu        |
| `d`      | Approve                    |
| `f`      | Reject                     |

Note: "Zen mode" allows a moderator to view and action only one comment at a time. Enjoy the silence!

#### The User Drawer

In order to get an idea of what sort of a commenter someone is, moderators can
click on the commenter's username in any moderation queue/elsewhere in the admin (eg the Community page) to see details about
their comments, and to take actions.

#### User Drawer Actions

**Suspend User**

Suspending a user allows a moderator to give a commenter a “time-out” for a set time chosen from four options; during
that time they won’t be allowed to post comments or react to comments.

**Ban User**

Banning a user allows a moderator to permanently disallow a commenter to
interact with their community. The commenters previous comments will remain on
the site. This action can only be un-done manually by a moderator.

**Reject Username**

If a username is violating your guidelines but isn't bad enough to lead to a ban (eg. they are impersonating a famous person), you can reject their username. This will prevent them from publishing comments until they submit a new username. The new name will appear on the Community page for moderator approval before they can publish comments again.

**Username, Email and Member Since Date**

This shows the basic details about a commenter's account

**Total Comments**

This shows the number of comments that a commenter has made that currently
display on the site.

**Reject Rate**

This shows the % of comments a commenter has had rejected by moderators, or
automatically.

**Karma score**

The user's current score. To see the default threshhold, click on the 'i' next to the word Karma. If the user's score is equal to or below the default threshhold, the number will be highlighted red. [Read more about karma scores here.](/talk/trust/#user-karma-score)

**User History**

This shows the history of the account - if a user has changed their username, or been suspended or banned. The name of the moderator who suspended/banned them/lifted the suspection or ban is displayed here as well.

**Moderating from this View**

Talk also allows you to moderate a commenters recent comments from this view. You can 'Select all' to select up to ten previous comments, and take bulk accept/reject actions.

### Stories

In the Stories tab moderators can view all the stories that have Talk comments
embedded on them, as well as be able to Open or Close comment streams on
stories.

### Community

The Community tab houses everything having to do with your team and your
commenters.

#### Moderating Usernames

Any usernames that have been reported will show in the Reported Usernames
sub-tab. Moderators can approve usernames if they’re suitable, or reject a
username. If a username is rejected, the commenter will be notified that they
need to change their username; until they do, they will be suspended from Talk.
The updated username then again appears in this queue for a decision by
moderators.

#### Managing People & Roles

All your team and commenters show in the People sub-tab. From here, you can
manage your team members’ roles (Admins, Moderators, Staff), as well as search
for commenters and take action on them (e.g. Ban/Un-ban, Suspend, etc.). 

### Configure

See [Configuring Talk](/talk/configuring-talk/).

## Moderating via the Comment Stream

Moderators can also choose to moderate comments in situ. If you are logged in as
a Moderator or Admin, you will see a caret dropdown on each comment that allows
you to Approve, Reject, or Feature comments, or Ban a User directly from the
comment stream.

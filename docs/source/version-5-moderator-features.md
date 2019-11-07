---
title: Moderator Features
permalink: v5/moderator-features/
---

## The Coral Admin

The admin is where your moderators will moderate your comments, and your Admins will
configure and manage the different parts of Coral.

### Moderate

This is the tab where Moderators will spend the majority of their time. They can
choose (via the dropdown) which story they would like to moderate, or moderate
site-wide.

#### Default mod queues

**Reported**

Comments have been published? _**Yes**_

The Reported queue contains all comments that have been reported by your readers. 
These comments are published and would require action by a Moderator to Reject 
them in order to remove them from the comment stream.

**Pending**

Comments have been published? _**No**_

This queue contains comments that are either in Pre-mod state or have been held 
back by moderation tools. These comments require Approval by a Moderator before 
they are shown on the comment stream.

**Unmoderated**

Comments have been published? _**Yes**_

Comments that appear on the comment stream and have not yet been moderated by
a Moderator.

**Rejected**

Comments have been published? _**No**_

Comments that have been rejected by a Moderator, or rejected because they 
contained a banned word/phrase. Tags for reports still appear on comments 
in this queue, but the comments will not go back into Reported.

#### Moderation tags

**Pre-mod**

_Comment published? No_

The Pre-mod tag signifies comments that are being pre-moderated.

**User**

_Comment published? Yes_

Comment has been reported by a user. The ‘More Details’ box contains the 
name/s of the users who reported the comment, and any additional information 
they provided.

**Staff**

_Comment published? Yes_

Comment has been reported by a staff member. The ‘More Details’ box contains
the name/s of the staff member who reported the comment, and any additional
information they provided.

**Suspect word**

_Comment published? Yes_

Comment contains a word or phrase that is on the ’Suspect words’ list in the 
Configure > Moderation tab (administrators only). The word/phrase will be 
highlighted in yellow.

**Karma**

_Comment published? No_

The History tag signifies comments that have been flagged because the user’s 
history indicates their Accepted:Rejected ratio has reached below the karma threshold.

**Spam**

_Comment published? No_

If you are using the Akismet anti-spam integration, this tag means that Akismet has 
flagged the comment as spam. You must Approve it for it to appear in the stream. 

**Toxic**

_Comment published? No_

If you are using the Perspective API, this tag means that the comment been 
flagged as likely to be toxic, above the threshold you have set (default: 80%). 
You must Approve it for it to appear in the stream. 

**Contains link**

The Contains Link tag signifies a comment that contains a link, which can
sometimes mean it is a spam or ad comment.

**More Details view**

At the bottom of each comment in the moderation queues, you can see more
information about a comment’s flags by clicking on More Detail.

#### Moderator actions

**Accept**

Accepting a comment ensures that the comment is displayed on the stream.

**Reject**

Rejecting a comment removes the comment from the stream.

**Feature**

Featuring a comment adds that comment to the Featured Comments tab on the
stream.

#### Keyboard shortcuts

Coral also supports a number of keyboard shortcuts that moderators can leverage
to moderate queues quickly:

| Shortcut | Action                     |
| -------- | -------------------------- |
| `j`      | Go to the next comment     |
| `k`      | Go to the previous comment |
| `ctrl+f` | Open search                |
| `1-5`    | Switch queues              |
| `z`      | Single comment mode        |
| `?`      | Open shortcuts menu        |
| `f`      | Approve                    |
| `d`      | Reject                     |

Note: "Single comment mode" allows a moderator to view and action only one 
comment at a time. Enjoy the silence!

#### The User Drawer

In order to get an idea of what sort of a commenter someone is, moderators can
click on the commenter's username in any moderation queue/elsewhere in the admin 
(eg the Community page) to see details about their comments, and to take actions.

#### User Drawer actions

**Suspend user**

Suspending a user allows a moderator to give a commenter a “time-out” for a 
set time chosen from four options; during that time they won’t be allowed to 
post comments or react to comments.

**Ban user**

Banning a user allows a moderator to permanently disallow a commenter to
interact with their community. The commenters previous comments will remain on
the site. This action can only be un-done manually by a moderator.

**Username, email and member since date**

This shows the basic details about a commenter's account.

**Total comments**

This shows the number of comments that a commenter has made that currently
display on the site.

**Reject rate**

This shows the % of comments a commenter has had rejected by moderators, or
automatically.

**Commenter history**

The user's current score. If the user's score is equal to or below the default 
threshhold, the number will be highlighted red. 

**User history**

This shows the history of the account - if a user has changed their username, 
or has been suspended or banned. The name of the moderator who suspended/banned 
them/lifted the suspection or ban is displayed here as well.

**Moderating from this View**

Talk also allows you to moderate a commenters recent comments from this view. 

### Stories

In the Stories tab moderators can view all the stories that have Talk comments
embedded on them, as well as be able to Open or Close comment streams on
stories.

### Community

The Community tab houses everything having to do with your team and your
commenters.

#### Managing people & roles

All your team and commenters show in the People sub-tab. From here, you can
manage your team members’ roles (Admins, Moderators, Staff), as well as search
for commenters and take action on them (e.g. Ban/Un-ban, Suspend, etc.). 

### Configure

See [Configuring Talk](/talk/configuring-talk/).

## Moderating via the comment stream

Moderators can also choose to moderate comments in situ. If you are logged in as
a Moderator or Admin, you will see a caret dropdown on each comment that allows
you to Approve, Reject, or Feature comments, or Ban a User directly from the
comment stream.

---
title: Commenter Features
permalink: v5/commenter-features/
---

## Commenter sign up and login

There are 2 ways that newsrooms can support signup/login functionality with Coral:

* Recommended: Use SSO, which provides support for external auth via JWT, 
making it a very flexible solution that works with the majority of auth providers 

* Easiest: Use Coral Auth, which provides authentication support out-of-the-box, 
including account registration with username and password, Google login, 
and/or Facebook login, as well as flows for forgot password, change username, 
and change email address

* OpenID Connect: We also support OIDC, which is a less flexible solution but
supported by some auth providers


## Comments, replies and threading

Coral supports extensive threading. Parent comments are loaded 10 at a 
time with the ability to see more; replies are shown 3 at at time with the 
ability to view more.

### Permalinks

All levels of comments and replies are able to be linked to via permalink. 
Permalinks are structured using a `commentId` query param:

```text
https://<your asset url>?commentId=<the comment id>
```

### Live updates

Coral supports real-time loading and updating of comments, via subscriptions
(specifically GraphQL Subscriptions); this enables readers to not have to refresh to
see new comments on a given comment stream.

Coral enables this via “Load More” buttons for both top-level comments (this
button appears at the top of the stream), and within conversation threads (this
button appears in situ for replies).

We’ve decided to go this route in order to make the viewing experience as smooth
as possible, so that the feed of comments doesn’t change as you’re reading just
because new comments are coming in. This could be especially disruptive on
breaking news and/or controversial stories with very active discussions.

The ability to turn off Live Updates is configurable per story and also site-wide.

### Comment character limits

You can enable Coral to set both minimum character and maximum character requirements
for a comment. Commenters are alerted when they outside of those limits, and must
conform to the limits before they're able to submit a comment.

## Comment reactions

Coral comes with a `respect` button out of the box. Why a “respect” button, you
ask?
[Read more here](https://mediaengagement.org/research/engagement-buttons/).

However, the reacion language is entirely configurable in the admin.

## Reporting Comments

Readers can report comments if they feel they’re unsuitable. They can choose one
of the following reasons:

* This comment is offensive
* This looks like an ad/marketing
* I don’t agree with this comment
* Other

They can also include more information and this shows for moderators in the Flag
Detail area on the comments in the moderation queues.

Comments that are reported go to the Reported queue, with the exception of “I
don’t agree with this comment”. This option is a useful way to let other readers
vent their frustration, but since just disagreeing with something doesn’t mean
it’s not suitable, we leave it be.

## Ignoring users

Commenters can ignore other commenters and essentially mute them entirely from
the comment platform. Commenters can manage their ignored users list in their My
Profile tab.

## Featured comments

Moderators can feature comments that they want to highlight and recommend to
their community. Featured comments show up on a separate tab, that is the
default for the comment stream. Featured comments within the stream show a
Featured badge.

## Sorting the stream

Readers can sort the stream in 4 ways based on their viewing preferences:

* Oldest first
* Newest first
* Most reacted first (most respected/liked/recommended/etc, depending on what
  reactions you use)
* Most replied first

## Staff user badge

Badges differentiate users on the stream and in the admin. By default, Coral has one
badge out of the box - the Staff badge.

The Staff user badge shows when the user has a role of Staff, Moderator, or Admin.
This is configurable in the admin.

## Custom user badges

You can also add your own custom user badges by sending a `role` via the user's JWT.
You can read more about how to do that in our [SSO configuration docs](/version-5-sso.md)..

## My Profile

The My Profile tab is where commenters can go to see their comment history, as
well as reactions and replies to their comments. They can also see their email
address associated with Coral, and manage their Ignored Users list here.

## Notifications & error messaging

Coral leverages notification and messages on the stream to alert users to
important information about their comment or their account.

### Pre-moderation of comments

If a stream is set to Pre-mod, or a commenter’s Trust karma score has fallen to
negative, or if for any other reason their comment is being pre-moderated, they
will get a notification letting them know this when they post a comment.

### Suspension

When a commenter has been suspended for a block of time (aka a “time-out”), they
will see a message at the top of their streams stating this.

### Ban

When a commenter has been banned, they will see a message at the top of their
streams stating this.

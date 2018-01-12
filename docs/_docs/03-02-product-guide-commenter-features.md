---
title: Commenter Features
permalink: /commenter-features/
---

## Signing up for Talk

There are 2 ways that newsrooms can support signup/login functionality with Talk:

* Use Talk’s auth plugin out of the box (supports account registration with username and password, as well as features like forgot password)

* Create their own auth plugin to integrate with your own auth systems

We also provide a Facebook auth plugin that supports logging in with Facebook (you must provide your own Facebook App ID and Secret, which you can read more about here: [https://developers.facebook.com](https://developers.facebook.com){:target="_blank"})

## Comments and Replies

Talk supports a standard comment hierarchy. There are top-level (or parent) comments, and then replies to that comment (or children comments).

### Permalinks

All levels of comments and replies are able to be linked to via permalink. Permalinks are structured using a `commentId` query param:

```text
https://<your asset url>?commentId=<the comment id>
```
{:.no-copy}

### Threading

Talk supports by default 3 levels of threading, meaning each top-level comment
has a depth of 3 replies; replies beyond that are not nested below the 3rd
level. You can adjust this using the
[TALK_THREADING_LEVEL]({{ "/advanced-configuration/#talk_threading_level" | relative_url }}){:.param}
configuration variable. We don’t recommend deep threading because it can cause
issues with styling, especially on mobile.

You can style threaded comments using these CSS classes:

```
talk-stream-comment-wrapper-level-${depth}
talk-stream-comment
talk-stream-comment-level-${depth}
talk-stream-highlighted-comment
talk-stream-pending-comment
```
{:.no-copy}

### Automatic Updates

Talk supports real-time loading and updating of comments, via subscriptions
(specifically GraphQL Subscriptions); this enables us to not have to refresh to
see new comments on a given comment stream.

Talk enables this via “Load More” buttons for both top-level comments (this
button appears at the top of the stream), and within conversation threads (this
button appears in situ for replies).

We’ve decided to go this route in order to make the viewing experience as smooth
as possible, so that the feed of comments doesn’t change as you’re reading just
because new comments are coming in. This could be especially disruptive on
breaking news and/or controversial stories with very active discussions.

### Comment Character Limits

You can enable Talk to limit the character length for comments, for example,
some newsrooms we’ve worked with prefer a limit between 2000 and 5000
characters. Commenters will be alerted that they have gone over that number and
won’t be able to submit their comment until they’ve edited it. This can be a
useful tool to ensure commenters are concise with their comments.

## Comment Reactions

Talk comes with a `respect` button out of the box. Why a “respect” button, you
ask?
[Read more here](https://mediaengagement.org/research/engagement-buttons/){:target="_blank"}.

We also have 2 more plugins, `like` and `love`, that you can turn on and
experiment with on your own Talk install.

And our plugin architecture makes it easy to create your own custom reaction
buttons too.

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


## Reporting Usernames

Usernames can also be reported by readers, if the username is inappropriate or
offensive. They can choose one of the following reasons:

* This username is offensive
* I don't like this username
* This user is impersonating
* This looks like an ad/marketing

Reported usernames go to the Reported Usernames queue which is located in the
Community tab. If a username is rejected by a moderator, the commenter is
prompted to change their username and they are suspended from commenting,
replying or reacting to comments until they do so. They receive an email, and
also a message at the top of their comment streams that let’s them know they’re
suspended.

If the commenter changes their username, it goes back to the Reported Usernames
queue for approval. If the updated username is accepted by a moderator, the
commenter is no longer suspended and continue interacting with the community. If
the username is rejected, the commenter remains suspended until they change
their username to something appropriate.

Approved usernames that are reported do not show up in the Reported Usernames
queues any longer, since they have been specifically OK’ed by a moderator.

## Ignoring Users

Commenters can ignore other commenters and essentially mute them entirely from
the comment platform. Commenters can manage their ignored users list in their My
Profile tab.

## Featured Comments

Moderators can feature comments that they want to highlight and recommend to
their community. Featured comments show up on a separate tab, that is the
default for the comment stream. Featured comments within the stream show a
Featured badge.

## Sorting the Stream

Readers can sort the stream in 4 ways based on their viewing preferences:

* Oldest first
* Newest first
* Most respect first (or most liked, most loved, etc., depending on what
  reactions you use)
* Most replied first

We also make it easy to add more sorts via custom plugins.

## Badges

Badges differentiate users and comments on the stream. By default, Talk has two
badges.

The Staff user badge that shows when a commenter has an Admin, Moderator, or
Staff role.

The Featured comment badge shows when a comment has been featured.

Another optional badge is the Subscriber badge (which is available as a
[Recipe]({{ "/plugin-recipes/#recipe-subscriber" | relative_url}}).

Badges are another easy part of Talk to customize by creating a new `tag`, then
setting some rules for when it should show, and how the badge should be styled.

## My Profile

The My Profile tab is where commenters can go to see their comment history, as
well as reactions and replies to their comments. They can also see their email
address associated with Talk, and manage their Ignored Users list here.

## Notifications & Error Messaging

Talk leverages notification and messages on the stream to alert users to
important information about their comment or their account.

### Pre-moderation of comments

If a stream is set to Pre-mod, or a commenter’s Trust karma score has fallen to
negative, or if for any other reason their comment is being pre-moderated, they
will get a notification letting them know this when they post a comment.

### Suspension because of Username

When a commenter has been suspended because their username is inappropriate,
they will see a message at the top of their streams stating this.

### Timed Suspension

When a commenter has been suspended for a block of time (aka a “time-out”), they
will see a message at the top of their streams stating this.

### Ban

When a commenter has been banned, they will see a message at the top of their
streams stating this.

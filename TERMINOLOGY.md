# Product's Terminology

This is a guide to have a common language to talk about "Talk".

## Definitions

* Site - a top level site, aka nytimes.com
* Section - the section of a site, aka, Politics.
* Subsection - the section of a site, aka, Politics.
* Asset - An article/video/etc identified by URL.

* Embed - Things we put on a asset: comment box, ToS, Stream, etc…
* Stream - All the activity on a certain asset. Container for Comments, actions, user
* Thread - defined by a parent and everything below. All replies to a comment and their replies, etc…
* Comment - a kind of user-generated content submitted by a comment author
  * A parent comment has replies to it
  * A child comments is a reply to another comment
  * A comment can be both a parent comment and a child of another comment
  * A top-level comment is a comment that is not a reply to any other comment
  * A nth-level comment refers to the number of replies away from the top-level comment

* User - an item to represent a person using Talk. It could be a moderator, reader, etc.
* User Roles:
  * Active: some who takes action (logged in or not)
  * Passive: some who just reads, no actions performed
  * Comment Author: The user who wrote the comment
  * Staff Member: someone who works for an organization (tagged for leverage in trust)
  * Moderator: someone with the ability to access the moderation queue and perform moderation actions
  * Administrator: has the ability to change the setup of their coral space
* Public Profile: information about users shown in public
* Private Profile: information about users shown only to user about themselves
* Protected Profile: information about users that only moderators and admins can see

* Queue - Group of items based on a query, aka - moderation queue
* Target - The item/s on which an action is performed

##  Actions

Actions are performed by users on items. Actions themselves are items. This requires two relationships: action on item, and user performs action.

### Flag
* A Flagger(user) performs a Flag
* A Flag is performed on a Comment or a username or profile content


## Moderation Actions and Status

Comments contain a field `status`. As moderation actions are peformed, the status changes.

* Initial status is empty.
* When a moderator Approves, the status is set to 'approved'.
* When a moderator Rejects, the status is set to 'reject'.

### Pre and post moderation

Comments can be set to be premoderated or postmoderated. 

Premoderation means that moderation has to occur _before_ a comment is shown on the site:

* New comments are shown in the moderator queues immediately. 
* The are not shown to users until (aka in streams) until they are approved by a moderator.

Postmoderation means that comments appear on the site _before_ any moderation action is taken.

* New comments appear in comment streams immediately.
* New comments do not appear in moderation queues unless they are flagged by other users.

### Word lists

* Banned words - words that the site never allows in a comment
* Suspect words - words whose usage needs to be approved by a moderator before being shown in the stream
* Approved words - words that are usually Banned or Suspect sitewide, but approved for use in a specific article stream


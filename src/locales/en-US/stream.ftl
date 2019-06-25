### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Join the conversation
general-userBoxUnauthenticated-signIn = Sign in
general-userBoxUnauthenticated-register = Register

general-userBoxAuthenticated-signedInAs =
  Signed in as <Username></Username>.

general-userBoxAuthenticated-notYou =
  Not you? <button>Sign Out</button>

general-tabBar-commentsTab = Comments
general-tabBar-myProfileTab = My Profile
general-tabBar-configure = Configure

## Comments Tab

comments-allCommentsTab = All Comments
comments-featuredTab = Featured
comments-featuredCommentTooltip-how = How is a comment featured?
comments-featuredCommentTooltip-handSelectedComments =
  Comments are hand selected by our team as worth reading.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Toggle featured comments tooltip


comments-streamQuery-storyNotFound = Story not found

comments-postCommentForm-submit = Submit
comments-replyList-showAll = Show All
comments-replyList-showMoreReplies = Show More Replies


comments-viewNew =
  { $count ->
    [1] View {$count} new comment
    *[other] View {$count} new comments
  }
comments-loadMore = Load More

comments-permalinkPopover =
  .description = A dialog showing a permalink to the comment
comments-permalinkButton-share = Share
comments-permalinkView-viewFullDiscussion = View Full Discussion
comments-permalinkView-commentRemovedOrDoesNotExist = This comment has been removed or does not exist.

comments-rte-bold =
  .title = Bold

comments-rte-italic =
  .title = Italic

comments-rte-blockquote =
  .title = Blockquote

comments-remainingCharacters = { $remaining } characters remaining

comments-postCommentFormFake-signInAndJoin = Sign in and Join the Conversation

comments-postCommentForm-rteLabel = Post a comment

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Reply

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Submit
comments-replyCommentForm-cancel = Cancel
comments-replyCommentForm-rteLabel = Write a reply
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Edit

comments-editCommentForm-saveChanges = Save Changes
comments-editCommentForm-cancel = Cancel
comments-editCommentForm-close = Close
comments-editCommentForm-rteLabel = Edit comment
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Edit: <time></time> remaining
comments-editCommentForm-editTimeExpired = Edit time has expired. You can no longer edit this comment. Why not post another one?
comments-editedMarker-edited = Edited
comments-showConversationLink-readMore = Read More of this Conversation >
comments-conversationThread-showMoreOfThisConversation =
  Show More of This Conversation

comments-permalinkView-currentViewing = You are currently viewing a
comments-permalinkView-singleConversation = SINGLE CONVERSATION
comments-inReplyTo = In reply to <Username></Username>
comments-replyTo = Replying to: <Username></Username>

comments-reportButton-report = Report
comments-reportButton-reported = Reported

comments-sortMenu-sortBy = Sort By
comments-sortMenu-newest = Newest
comments-sortMenu-oldest = Oldest
comments-sortMenu-mostReplies = Most Replies

comments-userPopover =
  .description = A popover with more user information
comments-userPopover-memberSince = Member since: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignore

comments-userIgnorePopover-ignoreUser = Ignore {$username}?
comments-userIgnorePopover-description =
  When you ignore a commenter, all comments they
  wrote on the site will be hidden from you. You can
  undo this later from My Profile.
comments-userIgnorePopover-ignore = Ignore
comments-userIgnorePopover-cancel = Cancel

comments-userBanPopover-title = Ban {$username}?
comments-userBanPopover-description = 
  Once banned, this user will no longer be able 
  to comment, use reactions, or report comments.
comments-userBanPopover-cancel = Cancel
comments-userBanPopover-ban = Ban

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Feature
comments-moderationDropdown-unfeature = Un-Feature
comments-moderationDropdown-approve = Approve
comments-moderationDropdown-approved = Approved
comments-moderationDropdown-reject = Reject
comments-moderationDropdown-rejected = Rejected
comments-moderationDropdown-ban = Ban User
comments-moderationDropdown-banned = Banned
comments-moderationDropdown-goToModerate = Go to Moderate
comments-moderationDropdown-caretButton =
  .aria-label = Moderate

comments-rejectedTombstone =
  You have rejected this comment. <TextLink>Go to Moderate to review this decision.</TextLink>

comments-featuredTag = Featured
comments-staffTag = Staff

### Featured Comments
comments-featured-gotoConversation = Go to Conversation
comments-featured-replies = Replies

## Profile Tab

profile-myCommentsTab = My Comments
profile-settingsTab = Settings

### Comment History
profile-historyComment-viewConversation = View Conversation
profile-historyComment-replies = Replies {$replyCount}
profile-historyComment-commentHistory = Comment History
profile-historyComment-story = Story: {$title}
profile-profileQuery-errorLoadingProfile = Error loading profile
profile-profileQuery-storyNotFound = Story not found
profile-commentHistory-loadMore = Load More

### Settings
profile-settings-ignoredCommenters = Ignored Commenters
profile-settings-description =
  Once you ignore someone, all of their comments are hidden from you.
  Commenters you ignore will still be able to see your comments.
profile-settings-empty = You are not currently ignoring anyone
profile-settings-stopIgnoring = Stop ignoring


## Report Comment Popover
comments-reportPopover =
  .description = A dialog for reporting comments
comments-reportPopover-reportThisComment = Report This Comment
comments-reportPopover-whyAreYouReporting = Why are you reporting this comment?

comments-reportPopover-reasonOffensive = This comment is offensive
comments-reportPopover-reasonIDisagree = I disagree with this comment
comments-reportPopover-reasonSpam = This looks like an ad or marketing
comments-reportPopover-reasonOther = Other

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Please leave any additional information that may be helpful to our moderators. (Optional)

comments-reportPopover-maxCharacters = Max. { $maxCharacters } Characters
comments-reportPopover-cancel = Cancel
comments-reportPopover-submit = Submit

comments-reportPopover-thankYou = Thank you!
comments-reportPopover-receivedMessage =
  We’ve received your message. Reports from members like you keep the community safe.

comments-reportPopover-dismiss = Dismiss

## Submit Status
comments-submitStatus-dismiss = Dismiss
comments-submitStatus-submittedAndWillBeReviewed =
  Your comment has been submitted and will be reviewed by a moderator

# Configure
configure-configureQuery-errorLoadingProfile = Error loading configure
configure-configureQuery-storyNotFound = Story not found

## Comment Stream
configure-stream-title = Configure this Comment Stream
configure-stream-apply = Apply

configure-premod-title = Enable Pre-Moderation
configure-premod-description =
  Moderators must approve any comment before it is published to this stream.

configure-premodLink-title = Pre-Moderate Comments Containing Links
configure-premodLink-description =
  Moderators must approve any comment that contains a link before it is published to this stream.

configure-messageBox-title = Enable Message Box for this Stream
configure-messageBox-description =
  Add a message to the top of the comment box for your readers. Use this to pose a topic,
  ask a question or make announcements relating to this story.
configure-messageBox-preview = Preview
configure-messageBox-selectAnIcon = Select an Icon
configure-messageBox-noIcon = No Icon
configure-messageBox-writeAMessage = Write a Message

configure-closeStream-title = Close Comment Stream
configure-closeStream-description =
  This comment stream is currently open. By closing this comment stream,
  no new comments may be submitted and all previously submitted comments
  will still be displayed.
configure-closeStream-closeStream = Close Stream

configure-openStream-title = Open Stream
configure-openStream-description =
  This comment stream is currently closed. By opening this comment
  stream new comments may be submitted and displayed.
configure-openStream-openStream = Open Stream

comments-tombstone-ignore = This comment is hidden because you ignored {$username}

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
    [1] View {$count} New Comment
    *[other] View {$count} New Comments
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

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Feature
comments-moderationDropdown-unfeature = Un-Feature
comments-moderationDropdown-approve = Approve
comments-moderationDropdown-approved = Approved
comments-moderationDropdown-reject = Reject
comments-moderationDropdown-rejected = Rejected
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
profile-commentHistory-empty = You have not written any comments
profile-commentHistory-empty-subheading = A history of your comments will appear here

### Settings
profile-settings-ignoredCommenters = Ignored Commenters
profile-settings-description =
  Once you ignore someone, all of their comments are hidden from you.
  Commenters you ignore will still be able to see your comments.
profile-settings-empty = You are not currently ignoring anyone
profile-settings-stopIgnoring = Stop ignoring

profile-settings-changePassword = Change Password
profile-settings-changePassword-oldPassword = Old Password
profile-settings-changePassword-forgotPassword = Forgot your password?
profile-settings-changePassword-newPassword = New Password
profile-settings-changePassword-button = Change Password
profile-settings-changePassword-updated =
  Your password has been updated

profile-settings-download-comments-title = Download my comment history
profile-settings-download-comments-description =
  You will receive an email with a link to download your comment history.
  You can make <strong>one download request every 14 days.</strong>
profile-settings-download-comments-request =
  Request comment history
profile-settings-download-comments-request-icon =
  .title = Request comment history
profile-settings-download-comments-recentRequest =
  Your most recent request: { $timeStamp }
profile-settings-download-comments-timeOut =
  You can submit another request in { framework-timeago-time }

profile-settings-deleteAccount-title = Delete My Account
profile-settings-deleteAccount-description =
  Deleting your account will permanently erase your profile and remove
  all your comments from this site.
profile-settings-deleteAccount-requestDelete-icon
  .title = Request account deletion
profile-settings-deleteAccount-requestDelete = Request account deletion

profile-settings-deleteAccount-pages-deleteButton = Delete my account
profile-settings-deleteAccount-pages-cancel = Cancel
profile-settings-deleteAccount-pages-proceed = Proceed
profile-settings-deleteAccount-pages-done = Done

profile-settings-deleteAccount-pages-descriptionHeader = Delete my account?
profile-settings-deleteAccount-pages-descriptionText =
  You are attempting to delete your account. This means:
profile-settings-deleteAccount-pages-list1 =
  All of your comments are removed from this site
profile-settings-deleteAccount-pages-list2 =
  All of your comments are deleted from our database
profile-settings-deleteAccount-pages-list3 =
  Your username and email address are removed from our system

profile-settings-deleteAccount-pages-whenHeader = Delete my account: When?
profile-settings-deleteAccount-pages-whenSec1Header =
  When will my account be deleted?
profile-settings-deleteAccount-pages-whenSec1Content =
  Your account will be deleted 24 hours after your request has been submitted.
profile-settings-deleteAccount-pages-whenSec2Header =
  Can I still write comments until my account is deleted?
profile-settings-deleteAccount-pages-whenSec2Content =
  No. Once you've requested account deletion, you can no longer write comments,
  reply to comments, or select reactions.

profile-settings-deleteAccount-pages-downloadCommentHeader = Download my comments?
profile-settings-deleteAccount-pages-downloadCommentsDesc =
  Before your account is deleted, we recommend you download your comment
  history for your records. After your account is deleted, you will be
  unable to request your comment history.
profile-settings-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download My Comment History

profile-settings-deleteAccount-pages-confirmHeader = Confirm account deletion?
profile-settings-deleteAccount-pages-confirmDescHeader =
  Are you sure you want to delete your account?
profile-settings-deleteAccount-confirmDescContent
  To confirm you would like to delete your account please type in the following
  phrase into the text box below:
profile-settings-deleteAccount-pages-confirmPhraseLabel =
  To confirm, type phrase below:
profile-settings-deleteAccount-pages-confirmPasswordLabel =
  Enter your password:

profile-settings-deleteAccount-pages-completeHeader = Account deletion requested
profile-settings-deleteAccount-pages-completeDescript =
  Your request has been submitted and a confirmation has been sent to the email
  address associated with your account.
profile-settings-deleteAccount-pages-completeTimeHeader =
  Your account will be deleted on:
profile-settings-deleteAccount-pages-completeSec1Header = Changed your mind?
profile-settings-deleteAccount-pages-completeSec1Content =
  Simply sign in to your account again before this time and select
  <strong>“Cancel Account Deletion Request.”</strong>
profile-settings-deleteAccount-pages-completeSec2Header = Tell us why.
profile-settings-deleteAccount-pages-completeSec2Content =
  We'd like to know why you chose to delete your account. Send us feedback on
  our comment system by emailing { $email }.

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

## Change username
profile-changeUsername-success = Your username has been successfully updated
profile-changeUsername-edit = edit
profile-changeUsername-heading = Edit your username
profile-changeUsername-desc = Change the username that will appear on all of your past and future comments. <strong>Usernames can be changed once every { framework-timeago-time }.</strong>
profile-changeUsername-current = Current username
profile-changeUsername-newUsername-label = New username
profile-changeUsername-confirmNewUsername-label = Confirm new username
profile-changeUsername-cancel = Cancel
profile-changeUsername-submit = <ButtonIcon>save</ButtonIcon> <span>Save</span>
profile-changeUsername-recentChange = Your username has been changed in the last { framework-timeago-time }. You may change your username again on { $nextUpdate }
profile-changeUsername-close = Close

## Comment Stream
configure-stream-title = Configure this Comment Stream
configure-stream-apply = Apply

configure-premod-title = Enable Pre-Moderation
configure-premod-description =
  Moderators must approve any comment before it is published to this stream.

configure-premodLink-title = Pre-Moderate Comments Containing Links
configure-premodLink-description =
  Moderators must approve any comment that contains a link before it is published to this stream.

configure-liveUpdates-title = Enable Live Updates for this Story
configure-liveUpdates-description =
  When enabled, there will be real-time loading and updating of comments as new comments and replies are published.

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

suspendInfo-heading = Your account has been temporarily suspended from commenting.
suspendInfo-info =
  In accordance with { $organization }'s community guidelines your
  account has been temporarily suspended. While suspended you will not
  be able to comment, respect or report comments. Please rejoin the
  conversation on { $until }

profile-changeEmail-unverified = (Unverified)
profile-changeEmail-edit = Edit
profile-changeEmail-please-verify = Verify your email address
profile-changeEmail-please-verify-details = 
  An email has been sent to { $email } to verify your account.
  You must verify your new email address before it can be used for
  signing into your account or for email notifications.
profile-changeEmail-resend = Resend verification
profile-changeEmail-heading = Edit your email address
profile-changeEmail-desc = Change the email address used for signing in and for receiving communication about your account.
profile-changeEmail-current = Current email
profile-changeEmail-newEmail-label = New email address
profile-changeEmail-password = Password
profile-changeEmail-password-input =
  .placeholder = Password
profile-changeEmail-cancel = Cancel
profile-changeEmail-submit = Save

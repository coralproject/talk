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

## Comment Count

comment-count-text =
  { $count  ->
    [one] Comment
    *[other] Comments
  }

## Comments Tab

comments-allCommentsTab = All Comments
comments-featuredTab = Featured
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-featuredCommentTooltip-how = How is a comment featured?
comments-featuredCommentTooltip-handSelectedComments =
  Comments are chosen by our team as worth reading.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Toggle featured comments tooltip
  .title = Toggle featured comments tooltip

comments-bannedInfo-bannedFromCommenting = Your account has been banned from commenting.
comments-bannedInfo-violatedCommunityGuidelines =
  Someone with access to your account has violated our community
  guidelines. As a result, your account has been banned. You will no
  longer be able to comment, respect or report comments. If you think
  this has been done in error, please contact our community team.

comments-noCommentsAtAll = There are no comments on this story.
comments-noCommentsYet = There are no comments yet. Why don't you write one?

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
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink to comment
comments-permalinkButton-share = Share
comments-permalinkButton =
  .aria-label = Share
comments-permalinkView-viewFullDiscussion = View Full Discussion
comments-permalinkView-commentRemovedOrDoesNotExist = This comment has been removed or does not exist.

comments-rte-bold =
  .title = Bold

comments-rte-italic =
  .title = Italic

comments-rte-blockquote =
  .title = Blockquote

comments-rte-bulletedList =
  .title = Bulleted List

comments-rte-strikethrough =
  .title = Strikethrough

comments-rte-spoiler = Spoiler

comments-remainingCharacters = { $remaining } characters remaining

comments-postCommentFormFake-signInAndJoin = Sign in and Join the Conversation

comments-postCommentForm-rteLabel = Post a comment

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Commenting is disabled when your account is scheduled for deletion.

comments-replyButton-reply = Reply
comments-replyButton =
  .aria-label = Reply

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
comments-replyingTo = Replying to <Username></Username>

comments-reportButton-report = Report
comments-reportButton-reported = Reported
comments-reportButton-aria-report =
  .aria-label = Report
comments-reportButton-aria-reported =
  .aria-label = Reported

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
  This comment will also be rejected.
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

### Q&A

general-tabBar-qaTab = Q&A

qa-answeredTab = Answered
qa-unansweredTab = Unanswered
qa-allCommentsTab = All

qa-noQuestionsAtAll =
  There are no questions on this story.
qa-noQuestionsYet =
  There are no questions yet. Why don't you ask one?
qa-viewNew =
  { $count ->
    [1] View {$count} New Question
    *[other] View {$count} New Questions
  }

qa-postQuestionForm-rteLabel = Post a question
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Most Voted

qa-answered-tag = answered
qa-expert-tag = expert

qa-reaction-vote = Vote
qa-reaction-voted = Voted
qa-reaction-aria-vote =
  .aria-label = Vote
qa-reaction-voted =
  .aria-label = Voted

qa-unansweredTab-doneAnswering = Done

qa-expert-email = ({ $email })

qa-answeredTooltip-how = How is a question answered?
qa-answeredTooltip-answeredComments =
  Questions are answered by a Q&A expert.
qa-answeredTooltip-toggleButton =
  .aria-label = Toggle answered questions tooltip
  .title = Toggle answered questions tooltip

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Account deletion requested
comments-stream-deleteAccount-callOut-receivedDesc =
  A request to delete your account was received on { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  If you would like to continue leaving comments, replies or reactions,
  you may cancel your request to delete your account before { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancel account deletion request

### Featured Comments
comments-featured-gotoConversation = Go to Conversation
comments-featured-replies = Replies

## Profile Tab

profile-myCommentsTab = My Comments
profile-myCommentsTab-comments = My comments
profile-accountTab = Account
profile-preferencesTab = Preferences

accountSettings-manage-account = Manage your account

### Account Deletion

profile-accountDeletion-deletionDesc =
  Your account is scheduled to be deleted on { $date }.
profile-accountDeletion-cancelDeletion =
  Cancel account deletion request

### Comment History
profile-historyComment-viewConversation = View Conversation
profile-historyComment-replies = Replies {$replyCount}
profile-historyComment-commentHistory = Comment History
profile-historyComment-story = Story: {$title}
profile-historyComment-comment-on = Comment on:
profile-profileQuery-errorLoadingProfile = Error loading profile
profile-profileQuery-storyNotFound = Story not found
profile-commentHistory-loadMore = Load More
profile-commentHistory-empty = You have not written any comments
profile-commentHistory-empty-subheading = A history of your comments will appear here

### Account
profile-account-ignoredCommenters = Ignored Commenters
profile-account-ignoredCommenters-description =
  You can Ignore other commenters by clicking on their username
  and selecting Ignore. When you ignore someone, all of their
  comments are hidden from you. Commenters you Ignore will still
  be able to see your comments.
profile-account-ignoredCommenters-empty = You are not currently ignoring anyone
profile-account-ignoredCommenters-stopIgnoring = Stop ignoring
profile-account-ignoredCommenters-manage = Manage
profile-account-ignoredCommenters-cancel = Cancel

profile-account-changePassword-cancel = Cancel
profile-account-changePassword = Change Password
profile-account-changePassword-oldPassword = Old Password
profile-account-changePassword-forgotPassword = Forgot your password?
profile-account-changePassword-newPassword = New Password
profile-account-changePassword-button = Change Password
profile-account-changePassword-updated =
  Your password has been updated
profile-account-changePassword-password = Password

profile-account-download-comments-title = Download my comment history
profile-account-download-comments-description =
  You will receive an email with a link to download your comment history.
  You can make <strong>one download request every 14 days.</strong>
profile-account-download-comments-request =
  Request comment history
profile-account-download-comments-request-icon =
  .title = Request comment history
profile-account-download-comments-recentRequest =
  Your most recent request: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Your most recent request was within the last 14 days. You may
  request to download your comments again on: { $timeStamp }
profile-account-download-comments-requested =
  Request submitted. You can submit another request in { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Your request has been successfully submitted. You may request to
  download your comment history again in { framework-timeago-time }.
profile-account-download-comments-error =
  We were unable to complete your download request.
profile-account-download-comments-request-button = Request

## Delete Account

profile-account-deleteAccount-title = Delete My Account
profile-account-deleteAccount-description =
  Deleting your account will permanently erase your profile and remove
  all your comments from this site.
profile-account-deleteAccount-requestDelete = Request account deletion

profile-account-deleteAccount-cancelDelete-description =
  You have already submitted a request to delete your account.
  Your account will be deleted on { $date }.
  You may cancel the request until that time.
profile-account-deleteAccount-cancelDelete = Cancel account deletion request

profile-account-deleteAccount-request = Request
profile-account-deleteAccount-cancel = Cancel
profile-account-deleteAccount-pages-deleteButton = Delete my account
profile-account-deleteAccount-pages-cancel = Cancel
profile-account-deleteAccount-pages-proceed = Proceed
profile-account-deleteAccount-pages-done = Done
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-descriptionHeader = Delete my account?
profile-account-deleteAccount-pages-descriptionText =
  You are attempting to delete your account. This means:
profile-account-deleteAccount-pages-allCommentsRemoved =
  All of your comments are removed from this site
profile-account-deleteAccount-pages-allCommentsDeleted =
  All of your comments are deleted from our database
profile-account-deleteAccount-pages-emailRemoved =
  Your email address is removed from our system

profile-account-deleteAccount-pages-whenHeader = Delete my account: When?
profile-account-deleteAccount-pages-whenSec1Header =
  When will my account be deleted?
profile-account-deleteAccount-pages-whenSec1Content =
  Your account will be deleted 24 hours after your request has been submitted.
profile-account-deleteAccount-pages-whenSec2Header =
  Can I still write comments until my account is deleted?
profile-account-deleteAccount-pages-whenSec2Content =
  No. Once you've requested account deletion, you can no longer write comments,
  reply to comments, or select reactions.

profile-account-deleteAccount-pages-downloadCommentHeader = Download my comments?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Before your account is deleted, we recommend you download your comment
  history for your records. After your account is deleted, you will be
  unable to request your comment history.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download My Comment History

profile-account-deleteAccount-pages-confirmHeader = Confirm account deletion?
profile-account-deleteAccount-pages-confirmDescHeader =
  Are you sure you want to delete your account?
profile-account-deleteAccount-confirmDescContent =
  To confirm you would like to delete your account please type in the following
  phrase into the text box below:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  To confirm, type phrase below:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Enter your password:

profile-account-deleteAccount-pages-completeHeader = Account deletion requested
profile-account-deleteAccount-pages-completeDescript =
  Your request has been submitted and a confirmation has been sent to the email
  address associated with your account.
profile-account-deleteAccount-pages-completeTimeHeader =
  Your account will be deleted on: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Changed your mind?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Simply sign in to your account again before this time and select
  <strong>Cancel Account Deletion Request</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Tell us why.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  We'd like to know why you chose to delete your account. Send us feedback on
  our comment system by emailing { $email }.
profile-account-changePassword-edit = Edit


## Notifications
profile-notificationsTab = Notifications
profile-account-notifications-emailNotifications = E-Mail Notifications
profile-account-notifications-emailNotifications = Email Notifications
profile-account-notifications-receiveWhen = Receive notifications when:
profile-account-notifications-onReply = My comment receives a reply
profile-account-notifications-onFeatured = My comment is featured
profile-account-notifications-onStaffReplies = A staff member replies to my comment
profile-account-notifications-onModeration = My pending comment has been reviewed
profile-account-notifications-sendNotifications = Send Notifications:
profile-account-notifications-sendNotifications-immediately = Immediately
profile-account-notifications-sendNotifications-daily = Daily
profile-account-notifications-sendNotifications-hourly = Hourly
profile-account-notifications-updated = Your notification settings have been updated
profile-account-notifications-button = Update Notification Settings
profile-account-notifications-button-update = Update

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
comments-submitStatus-submittedAndRejected =
  This comment has been rejected for violating our guidelines

# Configure
configure-configureQuery-errorLoadingProfile = Error loading configure
configure-configureQuery-storyNotFound = Story not found

## Change username
profile-changeUsername-username = Username
profile-changeUsername-success = Your username has been successfully updated
profile-changeUsername-edit = Edit
profile-changeUsername-heading = Edit your username
profile-changeUsername-desc = Change the username that will appear on all of your past and future comments. <strong>Usernames can be changed once every { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Change the username that will appear on all of your past and future comments. Usernames can be changed once every { framework-timeago-time }.
profile-changeUsername-current = Current username
profile-changeUsername-newUsername-label = New username
profile-changeUsername-confirmNewUsername-label = Confirm new username
profile-changeUsername-cancel = Cancel
profile-changeUsername-save = Save
profile-changeUsername-recentChange = Your username has been changed in the last { framework-timeago-time }. You may change your username again on { $nextUpdate }
profile-changeUsername-close = Close

## Comment Stream
configure-stream-title = Configure this Comment Stream
configure-stream-title-configureThisStream =
  Configure this Stream
configure-stream-apply = Apply

configure-premod-title = Enable Pre-Moderation
configure-premod-description =
  Moderators must approve any comment before it is published to this story.

configure-premodLink-title = Pre-Moderate Comments Containing Links
configure-premodLink-description =
  Moderators must approve any comment that contains a link before it is published to this story.

configure-liveUpdates-title = Enable Live Updates for this Story
configure-liveUpdates-description =
  When enabled, the comments will be updated instantly
  as new comments and replies are submitted, instead of
  requiring a page refresh. You can disable this in the
  unusual situation of an article getting so much traffic that the comments are loading slowly.

configure-messageBox-title = Enable Message Box for this Story
configure-messageBox-description =
  Add a message to the top of the comment box for your readers.
  Use this to suggest a discussion topic, ask a question or make
  announcements relating to the comments on this story.
configure-messageBox-preview = Preview
configure-messageBox-selectAnIcon = Select an Icon
configure-messageBox-iconConversation = Conversation
configure-messageBox-iconDate = Date
configure-messageBox-iconHelp = Help
configure-messageBox-iconWarning = Warning
configure-messageBox-iconChatBubble = Chat Bubble
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

configure-moderateThisStream = Moderate this stream

configure-enableQA-title = Switch to Q&A Format
configure-enableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-enableQA-enableQA = Switch to Q&A

configure-disableQA-title = Configure this Q&A
configure-disableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-disableQA-disableQA = Switch to Comments

configure-experts-title = Add an Expert
configure-experts-filter-searchField =
  .placeholder = Search by email or username
  .aria-label = Search by email or username
configure-experts-filter-searchButton =
  .aria-label = Search
configure-experts-filter-description =
  Adds an Expert Badge to comments by registered users, only on this
  page. New users must first sign up and open the comments on a page
  to create their account.
configure-experts-search-none-found = No users were found with that email or username
configure-experts-remove-button = Remove
configure-experts-load-more = Load More
configure-experts-none-yet = There are currently no experts for this Q&A.
configure-experts-assigned-title = Experts

comments-tombstone-ignore = This comment is hidden because you ignored {$username}
comments-tombstone-deleted =
  This comment is no longer available. The commenter has deleted their account.

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
  You must verify your new email address before it can be used
  to sign in to your account or to receive notifications.
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
profile-changeEmail-email = Email

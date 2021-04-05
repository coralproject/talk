### Localization for Embed Stream

## General

general-moderate = Moderate

general-userBoxUnauthenticated-joinTheConversation = Neem deel aan die gesprek
general-userBoxUnauthenticated-signIn = Meld aan
general-userBoxUnauthenticated-register = Registreer

general-userBoxAuthenticated-signedIn =
  Aangemeld as
general-userBoxAuthenticated-notYou =
  Nie jy nie? <button>Meld af</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  You have been successfully signed out

general-tabBar-commentsTab = Comments
general-tabBar-myProfileTab = My profiel
general-tabBar-discussionsTab = Discussions
general-tabBar-configure = Configure

general-tabBar-aria-comments =
  .aria-label = Comments
  .title = Comments
general-tabBar-aria-qa =
  .aria-label = Q&A
  .title = Q&A
general-tabBar-aria-myProfile =
  .aria-label = My profiel
  .title = My profiel
general-tabBar-aria-configure =
  .aria-label = Configure
  .title = My profiel
general-tabBar-aria-discussions =
  .aria-label = Discussions
  .title = Discussions

## Comment Count

comment-count-text =
  { $count  ->
    [one] Comment
    *[other] Comments
  }

## Comments Tab

comments-allCommentsTab = Alle kommentare
comments-featuredTab = In fokus
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 person viewing this discussion
    *[other] { SHORT_NUMBER($count) } people viewing this discussion
  }

comments-featuredCommentTooltip-how = Hoe word 'n kommentaar uitgelig?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentare word deur ons span gekies as die moeite werd om te lees.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Toggle featured comments tooltip
  .title = Toggle featured comments tooltip

comments-collapse-toggle =
  .aria-label = Collapse comment thread
comments-bannedInfo-bannedFromCommenting = Your account has been banned from commenting.
comments-bannedInfo-violatedCommunityGuidelines =
  Someone with access to your account has violated our community
  guidelines. As a result, your account has been banned. You will no
  longer be able to comment, use reactions or report comments. If you think
  this has been done in error, please contact our community team.

comments-noCommentsAtAll = There are no comments on this story.
comments-noCommentsYet = There are no comments yet. Why don't you write one?

comments-streamQuery-storyNotFound = Storie nie gevind

comments-commentForm-cancel = Kanselleer
comments-commentForm-saveChanges = Save changes
comments-commentForm-submit = Stuur

comments-postCommentForm-submit = Stuur
comments-replyList-showAll = Show All
comments-replyList-showMoreReplies = Show More Replies

comments-postCommentForm-gifSearch = Search for a GIF
comments-postComment-gifSearch-search =
  .aria-label = Search
comments-postComment-gifSearch-loading = Loading...
comments-postComment-gifSearch-no-results = No results found for {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Paste image URL
comments-postComment-insertImage = Insert

comments-postComment-confirmMedia-youtube = Add this YouTube video to the end of your comment?
comments-postComment-confirmMedia-twitter = Add this Tweet to the end of your comment?
comments-postComment-confirmMedia-cancel = Kanselleer
comments-postComment-confirmMedia-add-tweet = Add Tweet
comments-postComment-confirmMedia-add-video = Add video
comments-postComment-confirmMedia-remove = Remove
comments-commentForm-gifPreview-remove = Remove
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
comments-permalinkButton-share = Deel
comments-permalinkButton =
  .aria-label = Share comment by {$username}
comments-permalinkView-viewFullDiscussion = Sien volle gesprek
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

comments-rte-sarcasm = Sarcasm

comments-rte-externalImage =
  .title = External Image

comments-remainingCharacters = { $remaining } characters remaining

comments-postCommentFormFake-signInAndJoin = Meld aan en neem deel aan die gesprek

comments-postCommentForm-rteLabel = Stuur 'n kommentaar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Antwoord
comments-replyButton =
  .aria-label = Reply to comment by {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Stuur
comments-replyCommentForm-cancel = Kanselleer
comments-replyCommentForm-rteLabel = Skryf 'n antwoord
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Redigeer

comments-commentContainer-avatar =
  .alt = Avatar for { $username }

comments-editCommentForm-saveChanges = Save Changes
comments-editCommentForm-cancel = Kanselleer
comments-editCommentForm-close = Close
comments-editCommentForm-rteLabel = Edit comment
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Edit: <time></time> remaining
comments-editCommentForm-editTimeExpired = Edit time has expired. You can no longer edit this comment. Why not post another one?
comments-editedMarker-edited = Geredigeer
comments-showConversationLink-readMore = Read More of this Conversation >
comments-conversationThread-showMoreOfThisConversation =
  Show More of This Conversation

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Hierdie is 'n enkele gesprek
comments-inReplyTo = In antwoord op <Username></Username>
comments-replyingTo = Antwoord op <Username></Username>

comments-reportButton-report = Rapporteer
comments-reportButton-reported = Gerapporteer
comments-reportButton-aria-report =
  .aria-label = Report comment by {$username}
comments-reportButton-aria-reported =
  .aria-label = Gerapporteer

comments-sortMenu-sortBy = Lys volgens
comments-sortMenu-newest = Jongste
comments-sortMenu-oldest = Oudste
comments-sortMenu-mostReplies = Meeste antwoorde

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
comments-userIgnorePopover-cancel = Kanselleer

comments-userBanPopover-title = Ban {$username}?
comments-userBanPopover-description =
  Once banned, this user will no longer be able
  to comment, use reactions, or report comments.
  This comment will also be rejected.
comments-userBanPopover-scopedDescription =
  Once banned from {$sitename}, this user will
  no longer be able to comment, use reactions, or report
  comments. This comment will also be rejected.
comments-userBanPopover-cancel = Kanselleer
comments-userBanPopover-ban = Ban

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Feature
comments-moderationDropdown-unfeature = Verwyder as 'In fokus'
comments-moderationDropdown-approve = Keur goed
comments-moderationDropdown-approved = Goedgekeur
comments-moderationDropdown-reject = Keur af
comments-moderationDropdown-rejected = Afgekeur
comments-moderationDropdown-ban = Blok gebruiker
comments-moderationDropdown-banned = Banned
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Modereringskerm
comments-moderationDropdown-moderateStory = Modereer storie
comments-moderationDropdown-caretButton =
  .aria-label = Moderate

comments-rejectedTombstone-title = You have rejected this comment.
comments-rejectedTombstone-moderateLink =
  Go to moderate to review this decision

comments-featuredTag = In fokus

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} comment by {$username}
    *[other] {$reaction} ({$count}) comment by {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} comment by {$username}
    [one] {$reaction} comment by {$username}
    *[other] {$reaction} ({$count}) comment by {$username}
  }

comments-jumpToComment-title = Your reply has posted below
comments-jumpToComment-GoToReply = Go to reply

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

qa-sortMenu-mostVoted = Most voted

qa-answered-tag = answered
qa-expert-tag = expert

qa-reaction-vote = Vote
qa-reaction-voted = Voted

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Vote for comment by {$username}
    *[other] Vote ({$count}) for comment by {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Voted for comment by {$username}
    [one] Voted for comment by {$username}
    *[other] Voted ({$count}) for comment by {$username}
  }

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
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Cancel account deletion

comments-permalink-copyLink = Copy link
comments-permalink-linkCopied = Link copied

### Embed Links

comments-embedLinks-showEmbeds = Show embeds
comments-embedLinks-hideEmbeds = Hide embeds

comments-embedLinks-show-giphy = Show GIF
comments-embedLinks-hide-giphy = Hide GIF

comments-embedLinks-show-youtube = Show video
comments-embedLinks-hide-youtube = Hide video

comments-embedLinks-show-twitter = Show Tweet
comments-embedLinks-hide-twitter = Hide Tweet

comments-embedLinks-show-external = Show image
comments-embedLinks-hide-external = Hide image


### Featured Comments
comments-featured-gotoConversation = Gaan na gesprek
comments-featured-replies = Antwoorde

## Profile Tab

profile-myCommentsTab = My kommentaar
profile-myCommentsTab-comments = My kommentaar
profile-accountTab = Account
profile-preferencesTab = Voorkeure

### Bio
profile-bio-title = Bio
profile-bio-description =
  Write a bio to display publicly on your commenting profile. Must be
  less than 100 characters.
profile-bio-remove = Remove
profile-bio-update = Dateer op
profile-bio-success = Your bio has been successfully updated.
profile-bio-removed = Your bio has been removed.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Your account is scheduled to be deleted on { $date }.
profile-accountDeletion-cancelDeletion =
  Cancel account deletion request
profile-accountDeletion-cancelAccountDeletion =
  Cancel account deletion

### Comment History
profile-historyComment-viewConversation = Sien gesprek
profile-historyComment-replies = Antwoorde {$replyCount}
profile-historyComment-commentHistory = Comment History
profile-historyComment-story = Story: {$title}
profile-historyComment-comment-on = Lewer kommentaar op:
profile-profileQuery-errorLoadingProfile = Error loading profile
profile-profileQuery-storyNotFound = Storie nie gevind
profile-commentHistory-loadMore = Load More
profile-commentHistory-empty = Jy het geen kommentare geskryf nie
profile-commentHistory-empty-subheading = Die geskiedenis van jou kommentare sal hier vertoon word

### Preferences

profile-preferences-mediaPreferences = Media Preferences
profile-preferences-mediaPreferences-alwaysShow = Always show GIFs, Tweets, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = This may make the comments slower to load
profile-preferences-mediaPreferences-update = Dateer op
profile-preferences-mediaPreferences-preferencesUpdated =
  Your media preferences have been updated

### Account
profile-account-ignoredCommenters = Ignoreer kommentare
profile-account-ignoredCommenters-description =
  Jy kan ander kommentators ignoreer deur op hul aanmeldnaam te klik en 'Ignore' te kies. 
  Wanneer jy iemand ignoreer, sal al hul kommentare vir jou versteek word. Kommentators wat jy ignoreer, 
  sal steeds jou kommentare kan sien.
profile-account-ignoredCommenters-empty = Daar is niemand wat jy ignoreer nie
profile-account-ignoredCommenters-stopIgnoring = Stop ignoring
profile-account-ignoredCommenters-youAreNoLonger =
  You are no longer ignoring
profile-account-ignoredCommenters-manage = Bestuur
profile-account-ignoredCommenters-cancel = Kanselleer
profile-account-ignoredCommenters-close = Sluit

profile-account-changePassword-cancel = Kanselleer
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
profile-account-deleteAccount-deleteMyAccount = Delete my account
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
profile-account-deleteAccount-cancel = Kanselleer
profile-account-deleteAccount-pages-deleteButton = Delete my account
profile-account-deleteAccount-pages-cancel = Kanselleer
profile-account-deleteAccount-pages-proceed = Proceed
profile-account-deleteAccount-pages-done = Done
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-sharedHeader = Delete my account

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
profile-account-deleteAccount-pages-whenSubHeader = When?
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
profile-account-deleteAccount-pages-downloadSubHeader = Download my comments
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Before your account is deleted, we recommend you download your comment
  history for your records. After your account is deleted, you will be
  unable to request your comment history.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download My Comment History

profile-account-deleteAccount-pages-confirmHeader = Confirm account deletion?
profile-account-deleteAccount-pages-confirmSubHeader = Are you sure?
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
profile-account-deleteAccount-pages-completeSubHeader = Request submitted
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
profile-account-changePassword-change = Change


## Notifications
profile-notificationsTab = Notifications
profile-account-notifications-emailNotifications = E-pos kennisgewings
profile-account-notifications-emailNotifications = E-pos kennisgewings
profile-account-notifications-receiveWhen = Wanneer wil jy kennisgewings ontvang?
profile-account-notifications-onReply = My kommentare is beantwoord
profile-account-notifications-onFeatured = My kommentaar is vertoon
profile-account-notifications-onStaffReplies = 'n Personeellid het terugvoering op my kommentare gegee
profile-account-notifications-onModeration = My hangende kommentaar is oorweeg
profile-account-notifications-sendNotifications = Stuur kennisgewings:
profile-account-notifications-sendNotifications-immediately = Onmiddellik
profile-account-notifications-sendNotifications-daily = Daagliks
profile-account-notifications-sendNotifications-hourly = Uurliks
profile-account-notifications-updated = Your notification settings have been updated
profile-account-notifications-button = Update Notification Settings
profile-account-notifications-button-update = Dateer op

## Report Comment Popover
comments-reportPopover =
  .description = A dialog for reporting comments
comments-reportPopover-reportThisComment = Rapporteer dié kommentaar
comments-reportPopover-whyAreYouReporting = Hoekom rapporteer jy hierdie kommentaar?

comments-reportPopover-reasonOffensive = Die kommentaar is afstootlik
comments-reportPopover-reasonAbusive = Hierdie is beledigende gedrag
comments-reportPopover-reasonIDisagree = Ek stem nie saam met hierdie kommentaar nie
comments-reportPopover-reasonSpam = Hierdie lyk soos 'n advertensie of bemarking
comments-reportPopover-reasonOther = Ander

comments-reportPopover-additionalInformation =
  Bykomende inligting <optional>Opsioneel</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Please leave any additional information that may be helpful to our moderators.

comments-reportPopover-maxCharacters = Net { $maxCharacters } karakters
comments-reportPopover-restrictToMaxCharacters = Please restrict your report to { $maxCharacters } characters
comments-reportPopover-cancel = Kanselleer
comments-reportPopover-submit = Stuur

comments-reportPopover-thankYou = Dankie! 
comments-reportPopover-receivedMessage =
  Ons het jou boodskap ontvang! Jou rapportering help ons om ons gemeenskap te beveilig.

comments-reportPopover-dismiss = Dismiss

## Submit Status
comments-submitStatus-dismiss = Dismiss
comments-submitStatus-submittedAndWillBeReviewed =
  Your comment has been submitted and will be reviewed by a moderator
comments-submitStatus-submittedAndRejected =
  This comment has been rejected for violating our guidelines

# Configure
configure-configureQuery-errorLoadingProfile = Error loading configure
configure-configureQuery-storyNotFound = Storie nie gevind

## Change username
profile-changeUsername-username = Username
profile-changeUsername-success = Your username has been successfully updated
profile-changeUsername-edit = Redigeer
profile-changeUsername-change = Change
profile-changeUsername-heading = Edit your username
profile-changeUsername-heading-changeYourUsername = Change your username
profile-changeUsername-desc = Change the username that will appear on all of your past and future comments. <strong>Usernames can be changed once every { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Change the username that will appear on all of your past and future comments. Usernames can be changed once every { framework-timeago-time }.
profile-changeUsername-current = Current username
profile-changeUsername-newUsername-label = New username
profile-changeUsername-confirmNewUsername-label = Confirm new username
profile-changeUsername-cancel = Kanselleer
profile-changeUsername-save = Save
profile-changeUsername-saveChanges = Save Changes
profile-changeUsername-recentChange = Your username has been changed in the last . You may change your username again on { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  You changed your username within the last { framework-timeago-time }. You may change your username again on: { $nextUpdate }.
profile-changeUsername-close = Close

## Discussions tab

discussions-mostActiveDiscussions = Most active discussions
discussions-mostActiveDiscussions-subhead = Ranked by the most comments received over the last 24 hours on { $siteName }
discussions-mostActiveDiscussions-empty = You haven’t participated in any discussions
discussions-myOngoingDiscussions = My ongoing discussions
discussions-myOngoingDiscussions-subhead = Where you’ve commented across { $orgName }
discussions-viewFullHistory = View full comment history
discussions-discussionsQuery-errorLoadingProfile = Error loading profile
discussions-discussionsQuery-storyNotFound = Storie nie gevind

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Maak die stroom volgens jou voorkeure
configure-stream-apply =
configure-stream-update = Dateer op
configure-stream-streamHasBeenUpdated =
  This stream has been updated

configure-premod-title =
configure-premod-premoderateAllComments = Modereer alle kommentare vooraf
configure-premod-description =
  Moderators moet enige kommentaar goedkeur voor dit gepubliseer kan word.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Modereer kommentare vooraf wat skakels insluit
configure-premodLink-description =
  Moderators moet enige kommentaar wat 'n skakel insluit goedkeur voor dit gepubliseer kan word.

configure-liveUpdates-title =
configure-enableLiveUpdates-title = Enable live updates
configure-liveUpdates-description =
configure-enableLiveUpdates-description =
  When enabled, the comments will be updated instantly as new comments and
  replies are submitted, instead of requiring a page refresh. You can
  disable this in the unusual situation of an article getting so much
  traffic that the comments are loading slowly.
configure-enableLiveUpdates-enable = Enable

configure-disableLiveUpdates-title = Skakel regstreekse opdatering af
configure-disableLiveUpdates-description =
  Wanneer afgeskakel, sal kommentare en antwoorde nie meer dadelik opdateer ná dit gestuur is nie. 
  Kommentators sal die blad moet verfris om nuwe kommentare te sien. Ons beveel hierdie aan onder buitengewone omstandighede 
  soos wanneer hoë verkeer na 'n storie die laai van nuwe kommentare stadiger maak.
configure-disableLiveUpdates-disable = Deaktiveer

configure-liveUpdates-disabledSuccess = Live updates are now disabled
configure-liveUpdates-enabledSuccess = Live updates are now enabled

configure-messageBox-title =
configure-addMessage-title =
  Voeg 'n boodskap of vraag by
configure-messageBox-description =
configure-addMessage-description =
  Plaas 'n boodskap aan jou lesers bo-aan die kommentaarboks. 
  Gebruik hierdie om 'n onderwerp voor te stel, 
  'n vraag te vra of opmerkings oor hierdie storie by te voeg.
configure-addMessage-addMessage = Voeg boodskap by
configure-addMessage-removed = Message has been removed
config-addMessage-messageHasBeenAdded =
  The message has been added to the comment box
configure-addMessage-remove = Remove
configure-addMessage-submitUpdate = Dateer op
configure-addMessage-cancel = Kanselleer
configure-addMessage-submitAdd = Voeg boodskap by

configure-messageBox-preview = Preview
configure-messageBox-selectAnIcon = Select an icon
configure-messageBox-iconConversation = Conversation
configure-messageBox-iconDate = Date
configure-messageBox-iconHelp = Help
configure-messageBox-iconWarning = Warning
configure-messageBox-iconChatBubble = Chat bubble
configure-messageBox-noIcon = No icon
configure-messageBox-writeAMessage = Write a message

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Sluit kommentaarstroom
configure-closeStream-description =
  Hierdie kommentaarstroom is oop. Deur hierdie kommentaarstroom te sluit, sal geen nuwe kommentare gestuur mag word nie 
  en alle kommentare wat vroeër gestuur is, sal steeds wys.
configure-closeStream-closeStream = Sluit stroom
configure-closeStream-theStreamIsNowOpen = The stream is now open

configure-openStream-title = Open Stream
configure-openStream-description =
  This comment stream is currently closed. By opening this comment
  stream new comments may be submitted and displayed.
configure-openStream-openStream = Open Stream
configure-openStream-theStreamIsNowClosed = The stream is now closed

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  The Q&A format is currently in active development. Please contact
  us with any feedback or requests.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Switch to Q&A format
configure-enableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-enableQA-enableQA = Switch to Q&A
configure-enableQA-streamIsNowComments =
  This stream is now in comments format

configure-disableQA-title = Configure this Q&A
configure-disableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-disableQA-disableQA = Switch to Comments
configure-disableQA-streamIsNowQA =
  This stream is now in Q&A format

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
configure-experts-
configure-experts-remove-button = Remove
configure-experts-load-more = Load More
configure-experts-none-yet = There are currently no experts for this Q&A.
configure-experts-search-title = Search for an expert
configure-experts-assigned-title = Experts
configure-experts-noLongerAnExpert = is no longer an expert
comments-tombstone-ignore = This comment is hidden because you ignored {$username}
comments-tombstone-showComment = Show comment
comments-tombstone-deleted =
  This comment is no longer available. The commenter has deleted their account.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Your account has been temporarily suspended from commenting
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  In accordance with { $organization }'s community guidelines your
  account has been temporarily suspended. While suspended you will not
  be able to comment, use reactions or report comments.
suspendInfo-until-pleaseRejoinThe =
  Please rejoin the conversation on { $until }

warning-heading = Your account has been issued a warning
warning-explanation =
  In accordance with our community guidelines your account has been issued a warning.
warning-instructions =
  To continue participating in discussions, please press the "Acknowledge" button below.
warning-acknowledge = Acknowledge

warning-notice = Your account has been issued a warning. To continue participating please <a>review the warning message</a>.

profile-changeEmail-unverified = (Unverified)
profile-changeEmail-current = (current)
profile-changeEmail-edit = Redigeer
profile-changeEmail-change = Change
profile-changeEmail-please-verify = Verify your email address
profile-changeEmail-please-verify-details =
  An email has been sent to { $email } to verify your account.
  You must verify your new email address before it can be used
  to sign in to your account or to receive notifications.
profile-changeEmail-resend = Resend verification
profile-changeEmail-heading = Edit your email address
profile-changeEmail-changeYourEmailAddress =
  Change your email address
profile-changeEmail-desc = Change the email address used for signing in and for receiving communication about your account.
profile-changeEmail-newEmail-label = New email address
profile-changeEmail-password = Password
profile-changeEmail-password-input =
  .placeholder = Password
profile-changeEmail-cancel = Kanselleer
profile-changeEmail-submit = Save
profile-changeEmail-saveChanges = Save changes
profile-changeEmail-email = Email
profile-changeEmail-title = Email address
profile-changeEmail-success = Your email has been successfully updated

## Ratings and Reviews

ratingsAndReviews-reviewsTab = Reviews
ratingsAndReviews-questionsTab = Questions
ratingsAndReviews-noReviewsAtAll = There are no reviews.
ratingsAndReviews-noQuestionsAtAll = There are no questions.
ratingsAndReviews-noReviewsYet = There are no reviews yet. Why don't you write one?
ratingsAndReviews-noQuestionsYet = There are no questions yet. Why don't you ask one?
ratingsAndReviews-selectARating = Select a rating
ratingsAndReviews-youRatedThis = You rated this
ratingsAndReviews-showReview = Show review
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Rate and Review
ratingsAndReviews-askAQuestion = Ask a Question
ratingsAndReviews-basedOnRatings = { $count ->
  [0] No ratings yet
  [1] Based on 1 rating
  *[other] Based on { SHORT_NUMBER($count) } ratings
}

ratingsAndReviews-allReviewsFilter = All reviews
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Star
  *[other] { $rating } Stars
}

comments-addAReviewForm-rteLabel = Add a review (optional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Top of article
stream-footer-links-top-of-comments = Top of comments
stream-footer-links-profile = Profile & Replies
stream-footer-links-discussions = More discussions

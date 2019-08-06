### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Deltag i samtalen
general-userBoxUnauthenticated-signIn = Log ind
general-userBoxUnauthenticated-register = Registrer

general-userBoxAuthenticated-signedInAs =
  Logget ind som <Username></Username>.

general-userBoxAuthenticated-notYou =
  Ikke dig? <button>Log ud</button>

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-configure = Konfigurer

## Comments Tab

comments-allCommentsTab = Alle kommentarer
comments-featuredTab = Fremhævede kommentarer
comments-featuredCommentTooltip-how = Hvordan fremhæves en kommentar?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentarer vælges hånd af vores team som værd at læse.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Se information om fremhævede kommentarer


comments-streamQuery-storyNotFound = Historien blev ikke fundet

comments-postCommentForm-submit = Indsend
comments-replyList-showAll = Vis alt
comments-replyList-showMoreReplies = Vis flere svar


comments-viewNew =
  { $count ->
    [1] Se {$count} kommentar
    *[other] Se {$count} kommentarer
  }
comments-loadMore = Indlæse mere

comments-permalinkPopover =
  .description = En dialog der viser en permalink til kommentaren
comments-permalinkButton-share = Del
comments-permalinkView-viewFullDiscussion = Se fuld diskussion
comments-permalinkView-commentRemovedOrDoesNotExist = Denne kommentar er blevet fjernet eller findes ikke.

comments-rte-bold =
  .title = Fed

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Blokcitat

comments-remainingCharacters = { $remaining } tegn tilbage

comments-postCommentFormFake-signInAndJoin = Log ind, og deltag i samtalen

comments-postCommentForm-rteLabel = Indsend en kommentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Svar

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Indsend
comments-replyCommentForm-cancel = Afbestille
comments-replyCommentForm-rteLabel = Skriv et svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Redigere

comments-editCommentForm-saveChanges = Gem ændringer
comments-editCommentForm-cancel = Afbestille
comments-editCommentForm-close = Lukke
comments-editCommentForm-rteLabel = Rediger kommentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Udgave: <time></time> tilbage
comments-editCommentForm-editTimeExpired = Redigeringstiden er udløbet. Du kan ikke længere redigere denne kommentar. Hvorfor ikke lægge en anden?
comments-editedMarker-edited = Redigeret
comments-showConversationLink-readMore = Læs mere om denne samtale >
comments-conversationThread-showMoreOfThisConversation =
  Vis mere af denne samtale

comments-permalinkView-currentViewing = Du ser i øjeblikket en
comments-permalinkView-singleConversation = ENKELKONVERSATION
comments-inReplyTo = Som svar til <Username></Username>
comments-replyTo = Svar på: <Username></Username>

comments-reportButton-report = Rapporter
comments-reportButton-reported = Rapporteret

comments-sortMenu-sortBy = Sorter efter
comments-sortMenu-newest = Nyeste
comments-sortMenu-oldest = Ældste
comments-sortMenu-mostReplies = De fleste svar

comments-userPopover =
  .description = Se flere brugeroplysninger
comments-userPopover-memberSince = Medlem siden: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorere

comments-userIgnorePopover-ignoreUser = Ignorerer {$username}?
comments-userIgnorePopover-description =
  Når du ignorerer en kommentator, vil alle kommentarer, 
  de skrev på webstedet, være skjult for dig. Du kan fortryde 
  dette senere fra Min profil.
comments-userIgnorePopover-ignore = Ignorerer
comments-userIgnorePopover-cancel = Afbestille

comments-moderationDropdown-popover =
  .description = En menu med indstillinger til at moderere kommentar
comments-moderationDropdown-feature = Fremhæv
comments-moderationDropdown-unfeature = Fjern ikke-fremhæv
comments-moderationDropdown-approve = Godkend
comments-moderationDropdown-approved = Godkendt
comments-moderationDropdown-reject = Afvis
comments-moderationDropdown-rejected = Afvist
comments-moderationDropdown-goToModerate = Gå til moderation
comments-moderationDropdown-caretButton =
  .aria-label = Moderér

comments-rejectedTombstone =
  Du har afvist denne kommentar. <TextLink>Gå til moderation for at gennemgå denne beslutning.</TextLink>

comments-featuredTag = Fremhævet
comments-staffTag = Personale

### Featured Comments
comments-featured-gotoConversation = Gå til samtale
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mine kommentarer
profile-settingsTab = Indstillinger

### Comment History
profile-historyComment-viewConversation = Se samtale
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentarhistorik
profile-historyComment-story = Historie: {$title}
profile-profileQuery-errorLoadingProfile = Fejl ved indlæsning af profil
profile-profileQuery-storyNotFound = Historien blev ikke fundet
profile-commentHistory-loadMore = Indlæse mere
profile-commentHistory-empty = Du har ikke skrevet nogen kommentarer
profile-commentHistory-empty-subheading = En historie med dine kommentarer vises her

### Settings
profile-settings-ignoredCommenters = Ignorerede kommentarer
profile-settings-description =
  Når du ignorerer nogen, er alle deres kommentarer skjult for dig.
  Kommentarer, du ignorerer, kan stadig se dine kommentarer.
profile-settings-empty = Du ignorerer i øjeblikket ingen
profile-settings-stopIgnoring = Stop med at ignorere

profile-settings-changePassword = Skift kodeord
profile-settings-changePassword-oldPassword = Gammelt kodeord
profile-settings-changePassword-forgotPassword = Glemt din adgangskode?
profile-settings-changePassword-newPassword = Nyt kodeord
profile-settings-changePassword-button = Skift kodeord
profile-settings-changePassword-updated =
  Din adgangskode er blevet opdateret

## Report Comment Popover
comments-reportPopover =
  .description = En dialog til rapportering af kommentarer
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

### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Unirse a la conversación
general-userBoxUnauthenticated-signIn = Iniciar sesión
general-userBoxUnauthenticated-register = Registrar

general-userBoxAuthenticated-signedInAs =
  Registrado como <Username></Username>.

general-userBoxAuthenticated-notYou =
  ¿No tú? <button>Desconectar</button>

general-tabBar-commentsTab = Comentarios
general-tabBar-myProfileTab = Mi perfil
general-tabBar-configure = Configurar

## Comments Tab

comments-allCommentsTab = Todos los comentarios
comments-featuredTab = Comentarios resaltados
comments-featuredCommentTooltip-how = ¿Cómo se resalta un comentario?
comments-featuredCommentTooltip-handSelectedComments =
  Los comentarios son seleccionados a mano por nuestro equipo como recomiendas por leer.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Alternar el consejo sobre comentarios resaltados


comments-streamQuery-storyNotFound = Historia no encontrada

comments-postCommentForm-submit = Enviar
comments-replyList-showAll = Mostrar todo
comments-replyList-showMoreReplies = Mostrar más respuestas


comments-viewNew =
  { $count ->
    [1] Ver {$count} nuevo comentario
    *[other] Ver {$count} nuevos comentarios
  }
comments-loadMore = Cargar más

comments-permalinkPopover =
  .description = Un diálogo que muestra un enlace permanente al comentario
comments-permalinkButton-share = Compartir
comments-permalinkView-viewFullDiscussion = Ver discusión completa
comments-permalinkView-commentRemovedOrDoesNotExist = Este comentario ha sido eliminado o no existe.

comments-rte-bold =
  .title = Texto en negrita

comments-rte-italic =
  .title = Texto en cursiva

comments-rte-blockquote =
  .title = Texto citado

comments-remainingCharacters = { $remaining } caracteres restantes

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

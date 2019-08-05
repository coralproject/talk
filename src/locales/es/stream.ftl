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

comments-postCommentFormFake-signInAndJoin = Registrarse y unirse a la conversación

comments-postCommentForm-rteLabel = Publicar un comentario

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Responder

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Envira
comments-replyCommentForm-cancel = Cancelar
comments-replyCommentForm-rteLabel = Escribir una repuesta
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Editar

comments-editCommentForm-saveChanges = Guardar cambios
comments-editCommentForm-cancel = Cancelar
comments-editCommentForm-close = Cerrar
comments-editCommentForm-rteLabel = Editar commentario
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Edición: <time></time> se queda(n)
comments-editCommentForm-editTimeExpired = El tiempo de edición ha expirado. Ya no puedes editar este comentario. ¿Por qué no publicar otro?
comments-editedMarker-edited = Editado
comments-showConversationLink-readMore = Leer más de esta conversación
comments-conversationThread-showMoreOfThisConversation =
  Mostrar más de esta conversación

comments-permalinkView-currentViewing = Actualmente estás viendo
comments-permalinkView-singleConversation = UNA SOLA CONVERSACIÓN
comments-inReplyTo = En respuesta a: <Username></Username>
comments-replyTo = En respuesta a: <Username></Username>

comments-reportButton-report = Reportar
comments-reportButton-reported = Reportado

comments-sortMenu-sortBy = Ordenar por
comments-sortMenu-newest = Nuevos
comments-sortMenu-oldest = Más antiguos
comments-sortMenu-mostReplies = Más respondidos

comments-userPopover =
  .description = Más información del usuario
comments-userPopover-memberSince = Miembro desde: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorar

comments-userIgnorePopover-ignoreUser = ¿Ignorar a {$username}?
comments-userIgnorePopover-description =
  Cuando ignora a un comentarista, se le ocultarán
  todos los comentarios que escribieron en el sitio. 
  Puede deshacer esto más tarde desde Mi perfil.
comments-userIgnorePopover-ignore = Ignorar
comments-userIgnorePopover-cancel = Cancelar

comments-moderationDropdown-popover =
  .description = Un menú para moderar un comentario
comments-moderationDropdown-feature = Resaltar
comments-moderationDropdown-unfeature = Desmarcar
comments-moderationDropdown-approve = Aprobar
comments-moderationDropdown-approved = Aprobado
comments-moderationDropdown-reject = Rechazar
comments-moderationDropdown-rejected = Rechazado
comments-moderationDropdown-goToModerate = Ir a moderación
comments-moderationDropdown-caretButton =
  .aria-label = Moderar

comments-rejectedTombstone =
  Has rechazado este comentario.<TextLink>Vaya a moderación para revisar esta decisión.</TextLink>

comments-featuredTag = Resaltado
comments-staffTag = Miembro del equipo

### Featured Comments
comments-featured-gotoConversation = Ir a conversación
comments-featured-replies = Respuestas

## Profile Tab

profile-myCommentsTab = Mis comentarios
profile-settingsTab = Ajustes

### Comment History
profile-historyComment-viewConversation = Ver conversación
profile-historyComment-replies = Respuestas {$replyCount}
profile-historyComment-commentHistory = Historial de comentarios
profile-historyComment-story = Historia: {$title}
profile-profileQuery-errorLoadingProfile = Error al cargar el perfil
profile-profileQuery-storyNotFound = Historia no encontrada
profile-commentHistory-loadMore = Carga más

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

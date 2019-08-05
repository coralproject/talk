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
profile-settings-ignoredCommenters = Comentaristas ignorados
profile-settings-description =
  Una vez que ignoras a alguien, todos sus comentarios están ocultos para ti.
  Los comentaristas que ignores podrán ver tus comentarios.
profile-settings-empty = Actualmente no estás ignorando a nadie
profile-settings-stopIgnoring = Deja de ignorar


## Report Comment Popover
comments-reportPopover =
  .description = Un diálogo para reportar comentarios
comments-reportPopover-reportThisComment = Reportar este comentario
comments-reportPopover-whyAreYouReporting = ¿Por qué estás reportando este comentario?

comments-reportPopover-reasonOffensive = Este comentario es ofensivo
comments-reportPopover-reasonIDisagree = No estoy de acuerdo con este comentario
comments-reportPopover-reasonSpam = Esto parece un anuncio o marketing
comments-reportPopover-reasonOther = Otro

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Por favor, deje cualquier información adicional que pueda ser útil para nuestros moderadores. (Opcional)

comments-reportPopover-maxCharacters = Máx. { $maxCharacters } caracteres
comments-reportPopover-cancel = Cancelar
comments-reportPopover-submit = Enviar

comments-reportPopover-thankYou = ¡Gracias!
comments-reportPopover-receivedMessage =
  Hemos recibido tu mensaje. Los informes de miembros como Usted mantienen segura a la comunidad.

comments-reportPopover-dismiss = Descartar

## Submit Status
comments-submitStatus-dismiss = Descartar
comments-submitStatus-submittedAndWillBeReviewed =
  Su comentario ha sido enviado y será revisado por un moderador

# Configure
configure-configureQuery-errorLoadingProfile = Error al cargar la configuración
configure-configureQuery-storyNotFound = Historia no encontrada

## Comment Stream
configure-stream-title = Configurar comentarios
configure-stream-apply = Guardar

configure-premod-title = Habilitar pre-moderación
configure-premod-description =
  Los moderadores deben aprobar cualquier comentario antes de que se publique.

configure-premodLink-title = Comentarios pre-moderados que contienen enlaces
configure-premodLink-description =
  Los moderadores deben aprobar cualquier comentario que contenga un enlace antes de que se publique en esta secuencia.

configure-liveUpdates-title = Habilitar actualizaciones en vivo para esta historia
configure-liveUpdates-description =
  Cuando se habilita, se cargarán y actualizarán los comentarios en tiempo real a medida que se publiquen nuevos comentarios y respuestas.

configure-messageBox-title = Habilitar campo de mensaje para esta secuencia
configure-messageBox-description =
  Agregue un mensaje en la parte superior del campo de comentarios para sus lectores. 
  Use esto para plantear un tema, hacer una pregunta o hacer anuncios relacionados
  con esta historia.
configure-messageBox-preview = Avance
configure-messageBox-selectAnIcon = Selecciona un icono
configure-messageBox-noIcon = Ningún icono
configure-messageBox-writeAMessage = Escribe un mensaje

configure-closeStream-title = Cerrar los comentarios
configure-closeStream-description =
  Los comentarios están actualmente abiertos. Al cerrar los comentarios, 
  no se pueden enviar nuevos comentarios y todos los comentarios enviados
  anteriormente se seguirán mostrando.
configure-closeStream-closeStream = Cerrar los comentarios

configure-openStream-title = Abrir los comentarios
configure-openStream-description =
  Los comentarios están actualmente cerrados. 
  Al abrir los comentarios, se pueden enviar y mostrar nuevos comentarios.
configure-openStream-openStream = Abrir los comentarios

comments-tombstone-ignore = Este comentario está oculto porque ignoraste a {$username}

### Localization for Embed Stream

## General

general-moderate = Moderar

general-userBoxUnauthenticated-joinTheConversation = Unirse a la conversación
general-userBoxUnauthenticated-signIn = Iniciar sesión
general-userBoxUnauthenticated-register = Registrarse

general-userBoxAuthenticated-signedIn =
  Sesión iniciada como

general-userBoxAuthenticated-notYou =
  ¿No eres tú? <button>Desconectar</button>

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

comments-bannedInfo-bannedFromCommenting = Su cuenta ha sido bloqueada para poder comentar.
comments-bannedInfo-violatedCommunityGuidelines =
  Alguien con acceso a su cuenta ha violado nuestras directrices de la comunidad.
  Como resultado, su cuenta ha sido bloqueada.
  Ya no podrás comentar, respetar o reportar comentarios. Si usted piensa
  que esto se ha hecho por error, póngase en contacto con nuestro equipo de la comunidad.

comments-noCommentsYet = ¿No hay comentarios. Por qué no escribes uno?

comments-streamQuery-storyNotFound = Historia no encontrada

comments-commentForm-cancel = Cancelar
comments-commentForm-saveChanges = Guardar cambios
comments-commentForm-submit = Enviar

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

comments-replyCommentForm-submit = Enviar
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
comments-replyingTo = En respuesta a <Username></Username>
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


### Q&A

general-tabBar-qaTab = Q&A

qa-answeredTab = Respondido
qa-unansweredTab = Aún sin responder
qa-allCommentsTab = Todas

qa-noQuestionsAtAll =
  No hay preguntas sobre esta historia.
qa-noQuestionsYet =
  No hay preguntas todavía. ¿Por qué no formulas una?
qa-viewNew =
  { $count ->
    [1] View {$count} nueva pregunta
    *[other] View {$count} nuevas preguntas
  }

qa-postQuestionForm-rteLabel = Publica una pregunta
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Más votada

qa-answered-tag = respondido
qa-expert-tag = experto

qa-reaction-vote = Votar
qa-reaction-voted = Votado

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Votar por el comentario de {$username}
    *[other] Votar ({$count}) por el comentario de {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Votado por el comentario de {$username}
    [one] Votado por el comentario de {$username}
    *[other] Votado ({$count}) por el comentario de {$username}
  }

qa-unansweredTab-doneAnswering = Completado

qa-expert-email = ({ $email })

qa-answeredTooltip-how = ¿Cómo será respondida una pregunta?
qa-answeredTooltip-answeredComments =
  Las preguntas serán respondidas por expertos elegidos por nuestro equipo.
qa-answeredTooltip-toggleButton =
  .aria-label = Alternar descripción emergente de preguntas respondidas
  .title = Alternar descripción emergente de preguntas respondidas

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Se ha solicitado la eliminación de la cuenta
comments-stream-deleteAccount-callOut-receivedDesc =
  Se recibió una solicitud para eliminar su cuenta en { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Si desea seguir dejando comentarios, respuestas o reacciones,
  puede cancelar su solicitud para eliminar su cuenta antes del { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancelar la solicitud de eliminación de la cuenta
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Cancelar la eliminación de la cuenta

### Featured Comments
comments-featured-gotoConversation = Ir a conversación
comments-featured-replies = Respuestas

## Profile Tab

profile-myCommentsTab = Mis comentarios
profile-myCommentsTab-comments = Mis comentarios
profile-accountTab = Account
profile-preferencesTab = Preferencias

### Comment History
profile-historyComment-viewConversation = Ver conversación
profile-historyComment-replies = Respuestas {$replyCount}
profile-historyComment-commentHistory = Historial de comentarios
profile-historyComment-story = Historia: {$title}
profile-profileQuery-errorLoadingProfile = Error al cargar el perfil
profile-profileQuery-storyNotFound = Historia no encontrada
profile-commentHistory-loadMore = Carga más
profile-commentHistory-empty = No has escrito comentarios
profile-commentHistory-empty-subheading = El historial de tus comentarios aparecerá aquí

### Preferences
profile-preferences-mediaPreferences = Preferencias de Media
profile-preferences-mediaPreferences-alwaysShow = Siempre muestra GIFs, Tweets, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = Esto puede hacer que los comentarios carguen más lento
profile-preferences-mediaPreferences-update = Actualizar

### Account
profile-account-ignoredCommenters-description =
  Tu puedes ignorar otros comentaristas haciendo clic en su nombre de usuario
  y seleccionando Ignorar. Cuando tu ignoras a alguien, todos sus comentarios
  estarán ocultos para ti. Los comentaristas que tu ignores todavía serán
  capaces de ver tus comentarios.
profile-account-ignoredCommenters-manage = Manejar


profile-account-download-comments-title = Descargar mi historial de comentarios
profile-account-download-comments-description =
  Recibirá un correo electrónico con un enlace para descargar su historial de comentarios.
  <strong>Puede realizar una solicitud de descarga cada 14 días.</strong>
profile-account-download-comments-request =
  Solicitar su historial de comentarios
profile-account-download-comments-request-icon =
  .title = Solicitar su historial de comentarios
profile-account-download-comments-recentRequest =
  Su último solicitud: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Puede realizar una solicitud de descarga cada 14 días. Puede
  pedir una nueva descarga en: { $timeStamp }
profile-account-download-comments-requested =
  Recibido. Puede realizar una solicitud en { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Recibido. Puede realizar una solicitud en { framework-timeago-time }.
profile-account-download-comments-error =
  No podemos cumplir su pedido.
profile-account-download-comments-request-button = SOLICITUD

### Settings
profile-account-ignoredCommenters = Comentaristas ignorados
profile-account-ignoredCommenters-description =
  Una vez que ignoras a alguien, todos sus comentarios están ocultos para ti.
  Los comentaristas que ignores podrán ver tus comentarios.
profile-account-ignoredCommenters-empty = Actualmente no estás ignorando a nadie
profile-account-ignoredCommenters-stopIgnoring = Deja de ignorar

## Notifications
profile-account-notifications-emailNotifications = Notificaciones por correo
profile-account-notifications-receiveWhen = Recibe notificaciones cuando:
profile-account-notifications-onReply = Mi comentario recibe una respuesta
profile-account-notifications-onFeatured = Mi comentario es destacado.
profile-account-notifications-onStaffReplies = Un miembro del staff responde a mi comentario
profile-account-notifications-onModeration = Mi comentario pendiente ha sido revisado
profile-account-notifications-sendNotifications = Enviar Notificaciones:
profile-account-notifications-sendNotifications-immediately = Inmediatamente
profile-account-notifications-sendNotifications-daily = Cada día
profile-account-notifications-sendNotifications-hourly = Cada hora
profile-account-notifications-button-update = Actualizar

## Report Comment Popover
comments-reportPopover =
  .description = Un diálogo para reportar comentarios
comments-reportPopover-reportThisComment = Reportar este comentario
comments-reportPopover-whyAreYouReporting = ¿Por qué estás reportando este comentario?

comments-reportPopover-reasonOffensive = Este comentario es ofensivo
comments-reportPopover-reasonAbusive = Este es un comportamiento abusivo
comments-reportPopover-reasonIDisagree = No estoy de acuerdo con este comentario
comments-reportPopover-reasonSpam = Esto parece un anuncio o marketing
comments-reportPopover-reasonOther = Otro

comments-reportPopover-additionalInformation =
  Información Adicional <optional>Opcional</optional>
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
configure-stream-update = Actualizar

configure-premod-title = Habilitar pre-moderación
configure-premod-premoderateAllComments = Pre-moderar todos los comentarios
configure-premod-description =
  Los moderadores deben aprobar cualquier comentario antes de que se publique.

configure-premodLink-title = Comentarios pre-moderados que contienen enlaces
configure-premodLink-commentsContainingLinks = Pre-moderar comentarios que contienen links
configure-premodLink-description =
  Los moderadores deben aprobar cualquier comentario que contenga un enlace antes de que se publique en esta secuencia.

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

configure-enableQA-title =
configure-enableQA-switchToQA =
  Cambiar a Q&A
configure-enableQA-description =
  El formato de Q&A permite a los miembros de la comunidad enviar preguntas para que las respondan los expertos elegidos.
configure-enableQA-enableQA = Cambiar a Q&A
configure-enableQA-streamIsNowComments =
  Está ahora en el formato de comentarios

configure-disableQA-title = Configurar esta sesión de Q&A
configure-disableQA-description =
  El formato de Q&A permite a los miembros de la comunidad enviar preguntas para que las respondan los expertos elegidos.
configure-disableQA-disableQA = Cambiar a comentarios
configure-disableQA-streamIsNowQA =
  Está ahora en el formato Q&A

configure-experts-title = Agregar un experto
configure-experts-filter-searchField =
  .placeholder = Buscar por email or nombre de usario
  .aria-label = Buscar por email or nombre de usario
configure-experts-filter-searchButton =
  .aria-label = Buscar
configure-experts-filter-description =
  Agregar una insignia de experto a los comentarios de los usuarios registrados, solamente en esta página. Los nuevos usuarios primero deben registrarse y abrir los comentarios en una página para crear su cuenta.
  page.
configure-experts-search-none-found = No se encuentra ningún usario con este email o nombre de usario
configure-experts-
configure-experts-remove-button = Eliminar
configure-experts-load-more = Carga más
configure-experts-none-yet = No hay expertos en el Q&A.
configure-experts-search-title = Buscar un experto
configure-experts-assigned-title = Expertos
configure-experts-noLongerAnExpert = ya no es un experto
comments-tombstone-ignore = Este comentario está escondido porque usted ha ignorado {$username}
comments-tombstone-showComment = Mostrar comentario
comments-tombstone-deleted =
  Este comentario ya no está disponible. El comentarista ha eliminado su cuenta.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Su cuenta ha sido suspendida temporalmente para poder comentar
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  De acuerdo con las directrices de la comunidad de { $organization }, tu
  cuenta ha sido suspendida temporalmente. Mientras esté suspendida
  no podrás comentar, respetar o denunciar comentarios.
suspendInfo-until-pleaseRejoinThe =
  Vuelva a unirse a la conversación el { $until }

warning-heading = Tu cuenta ha recibido una advertencia
warning-explanation =
  De acuerdo con nuestras pautas de la comunidad, se ha emitido una advertencia a su cuenta.
warning-instructions =
  Para continuar participando en las discusiones, presione el botón "Reconocer" a continuación.
warning-acknowledge = Reconocer

warning-notice = Su cuenta ha recibido una advertencia. Para continuar participando, <a> revise el mensaje de advertencia </a>.

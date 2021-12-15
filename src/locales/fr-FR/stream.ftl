### Localization for Embed Stream

## General

general-moderate = Modérer

general-userBoxUnauthenticated-joinTheConversation = Réagir
general-userBoxUnauthenticated-signIn = Se connecter
general-userBoxUnauthenticated-register = S'enregistrer

general-userBoxAuthenticated-signedIn =
  Connecté en tant que
general-userBoxAuthenticated-notYou =
  Ce n'est pas vous ?<button>Se déconnecter</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Vous avez été déconnecté avec succès

general-tabBar-commentsTab = Commentaires
general-tabBar-myProfileTab = Mon profil
general-tabBar-discussionsTab = Discussions
general-tabBar-configure = Configuration

## Comment Count

comment-count-text =
  { $count  ->
    [one] Commentaire
    *[other] Commentaires
  }

## Comments Tab

comments-allCommentsTab = Tous les commentaires
comments-featuredTab = Mis en avant
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 personne regarde cette discussion
    *[other] { SHORT_NUMBER($count) } personnes regardent cette discussion
  }

comments-featuredCommentTooltip-how = Comment un commentaire est déclaré "mise en avant" ?
comments-featuredCommentTooltip-handSelectedComments =
  Les commentaires sont choisis par notre équipe.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Basculer la bulle d'information des commentaires mis en avant
  .title = Basculer la bulle d'information des commentaires mis en avant

comments-bannedInfo-bannedFromCommenting = Votre compte a été banni.
comments-bannedInfo-violatedCommunityGuidelines =
  Quelqu'un ayant accès à votre compte a enfreint les règles
  de notre communauté. En conséquence, votre compte a été banni.
  Vous ne pourrez plus commenter, réagir ou signaler des commentaires.
  Si vous pensez que cela a été fait par erreur,
  veuillez contacter notre équipe.

comments-noCommentsAtAll = Il n'y a aucun commentaire sur ce contenu.
comments-noCommentsYet = Il n'y a pas de commentaire pour le moment. Souhaitez-vous en écrire un ?

comments-streamQuery-storyNotFound = Pas de contenu trouvé.

comments-commentForm-cancel = Annuler
comments-commentForm-saveChanges = Sauvegarder les changements
comments-commentForm-submit = Soumettre

comments-postCommentForm-submit = Soumettre
comments-replyList-showAll = Tout voir
comments-replyList-showMoreReplies = Voir plus de réponses

comments-postCommentForm-gifSeach = Rechercher un GIF
comments-postComment-gifSearch-loading = Chargement...
comments-postComment-gifSearch-no-results = Aucun résultat pour {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Propulsé par giphy

comments-postComment-pasteImage = Coller l'URL d'une image
comments-postComment-insertImage = Insérer

comments-postComment-confirmMedia-youtube = Ajouter cette vidéo Youtube à la fin de votre commentaire?
comments-postComment-confirmMedia-twitter = Ajouter ce tweet à la fin de votre commentaire?
comments-postComment-confirmMedia-cancel = Annuler
comments-postComment-confirmMedia-add-tweet = Ajouter le tweet
comments-postComment-confirmMedia-add-video = Ajouter la vidéo
comments-postComment-confirmMedia-remove = Retirer
comments-commentForm-gifPreview-remove = Retirer
comments-viewNew =
  { $count ->
    [1] Voir le nouveau commentaire
    *[other] Voir les {$count} nouveaux commentaires
  }
comments-loadMore = Charger plus

comments-permalinkPopover =
  .description = Un dialogue qui montre un lien vers le commentaire
 comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalien du commentaire
comments-permalinkButton-share = Partager
comments-permalinkButton =
  .aria-label = Partager le commentaire de {$username}
comments-permalink-copyLink = Copier le lien
comments-permalinkView-viewFullDiscussion = Voir toute la discussion
comments-permalinkView-commentRemovedOrDoesNotExist = Ce commentaire n'existe pas ou a été supprimé.

comments-rte-bold =
  .title = Gras

comments-rte-italic =
  .title = Italique

comments-rte-blockquote =
  .title = Bloc de citation

comments-rte-bulletedList =
  .title = Liste

comments-rte-strikethrough =
  .title = Barré

comments-rte-spoiler = Divulgâcher

comments-rte-sarcasm = Sarcasme

comments-rte-externalImage =
  .title = Image externe

comments-remainingCharacters = { $remaining } caractères restants

comments-postCommentFormFake-signInAndJoin = Se connecter et réagir

comments-postCommentForm-rteLabel = Publier un commentaire

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Les commentaires sont désactivés lorsque la suppression de votre compte est planifiée.

comments-replyButton-reply = Répondre
comments-replyButton =
  .aria-label = Répondre au commentaire de {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Soumettre
comments-replyCommentForm-cancel = Annuler
comments-replyCommentForm-rteLabel = Écrire une réponse
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Modifier

comments-commentContainer-avatar =
  .alt = Avatar de { $username }

comments-editCommentForm-saveChanges = Sauvegarder les changements
comments-editCommentForm-cancel = Annuler
comments-editCommentForm-close = Fermer
comments-editCommentForm-rteLabel = Modifier le commentaire
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Modification : <time></time> restant
comments-editCommentForm-editTimeExpired = Le temps de modification a expiré. Vous ne pouvez plus modifier ce commentaire. Pourquoi ne pas en publier un nouveau ?
comments-editedMarker-edited = Modifié
comments-showConversationLink-readMore = En lire plus sur cette conversation >
comments-conversationThread-showMoreOfThisConversation =
Montrer plus de cette conversation

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Vous consultez actuellement une seule conversation
comments-inReplyTo = En réponse à <Username></Username>
comments-replyingTo = Répondre à <Username></Username>

comments-reportButton-report = Signaler
comments-reportButton-reported = Signalé
comments-reportButton-aria-report =
  .aria-label = Signaler le commentaire de {$username}
comments-reportButton-aria-reported =
  .aria-label = Signalé

comments-sortMenu-sortBy = Trier par
comments-sortMenu-newest = Le plus récent
comments-sortMenu-oldest = Le plus vieux
comments-sortMenu-mostReplies = Le plus de réponses

comments-userPopover =
  .description = Une bulle contextuelle avec plus d'informations sur l'utilisateur.
comments-userPopover-memberSince = Membre depuis : { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorer

comments-userIgnorePopover-ignoreUser = Voulez-vous ignorer {$username} ?
comments-userIgnorePopover-description =
  Lorsque vous ignorez un intervenant, tous les commentaires
  qu'il écrira sur le site vous seront cachés.
  Vous pouvez annuler cette action dans "Mon profil".
comments-userIgnorePopover-ignore = Ignorer
comments-userIgnorePopover-cancel = Annuler

comments-userBanPopover-title = Voulez-vous bannir {$username} ?
comments-userBanPopover-description =
  Une fois banni, cet utilisateur ne sera plus capable
  de commenter, de réagir ou de signaler des commentaires.
  Ce commentaire sera également rejeté.
comments-userBanPopover-cancel = Annuler
comments-userBanPopover-ban = Bannir

comments-moderationDropdown-popover =
  .description = Une bulle contextuelle pour la modération du commentaire
comments-moderationDropdown-feature = Mis en avant
comments-moderationDropdown-unfeature = Désactiver la mise en avant
comments-moderationDropdown-approve = Approuver
comments-moderationDropdown-approved = Approuvé
comments-moderationDropdown-reject = Rejeter
comments-moderationDropdown-rejected = Rejeté
comments-moderationDropdown-ban = Bannir l'utilisateur
comments-moderationDropdown-banned = Banni
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Vue de modération
comments-moderationDropdown-moderateStory = Modérer l'article
comments-moderationDropdown-caretButton =
  .aria-label = Modérer

comments-moderationRejectedTombstone-title = Vous avez rejeté ce commentaire.
comments-moderationRejectedTombstone-moderateLink =
  Allez à la vue de la modération pour réviser cette décision

comments-featuredTag = Mis en avant

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} commentaire de {$username}
    [one] {$reaction} commentaire de {$username}
    *[other] {$reaction} ({$count}) commentaires de {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} commentaire de {$username}
    [one] {$reaction} commentaire de {$username}
    *[other] {$reaction} ({$count}) commentaires de {$username}
  }

comments-jumpToComment-title = Votre réponse a été publiée ci-dessous
comments-jumpToComment-GoToReply = Aller à la réponse

comments-permalink-copyLink = Copier le lien
comments-permalink-linkCopied = Lien copié

### Q&A

general-tabBar-qaTab = Q&R

qa-answeredTab = Répondu
qa-unansweredTab = Non répondu
qa-allCommentsTab = Tous

qa-noQuestionsAtAll =
  Il n'y a aucune question sur ce contenu.
qa-noQuestionsYet =
  Il n'y a aucune question. Pourquoi ne pas en poser une?
qa-viewNew =
  { $count ->
    [1] View {$count} nouvelle question
    *[other] View {$count} nouvelles questions
  }

qa-postQuestionForm-rteLabel = Publier une question
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Plus voté

qa-answered-tag = répondu
qa-expert-tag = expert

qa-reaction-vote = Voter
qa-reaction-voted = Voté

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] vote pour le commentaire de {$username}
    [one] vote pour le commentaire de {$username}
    *[other] ({$count}) votes pour le commentaire de {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] vote pour le commentaire de {$username}
    [one] vote pour le commentaire de {$username}
    *[other] ({$count}) votes pour le commentaire de {$username}
  }

qa-unansweredTab-doneAnswering = Terminé

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Comment une question est-elle répondue?
qa-answeredTooltip-answeredComments =
  Les Questions sont répondues par un expert Q&R.
qa-answeredTooltip-toggleButton =
  .aria-label = Affiche le tooltip des question répondues
  .title = Affiche le tooltip des question répondues

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Requête de suppression de compte
comments-stream-deleteAccount-callOut-receivedDesc =
  Une requête pour supprimer votre compte a été reçue à cette date : { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Si vous voulez continuer à poster des commentaires, à répondre ou à ajouter des réactions, vous devez annuler votre requête de suppression de compte avant cette date { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Annuler la requête de suppression de compte


### Embed Links

comments-embedLinks-showEmbeds = Afficher les pièces jointes
comments-embedLinks-hideEmbeds = Cacher les pièces jointes

comments-embedLinks-show-giphy = Afficher les GIF
comments-embedLinks-hide-giphy = Cacher les GIF

comments-embedLinks-show-youtube = Afficher les vidéos
comments-embedLinks-hide-youtube = Cacher les vidéos

comments-embedLinks-show-twitter = Afficher les tweets
comments-embedLinks-hide-twitter = Cacher les tweets

comments-embedLinks-show-external = Afficher les images
comments-embedLinks-hide-external = Cacher les images

### Featured Comments
comments-featured-gotoConversation = Aller sur la conversation
comments-featured-replies = Les réponses

## Profile Tab

profile-myCommentsTab = Mes commentaires
profile-myCommentsTab-comments = Mes commentaires
profile-accountTab = Mon compte
profile-preferencesTab = Préférences

### Account Deletion

profile-accountDeletion-deletionDesc =
  La suppression de votre compte est prévue pour le { $date }.
profile-accountDeletion-cancelDeletion =
   Annuler la requête de suppression de votre compte.
profile-accountDeletion-cancelAccountDeletion =
   Annuler la suppression de votre compte.

### Comment History
profile-historyComment-viewConversation = Voir la conversation
profile-historyComment-replies = Nombre de réponses : {$replyCount}
profile-historyComment-commentHistory = Historique de commentaires
profile-historyComment-story = Contenu : {$title}
profile-historyComment-comment-on = Commenter :
profile-profileQuery-errorLoadingProfile = Une erreur est survenue lors du chargement de votre profil.
profile-profileQuery-storyNotFound = Pas de contenu trouvé
profile-commentHistory-loadMore = Charger plus
profile-commentHistory-empty = Vous n'avez pas écrit de commentaire.
profile-commentHistory-empty-subheading = Un historique de vos commentaires va apparaître ici.

### Preferences

profile-preferences-mediaPreferences = Préférence des médias
profile-preferences-mediaPreferences-alwaysShow = Toujours afficher les GIFs, Tweets, vidéos YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = Cette option peut ralentir le chargement des commentaires
profile-preferences-mediaPreferences-update = Mettre à jour
profile-preferences-mediaPreferences-preferencesUpdated =
  Vos préférences ont été mises à jour

### Account
profile-account-ignoredCommenters = Intervenants ignorés
profile-account-ignoredCommenters-description =
  Vous pouvez ignorer les autres intervenants en cliquant sur leur pseudo et en selectionnant "Ignorer". Lorsque vous ignorez quelqu'un, tous ses commentaires vous seront cachés. Les intervenants que vous ignorez pourront toujours voir vos commentaires.
profile-account-ignoredCommenters-empty = Vous n'avez ignoré personne.
profile-account-ignoredCommenters-stopIgnoring = Arrêter d'ignorer
profile-account-ignoredCommenters-youAreNoLonger =
  Vous n'ignorez plus
profile-account-ignoredCommenters-manage = Gérer
profile-account-ignoredCommenters-cancel = Annuler
profile-account-ignoredCommenters-close = Fermer

profile-account-changePassword-cancel = Annuler
profile-account-changePassword = Changer le mot de passe
profile-account-changePassword-oldPassword = Ancien mot de passe
profile-account-changePassword-forgotPassword = Mot de passe oublié ?
profile-account-changePassword-newPassword = Nouveau mot de passe
profile-account-changePassword-button = Changer de mot de passe
profile-account-changePassword-updated =
  Votre mot de passe a été mis à jour.
profile-account-changePassword-password = Mot de passe

profile-account-download-comments-title = Télécharger votre historique de commentaires
profile-account-download-comments-description =
  Vous recevrez un email avec un lien pour télécharger votre historique de commentaires.
  Vous pouvez faire <strong>une seule demande de téléchargement de votre historique tous les 14 jours</strong>.
profile-account-download-comments-request =
  Demander l'historique des commentaires
profile-account-download-comments-request-icon =
  .title = Demander l'historique des commentaires
profile-account-download-comments-recentRequest =
  La date de votre dernière demande était : { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Votre demande la plus récente date de moins de 14 jours.
  Vous pourrez soumettre une nouvelle requête le { $timeStamp }.
profile-account-download-comments-requested =
  Requête envoyée. Vous pourrez soumettre une autre demande dans { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Votre demande a bien été envoyée. Vour pourrez effectuer une autre demande
  pour télécharger l'historique des commentaires dans { framework-timeago-time }.
profile-account-download-comments-error =
  Nous sommes incapables de comptléter votre requête de téléchargement.
profile-account-download-comments-request-button = Requête

## Delete Account

profile-account-deleteAccount-title = Supprimer mon compte
profile-account-deleteAccount-deleteMyAccount = Supprimer mon compte
profile-account-deleteAccount-description =
  Supprimer votre compte supprimera de manière irréversible votre profil et effacera tous vos commentaires du site.
profile-account-deleteAccount-requestDelete = Faire une demande de suppression de compte.

profile-account-deleteAccount-cancelDelete-description =
  Vous avez déjà soumis une demande de suppression de votre compte.
  Votre compte sera supprimé le { $date }.
  Vous pouvez annuler votre demande jusqu'à cette date.
profile-account-deleteAccount-cancelDelete = Annuler la demande de suppression de compte

profile-account-deleteAccount-request = Demander
profile-account-deleteAccount-cancel = Annuler
profile-account-deleteAccount-pages-deleteButton = Supprimer mon compte
profile-account-deleteAccount-pages-cancel = Annuler
profile-account-deleteAccount-pages-proceed = Procéder
profile-account-deleteAccount-pages-done = Terminé
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-sharedHeader = Supprimer mon compte

profile-account-deleteAccount-pages-descriptionHeader = Supprimer mon compte ?
profile-account-deleteAccount-pages-descriptionText =
  Vous tentez de supprimer votre compte. Cela implique :
profile-account-deleteAccount-pages-allCommentsRemoved =
  Tous vos commentaires seront supprimés du site.
profile-account-deleteAccount-pages-allCommentsDeleted =
  Tous vos commentaires seront supprimés de notre base de données.
profile-account-deleteAccount-pages-emailRemoved =
  Votre adresse email sera supprimée de notre système.

profile-account-deleteAccount-pages-whenHeader = Supprimer mon compte : Quand ?
profile-account-deleteAccount-pages-whenSubHeader = Quand ?
profile-account-deleteAccount-pages-whenSec1Header =
  Quand mon compte sera-t'il supprimé ?
profile-account-deleteAccount-pages-whenSec1Content =
  Votre compte sera supprimé 24 heures après avoir soumis votre demande.
profile-account-deleteAccount-pages-whenSec2Header =
  Est-il encore possible d'écrire des commentaires en attendant la suppression de mon compte ?
profile-account-deleteAccount-pages-whenSec2Content =
  Non. Une fois que vous avez demandé la suppression de votre compte, vous ne pouvez plus écrire de commentaires, répondre à des commentaires ou réagir.

profile-account-deleteAccount-pages-downloadCommentHeader = Télécharger mes commentaires ?
profile-account-deleteAccount-pages-downloadSubHeader = Télécharger mes commentaires
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Avant que votre compte ne soit supprimé, nous vous recommandons de télécharger votre historique de commentaires pour votre information. Après que votre compte sera supprimé, vous ne pourrez plus faire de demande de téléchargement de votre historique de commentaires.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mon profil > Télécharger mon historique de commentaires

profile-account-deleteAccount-pages-confirmHeader = Confirmer la suppression de compte ?
profile-account-deleteAccount-pages-confirmSubHeader = Êtes-vous certain ?
profile-account-deleteAccount-pages-confirmDescHeader =
  Êtes-vous sûr de vouloir supprimer votre compte ?
profile-account-deleteAccount-confirmDescContent =
  Pour confirmer que vous souhaitez supprimer votre compte, veuillez saisir la phrase suivante dans la zone de texte ci-dessous :
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Pour confirmer, tapez la phrase ci-dessous :
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Entrez votre mot de passe :

profile-account-deleteAccount-pages-completeHeader = Demande de suppression de votre compte
profile-account-deleteAccount-pages-completeDescript =
  Votre demande a été soumise, et une confirmation a été envoyée à l'adresse email
  associée à votre compte.
profile-account-deleteAccount-pages-completeTimeHeader =
  Votre compte sera supprimé le : { $date }.
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Vous avez changé d'avis ?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Reconnectez-vous simplement à votre compte avant cette heure et sélectionnez <strong>Annuler la demande de suppression de compte</strong>.

profile-account-deleteAccount-pages-completeTellUsWhy = Dites-nous pourquoi.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Nous aimerions savoir pourquoi vous avez choisi de supprimer votre compte.
  Envoyez-nous vos commentaires sur notre système de commentaires par email { $email }.
profile-account-changePassword-edit = Modifier
profile-account-changePassword-change = Changer


## Notifications
profile-notificationsTab = Notifications
profile-account-notifications-emailNotifications = Notifications d'E-mail
profile-account-notifications-emailNotifications = Notifications d'Email
profile-account-notifications-receiveWhen = Recevoir des notifications lorsque :
profile-account-notifications-onReply =  Mon commentaire reçoit une réponse.
profile-account-notifications-onFeatured =  Mon commentaire est mis en avant.
profile-account-notifications-onStaffReplies = Un membre de l'équipe répond à mon commentaire.
profile-account-notifications-onModeration = Mon commentaire en attente a été analysé.
profile-account-notifications-sendNotifications = Envoyer des notifications :
profile-account-notifications-sendNotifications-immediately = Immédiatement
profile-account-notifications-sendNotifications-daily = Chaque jour
profile-account-notifications-sendNotifications-hourly = Chaque heure
profile-account-notifications-updated = Vos paramètres de notification ont été mis à jour.
profile-account-notifications-button = Mettre à jour mes paramètres de notification
profile-account-notifications-button-update = Mise à jour

## Report Comment Popover
comments-reportPopover =
  .description = Un dialogue pour les commentaires signalés
comments-reportPopover-reportThisComment = Signaler ce commentaire
comments-reportPopover-whyAreYouReporting = Pourquoi signalez-vous ce commentaire ?

comments-reportPopover-reasonOffensive = Ce commentaire est offensant.
comments-reportPopover-reasonAbusive = C'est un comportement abusif.
comments-reportPopover-reasonIDisagree = Je suis en désaccord avec ce commentaire.
comments-reportPopover-reasonSpam = Il ressemble à une publicité.
comments-reportPopover-reasonOther = Autre

comments-reportPopover-additionalInformation =
  Information supplémentaire <optional>facultatif</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Veuillez indiquer des informations additionnelles qui pourraient être utiles pour nos modérateurs. (Facultatif)

comments-reportPopover-maxCharacters = Nombre de caractères maximal : { $maxCharacters }
comments-reportPopover-restrictToMaxCharacters = Respectez la limite de { $maxCharacters } caractères
comments-reportPopover-cancel = Annuler
comments-reportPopover-submit = Soumettre

comments-reportPopover-thankYou = Merci !
comments-reportPopover-receivedMessage =
  Nous avons reçu votre message. Les signalements faits par des membres comme vous assurent la sécurité de la communauté.
comments-reportPopover-dismiss = Rejeter

## Submit Status
comments-submitStatus-dismiss = Rejeter
comments-submitStatus-submittedAndWillBeReviewed =
    Votre commentaire a été soumis et va être évalué par un modérateur.
comments-submitStatus-submittedAndRejected =
    Ce commentaire a été rejeté car il ne respectait pas les règles.

# Configure
configure-configureQuery-errorLoadingProfile = Une erreur est survenue pendant le chargement des réglages.
configure-configureQuery-storyNotFound = L'article n'a pas été trouvé.

## Change username
profile-changeUsername-username = Pseudo
profile-changeUsername-success = Votre pseudo a bien été mis à jour.
profile-changeUsername-edit = Modifier
profile-changeUsername-edit = Changer
profile-changeUsername-heading = Modifier votre pseudo
profile-changeUsername-heading-changeYourUsername = Changer de pseudo
profile-changeUsername-desc = Changer le pseudo qui apparaît sur tous vos anciens et futurs commentaires. <strong>Le pseudo peut être changé une fois tous les { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Changer le pseudo qui apparaît sur tous vos anciens et futurs commentaires. Le pseudo peut être changé une fois tous les { framework-timeago-time }.
profile-changeUsername-current = Pseudo actuel
profile-changeUsername-newUsername-label = Nouveau pseudo
profile-changeUsername-confirmNewUsername-label = Confirmer le nouveau pseudo
profile-changeUsername-cancel = Annuler
profile-changeUsername-save = Sauvegarder
profile-changeUsername-saveChanges = Sauvegarder les changements
profile-changeUsername-recentChange =  Votre pseudo a été changé dans la dernière { framework-timeago-time }. Vous pourrez le rechanger à partir du { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Vous avez changé votre pseudo dans les derniers { framework-timeago-time }. Vous pourrez changer votre pseudo de nouveau le: { $nextUpdate }.
profile-changeUsername-close = Fermer

## Discussions tab

discussions-mostActiveDiscussions = Discussions les plus actives
discussions-mostActiveDiscussions-subhead = En ordre du nombre de commentaires reçu depuis les dernières 24 heures sur { $siteName }
discussions-mostActiveDiscussions-empty = Vous n'avez participé a aucune discussion
discussions-myOngoingDiscussions = Mes discussions en cours
discussions-myOngoingDiscussions-subhead = Vos commentaires sur { $orgName }
discussions-viewFullHistory = Afficher tout l'historique
discussions-discussionsQuery-errorLoadingProfile = Une erreur s'est produite au chargment du profil
discussions-discussionsQuery-storyNotFound = Article introuvable

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Configurer ce flux de commentaires
configure-stream-apply =
configure-stream-update = Mettre à jour
configure-stream-streamHasBeenUpdated =
  Ce flux a été mis à jour

configure-premod-title =
configure-premod-premoderateAllComments = Pré-modération de tous les commentaires
configure-premod-description =
  Les modérateurs doivent approuver chaque commentaire avant qu'il ne soit publié dans cet article.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  La pré-modération des commentaires contenant des liens.
configure-premodLink-description =
  Les modérateurs doivent approuver chaque commentaire qui contient un lien avant qu'il ne soit publié dans cet article.

configure-messageBox-title =
configure-addMessage-title =
 Ajouter un message ou une question
configure-messageBox-description =
configure-addMessage-description =
  Utilisez-le pour suggérer un sujet de discussion, poser une question
  ou faire des annonces concernant les commentaires de cet article.
configure-addMessage-addMessage = Ajouter un message
configure-addMessage-removed = Le message a été retiré
config-addMessage-messageHasBeenAdded =
  Le message a été ajouté à la boîte de commetaires
configure-addMessage-remove = Retirer
configure-addMessage-submitUpdate = Mettre à jour
configure-addMessage-cancel = Annuler
configure-addMessage-submitAdd = Ajouter le message

configure-messageBox-preview = Aperçu
configure-messageBox-selectAnIcon = Sélectionner une icône
configure-messageBox-iconConversation = Conversation
configure-messageBox-iconDate = Date
configure-messageBox-iconHelp = Aide
configure-messageBox-iconWarning = Attention
configure-messageBox-iconChatBubble = Bulle de discussion
configure-messageBox-noIcon = Aucune icône
configure-messageBox-writeAMessage = Écrire un message

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Fermer le flux de commentaires
configure-closeStream-description =
  Ce flux de commentaires est actuellement ouvert. En le fermant, aucune nouveau commentaire ne pourra être publié et tous les commentaires précédents resteront visibles.
configure-closeStream-closeStream = Fermer le flux
configure-closeStream-theStreamIsNowOpen = Le flux est maintenant ouvert

configure-openStream-title = Ouvrir le flux
configure-openStream-description =
  Ce flux de commentaires est actuellement fermé. En l'ouvrant, de nouveaux commentaires pourront être publiés et visibles.
configure-openStream-openStream = Ouvrir le flux
configure-openStream-theStreamIsNowClosed = The stream est maintenant fermé

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Le format Q&R est présentement en développement. Contactez-nous avec
  vos commentaires ou suggestions.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Basculer au format Q&R
configure-enableQA-description =
  Le format Q&R permet aux membres de la communauté de soumettre des questions
  qui seront répondues par un expect désigné.
configure-enableQA-enableQA = Basculez en Q&R
configure-enableQA-streamIsNowComments =
  Ce flux est présentement en format commentaires

configure-disableQA-title = Configurer ce Q&R
configure-disableQA-description =
  Le format Q&R permet aux membres de la communauté de soumettre des questions
  qui seront répondues par un expect désigné.
configure-disableQA-disableQA = Basculer en format commentaires
configure-disableQA-streamIsNowQA =
  Ce flux est présentement en format Q&R

configure-experts-title = Ajouter un expert
configure-experts-filter-searchField =
  .placeholder = Rechercher par email ou pseudo
  .aria-label = Rechercher par email ou pseudo
configure-experts-filter-searchButton =
  .aria-label = Rechercher
configure-experts-filter-description =
  Ajouter une badge d'expert aux commentaires de l'utilisateur désigné, seulement
  sur cette page. Les nouveux utilisateurs doivent d'abord se créer un compte et s'y
  connecter sur une page de commentaires.
configure-experts-search-none-found = Aucun utilisateur n'a été trouvé à partir de ce email ou pseudo
configure-experts-
configure-experts-remove-button = Retirer
configure-experts-load-more = Charger plus
configure-experts-none-yet = Il n'y a présentement aucun expert pour ce Q&R
configure-experts-search-title = Rechercher un expert
configure-experts-assigned-title = Experts
configure-experts-noLongerAnExpert = n'est plus un expert
comments-tombstone-ignore = Ce commentaire est caché, car vous avez ignoré {$username}.
comments-tombstone-showComment = Afficher le commentaire
comments-tombstone-deleted =
  Ce commentaire n'est plus disponible. L'intervenant a supprimé son compte.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Votre compte a été temporairement suspendu des commentaires.
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  Conformément aux directives de la communauté de { $organization },
  votre compte a été temporairement suspendu. Pendant la suspension,
  vous ne pourrez ni commenter, ni réagir, ni signaler de commentaires.
suspendInfo-until-pleaseRejoinThe =
  Vous pourrez rejoindre la conversation le { $until }.

warning-heading = Votre compte a reçu un avertissement
warning-explanation =
  En conformité avec nos règlements de communauté, votre compte a reçu un avertissement.
warning-instructions =
  Pour pouvoir continuer de participer aux discussions, appuyez sur le bouton "J'ai compris" ci-dessous.
warning-acknowledge = J'ai compris

warning-notice = Votre compte a reçu un avertissement. Pour continuer de participer, veuillez <a>prendre connaissance de l'avertissmenet</a>

profile-changeEmail-unverified = (Non vérifié)
profile-changeEmail-current = (actuel)
profile-changeEmail-edit = Modifer
profile-changeEmail-change = Changer
profile-changeEmail-please-verify = Vérifier votre adresse email
profile-changeEmail-please-verify-details =
  Un email a été envoyé a l'adresse { $email } pour vérifier votre compte.
  Vous devez vérifier votre nouvelle adresse email
  avant de pouvoir vous connecter sur votre compte
  ou de pouvoir recevoir des notifications.
profile-changeEmail-resend = Renvoyer une vérification
profile-changeEmail-heading = Modifier votre adresse email
profile-changeEmail-changeYourEmailAddress =
  Changer votre adresse email
profile-changeEmail-desc = Changer l'adresse email utilisée pour vous connecter et pour communiquer à propos de votre compte
profile-changeEmail-newEmail-label = Nouvelle adresse email
profile-changeEmail-password = Mot de passe
profile-changeEmail-password-input =
  .placeholder = Mot de passe
profile-changeEmail-cancel = Annuler
profile-changeEmail-submit = Sauvegarder
profile-changeEmail-saveChanges = Sauvegarder les changements
profile-changeEmail-email = Email
profile-changeEmail-title = Adresse mail
profile-changeEmail-success = Votre email a bien été mis à jour

## Ratings and Reviews

ratingsAndReviews-reviewsTab = Avis
ratingsAndReviews-questionsTab = Questions
ratingsAndReviews-noReviewsAtAll = Il n'y a pas d'avis.
ratingsAndReviews-noQuestionsAtAll = Il n'y a pas de question.
ratingsAndReviews-noReviewsYet = Il n'y a pas encore d'avis. Pourquoi ne pas en écrire un ?
ratingsAndReviews-noQuestionsYet = Il n'y a pas encore de question. Pourquoi ne pas en écrire une ?
ratingsAndReviews-selectARating = Choisir une note
ratingsAndReviews-youRatedThis = Vous avez noté ceci
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Notes et avis
ratingsAndReviews-askAQuestion = Poser une question
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Pas de note
  [1] Basé sur une note
  *[other] Basé sur { SHORT_NUMBER($count) } notes
}

ratingsAndReviews-allReviewsFilter = Toues les avis
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 étoile
  *[other] { $rating } étoiles
}

comments-addAReviewForm-rteLabel = Ajouter un avis (optionnel)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Revenir au début du contenu
  .title = Aller en haut de l'article
stream-footer-links-top-of-comments = Revenir au début des commentaires
  .title = Aller en haut des commentaires
stream-footer-links-profile = Profile et réponses
  .title = Aller au profil et aux réponses
stream-footer-links-discussions = Plus de discussions
  .title = Lire plus de discussions


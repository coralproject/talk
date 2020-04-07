### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Réagir
general-userBoxUnauthenticated-signIn = Se connecter
general-userBoxUnauthenticated-register = S'enregistrer

general-userBoxAuthenticated-signedInAs =
  Connecté en tant que <Username></Username>.

general-userBoxAuthenticated-notYou =
  Ce n'est pas vous ?<button>Se déconnecter</button>

general-tabBar-commentsTab = Commentaires
general-tabBar-myProfileTab = Mon profil
general-tabBar-configure = Configuration

## Comment Count

comment-count-text =
  { $count  ->
    [one] Commentaire
    *[other] Commentaires
  }

## Comments Tab

comments-allCommentsTab = Tous les commentaires
comments-featuredTab = En vedette
comments-featuredCommentTooltip-how = Comment un commentaire est déclaré "en vedette" ?
comments-featuredCommentTooltip-handSelectedComments =
  Les commentaires sont choisis par notre équipe comme dignes d'être lus.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Basculer la bulle d'information des commentaires en vedette

comments-bannedInfo-bannedFromCommenting = Votre compte a été banni des commentaires.
comments-bannedInfo-violatedCommunityGuidelines =
  Quelqu'un ayant accès à votre compte a enfreint les règles
  de notre communauté. En conséquence, votre compte a été banni. 
  Vous ne pourrez plus commenter, réagir ou signaler des commentaires.
  Si vous pensez que cela a été fait par erreur,
  veuillez contacter notre équipe communautaire.


comments-noCommentsYet = Il n'y a pas de commentaire pour le moment. Souhaitez-vous en écrire un ?

comments-streamQuery-storyNotFound = Pas d'article trouvé.

comments-postCommentForm-submit = Soumettre
comments-replyList-showAll = Tout voir
comments-replyList-showMoreReplies = Voir plus de réponses

comments-viewNew =
  { $count ->
    [1] Voir {$count} nouveau commentaire
    *[other] voir {$count} nouveaux commentaires
  }
comments-loadMore = Charger plus

comments-permalinkPopover =
  .description = Un dialogue qui montre un lien vers le commentaire
comments-permalinkButton-share = Partager
comments-permalinkView-viewFullDiscussion = Voir toute la discussion
comments-permalinkView-commentRemovedOrDoesNotExist = Ce commentaire n'existe pas ou a été supprimé.

comments-rte-bold =
  .title = Gras

comments-rte-italic =
  .title = Italique

comments-rte-blockquote =
  .title = Bloc de citation

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

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Soumettre
comments-replyCommentForm-cancel = Annuler
comments-replyCommentForm-rte☺Label = Écrire une réponse  
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Modifier

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

comments-permalinkView-currentViewing = Vous consultez actuellement un
comments-permalinkView-singleConversation = UNE SEULE CONVERSATION
comments-inReplyTo = En réponse à <Username></Username>
comments-replyTo = Répondre à : <Username></Username>

comments-reportButton-report = Signaler
comments-reportButton-reported = Signalé

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
comments-moderationDropdown-feature = En vedette 
comments-moderationDropdown-unfeature = Désactiver la mise en vedette
comments-moderationDropdown-approve = Approuver
comments-moderationDropdown-approved = Approuvé
comments-moderationDropdown-reject = Rejeter
comments-moderationDropdown-rejected = Rejeté
comments-moderationDropdown-ban = Bannir l'utilisateur
comments-moderationDropdown-banned = Banni
comments-moderationDropdown-goToModerate = Aller à la modération
comments-moderationDropdown-caretButton =
  .aria-label = Modérer

comments-rejectedTombstone =
  Vous avez rejeté ce commentaire. <TextLink> Aller à la modération pour revoir votre décision.</TextLink>

comments-featuredTag = En vedette

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Requête de suppression de compte
comments-stream-deleteAccount-callOut-receivedDesc =
  Une requête pour supprimer votre compte a été reçue à cette date : { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Si vous voulez continuer de poster des commentaires, de répondre ou d'ajouter des réactions, vous devriez annuler votre requête de suppression de compte avant cette date { $date }.
comments-stream-deleteAccount-callOut-cancel = 
  Annuler la requête de suppression de compte

### Featured Comments
comments-featured-gotoConversation = Aller sur la conversation
comments-featured-replies = Les réponses  

## Profile Tab

profile-myCommentsTab = Mes commentaires
profile-myCommentsTab-comments = Mes commentaires
profile-accountTab = Mon compte

accountSettings-manage-account = Gérer mon compte

### Account Deletion

profile-accountDeletion-deletionDesc =
  La suppression de votre compte est prévue pour le { $date }.
profile-accountDeletion-cancelDeletion =
   Annuler la requête de suppression de votre compte.

### Comment History
profile-historyComment-viewConversation = Voir la conversation
profile-historyComment-replies = Nombre de réponses : {$replyCount}
profile-historyComment-commentHistory = Historique de commentaires
profile-historyComment-story = Article : {$title}
profile-historyComment-comment-on = Commenter :
profile-profileQuery-errorLoadingProfile = Une erreur est survenue lors du chargement de votre profil.
profile-profileQuery-storyNotFound = Pas d'article trouvé
profile-commentHistory-loadMore = Charger plus
profile-commentHistory-empty = Vous n'avez pas écrit de commentaire.
profile-commentHistory-empty-subheading = Un historique de vos commentaires va apparaître ici.

### Account
profile-account-ignoredCommenters = Intervenants ignorés
profile-account-ignoredCommenters-description =
  Vous pouvez ignorer les autres intervenants en cliquant sur leur pseudo et en selectionnant "Ignorer". Lorsque vous ignorez quelqu'un, tous ses commentaires vous seront cachés. Les intervenants que vous ignorez pourront toujours voir vos commentaires.
profile-account-ignoredCommenters-empty = Vous n'avez ignoré personne.
profile-account-ignoredCommenters-stopIgnoring = Arrêter d'ignorer 
profile-account-ignoredCommenters-manage = Gérer
profile-account-ignoredCommenters-cancel = Annuler

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
profile-account-download-comments-timeOut =
  Vous pouvez soumettre une nouvelle requête dans { framework-timeago-time }.
profile-account-download-comments-request-button = Requête

## Delete Account

profile-account-deleteAccount-title = Supprimer mon compte
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
profile-account-deleteAccount-pages-whenSec1Header =
  Quand mon compte sera-t'il supprimé ?
profile-account-deleteAccount-pages-whenSec1Content =
  Votre compte sera supprimé 24 heures après avoir soumis votre demande.
profile-account-deleteAccount-pages-whenSec2Header =
  Est-il encore possible d'écrire des commentaires en attendant la suppression de mon compte ?
profile-account-deleteAccount-pages-whenSec2Content =
  Non. Une fois que vous avez demandé la suppression de votre compte, vous ne pouvez plus écrire de commentaires, répondre à des commentaires ou réagir.

profile-account-deleteAccount-pages-downloadCommentHeader = Télécharger mes commentaires ?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Avant que votre compte ne soit supprimé, nous vous recommandons de télécharger votre historique de commentaires pour votre information. Après que votre compte sera supprimé, vous ne pourrez plus faire de demande de téléchargement de votre historique de commentaires.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mon profil > Télécharger mon historique de commentaires

profile-account-deleteAccount-pages-confirmHeader = Confirmer la suppression de compte ?
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


## Notifications
profile-notificationsTab = Notifications
profile-account-notifications-emailNotifications = Notifications d'E-mail
profile-account-notifications-emailNotifications = Notifications d'Email
profile-account-notifications-receiveWhen = Recevoir des notifications lorsque :
profile-account-notifications-onReply =  Mon commentaire reçoit une réponse.
profile-account-notifications-onFeatured =  Mon commentaire est mis en vedette.
profile-account-notifications-onStaffReplies = Un membre du staff répond à mon commentaire.
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
comments-reportPopover-reasonIDisagree = Je suis en désaccord avec ce commentaire.
comments-reportPopover-reasonSpam = Il ressemble à une publicité.
comments-reportPopover-reasonOther = Autre

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Veuillez indiquer des informations additionnelles qui pourraient être utiles pour nos modérateurs. (Facultatif)

comments-reportPopover-maxCharacters = Nombre de caractères maximal : { $maxCharacters }
comments-reportPopover-cancel = Annuler
comments-reportPopover-submit = Soumettre

comments-reportPopover-thankYou = Merci !
comments-reportPopover-receivedMessage =
  Nous avons reçu votre message. Les signalements faits par des membres comme vous assurent la sécurité de la communauté.
comments-reportPopover-dismiss = Rejeter

## Submit Status
comments-submitStatus-dismiss = Rejeter
comments-submitStatus-submittedAndWillBeReviewed =
    Votre commentaire a été soumis et va être jugé par un modérateur.

# Configure
configure-configureQuery-errorLoadingProfile = Une erreur est survenue pendant le chargement des réglages.
configure-configureQuery-storyNotFound = L'article n'a pas été trouvé.

## Change username
profile-changeUsername-username = Pseudo
profile-changeUsername-success = Votre pseudo a bien été mis à jour.
profile-changeUsername-edit = Modifier
profile-changeUsername-heading = Modifier votre pseudo
profile-changeUsername-desc = 
Changer le pseudo qui apparaît sur tous vos anciens et futurs commentaires. <strong>Le pseudo peut être changé une fois tous les { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Changer le pseudo qui apparaît sur tous vos anciens et futurs commentaires. Le pseudo peut être changé une fois tous les { framework-timeago-time }.
profile-changeUsername-current = Pseudo actuel
profile-changeUsername-newUsername-label = Nouveau pseudo
profile-changeUsername-confirmNewUsername-label = Confirmer le nouveau pseudo
profile-changeUsername-cancel = Annuler
profile-changeUsername-save = Sauvegarder
profile-changeUsername-recentChange =  Votre pseudo a été changé dans la dernière { framework-timeago-time }. Vous pourrez le rechanger à partir du { $nextUpdate }.
profile-changeUsername-close = Fermer

## Comment Stream
configure-stream-title = Configurer ce flux de commentaires
configure-stream-apply = Appliquer

configure-premod-title = Activer la pré-modération
configure-premod-description =
  Les modérateurs doivent approuver chaque commentaire avant qu'il ne soit publié dans cet article.

configure-premodLink-title = La pré-modération dans les commentaires contenant des liens.
configure-premodLink-description =
  Les modérateurs doivent approuver chaque commentaire qui contient un lien avant qu'il ne soit publié dans cet article.

configure-liveUpdates-title = Activer la mise à jour en direct pour cet article
configure-liveUpdates-description =
  Lorsque cette option est activée, les commentaires sont mis à jour instantanément lorsque de nouveaux commentaires et réponses sont soumis, au lieu de nécessiter un rafraîchissement de la page. Vous pouvez le désactiver dans la situation inhabituelle d'un article qui génère un trafic si important que les commentaires se chargent lentement.


configure-messageBox-title = Activer la boîte de message pour cet article
configure-messageBox-description =
  Utilisez-le pour suggérer un sujet de discussion, poser une question
  ou faire des annonces concernant les commentaires de cet article.
configure-messageBox-preview = Aperçu
configure-messageBox-selectAnIcon = Sélectionner une icône
configure-messageBox-noIcon = Aucune icône
configure-messageBox-writeAMessage = Écrire un message

configure-closeStream-title =  Fermer le flux de commentaires
configure-closeStream-description =
  Ce flux de commentaires est actuellement ouvert. En le fermant, aucune nouveau commentaire ne pourra être publié et tous les commentaires précédents resteront visibles.
configure-closeStream-closeStream = Fermer le flux

configure-openStream-title = Ouvrir le flux
configure-openStream-description =
  Ce flux de commentaires est actuellement fermé. En l'ouvrant, de nouveaux commentaires pourront être publiés et visibles.
configure-openStream-openStream = Ouvrir le flux

comments-tombstone-ignore = Ce commentaire est caché, car vous avez ignoré {$username}.
comments-tombstone-deleted =
  Ce commentaire n'est plus disponible. L'intervenant a supprimé son compte.

suspendInfo-heading = Votre compte a été temporairement suspendu des commentaires.
suspendInfo-info =
  Conformément aux directives de la communauté de { $organization },
  votre compte a été temporairement suspendu. Pendant la suspension,
  vous ne pourrez ni commenter, ni réagir, ni signaler de commentaires.
  Vous pourrez rejoindre la conversation le { $until }.

profile-changeEmail-unverified = (Non vérifié)
profile-changeEmail-edit = Modifer
profile-changeEmail-please-verify = Vérifier votre adresse email
profile-changeEmail-please-verify-details =
  Un email a été envoyé a l'adresse { $email } pour vérifier votre compte.
  Vous devez vérifier votre nouvelle adresse email
  avant de pouvoir vous connecter sur votre compte
  ou de pouvoir recevoir des notifications.
profile-changeEmail-resend = Renvoyer une vérification
profile-changeEmail-heading = Modifier votre adresse email
profile-changeEmail-desc = Changer l'adresse email utilisée pour vous connecter et pour communiquer à propos de votre compte
profile-changeEmail-current = Email actuel
profile-changeEmail-newEmail-label = Nouvelle adresse email
profile-changeEmail-password = Mot de passe
profile-changeEmail-password-input =
  .placeholder = Mot de passe
profile-changeEmail-cancel = Annuler 
profile-changeEmail-submit = Sauvegarder
profile-changeEmail-email = Email

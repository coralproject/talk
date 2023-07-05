# Notifications du compte

email-footer-accountNotification =
  Envoyé par <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Demande de réinitialisation du mot de passe
email-template-accountNotificationForgotPassword =
  Bonjour { $username },<br/><br/>
  Nous avons reçu une demande de réinitialisation de votre mot de passe sur <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Veuillez suivre ce lien afin de réinitialiser votre mot de passe : <a data-l10n-name="resetYourPassword">Cliquez ici pour réinitialiser votre mot de passe</a><br/><br/>
  <i>Si vous n'avez pas demandé cela, vous pouvez ignorer ce mail.</i><br/>

email-subject-accountNotificationBan = Votre compte a été banni
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Si vous pensez que cela a été fait par erreur, veuillez contacter les modérateurs
  à <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Votre mot de passe a été modifié
email-template-accountNotificationPasswordChange =
  Bonjour { $username },<br/><br/>
  Le mot de passe de votre compte a été modifié. <br/><br/>
  Si vous n'avez pas demandé cette modification,
  veuillez contacter nos modérateurs à <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Votre nom d'utilisateur a été changé
email-template-accountNotificationUpdateUsername =
  Bonjour { $username },<br/><br/>
  Merci d'avoir mis à jour les informations de votre compte sur { $organizationName } . Les changements sont effectifs immédiatement. <br /><br />
  Si vous n'avez pas éffectué de changement veuillez contacter nos modérateurs à <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Votre compte a été suspendu
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Si vous pensez que cela a été fait par erreur, veuillez contacter les modérateurs
  à <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Confirmer l'e-mail
email-template-accountNotificationConfirmEmail =
  Bonjour { $username },<br/><br/>
  Pour confirmer votre adresse e-mail à utiliser sur  { $organizationName },
  veuillez suivre ce lien: <a data-l10n-name="confirmYourEmail">Cliquez ici afin de confirmer votre e-mail</a><br/><br/>
  Si vous n'avez pas récemment créé un compte de commentaire sur
  { $organizationName }, vous pouvez ignorer cet email sans risque.

email-subject-accountNotificationInvite = Invitation Team Coral
email-template-accountNotificationInvite =
 Vous avez été invité à rejoindre l'équipe de { $organizationName } sur Coral. Terminer
  la configuration de votre compte <a data-l10n-name="invite">ici</a>.

email-subject-accountNotificationDownloadComments = Vos commentaires sont prêts à être téléchargés
email-template-accountNotificationDownloadComments =
  Vos commentaires de { $organizationName } à partir de { $date } sont maintenant disponibles pour le téléchargement.<br /><br />
  <a data-l10n-name="downloadUrl">Télécharger l'archive de mes commentaires</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Votre compte de commentateur est programmé pour être supprimé
email-template-accountNotificationDeleteRequestConfirmation =
  Une demande de suppression de votre compte de commentateur a été reçue.
  La suppression de votre compte est prévue pour le { $requestDate }.<br /><br />
  Après cette période, tous vos commentaires seront retirés du site,
  tous vos commentaires seront retirés de notre base de données, et votre
  nom d'utilisateur et l'adresse e-mail seront supprimés de notre système.<br /><br />
  Si vous changez d'avis, vous pouvez vous connecter à votre compte et annuler la
  demande avant l'heure prévue pour la suppression de votre compte.

email-subject-accountNotificationDeleteRequestCancel =
  Votre demande de suppression de compte a été annulée
email-template-accountNotificationDeleteRequestCancel =
  Vous avez annulé votre demande de suppression de compte pour { $organizationName }.
  Votre compte est maintenant réactivé.

email-subject-accountNotificationDeleteRequestCompleted =
  Votre compte a été supprimé
email-template-accountNotificationDeleteRequestCompleted =
  Votre compte de commentateur sur { $organizationName } est maintenant supprimé. Nous sommes tristes de
  vous voir partir! <br /><br />
  Si vous souhaitez nous rejoindre à nouveau à l'avenir, vous pouvez vous créer
  un nouveau compte.<br /><br />
  Si vous souhaitez nous faire part de vos commentaires sur les raisons de votre départ et ce que nous pouvons faire pour
  améliorer l'expérience des commentaire, veuillez nous envoyer un e-mail à
  { $organizationContactEmail}.

# Notification

email-footer-notification =
  Envoyé par <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Se désinscrire de ces notifications</a>

## En réponse

email-subject-notificationOnReply = Quelqu'un a répondu à votre commentaire sur { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } a répondu au <a data-l10n-name="commentPermalink">commentaire</a> que vous a posté sur <a data-l10n-name="storyLink">{ $storyTitle }</a>

## En vedette

email-subject-notificationOnFeatured = L'un de vos commentaires a été mis en avant sur { $organizationName }
email-template-notificationOnFeatured =
  Un membre de notre équipe a mis en avant <a data-l10n-name="commentPermalink">le commentaire</a> que vous avez posté sur <a data-l10n-name="storyLink">{ $storyTitle }</a>

## Réponse du staff

email-subject-notificationOnStaffReply = Quelqu'un à  { $organizationName } a répondu à votre commentaire
email-template-notificationOnStaffReply =
  { $authorUsername } de { $organizationName } a répondu <a data-l10n-name="commentPermalink">au commentaire</a> que vous avez posté sur <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Votre commentaire sur { $organizatioName } a été publié
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  TMerci d'avoir publié votre commentaire. Votre commentaire est publié: <a data-l10n-name="commentPermalink">Voir le commentaire</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Votre commentaire sur { $organizationName } n'a pas été publié.
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  Le langage utilisé sur un de vos commentaire n'est pas conforme à la ligne de conduite de la communauté, et votre commentaire a été supprimé.

# Notification Digest

email-subject-notificationDigest = Votre dernier commentaire sur { $organizationName }

### Localization for Admin

## General
general-notAvailable = Non disponible

## Story Status
storyStatus-open = Ouvert
storyStatus-closed = Fermé

## Roles
role-admin = Administrateur
role-moderator = Modérateur
role-staff = Staff
role-commenter = Membre

role-plural-admin = Administrateurs
role-plural-moderator = Modérateurs
role-plural-staff = Staff
role-plural-commenter = Membres

## User Statuses
userStatus-active = Actif
userStatus-banned = Banni
userStatus-suspended = Suspendu
userStatus-premod = Toujours pré-modéré

## Navigation
navigation-moderate = Modérer
navigation-community = Communauté
navigation-stories = Articles
navigation-configure = Configurer

## User Menu
userMenu-signOut = Déconnexion
userMenu-viewLatestRelease = Voir la dernière version
userMenu-reportBug = Faire part d'un problème ou faire un retour d'information
userMenu-popover =
  .description = Un dialogue du menu utilisateur avec des liens et des actions connexes

## Restricted
restricted-currentlySignedInTo = Vous êtes connecté
restricted-noPermissionInfo = Vous n'avez pas les droits pour accéder à cette page.
restricted-signedInAs = Vous êtes connecté en tant que : <Username></Username>
restricted-signInWithADifferentAccount = Se connecter avec un autre compte.
restricted-contactAdmin = Si vous pensez qu'il y a une erreur, merci de contacter votre administateur pour recevoir une aide.

## Login

# Sign In
login-signInTo = Connectez-vous à
login-signIn-enterAccountDetailsBelow = Entrez les détails de votre compte ci-dessous.

login-emailAddressLabel = Adresse email
login-emailAddressTextField =
  .placeholder = Adresse email

login-signIn-passwordLabel = Mot de passe
login-signIn-passwordTextField =
  .placeholder = Mot de passe

login-signIn-signInWithEmail = Connectez-vous en utilisant votre email
login-signIn-orSeparator = ou
login-signIn-forgot-password = Mot de passe oublié ?

login-signInWithFacebook = Se connecter avec Facebook
login-signInWithGoogle = Se connecter avec Google
login-signInWithOIDC = Se connecter avec { $name }

## Configure

configure-unsavedInputWarning =
  Vous avez des changements non sauvegardés. Êtes-vous sûr de vouloir quitter cette page ?

configure-sideBarNavigation-general = Général
configure-sideBarNavigation-authentication = Authentification
configure-sideBarNavigation-moderation = Modération
configure-sideBarNavigation-organization = Organisation
configure-sideBarNavigation-advanced = Avancé
configure-sideBarNavigation-email = Email
configure-sideBarNavigation-bannedAndSuspectWords = Mots bannis et suspects

configure-sideBar-saveChanges = Sauvegarder les changements
configure-configurationSubHeader = Configuration
configure-onOffField-on = Activer
configure-onOffField-off = Désactiver
configure-permissionField-allow = Autoriser
configure-permissionField-dontAllow = Ne pas autoriser

### General
configure-general-guidelines-title = Résumé des règles de la communauté
configure-general-guidelines-explanation =
  Ceci apparaîtra au-dessus des commentaires dans tout le site.
  Vous pouvez formater le texte en utilisant Markdown.
  Plus d'informations sur l'utilisation de Markdown
  <externalLink>ici</externalLink>.


configure-general-guidelines-showCommunityGuidelines = Afficher le résumé des règles de la communauté

#### Locale
configure-general-locale-language = Langue
configure-general-locale-chooseLanguage = Choisissez la langue pour votre communauté Coral.

#### Sitewide Commenting
configure-general-sitewideCommenting-title = Commentaires sur l'ensemble du site.
configure-general-sitewideCommenting-explanation =
  Ouvrir ou fermer les flux de commentaires pour avoir les nouveaux commentaires.
  Quand les nouveaux commentaires sont désactivés, ils ne peuvent pas être soumis,
  mais les commentaires déjà éxistants peuvent continuer à recevoir des réactions,
  à être signalés et partagés.
configure-general-sitewideCommenting-enableNewCommentsSitewide =
 Activer les commentaires sur l'ensemble du site.
configure-general-sitewideCommenting-onCommentStreamsOpened =
  Activer - Le flux de commentaires est ouvert pour recevoir de nouveaux commentaires.
configure-general-sitewideCommenting-offCommentStreamsClosed =
  Désactiver - Le flux de commentaires est fermé pour les nouveaux commentaires.
configure-general-sitewideCommenting-message =
  Message pour dire que les commentaires sont fermés sur tout le site.
configure-general-sitewideCommenting-messageExplanation =
  Écrire un message qui sera affiché quand le flux de commentaires sera fermé sur tout le site.

#### Closing Comment Streams
configure-general-closingCommentStreams-title = Fermer le flux de commentaires
configure-general-closingCommentStreams-explanation = Fermer le flux de commentaires pendant un certain temps après la publication d'un article.
configure-general-closingCommentStreams-closeCommentsAutomatically = Fermer automatiquement les commentaires.
configure-general-closingCommentStreams-closeCommentsAfter = Fermer les commentaires après

#### Comment Length
configure-general-commentLength-title = Taille du commentaire
configure-general-commentLength-maxCommentLength = Taille maximale du commentaire
configure-general-commentLength-setLimit =
  Configurer les tailles maximales et minimales d'un commentaire.
  Les espaces blancs au début et à la fin d'un commentaire seront réduits.
configure-general-commentLength-limitCommentLength = Limite de taille d'un commentaire
configure-general-commentLength-minCommentLength = Taille minimale d'un commentaire
configure-general-commentLength-characters = caractères
configure-general-commentLength-textField =
  .placeholder = Aucune limite
configure-general-commentLength-validateLongerThanMin =
  Veuillez entrer un nombre plus grand que la taille minimale.

#### Comment Editing
configure-general-commentEditing-title = Modifier un commentaire
configure-general-commentEditing-explanation =
  Fixez une limite au temps dont disposent les membres
  pour modifier leurs commentaires sur l'ensemble du site.
  Les commentaires modifiés sont marqués (Édité) dans le flux de commentaires
  et le panneau de modération.
configure-general-commentEditing-commentEditTimeFrame = Temps maximal pour éditer un commentaire
configure-general-commentEditing-seconds = Secondes

#### Closed Stream Message
configure-general-closedStreamMessage-title = Message lorsque le flux de commentaires est fermé.
configure-general-closedStreamMessage-explanation = Écrire un message qui apparaîtra lorsqu'un article sera fermé aux commentaires.

### Organization
configure-organization-name = Nom de l'entreprise
configure-organization-nameExplanation =
  Votre nom d'entreprise apparaîtra sur les emails envoyés par { -product-name }
  à votre communauté et aux membres de votre entreprise.

configure-organization-email =  Email de l'entreprise
configure-organization-emailExplanation =
  Cette adresse email sera utilisée dans les mails et sur le site
  pour permettre aux membres de la communauté de contacter l'entreprise s'ils ont des questions
  sur leurs comptes ou à propos de la modération.
configure-organization-url = URL de l'entreprise
configure-organization-urlExplanation =
  Votre URL d'entreprise apparaîtra sur les emails envoyés par { -product-name }
  à votre communauté et aux membres de l'entreprise.

### Email

configure-email = Réglages de l'email
configure-email-configBoxEnabled = Activé
configure-email-fromNameLabel = De
configure-email-fromNameDescription =
  Le nom qui apparaîtra sur tous les emails envoyés.
configure-email-fromEmailLabel = De l'adresse email
configure-email-fromEmailDescription =
  L'adresse email qui va être utilisée pour envoyer les messages.
configure-email-smtpHostLabel = STMP host
configure-email-smtpHostDescription = (ex. smtp.sendgrid.com)
configure-email-smtpPortLabel = SMTP port
configure-email-smtpPortDescription = (ex. 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = SMTP authentification
configure-email-smtpCredentialsHeader = Identifiant de l'email
configure-email-smtpUsernameLabel = Pseudo
configure-email-smtpPasswordLabel = Mot de passe

### Authentication

configure-auth-clientID = Client ID
configure-auth-clientSecret = Client secret
configure-auth-configBoxEnabled = Activé
configure-auth-targetFilterCoralAdmin = { -product-name } Administrateur
configure-auth-targetFilterCommentStream = Flux de commentaires
configure-auth-redirectURI = URI de redirection
configure-auth-registration = Enregistrement
configure-auth-registrationDescription =
  Autoriser les utilisateurs qui ne se sont pas inscrits auparavant avec cette méthode
  à créer un nouveau compte.
configure-auth-registrationCheckBox = Autoriser les inscriptions.
configure-auth-pleaseEnableAuthForAdmin =
  Veuillez activer au moins une méthode d'authentification  pour { -product-name } Administrateur.
configure-auth-confirmNoAuthForCommentStream =
  Aucune méthode d'authentification n'a été activée pour ce flux de commentaires. Êtes-vous sûr de vouloir continuer ?

configure-auth-facebook-loginWith = Connexion avec Facebook
configure-auth-facebook-toEnableIntegration =
  Pour activer l'authentification avec Facebook,
  vous devez créer et configurer une application web.
  Pour plus d'informations, rendez-vous sur : <Link></Link>.
configure-auth-facebook-useLoginOn = Utiliser la connexion avec Facebook

configure-auth-google-loginWith = Connexion avec Google
configure-auth-google-toEnableIntegration =
  Pour activer l'authentification avec Google,
  vous devez créer et configurer une application web.
  Pour plus d'informations, rendez-vous sur : <Link></Link>.
configure-auth-google-useLoginOn = Utiliser la connexion avec Google

configure-auth-sso-loginWith = Connexion avec Single Sign On
configure-auth-sso-useLoginOn = Utiliser Single Sign On pour se connecter.
configure-auth-sso-key = Clé
configure-auth-sso-regenerate = Générer une nouvelle clé
configure-auth-sso-regenerateAt = La clé a été générée le :
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateWarning =
  Générer une nouvelle clé va rendre invalide toutes les sessions de l'utilisateur existantes
  et tous les utilisateurs connectés vont être déconnectés.

configure-auth-local-loginWith = Connexion par email
configure-auth-local-useLoginOn = Utiliser la connexion par email

configure-auth-oidc-loginWith = Connexion par OpenID Connect.
configure-auth-oidc-toLearnMore = En savoir plus : <Link></Link>
configure-auth-oidc-providerName = Nom du fournisseur
configure-auth-oidc-providerNameDescription =
  Le fournisseur de l'intégration de l'OpenID Connect.
  Il sera utilisé lorsque le nom du fournisseur devra être affiché,
  par ex. “Se connecter avec &lt;Facebook&gt;”.
configure-auth-oidc-issuer = Émetteur
configure-auth-oidc-issuerDescription =
  Après avoir entré toutes vos informations d'émetteur, cliquez sur le bouton Découvrir
  pour que {-product-name} complète les champs restants automatiquement.
  Vous pouvez également entrer les informations manuellement.
configure-auth-oidc-authorizationURL = URL d'autorisation
configure-auth-oidc-tokenURL = URL du token
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = Utiliser l'OpenID Connect pour se connecter.

configure-auth-settings = Réglages de la session
configure-auth-settings-session-duration-label = Durée de la session

### Moderation

### Recent Comment History

configure-moderation-recentCommentHistory-title = Historique récent
configure-moderation-recentCommentHistory-timeFrame = Période de l'historique des commentaires récents
configure-moderation-recentCommentHistory-timeFrame-description =
  Temps nécessaire pour calculer le taux de rejet d'un intervenant.
configure-moderation-recentCommentHistory-enabled = Filtre d'historique récent
configure-moderation-recentCommentHistory-enabled-description =
  Empêche les récidivistes de publier des commentaires sans approbation.
  Lorsque le taux de rejet d'un membre est supérieur au seuil,
  ses commentaires sont envoyés à "En attente d'approbation par le modérateur".
  Cela ne s'applique pas aux commentaires du staff.
configure-moderation-recentCommentHistory-triggerRejectionRate = Seuil du taux de rejet
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  Commentaires rejetés ÷ (commentaires rejetés + commentaires publiés)
  sur la période indiquée au-dessus, en pourcentage.
  Cela n'inclut pas les commentaires en cours de traitement pour toxicité,
  et les spams qui ont été pré-modérés.

#### Pre-Moderation
configure-moderation-preModeration-title = Pré-modération
configure-moderation-preModeration-explanation =
  Lorsque la pré-modération est activée, les commentaires ne seront pas publiés sans avoir été
  approuvés par un modérateur.
configure-moderation-preModeration-moderation =
  Pré-modération sur tous les commentaires du site.
configure-moderation-preModeration-premodLinksEnable =
  Pré-modération sur les commentaires contenant un lien sur tout le site.

configure-moderation-apiKey = clé de l'API

configure-moderation-akismet-title = Filtre pour la détection de spam
configure-moderation-akismet-explanation =
  Le filtre API Akismet avertit les utilisateurs lorsqu'un commentaire est susceptible
  d'être du spam. Les commentaires qui, selon Akismet, sont du spam ne seront pas publiés
  et seront placés dans la file d'attente pour être examinés par un modérateur.
  S'il est approuvé par un modérateur, le commentaire sera publié.

#### Akismet
configure-moderation-akismet-filter = Filtre pour la détection de spam
configure-moderation-akismet-accountNote =
  Note : Vous devez ajouter votre(vos) domaine(s) actif(s)
  dans votre compte Akismet: <externalLink>https://akismet.com account/</externalLink>
configure-moderation-akismet-siteURL = Lien du site


#### Perspective
configure-moderation-perspective-title = Filtre de commentaire toxique
configure-moderation-perspective-explanation =
  En utilisant l'API Perspective, le filtre de commentaire toxique avertit les utilisateurs
  lorsque les commentaires dépassent le seuil de toxicité prédéfini.
  Les commentaires avec un score de toxicité au dessus du seuil
  <strong>ne seront pas publiés</strong> et seront placés dans
  la <strong>file d'attente de validation par un modérateur</strong>.
  S'il est approuvé par un modérateur, le commentaire sera publié.
configure-moderation-perspective-filter = Filtre de commentaire toxique
configure-moderation-perspective-toxicityThreshold = Seuil de toxicité
configure-moderation-perspective-toxicityThresholdDescription =
  Cette valeur peut être fixée comme un pourcentage entre 0 et 100.
  Ce nombre représente la probabilité qu’un commentaire soit toxique, selon l’API de perspective.
  Par défaut, le seuil est défini sur { $ default }.
configure-moderation-perspective-toxicityModel = Modèle de toxicité
configure-moderation-perspective-toxicityModelDescription =
  Choisissez votre modèle de perspective. Il est par défaut sur { $default }.
  Vous pouvez en savoir plus sur le choix du modèle <externalLink>ici</externalLink>.
configure-moderation-perspective-allowStoreCommentData = Autoriser Google à récolter des données sur le commentaire.
configure-moderation-perspective-allowStoreCommentDataDescription =
  Les commentaires stockés seront utilisés à des fins de recherche
  et de création de modèles communautaires afin d'améliorer l'API au fil du temps.
configure-moderation-perspective-customEndpoint = Point de terminaison personnalisé
configure-moderation-perspective-defaultEndpoint =
  Par défaut, le point de terminaison est défini par { $default }.
  Vous pouvez le changer ici.
configure-moderation-perspective-accountNote =
  Pour des informations complémentaires sur comment configurer le filtre
  de commentaires toxiques de perspective, rendez-vous sur :

<externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

#### Banned Words Configuration
configure-wordList-banned-bannedWordsAndPhrases = Mots et phrases bannis
configure-wordList-banned-explanation =
  Les commentaires contenant un mot ou une phrase dans la liste des mots bannis seront
  <strong>automatiquement rejetés et ne seront pas publiés</strong>.
configure-wordList-banned-wordList = Liste des mots bannis
configure-wordList-banned-wordListDetailInstructions =
  Séparer les mots et phrases bannis par une nouvelle ligne.
  Les mots/phrases ne sont pas sensibles aux majuscules.

#### Suspect Words Configuration
configure-wordList-suspect-bannedWordsAndPhrases = Mots et phrases suspects
configure-wordList-suspect-explanation =
  Les commentaires contenant un mot ou une phrase dans la liste des mots suspects seront
  <strong>automatiquement placés dans la file d'attente, en attente d'une inspection d'un modérateur
  et seront publiés (si les commentaires ne sont pas pré-modérés)</strong>.
configure-wordList-suspect-wordList = Liste de mots suspects
configure-wordList-suspect-wordListDetailInstructions =
  Les mots ou phrases suspects sont séparés par une nouvelle ligne.
  Les mots/phrases ne sont pas sensibles aux majuscules.

### Advanced
configure-advanced-customCSS = CSS personnalisé
configure-advanced-customCSS-override =
  Lien vers une feuille CSS qui écrasera les styles par défaut.

configure-advanced-permittedDomains = Domaines acceptés
configure-advanced-permittedDomains-description =
  Les domaines où votre instance { -product-name } est autorisée à être intégrée,
  y compris le schéma (ex. http://localhost:3000, https://staging.domain.com,
  https://domain.com).

configure-advanced-liveUpdates = Mise à jour en direct du flux de commentaires
configure-advanced-liveUpdates-explanation =
  Lorsqu'il est activé, il y aura un chargement et une mise à jour en temps réel des commentaires.
  Lorsqu'il est désactivé, les utilisateurs devront recharger la page pour voir les nouveaux commentaires.

configure-advanced-embedCode-title = Code à intégrer
configure-advanced-embedCode-explanation =
  Copiez et collez le code ci-dessous dans votre CMS pour incorporer les flux de commentaires Coral
  dans chacun des articles de votre site.

configure-advanced-embedCode-comment =
  Décommentez ces lignes et remplacez-les
  par l'ID de l'article et l'URL de votre CMS
  afin de fournir l'intégration la plus étroite possible.
  Reportez-vous à notre documentation à l'adresse
  https://docs.coralproject.net pour toutes les options de configuration.

## Decision History
decisionHistory-popover =
  .description = Un dialogue montrant l'historique des actions.
decisionHistory-youWillSeeAList =
  Vous verrez une liste de vos actions de post-modération ici.
decisionHistory-showMoreButton =
  Voir plus
decisionHistory-yourDecisionHistory = Votre historique d'actions
decisionHistory-rejectedCommentBy = Commentaire rejeté par <Username></Username>
decisionHistory-approvedCommentBy = Commentaire approuvé par <Username></Username>
decisionHistory-goToComment = Aller au commentaire

## moderate
moderate-navigation-reported = Signalé
moderate-navigation-pending = En attente
moderate-navigation-unmoderated = Non modéré
moderate-navigation-rejected = Rejeté

moderate-marker-preMod = Pré-modération
moderate-marker-link = Lien
moderate-marker-bannedWord = Mots bannis
moderate-marker-suspectWord = Mots suspects
moderate-marker-spam = Spam
moderate-marker-spamDetected = Un spam a été détecté.
moderate-marker-toxic = Toxique
moderate-marker-recentHistory = Historique récent
moderate-marker-bodyCount = Nombre de membres
moderate-marker-offensive = Offensant
moderate-marker-repeatPost = Commentaire répété

moderate-markers-details = Détails
moderate-flagDetails-offensive = Offensant
moderate-flagDetails-spam = Spam

moderate-flagDetails-toxicityScore = Score de toxicité
moderate-toxicityLabel-likely = Probable <score></score>
moderate-toxicityLabel-unlikely = Improbable <score></score>
moderate-toxicityLabel-maybe = Peut-être <score></score>

moderate-emptyQueue-pending = Bien joué ! Il n'y a plus de commentaire en attente à modérer.
moderate-emptyQueue-reported = Bien joué ! Il n'y a plus de commentaire signalé à modérer.
moderate-emptyQueue-unmoderated = Bien joué ! Il n'y a plus de commentaire à modérer.
moderate-emptyQueue-rejected = Il n'y a pas de commentaire rejeté.

moderate-comment-edited = (edité)
moderate-comment-inReplyTo = Répondre à <Username></Username>
moderate-comment-viewContext = Voir le contexte
moderate-comment-rejectButton =
  .aria-label = Rejeté
moderate-comment-approveButton =
  .aria-label = Approuvé
moderate-comment-decision = Décision
moderate-comment-story = Article
moderate-comment-moderateStory = Modérer un article
moderate-comment-featureText = Fonctionnalité
moderate-comment-featuredText = Fonctionnel
moderate-comment-moderatedBy = Modéré par
moderate-comment-moderatedBySystem = Système

moderate-single-goToModerationQueues = Aller à la file d'attente de la modération
moderate-single-singleCommentView = Voir un seul commentaire

moderate-queue-viewNew =
  { $count ->
    [1] Lire {$count} nouveau commentaire
    *[other] Lire {$count} nouveaux commentaires
  }

moderate-comment-deleted-body =
  Ce commentaire n'est plus disponible. L'utilisateur a supprimé son compte.

### Moderate Search Bar
moderate-searchBar-allStories = Tous les articles
  .title = Tous les articles
moderate-searchBar-noStories = Nous n'avons pas pu trouver d'article correspondant à vos critères.
moderate-searchBar-stories = Articles :
moderate-searchBar-searchButton = Recherche
moderate-searchBar-titleNotAvailable =
  .title = Titre non disponible
moderate-searchBar-comboBox =
  .aria-label = Rechercher ou aller sur un article
moderate-searchBar-searchForm =
  .aria-label = Articles
moderate-searchBar-currentlyModerating =
  .title = En cours de modération
moderate-searchBar-searchResults = Résultat de la recherche
moderate-searchBar-searchResultsMostRecentFirst = Résultat de la recherche (les plus récents en premier)
moderate-searchBar-moderateAllStories = Modérer tous les articles
moderate-searchBar-comboBoxTextField =
  .aria-label = Rechercher ou aller sur un article...
  .placeholder =  Utiliser les guillemets autour de chaque terme recherché (par ex. “équipe”, “Monaco”)
moderate-searchBar-goTo = Aller à
moderate-searchBar-seeAllResults = Voir tous les résultats

moderateCardDetails-tab-details = Détails
moderateCardDetails-tab-edits = Modifier l'historique
### Moderate User History Drawer

moderate-user-drawer-email =
  .title = Adresse email
moderate-user-drawer-created-at =
  .title = Date de création du compte
moderate-user-drawer-member-id =
  .title = ID du membre
moderate-user-drawer-tab-all-comments = Tous les commentaires
moderate-user-drawer-tab-rejected-comments = Rejeté
moderate-user-drawer-tab-account-history = Historique du compte
moderate-user-drawer-tab-notes = Notes
moderate-user-drawer-load-more = Charger plus
moderate-user-drawer-all-no-comments = {$username} n'a pas envoyé de commentaire.
moderate-user-drawer-rejected-no-comments = {$username} n'a pas de commentaire rejeté.
moderate-user-drawer-user-not-found = Utilisateur non trouvé
moderate-user-drawer-status-label = Statut :

moderate-user-drawer-account-history-system = <icon>ordinateur</icon> Système
moderate-user-drawer-account-history-suspension-ended = Fin de la suspension
moderate-user-drawer-account-history-suspension-removed = Suppresion de la suspension
moderate-user-drawer-account-history-banned = Banni
moderate-user-drawer-account-history-ban-removed = Suppression du bannissement
moderate-user-drawer-account-history-no-history =  Aucune action n'a été effectuée sur ce compte.
moderate-user-drawer-username-change = Changer de pseudo
moderate-user-drawer-username-change-new = Nouveau :
moderate-user-drawer-username-change-old = Ancien :

moderate-user-drawer-account-history-premod-set = Toujours pré-modéré
moderate-user-drawer-account-history-premod-removed = Supprimer la pré-modération

moderate-user-drawer-suspension =
  Suspension, { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] secondes
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] heure
      *[other] heures
    }
    [day] { $value ->
      [1] jour
      *[other] jours
    }
    [week] { $value ->
      [1] semaine
      *[other] semaines
    }
    [month] { $value ->
      [1] mois
      *[other] mois
    }
    [year] { $value ->
      [1] année
      *[other] années
    }
    *[other] unité inconnue
  }


moderate-user-drawer-recent-history-title = Historique de commentaires récent
moderate-user-drawer-recent-history-calculated =
   Calculé sur la dernière { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = Rejeté
moderate-user-drawer-recent-history-tooltip-title = Comment est-ce calculé ?
moderate-user-drawer-recent-history-tooltip-body =
  Commentaires rejetés ÷ (commentaires rejetés + commentaires publiés).
  Le seuil peut être changé par les administrateurs dans le menu Configurer > Modération.
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = Changer la bulle d'information des commentaires récents.
moderate-user-drawer-recent-history-tooltip-submitted = Soumis

moderate-user-drawer-notes-field =
  .placeholder = Laisser une remarque...
moderate-user-drawer-notes-button = Ajouter une remarque
moderatorNote-left-by = Laissé par :
moderatorNote-delete = Supprimer

## Create Username

createUsername-createUsernameHeader = Créer un pseudo
createUsername-whatItIs =
  Votre pseudo est un identifiant qui apparaîtra sur tous vos commentaires.
createUsername-createUsernameButton = Créer un pseudo
createUsername-usernameLabel = Pseudo
createUsername-usernameDescription = Vous pouvez utiliser "_" et ".", les espaces ne sont pas permis.
createUsername-usernameTextField =
  .placeholder = Pseudo

## Add Email Address
addEmailAddress-addEmailAddressHeader = Ajouter une adresse email

addEmailAddress-emailAddressLabel = Adresse email
addEmailAddress-emailAddressTextField =
  .placeholder = Adresse email

addEmailAddress-confirmEmailAddressLabel = Confirmer votre adresse email
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = Confirmer votre adresse email

addEmailAddress-whatItIs =
  Pour plus de sécurité, nous recommandons à nos utilisateurs d'ajouter une adresse email à leur compte.

addEmailAddress-addEmailAddressButton =
  Ajouter une adresse email

## Create Password
createPassword-createPasswordHeader = Créer un mot de passe.
createPassword-whatItIs =
  Afin d'être protégé contre les changements non autorisés sur leur compte,
  nous recommandons aux utilisateurs de créer un mot de passse.
createPassword-createPasswordButton =
  Créer un mot de passe

createPassword-passwordLabel = Mot de passe
createPassword-passwordDescription = Le mot de passe doit comporter au minimum {$minLength} caractères.
createPassword-passwordTextField =
  .placeholder = Mot de passe

## Community
community-emptyMessage = Nous n'avons trouvé personne dans la communauté qui réponde à vos critères.

community-filter-searchField =
  .placeholder = Rechercher par pseudo ou adresse email...
  .aria-label = Rechercher par pseudo ou adresse email
community-filter-searchButton =
  .aria-label = Recherche

community-filter-roleSelectField =
  .aria-label = Rechercher par rôle

community-filter-statusSelectField =
  .aria-label = Recherche par statut d'utilisateur

community-changeRoleButton =
  .aria-label = Changer de rôle

community-filter-optGroupAudience =
  .label = Audience
community-filter-optGroupOrganization =
  .label = Entreprise
community-filter-search = Rechercher
community-filter-showMe = Montre-moi
community-filter-allRoles = Tous les rôles
community-filter-allStatuses = Tous les statuts

community-column-username = Pseudo
community-column-username-deleted = Supprimer
community-column-email = Email
community-column-memberSince = Membre depuis
community-column-role = Rôle
community-column-status = Statut

community-role-popover =
  .description = Liste déroulante pour changer le rôle de l'utilisateur

community-userStatus-popover =
  .description = Liste déroulante pour changer le statut de l'utilisateur

community-userStatus-banUser = Utilisateur banni
community-userStatus-ban = Banni
community-userStatus-removeBan = Suppression du bannissement
community-userStatus-removeUserBan = Supprimer un bannissement
community-userStatus-suspendUser = Utilisateur suspendu
community-userStatus-suspend = Suspendu
community-userStatus-removeSuspension = Suppression de suspension
community-userStatus-removeUserSuspension = Lever la suspension
community-userStatus-unknown = Inconnu
community-userStatus-changeButton =
  .aria-label = Changer le statut de l'utilisateur
community-userStatus-premodUser = Toujours pré-modéré
community-userStatus-removePremod = Supprimer la pré-modération

community-banModal-areYouSure = Êtes-vous sûr de vouloir bannir <strong>{ $username }</strong> ?
community-banModal-consequence =
  Une fois banni, cet utilisateur ne sera plus capable de commenter, de réagir
  ou de signaler des commentaires.
community-banModal-cancel = Annuler
community-banModal-banUser = Utilisateur banni
community-banModal-customize = Personnaliser le message du mail de bannissement.

community-suspendModal-areYouSure = Suspendre <strong>{ $username }</strong> ?
community-suspendModal-consequence =
  Une fois suspendu, cet utilisateur ne sera plus capable de commenter,
  de réagir et de signaler des commentaires.
community-suspendModal-duration-3600 = 1 heure
community-suspendModal-duration-10800 = 3 heures
community-suspendModal-duration-86400 = 24 heures
community-suspendModal-duration-604800 = 7 jours
community-suspendModal-cancel = Annuler
community-suspendModal-suspendUser = Suspendre l'utilisateur
community-suspendModal-emailTemplate =
  Bonjour { $username },

  En accord avec les règles de la communauté { $organizationName }, votre compte a été temporairement suspendu. Durant votre suspension, vous serez incapable de commenter, signaler et interagir avec d'autres membres. Vous pourrez rejoindre la conversation dans { framework-timeago-time }.

community-suspendModal-customize = Personnaliser le message de l'email de suspension.

community-suspendModal-success =
  <strong>{ $username }</strong> a été suspendu pour une durée de <strong>{ $duration }</strong>.

community-suspendModal-success-close = Fermer
community-suspendModal-selectDuration = Sélectionner une durée de suspension

community-premodModal-areYouSure =
  Êtes-vous sûr de toujours pré-modérer <strong>{ $username }</strong> ?
community-premodModal-consequence =
  Tous ses commentaires seront envoyés vers la file d'attente de modération jusqu'à ce que son statut soit supprimé.
community-premodModal-cancel = Supprimer
community-premodModal-premodUser = Oui, toujours pré-modérer

community-invite-inviteMember = Inviter des membres à votre entreprise
community-invite-emailAddressLabel = Adresse email :
community-invite-inviteMore = Inviter plus
community-invite-inviteAsLabel = Inviter en tant que :
community-invite-sendInvitations = Envoyer des invitations
community-invite-role-staff =
<strong>Rôle de staff :</strong> Reçoit un badge "staff",
  et les commentaires sont automatiquement approuvés.
  Impossible de modérer ou de modifier une configuration de { -product-name }.
community-invite-role-moderator =
  <strong>Rôle de modérateur :</strong> Reçoit un badge "staff"
  et les commentaires sont automatiquement approuvés.
  Possède tous les privilèges de modération
  (Approuver, rejeter et mettre en avant les commentaires).
  Peut configurer des articles individuels,
  mais aucun privilège de configuration sur tout le site.
community-invite-role-admin =
  <strong>Rôle d'administrateur :</strong> Reçoit un badge "staff"
  et les commentaires sont automatiquement approuvés.
  Possède tous les privilèges de modération
  (Approuver, rejeter et mettre en avant les commentaires).
  Peut configurer des articles individuels et possède
  les privilèges de configuration sur tout le site.
community-invite-invitationsSent = Votre invitation a été envoyée.
community-invite-close = Fermer
community-invite-invite = Inviter

## Stories
stories-emptyMessage = Il n'y a aucun article publié actuellement.
stories-noMatchMessage = Nous ne trouvons pas d'article qui corresponde à vos critères.

stories-filter-searchField =
  .placeholder = Rechercher par auteur ou titre d'article...
  .aria-label = Rechercher par auteur ou titre d'article...
stories-filter-searchButton =
  .aria-label = Rechercher

stories-filter-statusSelectField =
  .aria-label = Rechercher par statut

stories-changeStatusButton =
  .aria-label = Changer le statut

stories-filter-search = Rechercher
stories-filter-showMe = Montre-moi
stories-filter-allStories = Tous les articles
stories-filter-openStories = Ouvrir les articles
stories-filter-closedStories = Fermer les articles

stories-column-title = Titre
stories-column-author = Auteur
stories-column-publishDate = Date de publication
stories-column-status = Statut
stories-column-clickToModerate = Cliquer sur le titre pour modérer l'article.

stories-status-popover =
  .description = Liste déroulante pour changer le statut de votre article.

## Invite

invite-youHaveBeenInvited = Vous avez été invité à rejoindre { $organizationName }.
invite-finishSettingUpAccount = Terminez la configuration du compte pour :
invite-createAccount = Créer un compte
invite-passwordLabel = Mot de passe
invite-passwordDescription = Il doit y avoir au minimum { $minLength } caractères.
invite-passwordTextField =
  .placeholder = Mot de passe
invite-usernameLabel = Pseudo
invite-usernameDescription = Vous pouvez utiliser "_" et "."
invite-usernameTextField =
  .placeholder = Pseudo
invite-oopsSorry = Oups désolé !
invite-successful = Votre compte a été créé.
invite-youMayNowSignIn = Vous pouvez vous connecter à { -product-name } en utilisant :
invite-goToAdmin = Aller sur l'admin de { -product-name }
invite-goToOrganization = Aller à { $organizationName }
invite-tokenNotFound =
  Le lien spécifié n'est pas valide, veuillez vérifier qu'il ait été copié correctement.

userDetails-banned-on = <strong>Banni sur</strong> { $timestamp }
userDetails-banned-by = <strong>par</strong> { $username }
userDetails-suspended-by = <strong>Suspendu par</strong> { $username }
userDetails-suspension-start = <strong>Début :</strong> { $timestamp }
userDetails-suspension-end = <strong>Fin :</strong> { $timestamp }

configure-general-reactions-title = Réactions
configure-general-reactions-explanation =
  Permettez à votre communauté de dialoguer
  et de réagir en un clic. Par défaut, Coral permet
  aux membres de "respecter" les commentaires de chacun.

configure-general-reactions-label = Étiquette de réaction
configure-general-reactions-input =
  .placeholder = Ex: Respect
configure-general-reactions-active-label = Étiquette de réaction active
configure-general-reactions-active-input =
  .placeholder = Ex: Respecté
configure-general-reactions-sort-label = Trier les étiquettes
configure-general-reactions-sort-input =
  .placeholder = Ex: Le plus respecté
configure-general-reactions-preview = Aperçu
configure-general-reaction-sortMenu-sortBy = Trier par

configure-general-staff-title = Badge de membre du staff
configure-general-staff-explanation =
  Montre un badge personnalisé pour les membres du staff de votre organisation.
  Ce badge apparaît sur le flux de commentaires et sur l'interface d'administration.
configure-general-staff-label = Texte du badge
configure-general-staff-input =
  .placeholder = Ex: Staff
configure-general-staff-preview = Aperçu

configure-account-features-title = Les droits du compte membre
configure-account-features-explanation =
  Vous pouvez activer ou désactiver certaines fonctionnalités
  afin que vos membres puissent les utiliser. Ces fonctionnalités contribuent également
  à la conformité du RGPD.
configure-account-features-allow = Autoriser les utilisateurs à :
configure-account-features-change-usernames = Changer leur pseudo :
configure-account-features-change-usernames-details = Les pseudos peuvent être changés une fois tous les 14 jours.
configure-account-features-yes = Oui
configure-account-features-no = Non
configure-account-features-download-comments = Télécharger leurs commentaires.
configure-account-features-download-comments-details =
  Les membres peuvent télécharger un fichier .csv de leur historique de commentaires.
configure-account-features-delete-account = Supprimer leur compte
configure-account-features-delete-account-details =
  Supprimer toutes les données de commentaires, pseudo et adresse email depuis le site et la base de données.

configure-account-features-delete-account-fieldDescriptions =
  Supprimer toutes les données de commentaires,
  pseudo et adresse email depuis le site et la base de données.

configure-advanced-stories = Création d'article
configure-advanced-stories-explanation = Paramètres avancés pour la création d'article dans Coral.
configure-advanced-stories-lazy = Création d'article paresseuse
configure-advanced-stories-lazy-detail = Autoriser les articles à être automatiquement créer quand ils sont publiés depuis votre CMS.
configure-advanced-stories-scraping = Récolte de tous les articles.
configure-advanced-stories-scraping-detail =
  Autoriser les données des articles à être automatiquement récoltées
  quand ils sont publiés depuis votre CMS.
configure-advanced-stories-proxy = Récolte de toutes les URL du proxy
configure-advanced-stories-proxy-detail =
  Lorsque spécifié, autorise les requêtes de récolte à utiliser le proxy fourni.
  Toutes les demandes seront ensuite transmises au proxy approprié,
  analysées par le package <externalLink>npm proxy-agent</externalLink>.

forgotPassword-forgotPasswordHeader = Mot de passe oublié ?
forgotPassword-checkEmailHeader = Vérifier votre email
forgotPassword-gotBackToSignIn = Aller sur la page de connexion
forgotPassword-checkEmail-receiveEmail =
  S'il y a un compte associé à <strong>{ $email }</strong>,
  vous recevrez un email avec un lien pour créer un nouveau mot de passe.
forgotPassword-enterEmailAndGetALink =
  Entrer votre adresse email ci-dessous
  et nous vous enverrons un lien pour réinitialiser votre mot de passe.
forgotPassword-emailAddressLabel = Adresse email
forgotPassword-emailAddressTextField =
  .placeholder = Adresse email
forgotPassword-sendEmailButton = Envoyer un email

commentAuthor-status-banned = Banni

hotkeysModal-title = Raccourci du clavier
hotkeysModal-navigation-shortcuts = Raccourci de navigation
hotkeysModal-shortcuts-next = Commentaire suivant
hotkeysModal-shortcuts-prev = Commentaire précédent
hotkeysModal-shortcuts-search = Ouvrir la recherche
hotkeysModal-shortcuts-jump = Aller dans une file d'attente spécifique
hotkeysModal-shortcuts-switch = Changer de file d'attente
hotkeysModal-shortcuts-toggle = Basculer l'aide du raccourci
hotkeysModal-shortcuts-single-view = Afficher un seul commentaire
hotkeysModal-moderation-decisions = Actions de modération
hotkeysModal-shortcuts-approve = Approuver
hotkeysModal-shortcuts-reject = Rejeter
hotkeysModal-shortcuts-ban = Bannir l'auteur d'un commentaire
hotkeysModal-shortcuts-zen = Basculer en affichage de commentaire unique




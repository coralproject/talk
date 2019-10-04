### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Log in of Registreer je in 1 minuut om een reactie te kunnen plaatsten
general-userBoxUnauthenticated-signIn = Inloggen
general-userBoxUnauthenticated-register = Registreren

general-userBoxAuthenticated-signedInAs =
  Ingelogd als <Username></Username>.

general-userBoxAuthenticated-notYou =
  Bent u dit niet? <button>Uitloggen</button>

general-tabBar-commentsTab = Reacties
general-tabBar-myProfileTab = Mijn profiel
general-tabBar-configure = Instellingen

## Comments Tab

comments-allCommentsTab = Alle reacties
comments-featuredTab = Uitgelicht
comments-featuredCommentTooltip-how = Hoe wordt een reactie uitgelicht?
comments-featuredCommentTooltip-handSelectedComments =
  Reacties zijn handmatig door ons gekozen als het lezen waard.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Uitgelichte reacties informatie knop


comments-streamQuery-storyNotFound = Bericht niet gevonden

comments-postCommentForm-submit = Plaats reactie
comments-replyList-showAll = Toon alles
comments-replyList-showMoreReplies = Laad meer reacties


comments-viewNew =
  { $count ->
    [1] Nieuwe reactie {$count}
    *[other] Nieuwe reactie {$count}
  }
comments-loadMore = Meer laden

comments-permalinkPopover =
  .description = Een dialoogvenster met een permanente link naar de opmerking
comments-permalinkButton-share = Delen
comments-permalinkView-viewFullDiscussion = Toon alle reacties
comments-permalinkView-commentRemovedOrDoesNotExist = Deze reactie is verwijderd of bestaat niet.

comments-rte-bold =
  .title = Bold

comments-rte-italic =
  .title = Italic

comments-rte-blockquote =
  .title = Blockquote

comments-remainingCharacters = { $remaining } overgebleven karakters

comments-postCommentFormFake-signInAndJoin = Log in of Registreer je in 1 minuut om een reactie te kunnen plaatsten.

comments-postCommentForm-rteLabel = Plaats een reactie

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Antwoorden

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Plaats reactie
comments-replyCommentForm-cancel = Annuleren
comments-replyCommentForm-rteLabel = Schrijf een reactie
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Aanpassen

comments-editCommentForm-saveChanges = Bewaar wijzigingen
comments-editCommentForm-cancel = Annuleren
comments-editCommentForm-close = Sluiten
comments-editCommentForm-rteLabel = Wijzig reactie
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Aanpassen: <time></time> resterend
comments-editCommentForm-editTimeExpired = Tijd om aan te passen verlopen. U kunt deze reactie niet meer aanpassen. Waarom plaatst u geen andere reactie?
comments-editedMarker-edited = Aangepast
comments-showConversationLink-readMore = Lees meer over dit gesprek >
comments-conversationThread-showMoreOfThisConversation =
  Toon meer van dit gesprek

comments-permalinkView-currentViewing = U bekijkt nu een
comments-permalinkView-singleConversation = LOSSTAAND GESPREK
comments-inReplyTo = Als antwoord op <Username></Username>
comments-replyTo = Antwoord op: <Username></Username>

comments-reportButton-report = Rapporteer
comments-reportButton-reported = Gerapporteerd

comments-sortMenu-sortBy = Sorteer op
comments-sortMenu-newest = Nieuwste
comments-sortMenu-oldest = Oudste
comments-sortMenu-mostReplies = Meeste reacties

comments-userPopover =
  .description = Meer gebruikers informatie
comments-userPopover-memberSince = Reageert sinds: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Negeren

comments-userIgnorePopover-ignoreUser = Negeer {$username}?
comments-userIgnorePopover-description =
  Wanneer u een gebruiker negeert, dan worden
  alle reacties van deze gebruiker niet meer zichtbaar voor u.
  U kunt dit later ongedaan maken in uw profiel.
comments-userIgnorePopover-ignore = Negeren
comments-userIgnorePopover-cancel = Annuleren

comments-moderationDropdown-popover =
  .description = Een menu om de reactie te modereren
comments-moderationDropdown-feature = Uitgelicht
comments-moderationDropdown-unfeature = Uitgelicht ongedaan maken
comments-moderationDropdown-approve = Goedkeuren
comments-moderationDropdown-approved = Goedgekeurd
comments-moderationDropdown-reject = Afwijzen
comments-moderationDropdown-rejected = Afgewezen
comments-moderationDropdown-goToModerate = Ga naar modereren
comments-moderationDropdown-caretButton =
  .aria-label = Modereer

comments-rejectedTombstone =
  U heeft deze reactie afgewezen. <TextLink>Ga naar modereren om dit besluit te herzien.</TextLink>

comments-featuredTag = Uitgelicht

### Featured Comments
comments-featured-gotoConversation = Ga naar het gesprek
comments-featured-replies = Antwoorden

## Profile Tab

profile-myCommentsTab = Mijn reacties

### Comment History
profile-historyComment-viewConversation = Bekijk gesprek
profile-historyComment-replies = Antwoorden {$replyCount}
profile-historyComment-commentHistory = Reactie geschiedenis
profile-historyComment-story = Bericht: {$title}
profile-profileQuery-errorLoadingProfile = Profiel kan niet ingeladen worden
profile-profileQuery-storyNotFound = Bericht niet gevonden
profile-commentHistory-loadMore = Meer laden

### Settings
profile-account-ignoredCommenters = Genegeerde gebruikers
profile-account-ignoredCommenters-description =
  Als je een gebruiker negeert, dan worden alle reacties van deze gebruiker
  niet meer zichtbaar voor jou.
  Gebruikers die jij negeert kunnen nog wel jouw reacties zien.
profile-account-ignoredCommenters-empty = U negeert niemand
profile-account-ignoredCommenters-stopIgnoring = Stop met negeren


## Report Comment Popover
comments-reportPopover =
  .description = Een veld voor het rapporteren van reacties
comments-reportPopover-reportThisComment = Rapporteer deze reactie
comments-reportPopover-whyAreYouReporting = Waarom wilt u deze reactie rapporteren?

comments-reportPopover-reasonOffensive = Deze reactie is aanstootgevend
comments-reportPopover-reasonIDisagree = Ik ben het niet eens met deze reactie
comments-reportPopover-reasonSpam = Dit ziet eruit als een advertentie of marketing actie
comments-reportPopover-reasonOther = Anders

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Laat hier extra informatie achter dat nuttig kan zijn voor onze moderatoren. (Optioneel)

comments-reportPopover-maxCharacters = Max. { $maxCharacters } karakters
comments-reportPopover-cancel = Annuleren
comments-reportPopover-submit = Versturen

comments-reportPopover-thankYou = Bedankt!
comments-reportPopover-receivedMessage =
  We hebben uw bericht ontvangen. Meldingen van gebruikers houdt deze community veilig.

comments-reportPopover-dismiss = Afwijzen

## Submit Status
comments-submitStatus-dismiss = Afwijzen
comments-submitStatus-submittedAndWillBeReviewed =
  Uw reactie is toegevoegd en zal eerst willen bekeken door een moderator

# Configure
configure-configureQuery-errorLoadingProfile = Probleem bij het laden
configure-configureQuery-storyNotFound = Bericht niet gevonden

## Comment Stream
configure-stream-title = Stel deze reactiestroom in
configure-stream-apply = Doorvoeren

configure-premod-title = Inschakelen pre-moderatie
configure-premod-description =
  Moderatoren moeten elke reactie eerst goedkeuren voordat deze zichtbaar wordt.

configure-premodLink-title = Pre-moderatie van reacties met links
configure-premodLink-description =
  Moderatoren moeten elke reactie met een link eerst goedkeuren voordat deze zichtbaar wordt.

configure-liveUpdates-title = Inschakelen live updates van dit bericht
configure-liveUpdates-description =
  Wanneer ingeschakeld, zullen er real-time reacties ingeladen en geüpdatet worden als er nieuwe reacties en antwoorden toegevoegd worden.

configure-messageBox-title = Inschakelen bericht box voor deze reactiestroom
configure-messageBox-description =
  Voeg voor je lezers bovenaan de reactie box een bericht toe. Gebruik dit om een vraag te stellen of
  een mededeling te doen gerelateerd aan dit bericht
configure-messageBox-preview = Voorbeeld
configure-messageBox-selectAnIcon = Selecteer een icon
configure-messageBox-noIcon = Geen icoon
configure-messageBox-writeAMessage = Schrijf een bericht

configure-closeStream-title = Sluit reactiestroom
configure-closeStream-description =
  Deze reactiestroom is open. Door het sluiten van deze reactiestroom
  kunnen er geen nieuwe reacties toegevoegd worden
  en alle reeds toegevoegde reacties zullen zichtbaar blijven.
configure-closeStream-closeStream = Sluit reactiestroom

configure-openStream-title = Open reactiestroom
configure-openStream-description =
  Deze reactiestroom is gesloten. Door het openen van deze reactiestroom
  kunnen nieuwe reacties worden toegevoegd en weergegeven.
configure-openStream-openStream = Open reactiestroom

comments-tombstone-ignore = Deze reactie is niet zichtbaar omdat u {$username} negeert

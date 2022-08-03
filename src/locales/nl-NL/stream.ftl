### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Meld je aan of Registreer je om reacties te plaatsen
general-userBoxUnauthenticated-signIn = Aanmelden
general-userBoxUnauthenticated-register = Registreren

general-userBoxAuthenticated-signedIn =
  Aangemeld als

general-userBoxAuthenticated-notYou =
  Bent u dit niet? <button>Uitloggen</button>

general-tabBar-commentsTab = Reacties
general-tabBar-myProfileTab = Mijn profiel
general-tabBar-configure = Instellingen

## Comment Count

comment-count-text =
  { $count  ->
    [one] reactie
    *[other] reacties
  }

## Comments Tab

comments-allCommentsTab = Alle reacties
comments-featuredTab = Uitgelicht
comments-featuredCommentTooltip-how = Hoe wordt een reactie uitgelicht?
comments-featuredCommentTooltip-handSelectedComments =
  Reacties zijn handmatig door ons gekozen als lezenswaardig.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Uitgelichte reacties info

comments-bannedInfo-bannedFromCommenting = Uw account is beblokkeerd voor het geven van reacties.
comments-bannedInfo-violatedCommunityGuidelines =
  Iemand die toegang heeft tot uw account heeft onze spelregels geschonden.
  Als gevolg daarvan is uw account geblokkeerd. U zult niet langer
  in staat zijn om reacties te plaatsen. Als u denkt dat
  dit is foutief gebeurd is, neem dan contact op met onze moderator.

comments-noCommentsAtAll = Er zijn geen reacties op dit artikel.
comments-noCommentsYet = Er zijn nog geen reacties. Wil je er één schrijven?

comments-streamQuery-storyNotFound = Artikel niet gevonden

comments-commentForm-cancel = Annuleren
comments-commentForm-saveChanges = Bewaar wijzigingen
comments-commentForm-submit = Plaats reactie

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
  .description = Een dialoogvenster met een statische link naar de reactie
comments-permalinkPopover-permalinkToComment =
  .aria-label = Statische link naar de reactie
comments-permalinkButton-share = Delen
comments-permalinkView-viewFullDiscussion = Toon alle reacties
comments-permalinkView-commentRemovedOrDoesNotExist = Deze reactie is verwijderd of bestaat niet.

comments-rte-bold =
  .title = Vet

comments-rte-italic =
  .title = Schuinschrift

comments-rte-blockquote =
  .title = Blockquote

comments-remainingCharacters = { $remaining } overgebleven karakters

comments-postCommentFormFake-signInAndJoin = Meld je aan of Registreer je in 1 minuut om een reactie te kunnen plaatsen.

comments-postCommentForm-rteLabel = Plaats een reactie

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Het plaatsen van reacties is niet mogelijk wanneer uw account gemerkt is voor verwijdering.

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
comments-showConversationLink-readMore = Lees meer over deze discussie >
comments-conversationThread-showMoreOfThisConversation =
  Toon meer van deze discussie

comments-permalinkView-currentViewing = U bekijkt nu een
comments-permalinkView-singleConversation = Losstaande reactie
comments-inReplyTo = Als antwoord op <Username></Username>
comments-replyingTo = Antwoord op: <Username></Username>

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
  alle reacties van deze gebruiker niet meer getoond aan u.
  U kunt dit later ongedaan maken in uw profiel.
comments-userIgnorePopover-ignore = Negeren
comments-userIgnorePopover-cancel = Annuleren

comments-userBanPopover-title = Blokkeer {$username}?
comments-userBanPopover-description =
  Eenmaal geblokkeerd, zal deze gebruiker niet meer in staat zijn om
  om reacties te plaatsen.
  Deze reactie zal ook verworpen worden.
comments-userBanPopover-cancel = Annuleer
comments-userBanPopover-ban = Blokkeer

comments-moderationDropdown-popover =
  .description = Een menu om de reactie te modereren
comments-moderationDropdown-feature = Uitgelicht
comments-moderationDropdown-unfeature = Uitlichten ongedaan maken
comments-moderationDropdown-approve = Goedkeuren
comments-moderationDropdown-approved = Goedgekeurd
comments-moderationDropdown-reject = Afwijzen
comments-moderationDropdown-rejected = Afgewezen
comments-moderationDropdown-ban = Blokkeer Gebruiker
comments-moderationDropdown-banned = Geblokkeerd
comments-moderationDropdown-goToModerate = Ga naar modereren
comments-moderationDropdown-caretButton =
  .aria-label = Modereer

comments-rejectedTombstone =
  U heeft deze reactie afgewezen. <TextLink>Ga naar modereren om dit besluit te herzien.</TextLink>

comments-featuredTag = Uitgelicht

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Verwijderen Account aangevraagd
comments-stream-deleteAccount-callOut-receivedDesc =
  Een aanvraag om uw account te verwijderen is ontvangen op { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Als u reacties wilt blijven plaatsen,
  kunt U uw verzoek om uw account te verwijderen annuleren voor { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Annuleer de aanvraag om dit account te verwijderen

### Featured Comments
comments-featured-gotoConversation = Ga naar de discussie
comments-featured-replies = Antwoorden

## Profile Tab

profile-myCommentsTab = Mijn reacties
profile-myCommentsTab-comments = Mijn reacties
profile-accountTab = Account
profile-preferencesTab = Voorkeuren

accountSettings-manage-account = Beheer je account

### Account Deletion

profile-accountDeletion-deletionDesc =
  Uw account zal worden verwijderd op { $date }.
profile-accountDeletion-cancelDeletion =
  Annuleer de aanvraag om dit account te verwijderen

### Comment History
profile-historyComment-viewConversation = Bekijk discussie
profile-historyComment-replies = Antwoorden {$replyCount}
profile-historyComment-commentHistory = Voorbije reacties
profile-historyComment-story = Bericht: {$title}
profile-historyComment-comment-on = Reageer op:
profile-profileQuery-errorLoadingProfile = Profiel kan niet ingeladen worden
profile-profileQuery-storyNotFound = Reactie niet gevonden
profile-commentHistory-loadMore = Meer laden
profile-commentHistory-empty = U heeft nog geen reacties geschreven
profile-commentHistory-empty-subheading = Een overzicht van uw reacties zal hier getoond worden

### Account
profile-account-ignoredCommenters = Genegeerde gebruikers
profile-account-ignoredCommenters-description =
  Als je een gebruiker negeert, dan worden alle reacties van deze gebruiker
  niet meer getoond aan jou.
  Gebruikers die jij negeert kunnen nog wel jouw reacties zien.
profile-account-ignoredCommenters-empty = U negeert niemand
profile-account-ignoredCommenters-stopIgnoring = Stop met negeren
profile-account-ignoredCommenters-manage = Beheer
profile-account-ignoredCommenters-cancel = Annuleer

profile-account-changePassword-cancel = Annuleer
profile-account-changePassword = Wijzig wachtwoord
profile-account-changePassword-oldPassword = Oud wachtwoord
profile-account-changePassword-forgotPassword = Wachtwoord vergeten?
profile-account-changePassword-newPassword = Nieuw wachtwoord
profile-account-changePassword-button = Change wachtwoord
profile-account-changePassword-updated =
  Uw wachtwoord is gewijzigd
profile-account-changePassword-password = wachtwoord

profile-account-download-comments-title = Download mijn voorbije reacties
profile-account-download-comments-description =
  U ontvangt een e-mail met een link om uw voorbije reacties te downloaden.
  Je kunt <strong>één download aanvragen elke 14 dagen.</strong>
profile-account-download-comments-request =
  Aanvraag voorbije reacties
profile-account-download-comments-request-icon =
  .title = Aanvraag voorbije reacties
profile-account-download-comments-recentRequest =
  Uw meest recente aanvraag: { $timeStamp }
profile-account-download-comments-requested =
  Verzoek ingediend. U kunt een ander verzoek indienen in { framework-timeago-time }.
profile-account-download-comments-request-button = Aanvraag

## Delete Account

profile-account-deleteAccount-title = Verwijder mijn Account
profile-account-deleteAccount-description =
  Als U uw account verwijdert, wordt uw profiel permanent gewist en tevens
  al uw reacties op deze website
.
profile-account-deleteAccount-requestDelete = Aanvraag verwijderen account

profile-account-deleteAccount-cancelDelete-description =
  U heeft al een verzoek ingediend om uw account te verwijderen.
  Uw account zal verwijderd worden op { $date }.
  U kunt de aanvraag tot die tijd annuleren.
profile-account-deleteAccount-cancelDelete = Annuleer de aanvraag tot verwijderen van account
profile-account-deleteAccount-request = Aanvraag
profile-account-deleteAccount-cancel = Annuleer
profile-account-deleteAccount-pages-deleteButton = Verwijder mijn account
profile-account-deleteAccount-pages-cancel = Annuleer
profile-account-deleteAccount-pages-proceed = Ga door
profile-account-deleteAccount-pages-done = Gedaan
profile-account-deleteAccount-pages-phrase =
  .aria-label = Zin

profile-account-deleteAccount-pages-descriptionHeader = Verwijder mijn account?
profile-account-deleteAccount-pages-descriptionText =
  U probeert uw account te verwijderen. Dit betekent:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Al uw reacties worden van deze website verwijderd
profile-account-deleteAccount-pages-allCommentsDeleted =
  Al uw reacties worden van onze databank verwijderd
profile-account-deleteAccount-pages-emailRemoved =
  Uw e-mailadres wordt uit ons systeem verwijderd

profile-account-deleteAccount-pages-whenHeader = Verwijder mijn account: Wanneer?
profile-account-deleteAccount-pages-whenSec1Header =
  Wanneer wordt mijn account verwijderd?
profile-account-deleteAccount-pages-whenSec1Content =
  Uw account wordt 24 uur na het indienen van uw aanvraag verwijderd.
profile-account-deleteAccount-pages-whenSec2Header =
  Kan ik nog steeds reacties schrijven totdat mijn account wordt verwijderd?
profile-account-deleteAccount-pages-whenSec2Content =
  Nee. Als u eenmaal een verzoek tot verwijdering van uw account hebt ingediend,
  kunt u geen reacties meer schrijven of selecteren.

profile-account-deleteAccount-pages-downloadCommentHeader = Download mijn reacties?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Wij raden u aan uw voorbije reacties te downloaden
  voordat uw account wordt verwijderd. Nadat uw account verwijderd is, bent U
  niet meer in staat om een download van uw voorbije reacties aan te vragen.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download mijn voorbije reacties

profile-account-deleteAccount-pages-confirmHeader = Bevestig de verwijdering van dit account?
profile-account-deleteAccount-pages-confirmDescHeader =
  Weet u zeker dat u uw account wilt verwijderen?
profile-account-deleteAccount-confirmDescContent =
  Ter bevestiging dat u uw account wilt verwijderen, typt u aub de volgende zin
  in het onderstaande tekstvak :
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Ter bevestiging, typ onderstaande zin:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Geef uw wachtwoord in:

profile-account-deleteAccount-pages-completeHeader = Verwijderen van account is aangevraagd
profile-account-deleteAccount-pages-completeDescript =
  Uw verzoek is ingediend en er is een bevestiging gestuurd naar het e-mailadres
  gekoppeld aan uw account.
profile-account-deleteAccount-pages-completeTimeHeader =
  Uw account wordt verwijderd op: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Van gedachten veranderd?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Meld u voor dit tijdstip gewoon weer aan op uw account en selecteer
  <strong>Annuleren van een verzoek tot verwijdering van een account</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Vertel ons waarom.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  We willen graag weten waarom u ervoor gekozen heeft om uw account te verwijderen. Stuur ons feedback over
  ons reactiesysteem door te e-mailen{ $email }.
profile-account-changePassword-edit = Bewerk


## Notifications
profile-notificationsTab = Kennisgevingen
profile-account-notifications-emailNotifications = E-mail Kennisgevingen
profile-account-notifications-emailNotifications = E-mail Kennisgevingen
profile-account-notifications-receiveWhen = Ontvang kennisgevingen als:
profile-account-notifications-onReply = Mijn reactie ontvangt een antwoord
profile-account-notifications-onFeatured = Mijn reactie is opgenomen in de lijst
profile-account-notifications-onStaffReplies = Een medewerker van Doorbraak reageert op mijn reactie
profile-account-notifications-onModeration = Mijn reactie in afwachting is nagezien
profile-account-notifications-sendNotifications = Zend kennisgevingen:
profile-account-notifications-sendNotifications-immediately = Onmiddellijk
profile-account-notifications-sendNotifications-daily = Dagelijks
profile-account-notifications-sendNotifications-hourly = Elk uur
profile-account-notifications-updated = Uw instellingen voor uw kennisgevingen zijn bijgewerkt
profile-account-notifications-button = Update instellingen voor kennisgevingen
profile-account-notifications-button-update = Update


## Report Comment Popover
comments-reportPopover =
  .description = Een dialoogvenster om reacties te rapporteren
comments-reportPopover-reportThisComment = Rapporteer deze reactie
comments-reportPopover-whyAreYouReporting = Waarom rapporteer je deze reactie?

comments-reportPopover-reasonOffensive = Deze reactie is beledigend
comments-reportPopover-reasonAbusive = Deze gebruiker is beledigend
comments-reportPopover-reasonIDisagree = Ik ben het niet eens met deze reactie
comments-reportPopover-reasonSpam = Dit lijkt een advertentie of marketing
comments-reportPopover-reasonOther = Anders

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Meer informatie <optional>Optioneel</optional>

comments-reportPopover-maxCharacters = Max. { $maxCharacters } karakters
comments-reportPopover-cancel = Annuleren
comments-reportPopover-submit = Versturen

comments-reportPopover-thankYou = Bedankt!
comments-reportPopover-receivedMessage =
  We hebben uw bericht ontvangen. Meldingen van gebruikers houdt deze gemeenschap veilig.

comments-reportPopover-dismiss = Afwijzen

## Submit Status
comments-submitStatus-dismiss = Afwijzen
comments-submitStatus-submittedAndWillBeReviewed =
  Uw reactie is toegevoegd en zal eerst bekeken worden door een moderator
comments-submitStatus-submittedAndRejected =
  Deze reactie is afgewezen omdat hij onze spelregels heeft geschonden

# Configure
configure-configureQuery-errorLoadingProfile = Probleem bij het laden
configure-configureQuery-storyNotFound = Artikel niet gevonden

## Change username
profile-changeUsername-username = Gebruikersnaam
profile-changeUsername-success = Uw gebruikersnaam is succesvol aangepast
profile-changeUsername-edit = Bewerk
profile-changeUsername-heading = Bewerk uw gebruikersnaam
profile-changeUsername-desc = Wijzig de gebruikersnaam die bij al uw vroegere en toekomstige reacties zal verschijnen. <strong>Gebruikersnamen kunnen gewijzigd worden ééns per { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Wijzig de gebruikersnaam die bij al uw vroegere en toekomstige reacties zal verschijnen. Gebruikersnamen kunnen gewijzigd worden ééns per { framework-timeago-time }.
profile-changeUsername-current = Huidige gebruikersnaam
profile-changeUsername-newUsername-label = Nieuwe gebruikersnaam
profile-changeUsername-confirmNewUsername-label = Bevestig nieuwe gebruikersnaam
profile-changeUsername-cancel = Annuleer
profile-changeUsername-save = Bewaar
profile-changeUsername-recentChange = Uw gebruikersnaam is gewijzigd in de laatste { framework-timeago-time }. U mag uw gebruikersnaam opnieuw wijzigen op { $nextUpdate }
profile-changeUsername-close = Sluiten

## Comment Stream
configure-stream-title = Stel deze reactiestroom in
configure-stream-apply = Doorvoeren

configure-premod-title = Inschakelen pre-moderatie
configure-premod-description =
  Moderatoren moeten elke reactie eerst goedkeuren voordat deze zichtbaar wordt.

configure-premodLink-title = Pre-moderatie van reacties met links
configure-premodLink-description =
  Moderatoren moeten elke reactie met een link eerst goedkeuren voordat deze zichtbaar wordt.

configure-messageBox-title = Inschakelen bericht box voor deze reactiestroom
configure-messageBox-description =
  Voeg voor je lezers bovenaan de reactie box een bericht toe. Gebruik dit om een vraag te stellen of
  een mededeling te doen gerelateerd aan dit bericht
configure-messageBox-preview = Voorbeeld
configure-messageBox-selectAnIcon = Selecteer een icon
configure-messageBox-iconConversation = Discussie
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Help
configure-messageBox-iconWarning = Waarschuwing
configure-messageBox-iconChatBubble = Tekstvak
configure-messageBox-noIcon = Geen icoon
configure-messageBox-writeAMessage = Schrijf een bericht

configure-closeStream-title = Sluit reactiestroom
configure-closeStream-description =
  Deze reactiestroom is open. Door het sluiten van deze reactiestroom
  kunnen er geen nieuwe reacties toegevoegd worden
  maar alle reeds toegevoegde reacties zullen zichtbaar blijven.
configure-closeStream-closeStream = Sluit reactiestroom

configure-openStream-title = Open reactiestroom
configure-openStream-description =
  Deze reactiestroom is gesloten. Door het openen van deze reactiestroom
  kunnen nieuwe reacties worden toegevoegd en weergegeven.
configure-openStream-openStream = Open reactiestroom

configure-moderateThisStream = Modereer deze stroom

comments-tombstone-ignore = Deze reactie is niet zichtbaar omdat u {$username} negeert

comments-tombstone-deleted =
  Deze reactie is niet meer beschikbaar. De gebruiker heeft zijn account verwijderd.

suspendInfo-heading = Uw account is tijdelijk geschorst voor reacties.
suspendInfo-info =
  In overeenstemming met de spelregels van  { $organization } is uw
  account tijdelijk geblokkeerd. Intussen zult U geen reacties
  meer kunnen plaatsen. U kunt terug deelnemen
  aan de discussie op { $until }

profile-changeEmail-unverified = (Niet geverifieerd)
profile-changeEmail-edit = Bewerk
profile-changeEmail-please-verify = Controleer uw e-mail adres
profile-changeEmail-please-verify-details =
  Een e-mail is verzonden naar { $email } ter bevestiging van uw account.
  U moet uw nieuwe e-mailadres controleren voordat u het kunt gebruiken
  om in te loggen op uw account of om meldingen te ontvangen.
profile-changeEmail-resend = Verificatie opnieuw verzenden
profile-changeEmail-heading = Bewerk uw e-mail adres
profile-changeEmail-desc = Wijzig het e-mailadres dat wordt gebruikt voor het aanmelden en voor het ontvangen van communicatie over uw account.
profile-changeEmail-current = Huidig e-mail
profile-changeEmail-newEmail-label = Nieuw e-mail adres
profile-changeEmail-password = Wachtwoord
profile-changeEmail-password-input =
  .placeholder = Wachtwoord
profile-changeEmail-cancel = Annuleer
profile-changeEmail-submit = Bewaar
profile-changeEmail-email = E-mail

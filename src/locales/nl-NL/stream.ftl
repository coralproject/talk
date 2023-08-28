### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Reacties insluiten

general-moderate = Modereren
general-archived = Gearchiveerd

general-userBoxUnauthenticated-joinTheConversation = Aanmelden om te reageren
general-userBoxUnauthenticated-signIn = Aanmelden
general-userBoxUnauthenticated-register = Registreren

general-authenticationSection =
  .aria-label = Authenticatie

general-userBoxAuthenticated-signedIn =
  Aangemeld als
general-userBoxAuthenticated-notYou =
  Ben je dit niet? <button>Uitloggen</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Je bent succesvol uitgelogd

general-tabBar-commentsTab = Reacties
general-tabBar-myProfileTab = Mijn profiel
general-tabBar-discussionsTab = Discussies
general-tabBar-reviewsTab = Reviews
general-tabBar-configure = Instellingen

general-mainTablist =
  .aria-label = Hoofdtabblad

general-secondaryTablist =
  .aria-label = Secundair tabblad

## Comment Count

comment-count-text =
  { $count  ->
    [one] reactie
    *[other] reacties
  }

comment-count-text-ratings =
  { $count  ->
    [one] Beoordeling
    *[other] Beoordelingen
  }

## Comments Tab
addACommentButton =
  .aria-label = Plaats een reactie. Deze knop zal de focus naar onderen verplaatsen naar de reacties.

comments-allCommentsTab = Alle reacties
comments-featuredTab = Uitgelicht
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 gebruiker bekijkt deze discussie
    *[other] { SHORT_NUMBER($count) } gebruikers bekijken deze discussie
  }

comments-announcement-section =
  .aria-label = Aankondiging
comments-announcement-closeButton =
  .aria-label = Sluit aankondiging

comments-accountStatus-section =
  .aria-label = Accountstatus

comments-featuredCommentTooltip-how = Hoe wordt een reactie uitgelicht?
comments-featuredCommentTooltip-handSelectedComments =
  Reacties zijn handmatig door ons gekozen als lezenswaardig.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Uitgelichte reacties info
  .title = Tooltip voor uitgelichte reactie in-/uitschakelen

comments-collapse-toggle-with-username =
  .aria-label = Verberg reactie van { $username } en de antwoorden erop
comments-collapse-toggle-without-username =
  .aria-label = Verberg reactie en de antwoorden erop
comments-expand-toggle-with-username =
  .aria-label = Toon reactie van { $username } en de antwoorden erop
comments-expand-toggle-without-username =
  .aria-label = Toon reactie en de antwoorden erop
comments-bannedInfo-bannedFromCommenting = Je account is beblokkeerd voor het geven van reacties.
comments-bannedInfo-violatedCommunityGuidelines =
  Iemand die toegang heeft tot je account heeft onze spelregels geschonden.
  Als gevolg daarvan is je account geblokkeerd. Je zult niet langer
  in staat zijn om reacties te plaatsen. Als je denkt dat
  dit is foutief gebeurd is, neem dan contact op met onze moderator.

comments-noCommentsAtAll = Er zijn geen reacties op dit artikel.
comments-noCommentsYet = Er zijn nog geen reacties. Plaats de eerste!

comments-streamQuery-storyNotFound = Artikel niet gevonden

comments-communityGuidelines-section =
  .aria-label = Communityrichtlijnen

comments-commentForm-cancel = Annuleren
comments-commentForm-saveChanges = Bewaar wijzigingen
comments-commentForm-submit = Plaats reactie

comments-postCommentForm-section =
  .aria-label = Plaats een reactie

comments-postCommentForm-submit = Plaats reactie
comments-replyList-showAll = Toon alles
comments-replyList-showMoreReplies = Laad meer reacties

comments-postComment-gifSearch = Zoeken naar een GIF
comments-postComment-gifSearch-search =
  .aria-label = Zoeken
comments-postComment-gifSearch-loading = Laden...
comments-postComment-gifSearch-no-results = Geen resultaten gevonden voor {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Mogelijk gemaakt door Giphy

comments-postComment-pasteImage = Plak de URL van de afbeelding
comments-postComment-insertImage = Invoegen

comments-postComment-confirmMedia-youtube = Deze YouTube-video aan het einde van je reactie toevoegen?
comments-postComment-confirmMedia-twitter = Deze Tweet aan het einde van je reactie toevoegen?
comments-postComment-confirmMedia-cancel = Annuleren
comments-postComment-confirmMedia-add-tweet = Voeg Tweet toe
comments-postComment-confirmMedia-add-video = Video toevoegen
comments-postComment-confirmMedia-remove = Verwijderen
comments-commentForm-gifPreview-remove = Verwijderen
comments-viewNew-loading = Laden...
comments-viewNew =
  { $count ->
    [1] Nieuwe reactie {$count}
    *[other] Nieuwe reacties {$count}
  }
comments-loadMore = Meer laden
comments-loadAll = Alle reacties laden
comments-loadAll-loading = Laden...

comments-permalinkPopover =
  .description = Een dialoogvenster met een statische link naar de reactie
comments-permalinkPopover-permalinkToComment =
  .aria-label = Statische link naar de reactie
comments-permalinkButton-share = Delen
comments-permalinkButton =
  .aria-label = Deel reactie van {$username}
comments-permalinkView-section =
  .aria-label = Enkele conversatie
comments-permalinkView-viewFullDiscussion = Toon alle reacties
comments-permalinkView-commentRemovedOrDoesNotExist = Deze reactie is verwijderd of bestaat niet.

comments-rte-bold =
  .title = Vet

comments-rte-italic =
  .title = Schuinschrift

comments-rte-blockquote =
  .title = Blockquote

comments-rte-bulletedList =
  .title = Bulleted List

comments-rte-strikethrough =
  .title = Doorhalen

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarcasme

comments-rte-externalImage =
  .title = Externe afbeelding

comments-remainingCharacters = { $remaining } overgebleven karakters

comments-postCommentFormFake-signInAndJoin = Meld je aan of Registreer je in 1 minuut om een reactie te kunnen plaatsen.

comments-postCommentForm-rteLabel = Plaats een reactie

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Antwoorden
comments-replyButton =
  .aria-label = Antwoord op reactie van {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Plaats reactie
comments-replyCommentForm-cancel = Annuleren
comments-replyCommentForm-rteLabel = Schrijf een reactie
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Draadniveau { $level }:
comments-commentContainer-highlightedLabel = Uitgelicht:
comments-commentContainer-ancestorLabel = Voorouder:
comments-commentContainer-replyLabel =
  Antwoord van { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Vraag van { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Reactie van { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Aanpassen

comments-commentContainer-avatar =
  .alt = Avatar voor { $username }

comments-editCommentForm-saveChanges = Bewaar wijzigingen
comments-editCommentForm-cancel = Annuleren
comments-editCommentForm-close = Sluiten
comments-editCommentForm-rteLabel = Wijzig reactie
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Aanpassen: <time></time> resterend
comments-editCommentForm-editTimeExpired = Tijd om aan te passen verlopen. Je kunt deze reactie niet meer aanpassen. Waarom plaatst je geen andere reactie?
comments-editedMarker-edited = Aangepast
comments-showConversationLink-readMore = Lees meer over deze discussie >
comments-conversationThread-showMoreOfThisConversation =
  Toon meer van deze discussie

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Je bekijkt momenteel een enkel gesprek
comments-inReplyTo = Als antwoord op <Username></Username>
comments-replyingTo = Antwoord op: <Username></Username>

comments-reportButton-report = Rapporteer
comments-reportButton-reported = Gerapporteerd
comments-reportButton-aria-report =
  .aria-label = Rapporteer reactie van {$username}
comments-reportButton-aria-reported =
  .aria-label = Gerapporteerd

comments-sortMenu-sortBy = Sorteer op
comments-sortMenu-newest = Nieuwste
comments-sortMenu-oldest = Oudste
comments-sortMenu-mostReplies = Meeste antwoorden

comments-userPopover =
  .description = Meer gebruikers informatie
comments-userPopover-memberSince = Reageert sinds: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Negeren

comments-userIgnorePopover-ignoreUser = Negeer {$username}?
comments-userIgnorePopover-description =
  Wanneer je een gebruiker negeert, dan worden
  alle reacties van deze gebruiker niet meer getoond aan je.
  Je kunt dit later ongedaan maken in je profiel.
comments-userIgnorePopover-ignore = Negeren
comments-userIgnorePopover-cancel = Annuleren

comments-userBanPopover-title = Blokkeer {$username}?
comments-userSiteBanPopover-title = Ban {$username} from this site?
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
comments-moderationDropdown-siteBan = Site Ban
comments-moderationDropdown-banned = Geblokkeerd
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderatie-weergave
comments-moderationDropdown-moderateStory = Modereer artikel
comments-moderationDropdown-caretButton =
  .aria-label = Modereer

comments-moderationRejectedTombstone-title = U heeft deze reactie afgewezen.
comments-moderationRejectedTombstone-moderateLink =
  Ga naar modereren om dit besluit te herzien.

comments-featuredTag = Uitgelicht
comments-featuredBy = Uitgelicht door <strong>{$username}</strong>

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} reactie van {$username}
    *[other] {$reaction} reacties van {$username} (Totaal: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} reactie van {$username}
    [one] {$reaction} reactie van {$username}
    *[other] {$reaction} reactie van {$username} (Totaal: {$count})
  }

comments-jumpToComment-title = Je reactie staat hieronder
comments-jumpToComment-GoToReply = Ga naar reactie

comments-mobileToolbar-closeButton =
  .aria-label = Sluiten
comments-mobileToolbar-unmarkAll = Markeer alle als gelezen
comments-mobileToolbar-nextUnread = Volgende ongelezen

comments-refreshComments-closeButton = Sluiten <icon></icon>
  .aria-label = Sluiten
comments-refreshComments-refreshButton = <icon></icon> Herlaad reacties
  .aria-label = Herlaad reacties
comments-refreshQuestions-refreshButton = <icon></icon> Herlaad vragen
  .aria-label = Herlaad vragen
comments-refreshReviews-refreshButton = <icon></icon> Herlaad reviews
  .aria-label = Herlaad reviews

comments-replyChangedWarning-theCommentHasJust =
  Deze reactie is zojuist bewerkt. De nieuwste versie wordt hierboven weergegeven.


### Q&A

general-tabBar-qaTab = Vraag & Antwoord

qa-postCommentForm-section =
  .aria-label = Stel een vraag

qa-answeredTab = Beantwoord
qa-unansweredTab = Onbeantwoord
qa-allCommentsTab = Alles

qa-answered-answerLabel =
  Antwoord van {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Ga naar gesprek
qa-answered-replies = Reacties

qa-noQuestionsAtAll =
  Er zijn geen vragen over dit artikel.
qa-noQuestionsYet =
  Er zijn nog geen vragen gesteld. Waarom stel je er geen?
qa-viewNew-loading = Laden...
qa-viewNew =
  { $count ->
    [1] Bekijk {$count} nieuwe vraag
    *[other] Bekijk {$count} nieuwe vragen
  }

qa-postQuestionForm-rteLabel = Plaats een vraag
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Meest gestemd

qa-answered-tag = beantwoord
qa-expert-tag = expert

qa-reaction-vote = Stem
qa-reaction-voted = Gestemd

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Stem voor reactie van {$username}
    *[other] Stem ({$count}) voor reactie van {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Gestemd voor reactie van {$username}
    [one] Gestemd voor reactie van {$username}
    *[other] Gestemd ({$count}) voor reactie van {$username}
  }

qa-unansweredTab-doneAnswering = Klaar

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Hoe wordt een vraag beantwoord?
qa-answeredTooltip-answeredComments =
  Vragen worden beantwoord door een V&A expert.
qa-answeredTooltip-toggleButton =
  .aria-label = Wissel de tooltip van beantwoorde vragen
  .title = Wissel de tooltip van beantwoorde vragen

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Verwijderen account aangevraagd
comments-stream-deleteAccount-callOut-receivedDesc =
  Een aanvraag om je account te verwijderen is ontvangen op { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Als je reacties wilt blijven plaatsen,
  kun je je verzoek om je account te verwijderen annuleren voor { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Annuleer de aanvraag om dit account te verwijderen
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Annuleer het verwijderen van het account

comments-permalink-copyLink = Link kopiëren
comments-permalink-linkCopied = Link kopiëren

### Embed Links

comments-embedLinks-showEmbeds = Laat ingesloten inhoud zien
comments-embedLinks-hideEmbeds = Verberg ingesloten inhoud

comments-embedLinks-show-giphy = Toon GIF
comments-embedLinks-hide-giphy = Verberg GIF

comments-embedLinks-show-youtube = Toon video
comments-embedLinks-hide-youtube = Verberg video

comments-embedLinks-show-twitter = Toon Tweet
comments-embedLinks-hide-twitter = Verberg Tweet

comments-embedLinks-show-external = Toon afbeelding
comments-embedLinks-hide-external = Verberg afbeelding

comments-embedLinks-expand = Uitvouwen


### Featured Comments
comments-featured-label =
  Uitgelichte reactie van {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Ga naar de discussie
comments-featured-gotoConversation-label-with-username =
  .aria-label = Ga naar deze uitgelichte reactie van gebruiker { $username } in de hoofdcommentaarstream
comments-featured-gotoConversation-label-without-username =
  .aria-label = Ga naar deze uitgelichte reactie in de hoofdcommentaarstream
comments-featured-replies = Antwoorden

## Profile Tab

profile-myCommentsTab = Mijn reacties
profile-myCommentsTab-comments = Mijn reacties
profile-accountTab = Account
profile-preferencesTab = Voorkeuren

### Bio
profile-bio-title = Bio
profile-bio-description =
  Schrijf een bio om openbaar weer te geven op je commentaarprofiel. Moet
  minder dan 100 tekens bevatten.
profile-bio-remove = Verwijderen
profile-bio-update = Bijwerken
profile-bio-success = Je bio is succesvol bijgewerkt.
profile-bio-removed = Je bio is verwijderd.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Je account zal worden verwijderd op { $date }.
profile-accountDeletion-cancelDeletion =
  Annuleer de aanvraag om dit account te verwijderen
profile-accountDeletion-cancelAccountDeletion =
  Annuleer het verwijderen van het account

### Comment History
profile-commentHistory-section =
  .aria-label = Reactie Geschiedenis
profile-historyComment-commentLabel =
  Reactie <RelativeTime></RelativeTime> op { $storyTitle }
profile-historyComment-viewConversation = Bekijk discussie
profile-historyComment-replies = Antwoorden {$replyCount}
profile-historyComment-commentHistory = oude reacties
profile-historyComment-story = Bericht: {$title}
profile-historyComment-comment-on = Reageer op:
profile-profileQuery-errorLoadingProfile = Profiel kan niet ingeladen worden
profile-profileQuery-storyNotFound = Reactie niet gevonden
profile-commentHistory-loadMore = Meer laden
profile-commentHistory-empty = Je hebt nog geen reacties geschreven
profile-commentHistory-empty-subheading = Een overzicht van je reacties zal hier getoond worden

profile-commentHistory-archived-thisIsAllYourComments =
  This is all of your comments from the previous { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uur
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaar
    }
    *[other] onbekende eenheid
  }. Neem contact met ons op om de rest van je reacties te bekijken.

### Preferences

profile-preferences-mediaPreferences = Mediavoorkeuren
profile-preferences-mediaPreferences-alwaysShow = Altijd GIFs, tweets, YouTube, etc. tonen
profile-preferences-mediaPreferences-thisMayMake = Dit kan ervoor zorgen dat de reacties langzamer laden
profile-preferences-mediaPreferences-update = Bijwerken
profile-preferences-mediaPreferences-preferencesUpdated =
  Je mediavoorkeuren zijn bijgewerkt

### Account
profile-account-ignoredCommenters = Genegeerde gebruikers
profile-account-ignoredCommenters-description =
  Als je een gebruiker negeert, dan worden alle reacties van deze gebruiker
  niet meer getoond aan jou.
  Gebruikers die jij negeert kunnen nog wel jouw reacties zien.

profile-account-ignoredCommenters-empty = Je negeert niemand
profile-account-ignoredCommenters-stopIgnoring = Stop met negeren
profile-account-ignoredCommenters-youAreNoLonger =
  Je negeert deze gebruiker niet langer.
profile-account-ignoredCommenters-manage = Beheer
  .aria-label = Beheer genegeerde gebruikers
profile-account-ignoredCommenters-cancel = Annuleer
profile-account-ignoredCommenters-close = Sluiten

profile-account-changePassword-cancel = Annuleer
profile-account-changePassword = Wijzig wachtwoord
profile-account-changePassword-oldPassword = Oud wachtwoord
profile-account-changePassword-forgotPassword = Wachtwoord vergeten?
profile-account-changePassword-newPassword = Nieuw wachtwoord
profile-account-changePassword-button = Change wachtwoord
profile-account-changePassword-updated =
  Je wachtwoord is gewijzigd
profile-account-changePassword-password = wachtwoord

profile-account-download-comments-title = Download mijn oude reacties
profile-account-download-comments-description =
  Je ontvangt een e-mail met een link om je oude reacties te downloaden.
  Je kunt <strong>één download aanvragen elke 14 dagen.</strong>
profile-account-download-comments-request =
  Aanvraag oude reacties
profile-account-download-comments-request-icon =
  .title = Aanvraag oude reacties
profile-account-download-comments-recentRequest =
  Je meest recente aanvraag: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Je meest recente verzoek was binnen de laatste 14 dagen.
  Je kunt opnieuw een verzoek indienen om je reacties te downloaden op: { $timeStamp }
profile-account-download-comments-requested =
  Verzoek ingediend. Je kunt een ander verzoek indienen in { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Je verzoek is succesvol ingediend.
  Je kunt opnieuw een verzoek indienen om je reacties te downloaden over { framework-timeago-time }.
profile-account-download-comments-error =
  We konden je downloadverzoek niet voltooien.
profile-account-download-comments-request-button = Aanvraag

## Delete Account

profile-account-deleteAccount-title = Verwijder mijn Account
profile-account-deleteAccount-deleteMyAccount = Verwijder mijn account
profile-account-deleteAccount-description =
  Als je je account verwijdert, wordt je profiel permanent gewist en tevens
  al je reacties op deze website.
profile-account-deleteAccount-requestDelete = Aanvraag verwijderen account

profile-account-deleteAccount-cancelDelete-description =
  Je hebt al een verzoek ingediend om je account te verwijderen.
  Je account zal verwijderd worden op { $date }.
  Je kunt de aanvraag tot die tijd annuleren.
profile-account-deleteAccount-cancelDelete = Annuleer de aanvraag tot verwijderen van account

profile-account-deleteAccount-request = Aanvraag
profile-account-deleteAccount-cancel = Annuleer
profile-account-deleteAccount-pages-deleteButton = Verwijder mijn account
profile-account-deleteAccount-pages-cancel = Annuleer
profile-account-deleteAccount-pages-proceed = Ga door
profile-account-deleteAccount-pages-done = Gedaan
profile-account-deleteAccount-pages-phrase =
  .aria-label = Zin

profile-account-deleteAccount-pages-sharedHeader = Mijn account verwijderen

profile-account-deleteAccount-pages-descriptionHeader = Verwijder mijn account?
profile-account-deleteAccount-pages-descriptionText =
  Je probeert je account te verwijderen. Dit betekent:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Al je reacties worden van deze website verwijderd
profile-account-deleteAccount-pages-allCommentsDeleted =
  Al je reacties worden van onze database verwijderd
profile-account-deleteAccount-pages-emailRemoved =
  Je e-mailadres wordt uit ons systeem verwijderd

profile-account-deleteAccount-pages-whenHeader = Verwijder mijn account: Wanneer?
profile-account-deleteAccount-pages-whenSubHeader = Wanneer?
profile-account-deleteAccount-pages-whenSec1Header =
  Wanneer wordt mijn account verwijderd?
profile-account-deleteAccount-pages-whenSec1Content =
  Je account wordt 24 uur na het indienen van je aanvraag verwijderd.
profile-account-deleteAccount-pages-whenSec2Header =
  Kan ik nog steeds reacties schrijven totdat mijn account wordt verwijderd?
profile-account-deleteAccount-pages-whenSec2Content =
  Nee. Als je eenmaal een verzoek tot verwijdering van je account hebt ingediend,
  kun je geen reacties meer schrijven of selecteren.

profile-account-deleteAccount-pages-downloadCommentHeader = Download mijn reacties?
profile-account-deleteAccount-pages-downloadSubHeader = Download mijn reacties
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Wij raden je aan je oude reacties te downloaden
  voordat je account wordt verwijderd. Nadat je account verwijderd is, ben je
  niet meer in staat om een download van je oude reacties aan te vragen.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download mijn oude reacties

profile-account-deleteAccount-pages-confirmHeader = Bevestig de verwijdering van dit account?
profile-account-deleteAccount-pages-confirmSubHeader = Weet je het zeker?
profile-account-deleteAccount-pages-confirmDescHeader =
  Weet je zeker dat je je account wilt verwijderen?
profile-account-deleteAccount-confirmDescContent =
  Ter bevestiging dat je je account wilt verwijderen, typ je de volgende zin
  in het onderstaande tekstvak:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Ter bevestiging, typ onderstaande zin:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Geef je wachtwoord in:

profile-account-deleteAccount-pages-completeHeader = Verwijderen van account is aangevraagd
profile-account-deleteAccount-pages-completeSubHeader = Verzoek ingediend
profile-account-deleteAccount-pages-completeDescript =
  Je verzoek is ingediend en er is een bevestiging gestuurd naar het e-mailadres
  gekoppeld aan je account.
profile-account-deleteAccount-pages-completeTimeHeader =
  Je account wordt verwijderd op: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Van gedachten veranderd?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Meld je voor dit tijdstip gewoon weer aan op je account en selecteer
  <strong>Annuleren van een verzoek tot verwijdering van een account</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Vertel ons waarom.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  We willen graag weten waarom je ervoor gekozen heeft om je account te verwijderen. Stuur ons feedback over
  ons reactiesysteem door te e-mailen{ $email }.
profile-account-changePassword-edit = Bewerk
profile-account-changePassword-change = Wijzigen
  .aria-label = Wijzig wachtwoord

## Notifications
profile-notificationsTab = Notificaties
profile-account-notifications-emailNotifications = E-mail notificaties
profile-account-notifications-emailNotifications = E-mail notificaties
profile-account-notifications-receiveWhen = Ontvang notificaties als:
profile-account-notifications-onReply = Mijn reactie een antwoord ontvangt
profile-account-notifications-onFeatured = Mijn reactie is opgenomen in de lijst
profile-account-notifications-onStaffReplies = Een medewerker reageert op mijn reactie
profile-account-notifications-onModeration = Mijn reactie in afwachting is beoordeeld
profile-account-notifications-sendNotifications = Stuur notificaties:
profile-account-notifications-sendNotifications-immediately = Onmiddellijk
profile-account-notifications-sendNotifications-daily = Dagelijks
profile-account-notifications-sendNotifications-hourly = Elk uur
profile-account-notifications-updated = Je instellingen voor je notificaties zijn bijgewerkt
profile-account-notifications-button = Update instellingen voor notificaties
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

comments-reportPopover-additionalInformation =
  Meer informatie <optional>(optioneel)</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Meer informatie <optional>(optioneel)</optional>

comments-reportPopover-maxCharacters = Max. { $maxCharacters } tekens
comments-reportPopover-restrictToMaxCharacters = Beperk je rapportage tot { $maxCharacters } tekens
comments-reportPopover-cancel = Annuleren
comments-reportPopover-submit = Versturen

comments-reportPopover-thankYou = Bedankt!
comments-reportPopover-receivedMessage =
  We hebben je bericht ontvangen. Meldingen van gebruikers houdt deze gemeenschap veilig.

comments-reportPopover-dismiss = Afwijzen

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Rapporteer deze reactie
comments-archivedReportPopover-doesThisComment =
  Schendt deze reactie onze community richtlijnen? Is dit beledigend of spam?
  Stuur een e-mail naar ons moderatieteam op <a>{ $orgName }</a> met een link naar
  deze reactie en een korte uitleg.
comments-archivedReportPopover-needALink =
  Heb je een link naar deze reactie nodig?
comments-archivedReportPopover-copyLink = Link kopiëren

comments-archivedReportPopover-emailSubject = Reactie rapporteren
comments-archivedReportPopover-emailBody =
  Ik wil de volgende reactie rapporteren:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Om de volgende redenen:

## Submit Status
comments-submitStatus-dismiss = Afwijzen
comments-submitStatus-submittedAndWillBeReviewed =
  Je reactie is toegevoegd en zal eerst bekeken worden door een moderator
comments-submitStatus-submittedAndRejected =
  Deze reactie is afgewezen omdat hij onze spelregels heeft geschonden

# Configure
configure-configureQuery-errorLoadingProfile = Probleem bij het laden
configure-configureQuery-storyNotFound = Artikel niet gevonden

## Archive
configure-archived-title = Deze reactiestroom is gearchiveerd
configure-archived-onArchivedStream =
  Op gearchiveerde stromen kunnen geen nieuwe reacties, reacties of rapporten worden
ingediend. Bovendien kunnen reacties niet worden gemodereerd.
configure-archived-toAllowTheseActions =
  Om deze acties toe te staan, dearchiveer de stroom.
configure-archived-unarchiveStream = Dearchiveer stroom

## Change username
profile-changeUsername-username = Gebruikersnaam
profile-changeUsername-success = Je gebruikersnaam is succesvol aangepast
profile-changeUsername-edit = Bewerk
profile-changeUsername-change = Wijzigen
  .aria-label = Wijzig gebruikernaam
profile-changeUsername-heading = Bewerk je gebruikersnaam
profile-changeUsername-heading-changeYourUsername = Change your username
profile-changeUsername-desc = Wijzig de gebruikersnaam die bij al je vroegere en toekomstige reacties zal verschijnen. <strong>Gebruikersnamen kunnen gewijzigd worden ééns per { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Wijzig de gebruikersnaam die bij al je vroegere en toekomstige reacties zal verschijnen. Gebruikersnamen kunnen gewijzigd worden ééns per { framework-timeago-time }.
profile-changeUsername-current = Huidige gebruikersnaam
profile-changeUsername-newUsername-label = Nieuwe gebruikersnaam
profile-changeUsername-confirmNewUsername-label = Bevestig nieuwe gebruikersnaam
profile-changeUsername-cancel = Annuleer
profile-changeUsername-save = Bewaar
profile-changeUsername-saveChanges = Wijzigingen opslaan
profile-changeUsername-recentChange = Je gebruikersnaam is gewijzigd in de laatste { framework-timeago-time }. Je mag je gebruikersnaam opnieuw wijzigen op { $nextUpdate }
profile-changeUsername-youChangedYourUsernameWithin =
  Je hebt je gebruikersnaam in de afgelopen { framework-timeago-time } gewijzigd. Je kunt je gebruikersnaam weer wijzigen op: { $nextUpdate }.
profile-changeUsername-close = Sluiten

## Discussions tab

discussions-mostActiveDiscussions = Meest actieve discussies
discussions-mostActiveDiscussions-subhead = Gerangschikt op de meeste ontvangen reacties in de afgelopen 24 uur op { $siteName }
discussions-mostActiveDiscussions-empty = Je hebt nog niet deelgenomen aan enige discussies
discussions-myOngoingDiscussions = Mijn lopende discussies
discussions-myOngoingDiscussions-subhead = Waar je hebt gereageerd op { $orgName }
discussions-viewFullHistory = Bekijk volledige reactiegeschiedenis
discussions-discussionsQuery-errorLoadingProfile = Fout bij het laden van profiel
discussions-discussionsQuery-storyNotFound = Artikel niet gevonden

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Deze stroom configureren
configure-stream-apply =
configure-stream-update = Bijwerken
configure-stream-streamHasBeenUpdated =
  Deze stroom is bijgewerkt

configure-premod-title =
configure-premod-premoderateAllComments = Pre-modereren van alle reacties
configure-premod-description =
  Moderatoren moeten elke reactie eerst goedkeuren voordat deze zichtbaar wordt.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Pre-moderate comments containing links
configure-premodLink-description =
  Moderatoren moeten elke reactie met een link eerst goedkeuren voordat deze zichtbaar wordt.

configure-messageBox-title =
configure-addMessage-title =
  Bericht of vraag toevoegen
configure-messageBox-description =
configure-addMessage-description =
  Voeg een bericht toe bovenaan het reactieveld voor je lezers. Gebruik dit om een onderwerp te introduceren, een vraag te stellen of aankondigingen te doen met betrekking tot dit artikel.
configure-addMessage-addMessage = Bericht toevoegen
configure-addMessage-removed = Bericht is verwijderd
config-addMessage-messageHasBeenAdded =
  Het bericht is toegevoegd aan het reactieveld
configure-addMessage-remove = Verwijderen
configure-addMessage-submitUpdate = Updaten
configure-addMessage-cancel = Annuleren
configure-addMessage-submitAdd = Bericht toevoegen

configure-messageBox-preview = Voorbeeld
configure-messageBox-selectAnIcon = Selecteer een icon
configure-messageBox-iconConversation = Discussie
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Help
configure-messageBox-iconWarning = Waarschuwing
configure-messageBox-iconChatBubble = Tekstvak
configure-messageBox-noIcon = Geen icoon
configure-messageBox-writeAMessage = Schrijf een bericht

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Reactiestroom sluiten
configure-closeStream-description =
  Deze reactiestroom is open. Door het sluiten van deze reactiestroom
  kunnen er geen nieuwe reacties toegevoegd worden
  maar alle reeds toegevoegde reacties zullen zichtbaar blijven.
configure-closeStream-closeStream = Sluit reactiestroom
configure-closeStream-theStreamIsNowOpen = De reactiestroom is nu open

configure-openStream-title = Open reactiestroom
configure-openStream-description =
  Deze reactiestroom is gesloten. Door het openen van deze reactiestroom
  kunnen nieuwe reacties worden toegevoegd en weergegeven.
configure-openStream-openStream = Open reactiestroom
configure-openStream-theStreamIsNowClosed = De reactiestroom is nu gesloten

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  De V&A-indeling is momenteel in actieve ontwikkeling. Neem contact met ons op voor feedback of verzoeken.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Schakel over naar het V&A-indeling
configure-enableQA-description =
  De V&A-indeling stelt gemeenschapsleden in staat vragen in te dienen voor gekozen experts om te beantwoorden.
configure-enableQA-enableQA = Schakel over naar V&A
configure-enableQA-streamIsNowComments =
  Deze stream is nu in commentaarindeling

configure-disableQA-title = Configureer deze V&A
configure-disableQA-description =
  De V&A-indeling stelt gemeenschapsleden in staat vragen in te dienen voor gekozen experts om te beantwoorden.
configure-disableQA-disableQA = Schakel over naar commentaar
configure-disableQA-streamIsNowQA =
  Deze stroom is nu in V&A-indeling

configure-experts-title = Voeg een expert toe

configure-experts-filter-searchField =
  .placeholder = Zoeken op e-mail of gebruikersnaam
  .aria-label = Zoeken op e-mail of gebruikersnaam
configure-experts-filter-searchButton =
  .aria-label = Zoeken
configure-experts-filter-description =
  Voegt een Expert Badge toe aan reacties van geregistreerde gebruikers, alleen op deze pagina.
  Nieuwe gebruikers moeten zich eerst aanmelden en de reacties op een pagina openen om hun account aan te maken.
configure-experts-search-none-found = Geen gebruikers gevonden met dat e-mailadres of gebruikersnaam
configure-experts-remove-button = Verwijderen
configure-experts-load-more = Meer laden
configure-experts-none-yet = Er zijn momenteel geen experts voor deze V&A.
configure-experts-search-title = Zoek naar een expert
configure-experts-assigned-title = Experts
configure-experts-noLongerAnExpert = is geen expert meer

comments-tombstone-ignore-user = Deze reactie is verborgen omdat je deze gebruiker negeert.
comments-tombstone-showComment = Toon reactie
comments-tombstone-deleted =
  Deze reactie is niet meer beschikbaar. De gebruiker heeft zijn account verwijderd.
comments-tombstone-rejected =
  Deze reactie is verwijderd door een moderator omdat deze in strijd is met onze gemeenschapsrichtlijnen.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Je account is tijdelijk geschorst voor het plaatsen van reacties.
suspendInfo-description-inAccordanceWith =
  In overeenstemming met de spelregels van { $organization } is je
  account tijdelijk geblokkeerd. Intussen zul je geen reacties
  meer kunnen plaatsen. Je kunt terug deelnemen
  aan de discussie op { $until }
suspendInfo-until-pleaseRejoinThe =
  Gelieve op { $until } opnieuw deel te nemen aan de discussie.

warning-heading = Je account heeft een waarschuwing ontvangen
warning-explanation =
  Overeenkomstig onze gemeenschapsrichtlijnen heeft je account een waarschuwing ontvangen.
warning-instructions =
  Om deel te blijven nemen aan discussies, druk op de "Erkennen" knop hieronder.
warning-acknowledge = Erkennen

warning-notice = Je account heeft een waarschuwing ontvangen. Om deel te blijven nemen, <a>bekijk de waarschuwingsboodschap</a>.

modMessage-heading = Je account heeft een bericht ontvangen van een moderator
modMessage-acknowledge = Bevestigen

profile-changeEmail-unverified = (Niet geverifieerd)
profile-changeEmail-current = (Huidig)
profile-changeEmail-edit = Bewerk
profile-changeEmail-change = Aanpassen
  .aria-label = Wijzig e-mailadres
profile-changeEmail-please-verify = Controleer je e-mailadres
profile-changeEmail-please-verify-details =
  Een e-mail is verzonden naar { $email } ter bevestiging van je account.
  Je moet je nieuwe e-mailadres controleren voordat je het kunt gebruiken
  om in te loggen op je account of om meldingen te ontvangen.
profile-changeEmail-resend = Verificatie opnieuw verzenden
profile-changeEmail-heading = Bewerk je e-mailadres
profile-changeEmail-changeYourEmailAddress =
  Verander je e-mailadres
profile-changeEmail-desc = Wijzig het e-mailadres dat wordt gebruikt voor het aanmelden en voor het ontvangen van communicatie over je account.
profile-changeEmail-newEmail-label = Nieuw e-mailadres
profile-changeEmail-password = Wachtwoord
profile-changeEmail-password-input =
  .placeholder = Wachtwoord
profile-changeEmail-cancel = Annuleer
profile-changeEmail-submit = Bewaar
profile-changeEmail-saveChanges = Opslaan
profile-changeEmail-email = E-mail
profile-changeEmail-title = E-mailadres
profile-changeEmail-success = Je e-mailadres is succesvol bijgewerkt

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Plaats een review of stel een vraag

ratingsAndReviews-reviewsTab = Reviews
ratingsAndReviews-questionsTab = Vragen
ratingsAndReviews-noReviewsAtAll = Er zijn geen reviews.
ratingsAndReviews-noQuestionsAtAll =  Er zijn geen vragen.
ratingsAndReviews-noReviewsYet = Er zijn nog geen reviews. Waarom schrijf je er niet een?
ratingsAndReviews-noQuestionsYet = Er zijn nog geen vragen. Waarom stel je er niet een?
ratingsAndReviews-selectARating = Selecteer een beoordeling
ratingsAndReviews-youRatedThis = Je hebt dit beoordeeld
ratingsAndReviews-showReview = Toon review
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Beoordeel en schrijf een review
ratingsAndReviews-askAQuestion = Stel een vraag
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Nog geen beoordelingen
  [1] Gebaseerd op 1 beoordeling
  *[other] Gebaseerd op { SHORT_NUMBER($count) } beoordelingen
}

ratingsAndReviews-allReviewsFilter = Alle reviews
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 ster
  *[other] { $rating } sterren
}

comments-addAReviewForm-rteLabel = Voeg een review toe (optioneel)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Bovenkant artikel
  .title = Ga naar bovenkant artikel
stream-footer-links-top-of-comments = Bovenkant reacties
  .title = Ga naar bovenkant reacties
stream-footer-links-profile = Profiel & Antwoorden
  .title = Ga naar profiel en antwoorden
stream-footer-links-discussions = Meer discussies
  .title = Ga naar meer discussies
stream-footer-navigation =
  .aria-label = Footer reacties

### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Comments Embed

general-moderate = Moderer

general-userBoxUnauthenticated-joinTheConversation = Delta i samtalen
general-userBoxUnauthenticated-signIn = Logg inn
general-userBoxUnauthenticated-register = Registrer deg

general-authenticationSection =
  .aria-label = Authentication

general-userBoxAuthenticated-signedIn =
  Innlogget som
general-userBoxAuthenticated-notYou =
  Ikke deg? <button>Logg ut</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Du er nå logget ut

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-discussionsTab = Diskusjoner
general-tabBar-reviewsTab = Vurderinger
general-tabBar-configure = Innstillinger

general-tabBar-aria-comments =
  .aria-label = Kommentarer
  .title = Kommentarer
general-tabBar-aria-qa =
  .aria-label = Spørsmål og svar
  .title = Spørsmål og svar
general-tabBar-aria-myProfile =
  .aria-label = Min profil
  .title = Min profil
general-tabBar-aria-configure =
  .aria-label = Innstillinger
  .title = Min profil
general-tabBar-aria-discussions =
  .aria-label = Diskusjoner
  .title = Diskusjoner
general-mainTablist =
  .aria-label = Hovedfaneliste

general-secondaryTablist =
  .aria-label = Sekundærfaneliste


## Comment Count

comment-count-text =
  { $count  ->
    [one] kommentar
    *[other] kommentarer
  }

## Comments Tab

comments-allCommentsTab = Alle kommentarer
comments-featuredTab = Fremhevede
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 person ser på denne diskusjonen
    *[other] { SHORT_NUMBER($count) } pålogget nå
  }

comments-announcement-section =
  .aria-label = Kunngjøring
comments-announcement-closeButton =
  .aria-label = Lukk kunngjøring


comments-accountStatus-section =
  .aria-label = Konto-status

comments-featuredCommentTooltip-how = Hvordan blir en kommentar fremhevet?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentarer verdt å lese blir valgt ut av oss.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Vis fremhevede kommentarer-tooltip
  .title = Vis fremhevede kommentarer-tooltip


comments-collapse-toggle =
  .aria-label = Kollapse kommentartråd
comments-expand-toggle =
  .aria-label = Utvid kommentartråden
comments-bannedInfo-bannedFromCommenting = Kontoen din er utestengt. Du har ikke tillatelse til å kommentere.
comments-bannedInfo-violatedCommunityGuidelines =
  Noen med tilgang til kontoen din har brutt retningslinjene her inne.
  Kontoen din har derfor blitt utestengt og du kan ikke kommentere,
  reagere på eller rapportere kommentarer lenger. Om du mistenker at
  det har skjedd feil, vennligst kontakt oss.


comments-noCommentsAtAll = Det er ingen kommentarer til denne saken.
comments-noCommentsYet = Det er ingen kommentarer ennå. Hvorfor ikke skrive en?


comments-streamQuery-storyNotFound = Kommentarfelt ikke funnet

comments-communityGuidelines-section =
  .aria-label = Retningslinjer

comments-commentForm-cancel = Avbryt
comments-commentForm-saveChanges = Lagre endringer
comments-commentForm-submit = Send

comments-postCommentForm-section =
  .aria-label = Legg inn en kommentar
comments-postCommentForm-submit = Send
comments-replyList-showAll = Vis alle
comments-replyList-showMoreReplies = Vis flere svar

comments-postCommentForm-gifSeach = Søk etter GIF
comments-postComment-gifSearch-search =
  .aria-label = Søk
comments-postComment-gifSearch-loading = Laster...
comments-postComment-gifSearch-no-results = Ingen resultater funnet for {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Levert av Giphy

comments-postComment-pasteImage = Lim inn bilde-URL
comments-postComment-insertImage = Sett inn

comments-postComment-confirmMedia-youtube = Vil du legge til denne YouTube-videoen nederst i kommentaren din?
comments-postComment-confirmMedia-twitter = Vil du legge til denne Twitter-meldingen nederst i kommentaren din?
comments-postComment-confirmMedia-cancel = Avbryt
comments-postComment-confirmMedia-add-tweet = Legg til Twitter-melding
comments-postComment-confirmMedia-add-video = Legg til video
comments-postComment-confirmMedia-remove = Fjern
comments-commentForm-gifPreview-remove = Fjern
comments-viewNew =
  { $count ->
    [1] Vis {$count} ny kommentar
    *[other] Vis {$count} nye kommentarer
  }
comments-loadMore = Last flere


comments-permalinkPopover =
  .description = En dialogboks som viser lenken til kommentaren
comments-permalinkPopover-permalinkToComment =
  .aria-label = Lenken til kommentaren
comments-permalinkButton-share = Del
comments-permalinkButton =
  .aria-label = Del kommentaren til {$username}
comments-permalinkView-section =
  .aria-label = Enkeltsamtale
comments-permalinkView-viewFullDiscussion = Vis hele diskusjonen
comments-permalinkView-commentRemovedOrDoesNotExist = Denne kommentaren har blitt fjernet eller aldri eksistert.


comments-rte-bold =
  .title = Fet

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Sitat

comments-rte-bulletedList =
  .title = Punktliste

comments-rte-strikethrough =
  .title = Gjennomstreking

comments-rte-spoiler = Røpealarm

comments-rte-sarcasm = Sarkasme

comments-rte-externalImage =
  .title = Eksternt bilde

comments-remainingCharacters = { $remaining } tegn igjen

comments-postCommentFormFake-signInAndJoin = Logg inn og delta i samtalen

comments-postCommentForm-rteLabel = Legg inn en kommentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Svar
comments-replyButton =
  .aria-label = Svar på kommentaren til {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Send
comments-replyCommentForm-cancel = Avbryt
comments-replyCommentForm-rteLabel = Skriv et svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Trådnivå { $level }:
comments-commentContainer-highlightedLabel = Uthevet:
comments-commentContainer-ancestorLabel = Trådstarter:
comments-commentContainer-replyLabel =
  Svar fra { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Soørsmål fra { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Kommentar fra { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Rediger

comments-commentContainer-avatar =
  .alt = Avatar for { $username }

comments-editCommentForm-saveChanges = Lagre endringer
comments-editCommentForm-cancel = Avbryt
comments-editCommentForm-close = Lukk
comments-editCommentForm-rteLabel = Rediger kommentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Rediger: <time></time> igjen
comments-editCommentForm-editTimeExpired = Redigeringstiden er utløpt. Det er ikke lenger mulig å redigere denne kommentaren. Kanskje du vil legge inn en ny?
comments-editedMarker-edited = Redigert
comments-showConversationLink-readMore = Les mer av denne samtalen >
comments-conversationThread-showMoreOfThisConversation =
  Vis mer av denne samtalen

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Du ser akkurat nå på en enkeltsamtale
comments-inReplyTo = Som svar til <Username></Username>
comments-replyingTo = Svarer <Username></Username>

comments-reportButton-report = Rapporter
comments-reportButton-reported = Rapportert
comments-reportButton-aria-report =
  .aria-label = Rapporter kommentar fra {$username}
comments-reportButton-aria-reported =
  .aria-label = Rapportert

comments-sortMenu-sortBy = Sorter etter
comments-sortMenu-newest = Nyeste
comments-sortMenu-oldest = Eldste
comments-sortMenu-mostReplies = Flest svar

comments-userPopover =
  .description = En popover med mer informasjon
comments-userPopover-memberSince = Medlem siden: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorer

comments-userIgnorePopover-ignoreUser = Ignorer {$username}?
comments-userIgnorePopover-description =
  Når du ignorerer en bruker, vil alle kommentarene
  fra denne brukeren bli skjult for deg. Du kan endre
  dette senere i profilen din.
comments-userIgnorePopover-ignore = Ignorer
comments-userIgnorePopover-cancel = Avbryt

comments-userBanPopover-title = Blokker {$username}?
comments-userBanPopover-description =
  Når en bruker først er blokkert vil han/hun ikke lenger
  kunne kommentere, reagere eller rapportere kommentarer.
  Denne kommentaren vil også bli avvist.

comments-userBanPopover-cancel = Avbryt
comments-userBanPopover-ban = Blokker


comments-moderationDropdown-popover =
  .description = En popover-meny for å moderere kommentarer
comments-moderationDropdown-feature = Fremhev
comments-moderationDropdown-unfeature = Fjern fra fremhevet
comments-moderationDropdown-approve = Godkjenn
comments-moderationDropdown-approved = Godkjent
comments-moderationDropdown-reject = Avvis
comments-moderationDropdown-rejected = Avvist
comments-moderationDropdown-ban = Blokker bruker
comments-moderationDropdown-banned = Blokkert
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Modereringsvisning
comments-moderationDropdown-moderateStory = Moderer samtale
comments-moderationDropdown-caretButton =
  .aria-label = Moderer


comments-rejectedTombstone-title = Du har avvist denne kommentaren.
comments-rejectedTombstone-moderateLink =
  Gå til Moderering for å gjøre om på denne beslutningen.


comments-featuredTag = Fremhevet

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    *[other] {$reaction} ({$count}) kommentar av {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    [one] {$reaction} kommentar av {$username}
    *[other] {$reaction} ({$count}) kommentar av {$username}
  }


comments-jumpToComment-title = Ditt svar er publisert under
comments-jumpToComment-GoToReply = Gå til svaret

### Q&A

general-tabBar-qaTab = Spørsmål og svar

qa-postCommentForm-section =
  .aria-label = Still et spørsmål


qa-answeredTab = Besvarte
qa-unansweredTab = Venter på svar
qa-allCommentsTab = Alle

qa-answered-answerLabel =
  Svar fra {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Gå til samtale
qa-answered-replies = Svar

qa-noQuestionsAtAll =
  Det er ingen spørsmål i denne samtalen.
qa-noQuestionsYet =
  Det er ingen spørsmål ennå. Kanskje du skal stille et?
qa-viewNew =
  { $count ->
    [1] Se {$count} nytt spørsmål
    *[other] Se {$count} nye spørsmål
  }

qa-postQuestionForm-rteLabel = Still et spørsmål
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Flest stemmer

qa-answered-tag = besvart
qa-expert-tag = ekspert

qa-reaction-vote = Stem opp
qa-reaction-voted = Stemt på

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Stem på kommentaren til {$username}
    *[other] Stem ({$count}) på kommentaren til {$username}
  }

qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Har stemt på kommentaren til {$username}
    [one] Har stemt på kommentaren til {$username}
    *[other] Har stemt ({$count}) på kommentaren til {$username}
  }


qa-unansweredTab-doneAnswering = Ferdig

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Hvordan blir et spørsmål besvart?
qa-answeredTooltip-answeredComments =
  Spørsmålene blir besvart av en av våre journalister eller eksperter.
qa-answeredTooltip-toggleButton =
  .aria-label = Vis besvarte spørsmål-tooltip
  .title = Vis besvarte spørsmål-tooltip

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Forespørsel om sletting av konto
comments-stream-deleteAccount-callOut-receivedDesc =
  En forespørsel om sletting av konto ble mottatt { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Hvis du vil fortsette å legge inn kommentarer, svar og reaksjoner,
  kan du avbryte forespørselen om sletting av konto innen { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Forespørsel om å avbryte sletting av konto
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Avbryt sletting av konto

comments-permalink-copyLink = Kopier lenke
comments-permalink-linkCopied = Lenke kopiert

### Embed Links

comments-embedLinks-showEmbeds = Vis eksternt innhold
comments-embedLinks-hideEmbeds = Skjul eksternt innhold

comments-embedLinks-show-giphy = Vis GIF
comments-embedLinks-hide-giphy = Skjul GIF

comments-embedLinks-show-youtube = Vis video
comments-embedLinks-hide-youtube = Skjul video

comments-embedLinks-show-twitter = Vis Twitter-melding
comments-embedLinks-hide-twitter = Skjul Twitter-melding

comments-embedLinks-show-external = Vis bilde
comments-embedLinks-hide-external = Skjul bilde



### Featured Comments
comments-featured-label =
  Fremhevet kommentar fra {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Gå til samtale
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mine kommentarer
profile-myCommentsTab-comments = Mine kommentarer
profile-accountTab = Konto
profile-preferencesTab = Innstillinger

### Bio
profile-bio-title = Bio
profile-bio-description =
  Skriv en bio som vises offentlig på din profil. Må være under 100 tegn.
profile-bio-remove = Fjern
profile-bio-update = Oppdater
profile-bio-success = Din bio er oppdatert
profile-bio-removed = Din bio er fjernet


### Account Deletion

profile-accountDeletion-deletionDesc =
  Din konto vil bli slettet { $date }.
profile-accountDeletion-cancelDeletion =
  Avbryt forespørsel om sletting av konto
profile-accountDeletion-cancelAccountDeletion =
  Avbryt sletting av konto

### Comment History
profile-commentHistory-section =
  .aria-label = Kommentarhistorie
profile-historyComment-commentLabel =
  Kommentar <RelativeTime></RelativeTime> på { $storyTitle }
profile-historyComment-viewConversation = Vis samtale
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentar-historikk
profile-historyComment-story = Sak: {$title}
profile-historyComment-comment-on = Kommentarer på:
profile-profileQuery-errorLoadingProfile = Feil ved lasting av profil
profile-profileQuery-storyNotFound = Samtalen ble ikke funnet
profile-commentHistory-loadMore = Last flere
profile-commentHistory-empty = Du har ikke skrevet noen kommentarer
profile-commentHistory-empty-subheading = En liste med dine kommentarer vil vises her

### Preferences

profile-preferences-mediaPreferences = Medieinnstillinger
profile-preferences-mediaPreferences-alwaysShow = Vis alltid GIF-er, Twitter-meldinger, YouTube-videoer, etc.
profile-preferences-mediaPreferences-thisMayMake = Dette kan gjøre at kommentarene laster litt tregere
profile-preferences-mediaPreferences-update = Oppdater
profile-preferences-mediaPreferences-preferencesUpdated =
  Dine medieinnstillinger har blitt oppdatert

### Account
profile-account-ignoredCommenters = Ignorerte brukere
profile-account-ignoredCommenters-description =
  Du kan ignorere brukere ved å klikke på brukernavnet deres og
  velge Ignorer. Når du ignorerer noen vil alle deres kommentarer
  bli skjult for deg. Brukere du ignorerer vil fortsatt kunne se
  dine kommentarer.
profile-account-ignoredCommenters-empty = Du har ikke ignorert noen
profile-account-ignoredCommenters-stopIgnoring = Slutt å ignorere
profile-account-ignoredCommenters-youAreNoLonger =
  Du ignorerer ikke lenger
profile-account-ignoredCommenters-manage = Gjør endringer
profile-account-ignoredCommenters-cancel = Avbryt
profile-account-ignoredCommenters-close = Lukk

profile-account-changePassword-cancel = Avbryt
profile-account-changePassword = Bytt passord
profile-account-changePassword-oldPassword = Gammelt passord
profile-account-changePassword-forgotPassword = Har du glemt passordet ditt?
profile-account-changePassword-newPassword = Nytt passord
profile-account-changePassword-button = Bytt passord
profile-account-changePassword-updated =
  Passordet ditt har blitt oppdatert
profile-account-changePassword-password = Passord


profile-account-download-comments-title = Last ned min kommentarhistorikk
profile-account-download-comments-description =
  Du vil motta en e-post med en lenke der du kan laste ned kommentarhistorikken din.
  Du kan komme med <strong>én nedlastingsforespørsel hver 14. dag.</strong>
profile-account-download-comments-request =
  Be om kommentarhistorikk
profile-account-download-comments-request-icon =
  .title = Be om kommentarhistorikk
profile-account-download-comments-recentRequest =
  Din siste forespørsel: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Din siste forespørsel var for under 14 dager siden. Du kan
  sende inn ny forespørsel: { $timeStamp }
profile-account-download-comments-requested =
  Forespørsel sendt. Du kan legge inn ny forespørsel om { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Din forespørsel er sendt. Du kan legge inn en ny forespørsel om å laste ned kommentarhistorikken din igjen om { framework-timeago-time }.
profile-account-download-comments-error =
  Vi kunne ikke behandle forespørselen om nedlasting
profile-account-download-comments-request-button = Forespørsel

## Delete Account

profile-account-deleteAccount-title = Slett konto
profile-account-deleteAccount-deleteMyAccount = Slett kontoen min
profile-account-deleteAccount-description =
  Om du sletter kontoen din vil hele profilen og alle kommentarer du har lagt inn forsvinne.
profile-account-deleteAccount-requestDelete = Be om sletting av konto



profile-account-deleteAccount-cancelDelete-description =
  Du har allerede sendt inn en forespørsel om sletting av konto.
  Din konto vil bli slettet den { $date }.
  Du kan avbryte forespørselen før dette.
profile-account-deleteAccount-cancelDelete = Avbryt forespørsel om sletting av konto

profile-account-deleteAccount-request = Forespørsel
profile-account-deleteAccount-cancel = Avbryt
profile-account-deleteAccount-pages-deleteButton = Slett kontoen min
profile-account-deleteAccount-pages-cancel = Avbryt
profile-account-deleteAccount-pages-proceed = Fortsett
profile-account-deleteAccount-pages-done = Ferdig
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-sharedHeader = Slett kontoen min

profile-account-deleteAccount-pages-descriptionHeader = Slette konto?
profile-account-deleteAccount-pages-descriptionText =
  Du prøver å slette kontoen din. Dette betyr:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Alle dine kommentarer blir fjernet fra disse sidene
profile-account-deleteAccount-pages-allCommentsDeleted =
  Alle dine kommentarer blir slettet fra vår database
profile-account-deleteAccount-pages-emailRemoved =
  Din e-postadresse blir fjernet fra systemet vårt

profile-account-deleteAccount-pages-whenHeader = Slett kontoen min: Når?
profile-account-deleteAccount-pages-whenSubHeader = Når?
profile-account-deleteAccount-pages-whenSec1Header =
  Når blir kontoen min slettet?
profile-account-deleteAccount-pages-whenSec1Content =
  Din konto vil bli slettet 24 timer etter at forespørselen ble sendt.
profile-account-deleteAccount-pages-whenSec2Header =
  Kan jeg fortsatt skrive kommentarer før kontoen min blir slettet?
profile-account-deleteAccount-pages-whenSec2Content =
  Nei. Så fort forespørselen om kontosletting er sendt, kan du ikke lenger skrive, svare på eller reagere på kommentarer.

profile-account-deleteAccount-pages-downloadCommentHeader = Last ned mine kommentarer
profile-account-deleteAccount-pages-downloadSubHeader = Last ned mine kommentarer
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Før kontoen din slettes anbefaler vi at du laster ned kommentarhistorien din. Det vil ikke være mulig å få tilgang til kommentarene dine etter at kontoen er slettet.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Min profil > Last ned mine kommentarer

profile-account-deleteAccount-pages-confirmHeader = Bekreft kontosletting
profile-account-deleteAccount-pages-confirmSubHeader = Er du sikker?
profile-account-deleteAccount-pages-confirmDescHeader =
  Er du sikker på at du vil slette kontoen din?
profile-account-deleteAccount-confirmDescContent =
  For å bekrefte at du vil slette kontoen din, skriv inn følgende uttrykk i tekstboksen under:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  For å bekrefte, skriv inn uttrykket under:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Skriv inn passord:


profile-account-deleteAccount-pages-completeHeader = Kontosletting anmodet
profile-account-deleteAccount-pages-completeSubHeader = Forespørsel sendt
profile-account-deleteAccount-pages-completeDescript =
  Din forespørsel er sendt og en bekreftelse er send til e-postadressen tilknyttet denne kontoen.
profile-account-deleteAccount-pages-completeTimeHeader =
  Din konto vil bli slettet: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Angre sletting?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Logg inn på kontoen din igjen før dette tidspunktet og velg
  <strong>Avbryt forespørsel om kontosletting</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Fortell oss hvorfor.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Vi vil gjerne vite hvorfor du valgte å slette kontoen. Gi oss en tilbakemelding om vårt kommentarsystem ved å sende en e-post til { $email }.
profile-account-changePassword-edit = Rediger
profile-account-changePassword-change = Endre

## Notifications
profile-notificationsTab = Varsler
profile-account-notifications-emailNotifications = E-post-varsler
profile-account-notifications-emailNotifications = Varsler på e-post
profile-account-notifications-receiveWhen = Motta varsler når:
profile-account-notifications-onReply = Noen svarer på mine kommentarer
profile-account-notifications-onFeatured = Min kommentar blir fremhevet
profile-account-notifications-onStaffReplies = En ansvarlig svarer på min kommentar
profile-account-notifications-onModeration = Min ventende kommentar har blitt vurdert
profile-account-notifications-sendNotifications = Send varsler:
profile-account-notifications-sendNotifications-immediately = Umiddelbart
profile-account-notifications-sendNotifications-daily = Daglig
profile-account-notifications-sendNotifications-hourly = Hver time
profile-account-notifications-updated = Dine varslings-innstillinger har blitt oppdatert.
profile-account-notifications-button = Oppdater varslings-innstillinger
profile-account-notifications-button-update = Oppdater

## Report Comment Popover
comments-reportPopover =
  .description = En dialog for rapportering av kommentarer
comments-reportPopover-reportThisComment = Rapporter denne kommentaren
comments-reportPopover-whyAreYouReporting = Hvorfor vil du rapportere denne kommentaren?


comments-reportPopover-reasonOffensive = Denne kommentaren er støtende
comments-reportPopover-reasonAbusive = Denne kommentaren er fornærmende
comments-reportPopover-reasonIDisagree = Jeg er uenig i denne kommentaren
comments-reportPopover-reasonSpam = Dette ser ut som reklame eller markedsføring
comments-reportPopover-reasonOther = Annet

comments-reportPopover-additionalInformation =
  Tilleggsinformasjon <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Legg gjerne inn tilleggsinformasjon som kan være nyttig for våre moderatorer.

comments-reportPopover-maxCharacters = Maks { $maxCharacters } tegn
comments-reportPopover-restrictToMaxCharacters = Begrens rapporten til { $maxCharacters } tegn
comments-reportPopover-cancel = Avbryt
comments-reportPopover-submit = Send inn

comments-reportPopover-thankYou = Tusen takk!
comments-reportPopover-receivedMessage =
  Vi har mottatt meldingen din. Rapporter fra medlemmer som deg hjelper til med å forbedre dialogen på nett.

comments-reportPopover-dismiss = Avvis

## Submit Status
comments-submitStatus-dismiss = Avvis
comments-submitStatus-submittedAndWillBeReviewed =
  Kommentaren din er sendt og vil bli sett gjennom av en moderator
comments-submitStatus-submittedAndRejected =
  Denne kommentaren har blitt avvist fordi den bryter retningslinjene våre


# Configure
configure-configureQuery-errorLoadingProfile = Feil ved lasting av side
configure-configureQuery-storyNotFound = Fant ikke diskusjon


## Change username
profile-changeUsername-username = Brukernavn
profile-changeUsername-success = Ditt brukernavn er oppdatert
profile-changeUsername-edit = Rediger
profile-changeUsername-change = Endre
profile-changeUsername-heading = Rediger brukernavn
profile-changeUsername-heading-changeYourUsername = Endre ditt brukernavn
profile-changeUsername-desc = Endre brukernavnet for alle dine eksisterende og fremtidige kommentarer. <strong>Brukernavn kan kun endres én gang i { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Endre brukernavnet for alle dine eksisterende og fremtidige kommentarer. Brukernavn kan kun endres én gang i { framework-timeago-time }.
profile-changeUsername-current = Nåværende brukernavn
profile-changeUsername-newUsername-label = Nytt brukernavn
profile-changeUsername-confirmNewUsername-label = Bekreft nytt brukernavn
profile-changeUsername-cancel = Avbryt
profile-changeUsername-save = Lagre
profile-changeUsername-saveChanges = Lagre endringer
profile-changeUsername-recentChange = Ditt brukernavn har nylig blitt endret. Du kan endre brukernavnet ditt igjen den { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Du har endret brukernavn innenfor den siste { framework-timeago-time }. Du kan endre brukernavn igjen den: { $nextUpdate }.
profile-changeUsername-close = Lukk

## Discussions tab

discussions-mostActiveDiscussions = Mest aktive diskusjoner
discussions-mostActiveDiscussions-subhead = Sortert etter flest kommentarer de siste 24 timene på { $siteName }
discussions-mostActiveDiscussions-empty = Du har ikke deltatt i noen diskusjoner
discussions-myOngoingDiscussions = Mine pågående diskusjoner
discussions-myOngoingDiscussions-subhead = Steder jeg har kommentert på { $orgName }
discussions-viewFullHistory = Se full kommentarhistorie
discussions-discussionsQuery-errorLoadingProfile = Feil ved lasting av profil
discussions-discussionsQuery-storyNotFound = Fant ikke diskusjon

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Endre innstillinger for denne strømmen
configure-stream-apply =
configure-stream-update = Oppdater
configure-stream-streamHasBeenUpdated =
  Denne strømmen er oppdatert

configure-premod-title =
configure-premod-premoderateAllComments = Forhåndsmoderer alle kommentarer
configure-premod-description =
  Moderator må godkjenne alle kommentarer før de publiseres.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Forhåndsmoderer kommentarer med lenker
configure-premodLink-description =
  Moderatorer må godkjenne alle kommentarer som inneholder lenker før de blir publisert.

configure-messageBox-title =
configure-addMessage-title =
  Legg inn en beskjed eller et spørsmål
configure-messageBox-description =
configure-addMessage-description =
  Legg inn en beskjed til leserne i toppen av kommentarfeltet. Bruk denne for å styre diskusjonen, foreslå tema, stille spørsmål eller komme med informasjon til leserne.
configure-addMessage-addMessage = Legg inn beskjed
configure-addMessage-removed = Beskjeden er fjernet
config-addMessage-messageHasBeenAdded =
  Beskjeden er lagt inn i kommentarboksen.
configure-addMessage-remove = Fjern
configure-addMessage-submitUpdate = Oppdater
configure-addMessage-cancel = Avbryt
configure-addMessage-submitAdd = Legg inn beskjed

configure-messageBox-preview = Forhåndsvis
configure-messageBox-selectAnIcon = Velg et ikon
configure-messageBox-iconConversation = Samtale
configure-messageBox-iconDate = Dato
configure-messageBox-iconHelp = Hjelp
configure-messageBox-iconWarning = Advarsel
configure-messageBox-iconChatBubble = Chat-boble
configure-messageBox-noIcon = Ingen
configure-messageBox-writeAMessage = Skriv beskjed


configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Steng kommentarfelt
configure-closeStream-description =
  Kommentarfeltet er åpent. Ved å stenge kommentarfeltet kan ikke nye kommentarer postes, men alle eksisterende kommentarer vil fortsatt vises.
configure-closeStream-closeStream = Steng kommentarfelt
configure-closeStream-theStreamIsNowOpen = Kommentarfeltet er nå åpent

configure-openStream-title = Åpne kommentarfelt
configure-openStream-description =
  Kommentarfeltet er stengt. Ved å åpne kommentarfeltet kan nye kommentarer postes og vises.
configure-openStream-openStream = Åpne kommentarfelt
configure-openStream-theStreamIsNowClosed = Kommentarfeltet er nå stengt
configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Spørsmål og svar-formatet er for tiden under utvikling. Ta kontakt for å gi tilbakemelding eller etterspørre funksjonalitet.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Gjør om til en Spørsmål og svar-strøm
configure-enableQA-description =
  Spørsmål og svar-formatet gjør at brukerne kan stille spørsmål som utvalgte eksperter kan svare på.
configure-enableQA-enableQA = Bytt om til Spørsmål og svar
configure-enableQA-streamIsNowComments =
  Denne strømmen er nå et kommentarfelt

configure-disableQA-title = Endre innstillinger for Spørsmål og svar
configure-disableQA-description =
  Spørsmål og svar-formatet gjør at brukerne kan stille spørsmål som utvalgte eksperter kan svare på.
configure-disableQA-disableQA = Bytt om til kommentarfelt
configure-disableQA-streamIsNowQA =
  Denne strømmen er nå i Spørsmål og svar-format

configure-experts-title = Legg til en ekspert
configure-experts-filter-searchField =
  .placeholder = Søk etter e-post eller brukernavn
  .aria-label = Søk etter e-post eller brukernavn
configure-experts-filter-searchButton =
  .aria-label = Søk
configure-experts-filter-description =
  Legger til en ekspert-etikett på kommentarer fra registrerte brukere, kun på denne siden. Nye brukere må først registrere seg for å opprette konto.
configure-experts-search-none-found = Fant ingen brukere med den e-posten eller det brukernavnet
configure-experts-
configure-experts-remove-button = Fjern
configure-experts-load-more = Last flere
configure-experts-none-yet = Det er for tiden ingen eksperter i denne Spørsmål og svar-modulen.
configure-experts-search-title = Søk etter en ekspert
configure-experts-assigned-title = Eksperter
configure-experts-noLongerAnExpert = er ikke lenger en ekspert
comments-tombstone-ignore = Denne kommentaren er skjult fordi du ignorerte {$username}
comments-tombstone-showComment = Vis kommentar
comments-tombstone-deleted =
  Denne kommentaren er ikke lenger tilgjengelig. Brukeren har slettet kontoen sin.
comments-tombstone-rejected =
  Denne brukeren har blitt fjernet av en moderator etter brudd på retningslinjene.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Din konto er midlertidig stengt for kommentering
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  I samsvar med { $organization }s retningslinjer er din konto midlertidig stengt. Du kan ikke kommentere, reagere på eller rapportere kommentarer.
suspendInfo-until-pleaseRejoinThe =
  Du kan bli med i samtalen igjen den { $until }

warning-heading = Kontoen din har fått en advarsel
warning-explanation =
  I samsvar med våre retningslinjer har din konto fått en advarsel.
warning-instructions =
  For å fortsette å delta i diskusjoner, vennligst trykk på bekreft-knappen under.
warning-acknowledge = Bekreft

warning-notice = Kontoen din har fått en advarsel. For å kunne fortsette deltagelsen, vennligst <a> gå gjennom advarselen </a>.

profile-changeEmail-unverified = (Ubekreftet)
profile-changeEmail-current = (nåværende)
profile-changeEmail-edit = Rediger
profile-changeEmail-change = Endre
profile-changeEmail-please-verify = Bekreft e-postadressen din
profile-changeEmail-please-verify-details =
  En e-post er sendt til { $email }.
  Du må bekrefte din nye e-postadresse før den kan bli brukt til å logge deg inn eller motta varsler.
profile-changeEmail-resend = Send bekreftelsen på nytt
profile-changeEmail-heading = Endre e-postadressen
profile-changeEmail-changeYourEmailAddress =
  Endre e-postadressen din
profile-changeEmail-desc = Endre e-postadressen som brukes til å logge deg på og der du mottar informasjon om kontoen din.
profile-changeEmail-newEmail-label = Ny e-postadresse
profile-changeEmail-password = Passord
profile-changeEmail-password-input =
  .placeholder = Passord
profile-changeEmail-cancel = Avbryt
profile-changeEmail-submit = Lagre
profile-changeEmail-saveChanges = Lagre endringer
profile-changeEmail-email = E-post
profile-changeEmail-title = E-postadresse
profile-changeEmail-success = Din e-postadresse er oppdatert

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Legg inn en anmeldelse eller still et spørsmål

ratingsAndReviews-reviewsTab = Anmeldelser
ratingsAndReviews-questionsTab = Spørsmål
ratingsAndReviews-noReviewsAtAll = Ingen anmeldelser.
ratingsAndReviews-noQuestionsAtAll = Ingen spørsmål.
ratingsAndReviews-noReviewsYet = Det er ingen anmeldelser ennå. Hva med å skrive en?
ratingsAndReviews-noQuestionsYet = Det er ingen spørsmål ennå. Still det første!
ratingsAndReviews-selectARating = Velg vurdering
ratingsAndReviews-youRatedThis = Du vurderte dette
ratingsAndReviews-showReview = Vis vurdering
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Vurder og anmeld
ratingsAndReviews-askAQuestion = Still et spørsmål
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Ingen vurderinger ennå
  [1] Basert på én vurdering
  *[other] Basert på { SHORT_NUMBER($count) } vurderinger
}

ratingsAndReviews-allReviewsFilter = Alle vurderinger
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 stjerne
  *[other] { $rating } stjerner
}

comments-addAReviewForm-rteLabel = Legg inn en vurdering (valgfritt)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Toppen av artikkelen
  .title = Gå til toppen av artikkelen
stream-footer-links-top-of-comments = Toppen av kommentarfeltet
  .title = Gå til toppen av kommentarfeltet
stream-footer-links-profile = Profil & svar
  .title = Gå til profil og svar
stream-footer-links-discussions = Flere diskusjoner
  .title = Gå til flere diskusjoner
stream-footer-navigation =
  .aria-label = Bunntekst under kommentarfeltet



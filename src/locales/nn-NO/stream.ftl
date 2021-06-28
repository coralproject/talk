### Localization for Embed Stream

## General

general-moderate = Moderer

general-userBoxUnauthenticated-joinTheConversation = Delta i samtalen
general-userBoxUnauthenticated-signIn = Logg inn
general-userBoxUnauthenticated-register = Registrer deg

general-userBoxAuthenticated-signedInAs =
  Innlogget som
general-userBoxAuthenticated-signedIn =
  Innlogget som
general-userBoxAuthenticated-notYou =
  Ikke deg? <button>Logg ut</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Du er nå logget ut

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-discussionsTab = Diskusjoner
general-tabBar-configure = Innstillinger

general-tabBar-aria-comments =
  .aria-label = Kommentarer
  .title = Kommentarer
general-tabBar-aria-qa =
  .aria-label = Q&A
  .title = Q&A
general-tabBar-aria-myProfile =
  .aria-label = Min profil
  .title = Min profil
general-tabBar-aria-configure =
  .aria-label = Innstillinger
  .title = Min profil
general-tabBar-aria-discussions =
  .aria-label = Diskusjoner
  .title = Diskusjoner

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
comments-watchers = { SHORT_NUMBER($count) } pålogget nå

comments-featuredCommentTooltip-how = Hvordan blir en kommentar fremhevet?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentarer blir valgt ut av oss som verdt å lese.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Vis fremhevede kommentarer-tooltip
  .title = Vis fremhevede kommentarer-tooltip

comments-collapse-toggle =
  .aria-label = Kollapse kommentartråd
comments-bannedInfo-bannedFromCommenting = Kontoen din er utestengt. Du har ikke tillatelse til å kommentere.
comments-bannedInfo-violatedCommunityGuidelines =
  Noen med tilgang til kontoen din har brutt retningslinjene her inne.
  Kontoen din har derfor blitt utestengt og du kan ikke kommentere,
  reagere på eller rapportere kommentarer lenger. Om du mistenker at
  det har skjedd feil, vennligst kontakt oss.

comments-noCommentsAtAll = Det er ingen kommentarer til denne saken.
comments-noCommentsYet = Det er ingen kommentarer ennå. Hvorfor ikke skrive en?

comments-streamQuery-storyNotFound = Saken ble ikke funnet

comments-commentForm-cancel = Avbryt
comments-commentForm-saveChanges = Lagre endringer
comments-commentForm-submit = Send

comments-postCommentForm-submit = Send
comments-replyList-showAll = Vis alle
comments-replyList-showMoreReplies = Vis flere svar

comments-postCommentForm-gifSeach = Søk etter GIF
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
comments-permalinkView-viewFullDiscussion = Vis hele diskusjonen
comments-permalinkView-commentRemovedOrDoesNotExist = Denne kommentaren har blitt fjernet eller aldri eksistert.

comments-rte-bold =
  .title = Fet

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Sitat

comments-rte-bulletedList =
  .title = Nummerert liste

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

comments-postCommentForm-userScheduledForDeletion-warning =
  Du kan ikke kommentere når kontoen din er i ferd med å slettes.

comments-replyButton-reply = Svar
comments-replyButton =
  .aria-label = Svar på kommentaren til {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Send
comments-replyCommentForm-cancel = Avbryt
comments-replyCommentForm-rteLabel = Skriv et svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

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
comments-editCommentForm-editTimeExpired = Redigeringstiden er utløpt. Det er ikke lenger mulig å redigere denne kommentaren. Kanskje du vil legge inn en ny en?
comments-editedMarker-edited = Redigert
comments-showConversationLink-readMore = Les mer av denne samtalen >
comments-conversationThread-showMoreOfThisConversation =
  Vis mer av denne samtalen

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

comments-featuredTag = Fremhevede

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

### Q&A

general-tabBar-qaTab = Q&A

qa-answeredTab = Besvarte
qa-unansweredTab = Ubesvarte
qa-allCommentsTab = Alle

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

qa-answered-tag = besvarte
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
comments-featured-gotoConversation = Gå til samtale
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mine kommentarer
profile-myCommentsTab-comments = Mine kommentarer
profile-accountTab = Konto
profile-preferencesTab = Innstillinger

### Account Deletion

profile-accountDeletion-deletionDesc =
  Din konto vil bli slettet { $date }.
profile-accountDeletion-cancelDeletion =
  Avbryt forespørsel om sletting av konto
profile-accountDeletion-cancelAccountDeletion =
  Avbryt sletting av konto

### Comment History
profile-historyComment-viewConversation = Vis samtale
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentar-historikk
profile-historyComment-story = Sak: {$title}
profile-historyComment-comment-on = Kommentarer på:
profile-profileQuery-errorLoadingProfile = Feil ved lasting av siden
profile-profileQuery-storyNotFound = Saken ble ikke funnet
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
  Din forespørsel er sendt. Du kan legge inn en ny forespørsel om å laste ned
kommentarhistorikken din igjen om { framework-timeago-time }.
profile-account-download-comments-error =
  Vi kunne ikke behandle forespørselen om nedlasting

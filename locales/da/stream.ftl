### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Deltag i samtalen
general-userBoxUnauthenticated-signIn = Log ind
general-userBoxUnauthenticated-register = Registrer

general-userBoxAuthenticated-signedIn =
  Logget ind som

general-userBoxAuthenticated-notYou =
  Er det ikke dig? <button>Log ud</button>

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-configure = Konfigurer

## Comments Tab

comments-allCommentsTab = Alle kommentarer
comments-featuredTab = Fremhævede kommentarer
comments-featuredCommentTooltip-how = Hvordan fremhæves en kommentar?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentarer vælges hånd af vores team som værd at læse.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Se information om fremhævede kommentarer

comments-noCommentsYet = Der er ingen kommentarer endnu.

comments-streamQuery-storyNotFound = Historien blev ikke fundet

comments-commentForm-cancel = Annuller
comments-commentForm-saveChanges = Gem ændringer
comments-commentForm-submit = Indsend

comments-postCommentForm-submit = Indsend
comments-replyList-showAll = Vis alt
comments-replyList-showMoreReplies = Vis flere svar

comments-viewNew =
  { $count ->
    [1] Se {$count} kommentar
    *[other] Se {$count} kommentarer
  }
comments-loadMore = Vis flere

comments-permalinkPopover =
  .description = En dialog der viser en permalink til kommentaren
comments-permalinkButton-share = Del
comments-permalinkView-viewFullDiscussion = Tilbage til alle kommentarer
comments-permalinkView-commentRemovedOrDoesNotExist = Denne kommentar er blevet fjernet eller findes ikke.

comments-rte-bold =
  .title = Fed

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Blokcitat

comments-remainingCharacters = { $remaining } tegn tilbage

comments-postCommentFormFake-signInAndJoin = Log ind, og deltag i samtalen

comments-postCommentForm-rteLabel = Indsend en kommentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Svar

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Indsend
comments-replyCommentForm-cancel = Annuller
comments-replyCommentForm-rteLabel = Skriv et svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Rediger

comments-editCommentForm-saveChanges = Gem ændringer
comments-editCommentForm-cancel = Annuller
comments-editCommentForm-close = Lukke
comments-editCommentForm-rteLabel = Rediger kommentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Du kan redigere i <time></time> minutter endnu
comments-editCommentForm-editTimeExpired = Redigeringstiden er udløbet. Du kan ikke længere redigere denne kommentar. Hvorfor ikke lægge en anden?
comments-editedMarker-edited = Redigeret
comments-showConversationLink-readMore = Læs mere om denne samtale >
comments-conversationThread-showMoreOfThisConversation =
  Vis mere af denne samtale

comments-permalinkView-currentViewing = Du ser i øjeblikket en
comments-permalinkView-singleConversation = ENKELKONVERSATION
comments-inReplyTo = Som svar til <Username></Username>
comments-replyingTo = Svar på: <Username></Username>

comments-reportButton-report = Rapportér
comments-reportButton-reported = Rapporteret

comments-sortMenu-sortBy = Sorter efter
comments-sortMenu-newest = Nyeste
comments-sortMenu-oldest = Ældste
comments-sortMenu-mostReplies = De fleste svar

comments-userPopover =
  .description = Se flere brugeroplysninger
comments-userPopover-memberSince = Medlem siden: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorere

comments-userIgnorePopover-ignoreUser = Ignorerer {$username}?
comments-userIgnorePopover-description =
  Når du ignorerer en kommentator, vil alle kommentarer,
  de skrev på webstedet, være skjult for dig. Du kan fortryde
  dette senere fra Min profil.
comments-userIgnorePopover-ignore = Ignorerer
comments-userIgnorePopover-cancel = Annuller

comments-moderationDropdown-popover =
  .description = En menu med indstillinger til at moderere kommentar
comments-moderationDropdown-feature = Fremhæv
comments-moderationDropdown-unfeature = Fjern ikke-fremhæv
comments-moderationDropdown-approve = Godkend
comments-moderationDropdown-approved = Godkendt
comments-moderationDropdown-reject = Afvis
comments-moderationDropdown-rejected = Afvist
comments-moderationDropdown-goToModerate = Gå til moderation
comments-moderationDropdown-caretButton =
  .aria-label = Moderér

comments-rejectedTombstone =
  Du har afvist denne kommentar. <TextLink>Gå til moderation for at gennemgå denne beslutning.</TextLink>

comments-featuredTag = Fremhævet

### Featured Comments
comments-featured-gotoConversation = Gå til samtale
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mine kommentarer
profile-settingsTab = Indstillinger

### Comment History
profile-historyComment-viewConversation = Se samtale
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentarhistorik
profile-historyComment-story = Historie: {$title}
profile-historyComment-comment-on = Kommentar på:
profile-profileQuery-errorLoadingProfile = Fejl ved indlæsning af profil
profile-profileQuery-storyNotFound = Historien blev ikke fundet
profile-commentHistory-loadMore = Vis fleree
profile-commentHistory-empty = Du har ikke skrevet nogen kommentarer
profile-commentHistory-empty-subheading = En historie med dine kommentarer vises her

### Settings
profile-settings-ignoredCommenters = Ignorerede kommentarer
profile-settings-description =
  Når du ignorerer nogen, er alle deres kommentarer skjult for dig.
  Kommentarer, du ignorerer, kan stadig se dine kommentarer.
profile-settings-empty = Du ignorerer i øjeblikket ingen
profile-settings-stopIgnoring = Stop med at ignorere

profile-settings-changePassword = Skift kodeord
profile-settings-changePassword-oldPassword = Gammelt kodeord
profile-settings-changePassword-forgotPassword = Glemt din adgangskode?
profile-settings-changePassword-newPassword = Nyt kodeord
profile-settings-changePassword-button = Skift kodeord
profile-settings-changePassword-updated =
  Din adgangskode er blevet opdateret

## Report Comment Popover
comments-reportPopover =
  .description = En dialog til rapportering af kommentarer
comments-reportPopover-reportThisComment = Rapporter denne kommentar
comments-reportPopover-whyAreYouReporting = Hvorfor rapporterer du denne kommentar?

comments-reportPopover-reasonOffensive = This comment is offensive
comments-reportPopover-reasonIDisagree = Denne kommentar er stødende
comments-reportPopover-reasonSpam = Dette ligner en annonce eller markedsføring
comments-reportPopover-reasonOther = Andet

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Efterlad venligst yderligere oplysninger, som kan være nyttige for vores moderatorer. (Valgfri)

comments-reportPopover-maxCharacters = Maks. { $maxCharacters } tegn
comments-reportPopover-cancel = Annuller
comments-reportPopover-submit = Indsend

comments-reportPopover-thankYou = Mange tak
comments-reportPopover-receivedMessage =
  Vi har modtaget din besked.
  Rapporteringer fra medlemmer som dig,
  hjælper til at holde en god tone.

comments-reportPopover-dismiss = Luk

## Submit Status
comments-submitStatus-dismiss = Luk
comments-submitStatus-submittedAndWillBeReviewed =
  Din kommentar er blevet sendt og vil blive gennemgået af en moderator

# Configure
configure-configureQuery-errorLoadingProfile = Fejl ved indlæsning af konfiguration
configure-configureQuery-storyNotFound = Historien blev ikke fundet

## Comment Stream
configure-stream-title = Konfigurer denne kommentarstrøm
configure-stream-apply = Ansøge

configure-premod-title = Aktivér før-moderering
configure-premod-description =
  Moderatorer skal godkende enhver kommentar, før den offentliggøres.

configure-premodLink-title = Førmoderate kommentarer der indeholder links
configure-premodLink-description =
  Moderatorer skal godkende enhver kommentar, der indeholder et link, inden den offentliggøres.

configure-messageBox-title = Aktivér meddelelsesboks til denne stream
configure-messageBox-description =
  Tilføj en besked øverst i kommentarfeltet for dine læsere. Brug dette til at stille et emne,
  stille et spørgsmål eller offentliggøre meddelelser vedrørende denne historie.
configure-messageBox-preview = Forhåndsvisning
configure-messageBox-selectAnIcon = Vælg et ikon
configure-messageBox-noIcon = Intet ikon
configure-messageBox-writeAMessage = Skriv en besked

configure-closeStream-title = Luk kommentarer
configure-closeStream-description =
  Kommentarerne er i øjeblikket åbne.
  Ved at lukke kommentarerne kan der ikke indsendes nye kommentarer,
  og alle tidligere indsendte kommentarer vises stadig.
configure-closeStream-closeStream = Luk kommentarer

configure-openStream-title = Åbn kommentarer
configure-openStream-description =
  Denne kommentarstrøm er i øjeblikket lukket.
  Ved at åbne denne kommentar kan nye kommentarer indsendes og vises.
configure-openStream-openStream = Åbn kommentarer

comments-tombstone-ignore = Denne kommentar er skjult, fordi du ignorerede {$username}

suspendInfo-heading = Din konto er midlertidigt suspenderet for at kommentere.
suspendInfo-info =
  I overensstemmelse med fællesskabsretningslinjerne for { $organization}
  er din konto midlertidigt suspenderet. Mens du er suspenderet,
  kan du ikke kommentere, respektere eller rapportere kommentarer.
  Gå igen med til samtalen på { $until }.

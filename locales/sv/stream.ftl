### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Delta i diskussionen
general-userBoxUnauthenticated-signIn = Logga in
general-userBoxUnauthenticated-register = Registrera dig

general-userBoxAuthenticated-signedIn =
  Inloggad som

general-userBoxAuthenticated-notYou =
  Inte du? <button>Logga ut</button>

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-configure = Inställningar

## Comment Count

comment-count-text =
  { $count  ->
    [one] kommentar
    *[other] kommentarer
  }

## Comments Tab

comments-allCommentsTab = Alla kommentarer
comments-featuredTab = Utvalda
comments-featuredCommentTooltip-how = Hur blir en kommentar utvald?
comments-featuredCommentTooltip-handSelectedComments =
  Redaktionen väljer ut kommentarer som är extra läsvärda.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Toggle featured comments tooltip

comments-bannedInfo-bannedFromCommenting = Ditt konto har blivit avstängt från att kommentera.
comments-bannedInfo-violatedCommunityGuidelines =
  Någon med access till ditt konto har brutit mot våra regler.
  Ditt konto har därför blivit avstängt och du kommer inte kunna
  kommentera längre. Om du tycker detta är fel, vänligen kontakta oss.

comments-noCommentsYet = Det finns inga kommentarer ännu. Varför inte skriva en?

comments-streamQuery-storyNotFound = Artikel hittades inte

comments-postCommentForm-submit = Skicka
comments-replyList-showAll = Visa alla
comments-replyList-showMoreReplies = Visa fler svar

comments-viewNew =
  { $count ->
    [1] View {$count} Ny kommentar
    *[other] View {$count} Nya kommentarer
  }
comments-loadMore = Ladda fler

comments-permalinkPopover =
  .description = En ruta som visar en permalänk till kommentaren
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalänk till kommentaren
comments-permalinkButton-share = Dela
comments-permalinkView-viewFullDiscussion = Visa hela diskussionen
comments-permalinkView-commentRemovedOrDoesNotExist = Den här kommentaren har tagits bort eller finns inte.

comments-rte-bold =
  .title = Fetstil

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Citat

comments-remainingCharacters = { $remaining } tecken kvar

comments-postCommentFormFake-signInAndJoin = Logga in och delta i diskussionen

comments-postCommentForm-rteLabel = Skriv en kommentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Du kan inte kommentera när ditt konto är på väg att raderas.

comments-replyButton-reply = Svara

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Bidra
comments-replyCommentForm-cancel = Avbryt
comments-replyCommentForm-rteLabel = Skriv ett svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Redigera

comments-editCommentForm-saveChanges = Spara ändringar
comments-editCommentForm-cancel = Avbryt
comments-editCommentForm-close = Stäng
comments-editCommentForm-rteLabel = Redigera kommentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Redigering: <time></time> kvar
comments-editCommentForm-editTimeExpired = Tiden för att redigera har gått ut. Du kan inte längre redigera den här kommentaren. Varför inte skriva en till?
comments-editedMarker-edited = Redigerad
comments-showConversationLink-readMore = Läs mer av den här diskussionen >
comments-conversationThread-showMoreOfThisConversation =
  Visa mer av den här diskussionen

comments-permalinkView-currentViewing = Du ser just nu en
comments-permalinkView-singleConversation = ENSKILD DISKUSSION
comments-inReplyTo = Som svar till <Username></Username>
comments-replyingTo = Svarar till: <Username></Username>

comments-reportButton-report = Anmäl
comments-reportButton-reported = Anmäld

comments-sortMenu-sortBy = Sortera
comments-sortMenu-newest = Nyast
comments-sortMenu-oldest = Äldst
comments-sortMenu-mostReplies = Flest svar

comments-userPopover =
  .description = A popover with more user information
comments-userPopover-memberSince = Medlem sedan: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorera

comments-userIgnorePopover-ignoreUser = Ignorera {$username}?
comments-userIgnorePopover-description =
  När du ignorerar en person kommer alla deras kommentarer döljas för dig. Du kan ångra detta senare via din profil.
comments-userIgnorePopover-ignore = Ignorera
comments-userIgnorePopover-cancel = Avbryt

comments-userBanPopover-title = Stäng av {$username}?
comments-userBanPopover-description =
  Once banned, this user will no longer be able
  to comment, use reactions, or report comments.
  This comment will also be rejected.
comments-userBanPopover-cancel = Avbryt
comments-userBanPopover-ban = Stäng av

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Välj ut
comments-moderationDropdown-unfeature = Ångra Välj ut
comments-moderationDropdown-approve = Godkänn
comments-moderationDropdown-approved = Godkänd
comments-moderationDropdown-reject = Stoppa
comments-moderationDropdown-rejected = Stoppad
comments-moderationDropdown-ban = Stäng av användare
comments-moderationDropdown-banned = Avstängd
comments-moderationDropdown-goToModerate = Gå till Moderera
comments-moderationDropdown-caretButton =
  .aria-label = Moderera

comments-rejectedTombstone =
  Du har stoppat den här kommentaren. <TextLink>Gå till Moderera för att ändra beslutet.</TextLink>

comments-featuredTag = Utvalda

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Account deletion requested
comments-stream-deleteAccount-callOut-receivedDesc =
  A request to delete your account was received on { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  If you would like to continue leaving comments, replies or reactions,
  you may cancel your request to delete your account before { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancel account deletion request

### Featured Comments
comments-featured-gotoConversation = Gå till diskussion
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mina kommentarer
profile-myCommentsTab-comments = Mina kommentarer
profile-accountTab = Konto

accountSettings-manage-account = Hantera ditt konto

### Account Deletion

profile-accountDeletion-deletionDesc =
  Your account is scheduled to be deleted on { $date }.
profile-accountDeletion-cancelDeletion =
  Cancel account deletion request

### Comment History
profile-historyComment-viewConversation = Visa diskussion
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentarshistorik
profile-historyComment-story = Artikel: {$title}
profile-historyComment-comment-on = Kommentera på:
profile-profileQuery-errorLoadingProfile = Fel vid laddning av profil
profile-profileQuery-storyNotFound = Artikel hittades inte
profile-commentHistory-loadMore = Ladda fler
profile-commentHistory-empty = Du har inte skrivit några kommentarer
profile-commentHistory-empty-subheading = En historik över dina kommentarer kommer att synas här

### Account
profile-account-ignoredCommenters = Ignorerade personer
profile-account-ignoredCommenters-description =
  Du kan ignorera andra personer genom att klicka på deras användarnamn och välja Ignorera. När du ignorerar någon dols alla deras kommentarer för dig. Personer du ignorerar kan fortfarande läsa dina kommentarer.
profile-account-ignoredCommenters-empty = Du ignorerar ingen just nu
profile-account-ignoredCommenters-stopIgnoring = Sluta ignorera
profile-account-ignoredCommenters-manage = Hantera
profile-account-ignoredCommenters-cancel = Avbryt

profile-account-changePassword-cancel = Avbryt
profile-account-changePassword = Ändra lösenord
profile-account-changePassword-oldPassword = Gammalt lösenord
profile-account-changePassword-forgotPassword = Glömt ditt lösenord?
profile-account-changePassword-newPassword = Nytt lösenord
profile-account-changePassword-button = Ändra lösenord
profile-account-changePassword-updated =
  Ditt lösenord har ändrats
profile-account-changePassword-password = Lösenord

profile-account-download-comments-title = Ladda ner min kommentarshistorik
profile-account-download-comments-description =
  Du kommer få ett mejl med en länk till att ladda ner din kommentarshistorik.
  Du kan göra <strong>en begäran om nedladdning var 14:e dag</strong>
profile-account-download-comments-request =
  Begär kommentarshistorik
profile-account-download-comments-request-icon =
  .title = Begär kommentarshistorik
profile-account-download-comments-recentRequest =
  Din senaste begäran: { $timeStamp }
profile-account-download-comments-requested =
  Nedladdning begärd. Du kan begära en ny nedladdning om { framework-timeago-time }.
profile-account-download-comments-request-button = Begäran

## Delete Account

profile-account-deleteAccount-title = Ta bort mitt konto
profile-account-deleteAccount-description =
  Om du tar bort ditt konto kommer din profil och alla dina kommentarer raderas från sajten permanent.
profile-account-deleteAccount-requestDelete = Begär borttagning av konto

profile-account-deleteAccount-cancelDelete-description =
  Du har redan begärt att få ditt konto borttaget.
  Ditt konto kommer att tas bort den { $date }.
  Du kan avbryta din begäran fram tills dess.
profile-account-deleteAccount-cancelDelete = Avbryt begäran av borttagning av konto

profile-account-deleteAccount-request = Begär
profile-account-deleteAccount-cancel = Avbryt
profile-account-deleteAccount-pages-deleteButton = Ta bort mitt konto
profile-account-deleteAccount-pages-cancel = Avbryt
profile-account-deleteAccount-pages-proceed = Fortsätt
profile-account-deleteAccount-pages-done = Färdigt
profile-account-deleteAccount-pages-phrase =
 .aria-label = fras

profile-account-deleteAccount-pages-descriptionHeader = Ta bort mitt konto?
profile-account-deleteAccount-pages-descriptionText =
  Du försöker att ta bort ditt konto. Det betyder att:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Alla dina kommentarer tas bort från sajten
profile-account-deleteAccount-pages-allCommentsDeleted =
  Alla dina kommenterar raderas från vår databas
profile-account-deleteAccount-pages-emailRemoved =
  Din e-postadress tas bort från våra system

profile-account-deleteAccount-pages-whenHeader = Ta bord mitt konto: När?
profile-account-deleteAccount-pages-whenSec1Header =
  När kommer mitt konto att tas bort?
profile-account-deleteAccount-pages-whenSec1Content =
  Ditt konto tas bort 24 timmar efter att din begäran skickats in.
profile-account-deleteAccount-pages-whenSec2Header =
  Kan jag fortfarande kommentera tills dess att mitt konto tagits bort=
profile-account-deleteAccount-pages-whenSec2Content =
  Nej. När du begärt att ditt konto ska tas bort kan du inte längre skriva kommentarer, svara på kommentarer eller välja reaktioner.

profile-account-deleteAccount-pages-downloadCommentHeader = Ladda ner mina kommentarer?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Innan ditt konto tas bort rekommenderar vi att du laddar ner dina kommentarer. När ditt konto väl tagits bort kommer du inte kunna begära ut din kommentarshistorik.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Min profil > Ladda ner min kommentarshistorik

profile-account-deleteAccount-pages-confirmHeader = Bekräfta borttagning av konto?
profile-account-deleteAccount-pages-confirmDescHeader =
  Är du säker på att du vill ta bort ditt konto?
profile-account-deleteAccount-confirmDescContent =
  För att bekräfta att du vill ta bort ditt konot, vändligen skriv in följande fras i textrutan nedan:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  För att bekräfta, skriv frasen nedan:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Ange ditt lösenord:

profile-account-deleteAccount-pages-completeHeader = Borttagning av konto begärt
profile-account-deleteAccount-pages-completeDescript =
  Din begäran har skickats in och en bekräftelse har skickats till den e-postadress som hör till ditt konto.
profile-account-deleteAccount-pages-completeTimeHeader =
  Ditt konto kommer att tas bort den: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Ångrat dig?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Logga in på ditt konto igen före detta datum och välj
  <strong>Avbryt borttagning av konto</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Berätta varför.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Vi vill gärna veta varför du valt att ta bort ditt konto. Skicka feedback på vårt kommentarsflöde genom att mejla { $email }.
profile-account-changePassword-edit = Ändra


## Notifications
profile-notificationsTab = Notifieringar
profile-account-notifications-emailNotifications = Notifieringar via e-post
profile-account-notifications-emailNotifications = Notifieringar via epost
profile-account-notifications-receiveWhen = Ta emot notifieringar när:
profile-account-notifications-onReply = Min kommentar får ett svar
profile-account-notifications-onFeatured = Min kommentar blivit utvald
profile-account-notifications-onStaffReplies = En redaktionsmedlem svarar på min kommentar
profile-account-notifications-onModeration = Min väntande kommentar har blivit granskad
profile-account-notifications-sendNotifications = Skicka notifieringar:
profile-account-notifications-sendNotifications-immediately = Omedelbart
profile-account-notifications-sendNotifications-daily = Dagligen
profile-account-notifications-sendNotifications-hourly = Varje timme
profile-account-notifications-updated = Inställningar för notifieringar har ändrats
profile-account-notifications-button = Ändra inställningar för notifieringar
profile-account-notifications-button-update = Uppdatera

## Report Comment Popover
comments-reportPopover =
  .description = Om att anmäla kommentarer
comments-reportPopover-reportThisComment = Anmäl den här kommentaren
comments-reportPopover-whyAreYouReporting = Varför anmäler du den här kommentaren?

comments-reportPopover-reasonOffensive = Kommentaren är kränkande
comments-reportPopover-reasonIDisagree = Jag håller inte med om kommentaren
comments-reportPopover-reasonSpam = Det här ser ut som spam eller marknadsföring
comments-reportPopover-reasonOther = Annat

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Lämna gärna ytterligare informations om kan vara till hjälp för våra moderatorer. (Valfritt)

comments-reportPopover-maxCharacters = Max. { $maxCharacters } tecken
comments-reportPopover-cancel = Avbryt
comments-reportPopover-submit = Skicka in

comments-reportPopover-thankYou = Tack!
comments-reportPopover-receivedMessage =
  Vi har mottagit ditt meddelande. Anmälningar från medlemmar som du hjälper till att hålla vår gemenskap säker.

comments-reportPopover-dismiss = Avfärda

## Submit Status
comments-submitStatus-dismiss = Avfärda
comments-submitStatus-submittedAndWillBeReviewed =
  Din kommentar har skickats in och kommer att granskas av en moderator.
comments-submitStatus-submittedAndRejected =
  Din kommenatar har stoppats för att den bryter mot våra regler

# Configure
configure-configureQuery-errorLoadingProfile = Fel vid inladdning
configure-configureQuery-storyNotFound = Artikel hittades inte

## Change username
profile-changeUsername-username = Användarnamn
profile-changeUsername-success = Ditt användarnamn har ändrats
profile-changeUsername-edit = Ändra
profile-changeUsername-heading = Ändra ditt användarnamn
profile-changeUsername-desc = Ändra användarnamnet som syns på alla dina tidigare och framtida kommentarer. <strong>Användarnamn kan ändras en gång per { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Ändra användarnamnet som syns på alla dina tidigare och framtida kommentarer. Användarnamn kan ändras en gång per  { framework-timeago-time }.
profile-changeUsername-current = Nuvarande användarnamn
profile-changeUsername-newUsername-label = Nytt användarnamn
profile-changeUsername-confirmNewUsername-label = Bekräfta nytt användarnamn
profile-changeUsername-cancel = Avbryt
profile-changeUsername-save = Spara
profile-changeUsername-recentChange = Ditt användarnamn har ändrats under de senaste { framework-timeago-time }. Du kan ändra ditt användarnamn igen om { $nextUpdate }
profile-changeUsername-close = Stäng

## Comment Stream
configure-stream-title = Konfigurera det här kommmentarsflödet
configure-stream-apply = Applicera

configure-premod-title = Använd förhandsmoderering
configure-premod-description =
  Moderatorer måste godkänna varje kommentar innan den publiceras vid den här artikeln.

configure-premodLink-title = Förhandsmoderera kommentarer som innehåller länkar
configure-premodLink-description =
  Moderatorer måste godkänna varje kommentar som innehåller en länk innan den publiceras vid den här artikeln.

configure-messageBox-title = Använd meddelanderuta för den här artikeln
configure-messageBox-description =
  Lägg till ett meddelande till läsarna överst i kommentarsrutan.
  Använd detta för att föreslå diskussionsämne, ställa en fråga eller skriva meddelanden som har med kommentarerna att göra.
configure-messageBox-preview = Förhandsgranska
configure-messageBox-selectAnIcon = Välj en ikon
configure-messageBox-iconConversation = Konversation
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Hjälp
configure-messageBox-iconWarning = Varning
configure-messageBox-iconChatBubble = Chatbubbla
configure-messageBox-noIcon = Ingen ikon
configure-messageBox-writeAMessage = Skriv ett meddelande

configure-closeStream-title = Stäng kommentarsflöde
configure-closeStream-description =
  Det här kommentarsflödet är för närvarande öppet. Genom att stänga kommentarsflödet kan inga nya kommentarer skickas in, men alla tidigare kommenterare syns fortfarande.
configure-closeStream-closeStream = Stäng flöde

configure-openStream-title = Öppna flöde
configure-openStream-description =
  Det här kommentarsflödet är för närvarande stängt. Genom att öppna kommetarsflödet kan nya kommentarer skickas in och visas.
configure-openStream-openStream = Öppna flöde

configure-moderateThisStream = Moderera detta flöde

comments-tombstone-ignore = Den här kommentaren är dold eftersom du ignorerat {$username}
comments-tombstone-deleted =
  Den här kommentaren finns inte längre. Personen som kommenterade har tagit bort sitt konto.

suspendInfo-heading = Ditt konto har tillfälligt stängts av från möjligheten att kommentera.
suspendInfo-info =
  I enlighet med { $organization }:s riktlinjer för artikelkommentarer har ditt konto blivit tillfälligt avstängt. Under avstängningen kan du inte kommentera, ge kudos eller anmäla kommenterar. Välkommen att åter delta i diskussionen den { $until }

profile-changeEmail-unverified = (Obekräftad)
profile-changeEmail-edit = Ändra
profile-changeEmail-please-verify = Bekräfta din e-postadress
profile-changeEmail-please-verify-details =
  Ett mejl har skickats till { $email } för att bekräfta ditt konto.
  Du måste bekräfta din nya e-postadress innan den kan användas för att logga in på ditt konto eller för att ta emot notifieringar.
profile-changeEmail-resend = Skicka om bekräftelse
profile-changeEmail-heading = Ändra din e-postadress
profile-changeEmail-desc = Ändra e-postadressen som används för att logga in och för att ta emot information om ditt konto.
profile-changeEmail-current = Nuvarande e-postadress
profile-changeEmail-newEmail-label = Ny e-postadress
profile-changeEmail-password = Lösenord
profile-changeEmail-password-input =
  .placeholder = Lösenord
profile-changeEmail-cancel = Avbryt
profile-changeEmail-submit = Spara
profile-changeEmail-email = E-post

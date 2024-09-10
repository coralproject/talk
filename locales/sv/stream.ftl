### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Bädda in kommentarer

general-moderate = Moderera
general-archived = Arkiverad

general-userBoxUnauthenticated-joinTheConversation = Delta i diskussionen
general-userBoxUnauthenticated-signIn = Logga in
general-userBoxUnauthenticated-register = Registrera dig

general-authenticationSection =
  .aria-label = Autentisering

general-userBoxAuthenticated-signedIn =
  Inloggad som
general-userBoxAuthenticated-notYou =
  Inte du? <button>Logga ut</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Du har loggats ut från ditt konto

general-tabBar-commentsTab = Kommentarer
general-tabBar-myProfileTab = Min profil
general-tabBar-discussionsTab = Diskussioner
general-tabBar-reviewsTab = Granskning
general-tabBar-configure = Inställningar
general-tabBar-notifications = Notiser
general-tabBar-notifications-hasNew = Notiser (ny)

general-mainTablist =
  .aria-label = Huvudmeny

general-secondaryTablist =
  .aria-label = Sekundär meny

## Comment Count

comment-count-text =
  { $count  ->
    [one] kommentar
    *[other] kommentarer
  }

comment-count-text-ratings =
  { $count  ->
    [one] Omdöme
    *[other] Omdömen
  }

## Comments Tab
addACommentButton =
  .aria-label = Skriv en kommentar. Den här knappen scrollar ned till sista kommentaren.

comments-allCommentsTab = Alla kommentarer
comments-featuredTab = Utvalda
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 person tittar på diskussionen
    *[other] { SHORT_NUMBER($count) } personer tittar på diskussionen
  }

comments-announcement-section =
  .aria-label = Meddelande
comments-announcement-closeButton =
  .aria-label = Stäng Meddelande

comments-accountStatus-section =
  .aria-label = Kontostatus

comments-featuredCommentTooltip-how = Hur blir en kommentar utvald?
comments-featuredCommentTooltip-handSelectedComments =
  Redaktionen väljer ut kommentarer som är extra läsvärda.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Visa info om utvalda kommentarer
  .title = Visa info om utvalda kommentarer

comment-top-commenter-tooltip-header = <icon></icon> Toppskribent
comment-top-commenter-tooltip-details = En av användarens kommentarer har blivit utvald senaste 10 dagarna

comment-new-commenter-tooltip-details = Ny kommentator, säg hej

comments-collapse-toggle-with-username =
  .aria-label = Dölj kommentar av { $username } och dess svar
comments-collapse-toggle-without-username =
  .aria-label = Dölj kommentar och dess svar
comments-expand-toggle-with-username =
  .aria-label = Visa kommentar av { $username } och dess svar
comments-expand-toggle-without-username =
  .aria-label = Visa kommentar och dess svar
comments-bannedInfo-bannedFromCommenting = Ditt konto har blivit avstängt från att kommentera.
comments-bannedInfo-violatedCommunityGuidelines =
  Någon med access till ditt konto har brutit mot våra regler.
  Ditt konto har därför blivit avstängt och du kommer inte kunna
  kommentera längre. Om du tycker detta är fel, vänligen kontakta oss.

comments-noCommentsAtAll = Det finns inga kommentarer ännu.
comments-noCommentsYet = Det finns inga kommentarer ännu. Varför inte skriva en?

comments-streamQuery-storyNotFound = Artikel hittades inte

comments-communityGuidelines-section =
  .aria-label = Communityregler

comments-commentForm-cancel = Avbryt
comments-commentForm-saveChanges = Spara ändringar
comments-commentForm-submit = Skicka

comments-postCommentForm-section =
  .aria-label = Skriv en kommentar
comments-postCommentForm-submit = Skicka
comments-replyList-showAll = Visa alla
comments-replyList-showMoreReplies = Visa fler svar

comments-postComment-gifSearch = Sök efter GIF
comments-postComment-gifSearch-search =
  .aria-label = Sök
comments-postComment-gifSearch-loading = Laddar...
comments-postComment-gifSearch-no-results = Inga resultat för {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Drivs av giphy

comments-postComment-pasteImage = Klistra in bild-URL
comments-postComment-insertImage = Infoga

comments-postComment-confirmMedia-youtube = Lägg till denna YouTube-video i slutet av din kommentar?
comments-postComment-confirmMedia-twitter = Lägg till detta inlägg i slutet av din kommentar?
comments-postComment-confirmMedia-cancel = Avbryt
comments-postComment-confirmMedia-add-tweet = Lägg till inlägg
comments-postComment-confirmMedia-add-video = Lägg till video
comments-postComment-confirmMedia-remove = Ta bort
comments-commentForm-gifPreview-remove = Ta bort
comments-viewNew-loading = Laddar...
comments-viewNew =
  { $count ->
    [1] View {$count} Ny kommentar
    *[other] View {$count} Nya kommentarer
  }
comments-loadMore = Ladda fler
comments-loadAll = Ladda alla kommentarer
comments-loadAll-loading = Laddar...

comments-permalinkPopover =
  .description = En ruta som visar en permalänk till kommentaren
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalänk till kommentaren
comments-permalinkButton-share = Dela
comments-permalinkButton =
  .aria-label = Dela kommentar av {$username}
comments-permalinkButton-copyReportLink = Anmäl länk
comments-permalinkView-section =
  .aria-label = Enskild konversation
comments-permalinkView-viewFullDiscussion = Visa hela diskussionen
comments-permalinkView-commentRemovedOrDoesNotExist = Den här kommentaren har tagits bort eller finns inte.

comments-permalinkView-reportIllegalContent-title = Anmäl olagligt innehåll
comments-permalinkView-reportIllegalContent-description = Vänligen fyll i detta formulär så gott det går så att vårt modereringsteam kan fatta ett beslut och vid behov konsultera vår webbplats juridiska avdelning.
comments-permalinkView-reportIllegalContent-reportingComment = Du anmäler denna kommentar
comments-permalinkView-reportIllegalContent-lawBrokenDescription-inputLabel = Vilken lag tror du har brutits? (obligatoriskt)
comments-permalinkView-reportIllegalContent-additionalInformation-inputLabel = Inkludera ytterligare information om varför denna kommentar är olaglig (obligatoriskt)
comments-permalinkView-reportIllegalContent-additionalInformation-helperText = Alla detaljer du inkluderar kommer att hjälpa oss att undersöka detta vidare
comments-permalinkView-reportIllegalContent-additionalComments-inputLabel = Vill du anmäla några andra kommentarer för att innehålla olagligt innehåll?
comments-permalinkView-reportIllegalContent-bonafideBelief-checkbox = Jag tror att informationen som ingår i denna rapport är korrekt och komplett
comments-permalinkView-reportIllegalContent-additionalComments-addCommentURLButton = <Button></Button>Lägg till
comments-permalinkView-reportIllegalContent-additionalComment-commentURLButton = Kommentarens URL
comments-permalinkView-reportIllegalContent-additionalComments-deleteButton = <icon></icon> Ta bort
comments-permalinkView-reportIllegalContent-submit = Skicka in rapport
comments-permalinkView-reportIllegalContent-additionalComments-commentNotFoundError = Kommentaren hittades inte. Vänligen ange en giltig kommentars-URL
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError = Detta är inte en giltig URL. Vänligen ange en giltig kommentars-URL
comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError = Du har redan lagt till denna kommentar i rapporten. Vänligen lägg till en unik kommentars-URL
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLLengthError = Längden på ytterligare kommentars-URL överskrider maximalt.
comments-permalinkView-reportIllegalContent-additionalComments-previouslyReportedCommentError = Du har tidigare anmält denna kommentar för att innehålla olagligt innehåll. Du kan bara anmäla en kommentar av denna anledning en gång.
comments-permalinkView-reportIllegalContent-confirmation-successHeader = Vi har mottagit din anmälan om olagligt innehåll
comments-permalinkView-reportIllegalContent-confirmation-description = Din rapport kommer nu att granskas av vårt modereringsteam. Du kommer att få ett meddelande när ett beslut är fattat. Om innehållet
  visar sig innehålla olagligt innehåll kommer det att tas bort från webbplatsen och ytterligare åtgärder kan vidtas mot den som kommenterar.
comments-permalinkView-reportIllegalContent-confirmation-errorHeader = Tack för att du skickade in denna rapport
comments-permalinkView-reportIllegalContent-confirmation-errorDescription = Vi kunde inte skicka in din rapport av följande anledning(ar):
comments-permalinkView-reportIllegalContent-confirmation-returnToComments = Du kan nu stänga denna flik för att återgå till kommentarerna

comments-rte-bold =
  .title = Fetstil

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Citat

comments-rte-bulletedList =
  .title = Punktlista

comments-rte-strikethrough =
  .title = Genomstruken

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkasm

comments-rte-externalImage =
  .title = Extern bild

comments-remainingCharacters = { $remaining } tecken kvar

comments-postCommentFormFake-signInAndJoin = Logga in och delta i diskussionen

comments-postCommentForm-rteLabel = Skriv en kommentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Svara
comments-replyButton =
  .aria-label = Svara på kommentar av {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Skicka
comments-replyCommentForm-cancel = Avbryt
comments-replyCommentForm-rteLabel = Skriv ett svar
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Trådnivå { $level }:
comments-commentContainer-highlightedLabel = Markerad:
comments-commentContainer-ancestorLabel = Tidigare:
comments-commentContainer-replyLabel =
  Svar från { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Fråga från { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Kommentar från { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Redigera

comments-commentContainer-avatar =
  .alt = Avatar för { $username }

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

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Du visar för närvarande en enskild konversation
comments-inReplyTo = Som svar till <Username></Username>
comments-replyingTo = Svarar till: <Username></Username>

comments-reportButton-report = Anmäl
comments-reportButton-reported = Anmäld
comments-reportButton-aria-report =
  .aria-label = Anmäl kommentar av {$username}
comments-reportButton-aria-reported =
  .aria-label = Anmäld

comments-sortMenu-sortBy = Sortera
comments-sortMenu-newest = Senaste
comments-sortMenu-oldest = Äldst
comments-sortMenu-mostReplies = Flest svar

comments-userPopover =
  .description = En dialogruta med mer användarinformation
comments-userPopover-memberSince = Aktiv sedan: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorera

comments-userIgnorePopover-ignoreUser = Ignorera {$username}?
comments-userIgnorePopover-description =
  När du ignorerar en person kommer alla deras kommentarer
  döljas för dig. Du kan ångra detta senare via din profil.
comments-userIgnorePopover-ignore = Ignorera
comments-userIgnorePopover-cancel = Avbryt

comments-userSpamBanPopover-title = Spamblockering
comments-userSpamBanPopover-header-username = Användarnamn
comments-userSpamBanPopover-header-description = Spamblockering kommer
comments-userSpamBanPopover-callout = Endast för användning på uppenbara spamkonton
comments-userSpamBanPopover-description-list-banFromComments = Blockera detta konto från kommentarer
comments-userSpamBanPopover-description-list-rejectAllComments = Avvisa alla kommentarer skrivna av detta konto
comments-userSpamBanPopover-confirmation = Skriv in "{$text}" för att bekräfta

comments-userBanPopover-title = Stäng av {$username}?
comments-userSiteBanPopover-title = Stäng av {$username} från denna webbplats?
comments-userBanPopover-description =
  Once banned, this user will no longer be able
  to comment, use reactions, or report comments.
  This comment will also be rejected.
comments-userBanPopover-cancel = Avbryt
comments-userBanPopover-ban = Stäng av
comments-userBanPopover-moderator-ban-error = Kan inte blockera konton med moderatorprivilegier
comments-userBanPopover-moreContext = För mer sammanhang, gå till
comments-userBanPopover-moderationView = Moderationsvy

comments-userSiteBanPopover-confirm-title = {$username} är nu blockerad
comments-userSiteBanPopover-confirm-spam-banned = Detta konto kan inte längre kommentera, använda reaktioner eller rapportera kommentarer
comments-userSiteBanPopover-confirm-comments-rejected = Alla kommentarer från detta konto har avvisats
comments-userSiteBanPopover-confirm-closeButton = Stäng
comments-userSiteBanPopover-confirm-reviewAccountHistory = Du kan fortfarande granska detta kontos historik genom att söka i Corals
comments-userSiteBanPopover-confirm-communitySection = Communityavdelning

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Välj ut
comments-moderationDropdown-unfeature = Ångra Välj ut
comments-moderationDropdown-approve = Godkänn
comments-moderationDropdown-approved = Godkänd
comments-moderationDropdown-reject = Stoppa
comments-moderationDropdown-rejected = Stoppad
comments-moderationDropdown-spam-ban = Spamblockering
comments-moderationDropdown-ban = Stäng av användare
comments-moderationDropdown-siteBan = Sajtblockering
comments-moderationDropdown-banned = Avstängd
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Modereringsvy
comments-moderationDropdown-moderateStory = Moderera artikel
comments-moderationDropdown-caretButton =
  .aria-label = Moderera

comments-moderationDropdown-embedCode = Bädda in kod
comments-moderationDropdown-embedCodeCopied = Kod kopierad

comments-moderationRejectedTombstone-title = Du har avvisat denna kommentar.
comments-moderationRejectedTombstone-moderateLink =
  Gå till moderering för att granska detta beslut

comments-featuredTag = Utvalda
comments-featuredBy = Utvald av <strong>{$username}</strong>

# Reaktion kan vara "Gilla" som ett exempel. Var försiktig när du översätter till andra språk med olika grammatiska fall.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    *[other] {$reaction} kommentar av {$username} (Totalt: {$count})
  }

# Reaktion kan vara "Gillad" som ett exempel. Var försiktig när du översätter till andra språk med olika grammatiska fall.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} kommentar av {$username}
    [one] {$reaction} kommentar av {$username}
    *[other] {$reaction} kommentar av {$username} (Totalt: {$count})
  }

comments-jumpToComment-title = Ditt svar har postats nedan
comments-jumpToComment-GoToReply = Gå till svar

comments-mobileToolbar-unmarkAll = Markera alla som lästa
comments-mobileToolbar-nextUnread = Nästa olästa

comments-refreshComments-closeButton = Stäng <icon></icon>
  .aria-label = Stäng
comments-refreshComments-refreshButton = <icon></icon> Uppdatera kommentarer
  .aria-label = Uppdatera kommentarer
comments-refreshQuestions-refreshButton = <icon></icon> Uppdatera frågor
  .aria-label = Uppdatera frågor
comments-refreshReviews-refreshButton = <icon></icon> Uppdatera omdömen
  .aria-label = Uppdatera omdömen

comments-replyChangedWarning-theCommentHasJust =
  Denna kommentar har precis redigerats. Den senaste versionen visas ovan.

comments-mobileToolbar-notifications-closeButton = 
  .aria-label = Stäng notiser

### Q&A

general-tabBar-qaTab = Livechat

qa-postCommentForm-section =
  .aria-label = Ställ en fråga

qa-answeredTab = Besvarade
qa-unansweredTab = Obesvarade
qa-allCommentsTab = Alla

qa-answered-answerLabel =
  Svar från {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Gå till konversation
qa-answered-replies = Svar

qa-noQuestionsAtAll =
  Det finns inga frågor på denna artikel.
qa-noQuestionsYet =
  Det finns ännu inga frågor. Varför inte ställa en?
qa-viewNew-loading = Laddar...
qa-viewNew =
  { $count ->
    [1] Visa {$count} Ny Fråga
    *[other] Visa {$count} Nya Frågor
  }

qa-postQuestionForm-rteLabel = Ställ en fråga
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Mest gillade

qa-answered-tag = besvarad
qa-expert-tag = expert

qa-reaction-vote = Gilla
qa-reaction-voted = Gillad

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] röst på kommentar av {$username}
    *[other] röster ({$count}) på kommentar av {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] röster på kommentar av {$username}
    [one] röst på kommentar av {$username}
    *[other] röster ({$count}) på kommentar av {$username}
  }

qa-unansweredTab-doneAnswering = Klar

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Vilka frågor besvaras?
qa-answeredTooltip-answeredComments =
  Alla frågor besvaras under chatten i mån av tid.
qa-answeredTooltip-toggleButton =
  .aria-label = Visa info om besvarade frågor
  .title = Växla info om besvarade frågor


### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Borttagning av konto begärd
comments-stream-deleteAccount-callOut-receivedDesc =
  En begäran om att ta bort ditt konto mottogs den { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Om du vill fortsätta att lämna kommentarer, svar eller reaktioner,
  kan du avbryta din begäran om att ta bort ditt konto före { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Avbryt begäran om borttagning av konto
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Avbryt borttagning av konto

comments-permalink-copyLink = Kopiera länk
comments-permalink-linkCopied = Länk kopierad

### Bädda in länkar

comments-embedLinks-showEmbeds = Visa inbäddningar
comments-embedLinks-hideEmbeds = Dölj inbäddningar

comments-embedLinks-show-giphy = Visa GIF
comments-embedLinks-hide-giphy = Dölj GIF

comments-embedLinks-show-youtube = Visa video
comments-embedLinks-hide-youtube = Dölj video

comments-embedLinks-show-twitter = Visa inlägg
comments-embedLinks-hide-twitter = Dölj inlägg

comments-embedLinks-show-external = Visa bild
comments-embedLinks-hide-external = Dölj bild

comments-embedLinks-expand = Expandera

### Utvalda Kommentarer
comments-featured-label =
  Utvald kommentar från {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Gå till diskussion
comments-featured-gotoConversation-label-with-username =
  .aria-label = Gå till diskussionen för denna utvalda kommentar av användare { $username } i huvudkommentarsflödet
comments-featured-gotoConversation-label-without-username =
  .aria-label = Gå till diskussionen för denna utvalda kommentar i huvudkommentarsflödet
comments-featured-replies = Svar

## Profile Tab

profile-myCommentsTab = Mina kommentarer
profile-myCommentsTab-comments = Mina kommentarer
profile-accountTab = Konto
profile-preferencesTab = Inställningar

### Biografi
profile-bio-title = Biografi
profile-bio-description =
  Skriv en biografi för att visa offentligt på din kommentarsprofil. Måste vara
  mindre än 100 tecken.
profile-bio-remove = Ta bort
profile-bio-update = Uppdatera
profile-bio-success = Din biografi har uppdaterats framgångsrikt.
profile-bio-removed = Din biografi har tagits bort.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Your account is scheduled to be deleted on { $date }.
profile-accountDeletion-cancelDeletion =
  Cancel account deletion request
profile-accountDeletion-cancelAccountDeletion =
  Avbryt borttagning av konto

### Kommentarshistorik
profile-commentHistory-section =
  .aria-label = Kommentarshistorik
profile-historyComment-commentLabel =
  Kommentar <RelativeTime></RelativeTime> på { $storyTitle }
profile-historyComment-viewConversation = Visa diskussion
profile-historyComment-replies = Svar {$replyCount}
profile-historyComment-commentHistory = Kommentarshistorik
profile-historyComment-story = Artikel: {$title}
profile-historyComment-comment-on = Kommentar på:
profile-profileQuery-errorLoadingProfile = Fel vid laddning av profil
profile-profileQuery-storyNotFound = Artikel hittades inte
profile-commentHistory-loadMore = Ladda fler
profile-commentHistory-empty = Du har inte skrivit några kommentarer
profile-commentHistory-empty-subheading = En historik över dina kommentarer kommer att synas här

profile-commentHistory-archived-thisIsAllYourComments =
  Detta är alla dina kommentarer från de senaste { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  }. För att visa resten av dina kommentarer, vänligen kontakta oss.

### Inställningar

profile-preferences-mediaPreferences = Mediainställningar
profile-preferences-mediaPreferences-alwaysShow = Visa alltid GIFs, X inlägg, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = Detta kan göra att kommentarerna laddar långsammare
profile-preferences-mediaPreferences-update = Uppdatera
profile-preferences-mediaPreferences-preferencesUpdated =
  Dina mediainställningar har uppdaterats

### Account
profile-account-ignoredCommenters = Ignorerade personer
profile-account-ignoredCommenters-description =
  Du kan ignorera andra personer genom att klicka på deras användarnamn
  och välja Ignorera. När du ignorerar någon döljs alla deras
  kommentarer för dig. Personer du ignorerar kan fortfarande läsa
  dina kommentarer.
profile-account-ignoredCommenters-empty = Du ignorerar ingen just nu
profile-account-ignoredCommenters-stopIgnoring = Sluta ignorera
profile-account-ignoredCommenters-youAreNoLonger =
  Du ignorerar inte längre
profile-account-ignoredCommenters-manage = Hantera
  .aria-label = Hantera ignorerade kommentatorer
profile-account-ignoredCommenters-cancel = Avbryt
profile-account-ignoredCommenters-close = Stäng

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
profile-account-download-comments-yourMostRecentRequest =
  Din senaste begäran gjordes inom de senaste 14 dagarna. Du kan
  begära att ladda ner dina kommentarer igen den: { $timeStamp }
profile-account-download-comments-requested =
  Nedladdning begärd. Du kan begära en ny nedladdning om { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Din begäran har framgångsrikt skickats in. Du kan begära att
  ladda ner din kommentarshistorik igen om { framework-timeago-time }.
profile-account-download-comments-error =
  Vi kunde inte genomföra din begäran om nedladdning.
profile-account-download-comments-request-button = Begäran

## Delete Account

profile-account-deleteAccount-title = Ta bort mitt konto
profile-account-deleteAccount-deleteMyAccount = Ta bort mitt konto
profile-account-deleteAccount-description =
  Om du tar bort ditt konto kommer din profil och alla dina kommentarer
  raderas från sajten permanent.
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

profile-account-deleteAccount-pages-sharedHeader = Ta bort mitt konto

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
profile-account-deleteAccount-pages-whenSubHeader = När?
profile-account-deleteAccount-pages-whenSec1Header =
  När kommer mitt konto att tas bort?
profile-account-deleteAccount-pages-whenSec1Content =
  Ditt konto tas bort 24 timmar efter att din begäran skickats in.
profile-account-deleteAccount-pages-whenSec2Header =
  Kan jag fortfarande kommentera tills dess att mitt konto tagits bort=
profile-account-deleteAccount-pages-whenSec2Content =
  Nej. När du begärt att ditt konto ska tas bort kan du inte längre skriva
  kommentarer, svara på kommentarer eller välja reaktioner.

profile-account-deleteAccount-pages-downloadCommentHeader = Ladda ner mina kommentarer?
profile-account-deleteAccount-pages-downloadSubHeader = Ladda ner mina kommentarer
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Innan ditt konto tas bort rekommenderar vi att du laddar ner dina kommentarer.
  När ditt konto väl tagits bort kommer du inte kunna begära ut din kommentarshistorik.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Min profil > Ladda ner min kommentarshistorik

profile-account-deleteAccount-pages-confirmHeader = Bekräfta borttagning av konto?
profile-account-deleteAccount-pages-confirmSubHeader = Är du säker?
profile-account-deleteAccount-pages-confirmDescHeader =
  Är du säker på att du vill ta bort ditt konto?
profile-account-deleteAccount-confirmDescContent =
  För att bekräfta att du vill ta bort ditt konot, vänligen skriv in följande
  fras i textrutan nedan:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  För att bekräfta, skriv frasen nedan:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Ange ditt lösenord:

profile-account-deleteAccount-pages-completeHeader = Borttagning av konto begärt
profile-account-deleteAccount-pages-completeSubHeader = Begäran inskickad
profile-account-deleteAccount-pages-completeDescript =
  Din begäran har skickats in och en bekräftelse har skickats till den
  e-postadress som hör till ditt konto.
profile-account-deleteAccount-pages-completeTimeHeader =
  Ditt konto kommer att tas bort den: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Ångrat dig?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Logga in på ditt konto igen före detta datum och välj
  <strong>Avbryt borttagning av konto</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Berätta varför.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Vi vill gärna veta varför du valt att ta bort ditt konto. Skicka feedback
  på vårt kommentarsflöde genom att mejla { $email }.
profile-account-changePassword-edit = Ändra
profile-account-changePassword-change = Ändra
  .aria-label = Ändra lösenord


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

profile-account-notifications-inPageNotifications = Aviseringar
profile-account-notifications-includeInPageWhen = Meddela mig när

profile-account-notifications-inPageNotifications-on = Märken på
profile-account-notifications-inPageNotifications-off = Märken av

profile-account-notifications-showReplies-fromAnyone = från vem som helst
profile-account-notifications-showReplies-fromStaff = från en moderator
profile-account-notifications-showReplies =
  .aria-label = Visa svar från

## Report Comment Popover
comments-reportPopover =
  .description = Om att anmäla kommentarer
comments-reportPopover-reportThisComment = Anmäl den här kommentaren
comments-reportPopover-whyAreYouReporting = Varför anmäler du den här kommentaren?

comments-reportPopover-reasonOffensive = Kommentaren är kränkande
comments-reportPopover-reasonAbusive = Denna skribent är kränkande
comments-reportPopover-reasonIDisagree = Jag håller inte med om kommentaren
comments-reportPopover-reasonSpam = Det här ser ut som spam eller marknadsföring
comments-reportPopover-reasonOther = Annat

comments-reportPopover-additionalInformation =
  Ytterligare information <optional>Valfri</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Lämna gärna ytterligare information som kan vara till hjälp för våra moderatorer. (Valfritt)

comments-reportPopover-maxCharacters = Max. { $maxCharacters } tecken
comments-reportPopover-restrictToMaxCharacters = Vänligen begränsa din rapport till { $maxCharacters } tecken
comments-reportPopover-cancel = Avbryt
comments-reportPopover-submit = Skicka in

comments-reportPopover-thankYou = Tack!
comments-reportPopover-receivedMessage =
  Vi har mottagit ditt meddelande. Anmälningar från aktiva läsare som du hjälper oss att behålla ett bra debattklimat.

comments-reportPopover-dismiss = Avfärda

comments-reportForm-reportIllegalContent-button = Denna kommentar innehåller olagligt innehåll
comments-reportForm-signInToReport = Du måste logga in för att rapportera en kommentar som bryter mot våra riktlinjer

## Arkiverad Rapportera Kommentar Popover

comments-archivedReportPopover-reportThisComment = Rapportera denna kommentar
comments-archivedReportPopover-doesThisComment =
  Bryter denna kommentar mot våra communityregler? Är detta stötande eller spam?
  Skicka ett e-postmeddelande till vårt modereringsteam på <a>{ $orgName }</a> med en länk till
  denna kommentar och en kort förklaring.
comments-archivedReportPopover-needALink =
  Behöver du en länk till denna kommentar?
comments-archivedReportPopover-copyLink = Kopiera länk

comments-archivedReportPopover-emailSubject = Rapportera kommentar
comments-archivedReportPopover-emailBody =
  Jag skulle vilja rapportera följande kommentar:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Av de skäl som anges nedan:

## Submit Status
comments-submitStatus-dismiss = Avfärda
comments-submitStatus-submittedAndWillBeReviewed =
  Din kommentar har skickats in och kommer att granskas av en moderator.
comments-submitStatus-submittedAndRejected =
  Din kommenatar har stoppats för att den bryter mot våra regler

# Configure
configure-configureQuery-errorLoadingProfile = Fel vid inladdning
configure-configureQuery-storyNotFound = Artikel hittades inte

## Archive
configure-archived-title = Denna kommentarstråd har arkiverats
configure-archived-onArchivedStream =
  På arkiverade trådar kan inga nya kommentarer, reaktioner eller rapporter
  skickas in. Dessutom kan kommentarer inte modereras.
configure-archived-toAllowTheseActions =
  För att tillåta dessa åtgärder, avarkivera tråden.
configure-archived-unarchiveStream = Avarkivera tråden

## Change username
profile-changeUsername-username = Användarnamn
profile-changeUsername-success = Ditt användarnamn har ändrats
profile-changeUsername-edit = Ändra
profile-changeUsername-change = Ändra
  .aria-label = Ändra användarnamn
profile-changeUsername-heading = Ändra ditt användarnamn
profile-changeUsername-heading-changeYourUsername = Ändra ditt användarnamn
profile-changeUsername-desc = Ändra användarnamnet som syns på alla dina tidigare och framtida kommentarer. <strong>Användarnamn kan ändras en gång per { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Ändra användarnamnet som syns på alla dina tidigare och framtida kommentarer. Användarnamn kan ändras en gång per  { framework-timeago-time }.
profile-changeUsername-current = Nuvarande användarnamn
profile-changeUsername-newUsername-label = Nytt användarnamn
profile-changeUsername-confirmNewUsername-label = Bekräfta nytt användarnamn
profile-changeUsername-cancel = Avbryt
profile-changeUsername-save = Spara
profile-changeUsername-saveChanges = Spara ändringar
profile-changeUsername-recentChange = Ditt användarnamn har ändrats under de senaste { framework-timeago-time }. Du kan ändra ditt användarnamn igen om { $nextUpdate }
profile-changeUsername-youChangedYourUsernameWithin =
  Du ändrade ditt användarnamn inom de senaste { framework-timeago-time }. Du kan ändra ditt användarnamn igen den: { $nextUpdate }.
profile-changeUsername-close = Stäng

## Diskussionsflik

discussions-mostActiveDiscussions = Mest aktiva diskussioner
discussions-mostActiveDiscussions-subhead = Rankad efter antalet kommentarer mottagna under de senaste 24 timmarna på { $siteName }
discussions-mostActiveDiscussions-empty = Du har inte deltagit i några diskussioner
discussions-myOngoingDiscussions = Mina pågående diskussioner
discussions-myOngoingDiscussions-subhead = Där du har kommenterat över { $orgName }
discussions-viewFullHistory = Visa fullständig kommentarshistorik
discussions-discussionsQuery-errorLoadingProfile = Fel vid laddning av profil
discussions-discussionsQuery-storyNotFound = Artikeln hittades inte

## Kommentarstråd
configure-stream-title =
configure-stream-title-configureThisStream =
  Konfigurera denna tråd
configure-stream-apply =
configure-stream-update = Uppdatera
configure-stream-streamHasBeenUpdated =
  Denna tråd har uppdaterats

configure-premod-title =
configure-premod-premoderateAllComments = Förhandsmoderera alla kommentarer
configure-premod-description =
  Moderatorer måste godkänna varje kommentar innan den publiceras vid den här artikeln.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Förhandsmoderera kommentarer som innehåller länkar
configure-premodLink-description =
  Moderatorer måste godkänna varje kommentar som innehåller en länk innan den publiceras vid den här artikeln.

configure-messageBox-title =
configure-addMessage-title =
  Lägg till ett meddelande eller en fråga
configure-messageBox-description =
configure-addMessage-description =
  Lägg till ett meddelande till läsarna överst i kommentarsfältet.
  Använd detta för att föreslå diskussionsämnen, ställa en fråga eller skriva meddelanden relaterade till kommentarerna.
configure-addMessage-addMessage = Lägg till meddelande
configure-addMessage-removed = Meddelandet har tagits bort
config-addMessage-messageHasBeenAdded =
  Meddelandet har lagts till i kommentarsfältet
configure-addMessage-remove = Ta bort
configure-addMessage-submitUpdate = Uppdatera
configure-addMessage-cancel = Avbryt
configure-addMessage-submitAdd = Lägg till meddelande

configure-messageBox-preview = Förhandsgranska
configure-messageBox-selectAnIcon = Välj en ikon
configure-messageBox-iconConversation = Konversation
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Hjälp
configure-messageBox-iconWarning = Varning
configure-messageBox-iconChatBubble = Chatbubbla
configure-messageBox-noIcon = Ingen ikon
configure-messageBox-writeAMessage = Skriv ett meddelande

## configure-closeStream-title = 
configure-closeStream-closeCommentStream =
  Stäng kommentarstråden
configure-closeStream-description =
  Det här kommentarsflödet är för närvarande öppet. Genom att stänga
  kommentarsflödet kan inga nya kommentarer skickas in, men alla tidigare
  kommenterare syns fortfarande.
configure-closeStream-closeStream = Stäng flöde
configure-closeStream-theStreamIsNowOpen = Tråden är nu öppen

configure-openStream-title = Öppna flöde
configure-openStream-description =
  Det här kommentarsflödet är för närvarande stängt. Genom att öppna
  kommetarsflödet kan nya kommentarer skickas in och visas.
configure-openStream-openStream = Öppna flöde
configure-openStream-theStreamIsNowClosed = Tråden är nu stängd

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Livechat är för närvarande under aktiv utveckling. Vänligen kontakta
  oss med feedback eller förfrågningar.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Byt till livechat
configure-enableQA-description =
  Livechat möjliggör för användare att skicka in frågor till utvalda
  experter för svar.
configure-enableQA-enableQA = Byt till livechat
configure-enableQA-streamIsNowComments =
  Denna tråd är nu i kommentarsformat

configure-disableQA-title = Konfigurera denna livechat
configure-disableQA-description =
  Livechat möjliggör för användare att skicka in frågor till utvalda
  experter för svar.
configure-disableQA-disableQA = Byt till Kommentarer
configure-disableQA-streamIsNowQA =
  Denna tråd är nu i Livechat-läge

configure-experts-title = Lägg till en expert
configure-experts-filter-searchField =
  .placeholder = Sök med e-post eller användarnamn
  .aria-label = Sök med e-post eller användarnamn
configure-experts-filter-searchButton =
  .aria-label = Sök
configure-experts-filter-description =
  Lägger till en expertmärkning på kommentarer från registrerade användare, endast på denna
  sida. Nya användare måste först registrera sig och öppna kommentarerna på en sida
  för att skapa sitt konto.
configure-experts-search-none-found = Inga användare hittades med den e-posten eller användarnamnet
configure-experts-remove-button = Ta bort
configure-experts-load-more = Ladda fler
configure-experts-none-yet = Det finns för närvarande inga experter för denna livechat.
configure-experts-search-title = Sök efter en expert
configure-experts-assigned-title = Experter
configure-experts-noLongerAnExpert = är inte längre expert
comments-tombstone-ignore-user = Den här kommentaren är dold eftersom du ignorerat användaren.
comments-tombstone-showComment = Visa kommentar
comments-tombstone-deleted =
  Denna kommentar finns inte längre. Personen som kommenterade har tagit bort sitt konto.
comments-tombstone-rejected =
  Denna kommentar har tagits bort av en moderator för att ha brutit mot våra communityriktlinjer.

## suspendInfo-heading = 
suspendInfo-heading-yourAccountHasBeen =
  Ditt konto har tillfälligt stängts av från att kommentera.
suspendInfo-description-inAccordanceWith =
  I enlighet med { $organization }:s riktlinjer för artikelkommentarer
  har ditt konto blivit tillfälligt avstängt. Under avstängningen kan
  du inte kommentera, gilla eller anmäla kommentarer.
suspendInfo-until-pleaseRejoinThe =
  Välkommen att åter delta i diskussionen den { $until }

warning-heading = Ditt konto har fått en varning
warning-explanation =
  I enlighet med våra communityriktlinjer har ditt konto fått en varning.
warning-instructions =
  För att fortsätta delta i diskussioner, vänligen tryck på "Godkänn" knappen nedan.
warning-acknowledge = Godkänn

warning-notice = Ditt konto har fått en varning. För att fortsätta delta vänligen <a>granska varningsmeddelandet</a>.

modMessage-heading = Ditt konto har fått ett meddelande från en moderator
modMessage-acknowledge = Okej

profile-changeEmail-unverified = (Obekräftad)
profile-changeEmail-current = (nuvarande)
profile-changeEmail-edit = Ändra
profile-changeEmail-change = Ändra
  .aria-label = Ändra e-post
profile-changeEmail-please-verify = Bekräfta din e-postadress
profile-changeEmail-please-verify-details =
  Ett mejl har skickats till { $email } för att bekräfta ditt konto.
  Du måste bekräfta din nya e-postadress innan den kan användas för
  att logga in på ditt konto eller för att ta emot notifieringar.
profile-changeEmail-resend = Skicka om bekräftelse
profile-changeEmail-heading = Ändra din e-postadress
profile-changeEmail-changeYourEmailAddress =
  Ändra din e-postadress
profile-changeEmail-desc = Ändra e-postadressen som används för att logga in och för att ta emot information om ditt konto.
profile-changeEmail-newEmail-label = Ny e-postadress
profile-changeEmail-password = Lösenord
profile-changeEmail-password-input =
  .placeholder = Lösenord
profile-changeEmail-cancel = Avbryt
profile-changeEmail-submit = Spara
profile-changeEmail-saveChanges = Spara ändringar
profile-changeEmail-email = E-post
profile-changeEmail-title = E-postadress
profile-changeEmail-success = Din e-postadress har ändrats

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Skicka in ett omdöme eller ställ en fråga

ratingsAndReviews-reviewsTab = Omdömen
ratingsAndReviews-questionsTab = Frågor
ratingsAndReviews-noReviewsAtAll = Det finns inga omdömen.
ratingsAndReviews-noQuestionsAtAll = Det finns inga frågor.
ratingsAndReviews-noReviewsYet = Det finns inga omdömen än. Varför inte skriva ett?
ratingsAndReviews-noQuestionsYet = Det finns inga frågor än. Varför inte ställa en?
ratingsAndReviews-selectARating = Välj ett betyg
ratingsAndReviews-youRatedThis = Du betygsatte detta
ratingsAndReviews-showReview = Visa omdöme
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Betygsätt och recensera
ratingsAndReviews-askAQuestion = Ställ en fråga
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Inga betyg ännu
  [1] Baserat på 1 betyg
  *[other] Baserat på { SHORT_NUMBER($count) } betyg
}

ratingsAndReviews-allReviewsFilter = Alla omdömen
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Stjärna
  *[other] { $rating } Stjärnor
}

comments-addAReviewForm-rteLabel = Lägg till ett omdöme (valfritt)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Toppen av artikeln
  .title = Gå till toppen av artikeln
stream-footer-links-top-of-comments = Toppen av kommentarer
  .title = Gå till toppen av kommentarerna
stream-footer-links-profile = Profil & Svar
  .title = Gå till profil och svar
stream-footer-links-discussions = Fler diskussioner
  .title = Gå till fler diskussioner
stream-footer-navigation =
  .aria-label = Kommentarsfot

## Notifikationer

notifications-title = Notifikationer
notifications-loadMore = Visa fler
notifications-loadNew = Visa nya

notifications-adjustPreferences = Justera notisinställningar i Min profil &gt;<button>Inställningar.</button>

notification-comment-toggle-default-open = - Kommentar
notification-comment-toggle-default-closed = + Kommentar

notifications-comment-showRemovedComment = + Visa borttagen kommentar
notifications-comment-hideRemovedComment = - Dölj borttagen kommentar

notification-comment-description-featured = din kommentar på "{ $title }" blev utvald av en medlem i vårt team.
notification-comment-description-default = på "{ $title }"
notification-comment-media-image = Bild
notification-comment-media-embed = Bädda in
notification-comment-media-gif = Gif

notifications-yourIllegalContentReportHasBeenReviewed =
  Din anmälan av olagligt innehåll har granskats
notifications-yourCommentHasBeenRejected =
  Din kommentar har avvisats
notifications-yourCommentHasBeenApproved =
  Din kommentar har godkänts
notifications-yourCommentHasBeenFeatured =
  Din kommentar har blivit framhävd
notifications-yourCommentHasReceivedAReply =
  Nytt svar från { $author }
notifications-defaultTitle = Notifikation

notifications-rejectedComment-body =
  Innehållet i din kommentar bröt mot våra communityregler. Kommentaren har tagits bort.
notifications-rejectedComment-wasPending-body =
  Innehållet i din kommentar bedöms bryta mot våra communityregler.
notifications-reasonForRemoval = Orsak till borttagning
notifications-legalGrounds = Juridiska grunder
notifications-additionalExplanation = Ytterligare förklaring

notifications-repliedComment-hideReply = - Dölj svaret
notifications-repliedComment-showReply = + Visa svaret
notifications-repliedComment-hideOriginalComment = - Dölj min ursprungliga kommentar
notifications-repliedComment-showOriginalComment = + Visa min ursprungliga kommentar

notifications-dsaReportLegality-legal = Lagligt innehåll
notifications-dsaReportLegality-illegal = Olagligt innehåll
notifications-dsaReportLegality-unknown = Okänt

notifications-rejectionReason-offensive = Denna kommentar innehåller kränkande språk
notifications-rejectionReason-abusive = Denna kommentar innehåller missbrukande språk
notifications-rejectionReason-spam = Denna kommentar är spam
notifications-rejectionReason-bannedWord = Förbjudet ord
notifications-rejectionReason-ad = Denna kommentar är en annons
notifications-rejectionReason-illegalContent = Denna kommentar innehåller olagligt innehåll
notifications-rejectionReason-harassmentBullying = Denna kommentar innehåller trakasserande eller mobbande språk
notifications-rejectionReason-misinformation = Denna kommentar innehåller felinformation
notifications-rejectionReason-hateSpeech = Denna kommentar innehåller hatpropaganda
notifications-rejectionReason-irrelevant = Denna kommentar är irrelevant för diskussionen
notifications-rejectionReason-other = Annat
notifications-rejectionReason-other-customReason = Annat - { $customReason }
notifications-rejectionReason-unknown = Okänt

notifications-reportDecisionMade-legal =
  Den <strong>{ $date }</strong> rapporterade du en kommentar skriven av <strong>{ $author }</strong> för att innehålla olagligt innehåll. Efter att ha granskat din rapport har vårt modereringsteam beslutat att denna kommentar <strong>inte verkar innehålla olagligt innehåll.</strong> Tack för att du hjälper till att hålla vår community säker.
notifications-reportDecisionMade-illegal =
  Den <strong>{ $date }</strong> rapporterade du en kommentar skriven av <strong>{ $author }</strong> för att innehålla olagligt innehåll. Efter att ha granskat din rapport har vårt modereringsteam beslutat att denna kommentar <strong>innehåller olagligt innehåll</strong> och har tagits bort. Ytterligare åtgärder kan vidtas mot kommentatorn, dock kommer du inte att meddelas om några ytterligare steg. Tack för att du hjälper till att hålla vår community säker.

notifications-methodOfRedress-none =
  Alla modereringsbeslut är slutgiltiga och kan inte överklagas
notifications-methodOfRedress-email =
  För att överklaga ett beslut som visas här vänligen kontakta <a>{ $email }</a>
notifications-methodOfRedress-url =
  För att överklaga ett beslut som visas här vänligen besök <a>{ $url }</a>

notifications-youDoNotCurrentlyHaveAny = Du har för närvarande inga notifikationer

notifications-floatingIcon-close = stäng

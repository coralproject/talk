### Localization for Embed Stream

## General

general-moderate = Moderieren

general-userBoxUnauthenticated-joinTheConversation = An der Diskussion teilnehmen
general-userBoxUnauthenticated-signIn = Anmelden
general-userBoxUnauthenticated-register = Registrieren

general-userBoxAuthenticated-signedIn =
  Angemeldet als
general-userBoxAuthenticated-notYou =
  Bist das nicht du? <button>Abmelden</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Du wurdest erfolgreich abgemeldet.

general-tabBar-commentsTab = Kommentare
general-tabBar-myProfileTab = Mein Profil
general-tabBar-discussionsTab = Diskussionen
general-tabBar-configure = Konfigurieren

## Comment Count

comment-count-text =
  { $count  ->
    [one] Kommentar
    *[other] Kommentare
  }

## Comments Tab

comments-commentForm-submit = Kommentar abschicken
comments-allCommentsTab = Alle Kommentare
comments-featuredTab = Hervorgehoben
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 Person schaut sich die Diskussion an
    *[other] { SHORT_NUMBER($count) } Personen schauen sich diese Diskussion an
  }

comments-featuredCommentTooltip-how = Wie wird ein Kommentar hervorgehoben?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentare, welche von unserem Team vorgeschlagen werden.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Hervorgehobene Kommentare Tooltip ein-/ ausblenden
  .title = Hervorgehobene Kommentare Tooltip ein-/ ausblenden

comments-collapse-toggle =
  .aria-label = Kommentar Thread zusammenklappen
comments-bannedInfo-bannedFromCommenting = Dein Account wurde vom Kommentieren blockiert.
comments-bannedInfo-violatedCommunityGuidelines =
  Jemand mit Zugriff zu deinem Account hat gegen die Community Richtlinien
  verstossen. Als Result wurde dein Account blockiert. Du kannst nicht mehr kommentieren,
  auf andere Kommentare reagieren oder melden. Wenn du denkst, dass dein Account
  fälschlicherweise blockiert wurde, melde dich bitte an unser Community Team.

comments-noCommentsAtAll = Dieser Artikel hat keine Kommentare.
comments-noCommentsYet = Es gibt noch keine Kommentare. Verfasse den ersten.

comments-streamQuery-storyNotFound = Artikel nicht gefunden.

comments-commentForm-cancel = Abbrechen
comments-commentForm-saveChanges = Änderungen speichern
comments-commentForm-submit = Absenden

comments-postCommentForm-submit = Kommentar abschicken
comments-replyList-showAll = Alle anzeigen
comments-replyList-showMoreReplies = Mehr Antworten anzeigen

comments-postComment-gifSearch = Nach einem GIF suchen
comments-postComment-gifSearch-search =
  .aria-label = Suchen
comments-postComment-gifSearch-loading = Laden...
comments-postComment-gifSearch-no-results = Keine Resultate gefunden für {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Bild URL einfügen
comments-postComment-insertImage = Einfügen

comments-postComment-confirmMedia-youtube = Dieses Youtube Video am Ende deines Kommentars hinzufügen?
comments-postComment-confirmMedia-twitter = Diesen Tweet am Ende deines Kommentars hinzufügen?
comments-postComment-confirmMedia-cancel = Abbrechen
comments-postComment-confirmMedia-add-tweet = Tweet hinzufügen
comments-postComment-confirmMedia-add-video = Video hinzufügen
comments-postComment-confirmMedia-remove = Entfernen
comments-commentForm-gifPreview-remove = Entfernen
comments-viewNew =
  { $count ->
    [1] {$count} Neuen Kommentar anschauen
    *[other] {$count} Neue Kommentare anschauen
  }
comments-loadMore = Mehr laden

comments-permalinkPopover =
  .description = Eine Dialogbox, welche einen Permalink zum Kommentar anzeigt
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink zum Kommentar
comments-permalinkButton-share = Teilen
comments-permalinkButton =
  .aria-label = Kommentar geteilt von {$username}
comments-permalinkView-viewFullDiscussion = Ganze Diskussion anschauen
comments-permalinkView-commentRemovedOrDoesNotExist = Diese Komponente wurde entfernt oder existiert nicht.

comments-rte-bold =
  .title = Fett

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Zitat

comments-rte-bulletedList =
  .title = Aufzählungszeichen

comments-rte-strikethrough =
  .title = Durchgestrichen

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkasmus

comments-rte-externalImage =
  .title = Externes Bild

comments-remainingCharacters = { $remaining } Zeichen übrig

comments-postCommentFormFake-signInAndJoin = Anmelden und mitdiskutieren

comments-postCommentForm-rteLabel = Kommentar schreiben

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Antworten
comments-replyButton =
  .aria-label = Antworte auf den Kommentar von {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Absenden
comments-replyCommentForm-cancel = Abbrechen
comments-replyCommentForm-rteLabel = Eine Antwort schreiben
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Bearbeiten

comments-commentContainer-avatar =
  .alt = Avatar für { $username }

comments-editCommentForm-saveChanges = Änderungen speichern
comments-editCommentForm-cancel = Abbrechen
comments-editCommentForm-close = Schliessen
comments-editCommentForm-rteLabel = Kommentar bearbeiten
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Bearbeitung: <time></time> übrig
comments-editCommentForm-editTimeExpired = Die Zeit für die Bearbeitung ist abgelaufen. Du kannst diesen Kommentar nicht mehr bearbeiten. Warum verfasst du nicht einen neuen?
comments-editedMarker-edited = Bearbeitet
comments-showConversationLink-readMore = Mehr zu dieser Diskussion lesen >
comments-conversationThread-showMoreOfThisConversation =
  Mehr zu dieser Diskussion anzeigen

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Du schaust dir momentan eine einzige Diskussion an
comments-inReplyTo = Zur Antwort von <Username></Username>
comments-replyingTo = Antworten zu <Username></Username>

comments-reportButton-report = Melden
comments-reportButton-reported = Gemeldet
comments-reportButton-aria-report =
  .aria-label = Kommentar von {$username} melden
comments-reportButton-aria-reported =
  .aria-label = Gemeldet

comments-sortMenu-sortBy = Sortieren nach
comments-sortMenu-newest = Neueste
comments-sortMenu-oldest = Älteste
comments-sortMenu-mostReplies = Am meisten Antworten

comments-userPopover =
  .description = Ein Popover mit mehr Informationen zum Benutzer
comments-userPopover-memberSince = Mitglied seit: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorieren

comments-userIgnorePopover-ignoreUser = {$username} ignorieren?
comments-userIgnorePopover-description =
  Wenn du einen Kommentator ignorierst, werden all seine
  Kommentare auf der Seite vor dir verborgen. Du kannst das
  später in deinem Profil wieder ändern.
comments-userIgnorePopover-ignore = Ignorieren
comments-userIgnorePopover-cancel = Abbrechen

comments-userBanPopover-title = {$username} blockieren?
comments-userBanPopover-description =
  Wenn der User blockiert wird, wird er nicht mehr kommentieren,
  Reaktionen nutzen, oder Kommentare melden können.
  Dieser Kommentar wird ebenfalls abgewiesen.
comments-userBanPopover-cancel = Abbrechen
comments-userBanPopover-ban = Blockieren

comments-moderationDropdown-popover =
  .description = Ein Popover Menü um den Kommentar zu moderieren
comments-moderationDropdown-feature = Hervorheben
comments-moderationDropdown-unfeature = Hervorhebung zurücksetzen
comments-moderationDropdown-approve = Genehmigen
comments-moderationDropdown-approved = genehmigt
comments-moderationDropdown-reject = Ablehnen
comments-moderationDropdown-rejected = Abgelehnt
comments-moderationDropdown-ban = User blockieren
comments-moderationDropdown-banned = Blockiert
comments-moderationDropdown-goToModerate = Zur Moderation gehen
comments-moderationDropdown-moderationView = Moderation Ansicht
comments-moderationDropdown-moderateStory = Artikel moderieren
comments-moderationDropdown-caretButton =
  .aria-label = Moderieren

comments-moderationRejectedTombstone-title = Du hast diesen Kommentar abgelehnt.
comments-moderationRejectedTombstone-moderateLink =
  Gehe zu Moderieren um die Entscheidung zu überprüfen

comments-featuredTag = Hervorgehoben

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} (Kommentar von {$username})
    *[other] {$reaction} (Insgesamt: {$count}, Kommentar von {$username})
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} (Kommentar von {$username})
    [one] {$reaction} (Kommentar von {$username})
    *[other] {$reaction} (Insgesamt: {$count}, Kommentar von {$username})
  }

comments-jumpToComment-title = Deine Antwort wird unten angezeigt
comments-jumpToComment-GoToReply = Zur Antwort springen

### Q&A

general-tabBar-qaTab = Q&A

qa-answeredTab = Beantwortet
qa-unansweredTab = Unbeantwortet
qa-allCommentsTab = Alle

qa-noQuestionsAtAll =
  Es gibt keine Fragen zu diesem Artikel.
qa-noQuestionsYet =
   Es gibt noch keine Fragen. Stelle die erste Frage!
qa-viewNew =
  { $count ->
    [1] {$count} Neue Frage anschauen
    *[other] {$count} Neue Fragen anschauen
  }

qa-postQuestionForm-rteLabel = Frage stellen
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Am meisten abgestimmt

qa-answered-tag = Beantwortet
qa-expert-tag = Experte

qa-reaction-vote = Abstimmen
qa-reaction-voted = Abgestimmt

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Stimme für den Kommentar von {$username} ab
    *[other] Stimme ({$count}) für den Kommentar von {$username} ab
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] haben für den Kommentar von {$username} abgestimmt
    [one] hat für den Kommentar von {$username} abgestimmt
    *[other] haben ({$count}) für den Kommentar von {$username} abgestimmt
  }

qa-unansweredTab-doneAnswering = Fertig

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Wie wird eine Frage abgestimmt?
qa-answeredTooltip-answeredComments =
  Fragen werden von einem Q&A Experten beantwortet.
qa-answeredTooltip-toggleButton =
  .aria-label = Tooltip für die beantworteten Fragen ein-/ ausblenden
  .title = Tooltip für die beantworteten Fragen ein-/ ausblenden

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Löschung des Accounts beantragt
comments-stream-deleteAccount-callOut-receivedDesc =
  Eine Anfrage um deinen Account zu löschen, wurde am { $date } erhalten.
comments-stream-deleteAccount-callOut-cancelDesc =
  Wenn du weiter kommentieren, Antworten oder Reaktionen nutzen möchtest, kannst
  du deine Anfrage bezgl. der Löschung deines Accounts bis { $date } zurückziehen.
comments-stream-deleteAccount-callOut-cancel =
  Anfrage zur Account Löschung zurückziehen
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Account Löschung abbrechen

comments-permalink-copyLink = Link kopieren
comments-permalink-linkCopied = Link wurde kopiert

### Embed Links

comments-embedLinks-showEmbeds = Embeds anzeigen
comments-embedLinks-hideEmbeds = Embeds verbergen

comments-embedLinks-show-giphy = GIF anzeigen
comments-embedLinks-hide-giphy = GIF verbergen

comments-embedLinks-show-youtube = Video anzeigen
comments-embedLinks-hide-youtube = Video verbergen

comments-embedLinks-show-twitter = Tweet anzeigen
comments-embedLinks-hide-twitter = Tweet verbergen

comments-embedLinks-show-external = Bild anzeigen
comments-embedLinks-hide-external = Bild verbergen


### Featured Comments
comments-featured-gotoConversation = Zur Diskussion gehen
comments-featured-replies = Antworten

## Profile Tab

profile-myCommentsTab = Meine Kommentare
profile-myCommentsTab-comments = Meine Kommentare
profile-accountTab = Account
profile-preferencesTab = Einstellungen

### Bio
profile-bio-title = Bio
profile-bio-description =
  Schreibe eine Bio um sie öffentlich auf deinem Kommentar Profil anzuzeigen.
  Muss weniger als 100 Zeichen enthalten.
profile-bio-remove = Entfernen
profile-bio-update = Aktualisieren
profile-bio-success = Deine Bio wurde erfolgreich aktualisiert.
profile-bio-removed = Deine Bio wurde entfernt.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Dein Account wird am { $date } gelöscht.
profile-accountDeletion-cancelDeletion =
  Anfrage zur Account Löschung abbrechen
profile-accountDeletion-cancelAccountDeletion =
  Account Löschung abbrechen

### Comment History
profile-historyComment-viewConversation = Konversation anschauen
profile-historyComment-replies = Antworten {$replyCount}
profile-historyComment-commentHistory = Kommentar Verlauf
profile-historyComment-story = Artikel: {$title}
profile-historyComment-comment-on = Kommentar auf:
profile-profileQuery-errorLoadingProfile = Fehler beim Laden des Profils
profile-profileQuery-storyNotFound = Artikel nicht gefunden
profile-commentHistory-loadMore = Mehr laden
profile-commentHistory-empty = Du hast noch keine Kommentare geschrieben
profile-commentHistory-empty-subheading = Der Verlauf deiner Kommentare wird hier angezeigt

### Preferences

profile-preferences-mediaPreferences = Medien Einstellungen
profile-preferences-mediaPreferences-alwaysShow = GIFs, Tweets, YouTube, etc. immer anzeigen
profile-preferences-mediaPreferences-thisMayMake = Das könnte dazu führen, dass die Kommentare langsamer laden
profile-preferences-mediaPreferences-update = Aktualisieren
profile-preferences-mediaPreferences-preferencesUpdated =
  Deine Medien Einstellungen wurden aktualisiert

### Account
profile-account-ignoredCommenters = Ignorierte Kommentatoren
profile-account-ignoredCommenters-description =
  Du kannst andere Kommentatoren ignorieren, indem du auf ihren Benutzernamen
  klickst und dann Ignorieren auswählst. Wenn du jemanden ignorierst, werden
  alle Kommentare dieses Benutzers vor dir verborgen. Kommentatoren, welche
  du ignorierst, können weiterhin deine Kommentare sehen.
profile-account-ignoredCommenters-empty = Momentan ignorierst du niemanden
profile-account-ignoredCommenters-stopIgnoring = Nicht mehr ignorieren
profile-account-ignoredCommenters-youAreNoLonger =
  Du ignoriest den Benutzer nicht mehr
profile-account-ignoredCommenters-manage = Verwalten
profile-account-ignoredCommenters-cancel = Abbrechen
profile-account-ignoredCommenters-close = Schliessen

profile-account-changePassword-cancel = Abbrechen
profile-account-changePassword = Passwort ändern
profile-account-changePassword-oldPassword = Altes Passwort
profile-account-changePassword-forgotPassword = Passwort vergessen?
profile-account-changePassword-newPassword = Neues Passwort
profile-account-changePassword-button = Passwort ändern
profile-account-changePassword-updated =
  Dein Passwort wurde aktualisiert
profile-account-changePassword-password = Passwort

profile-account-download-comments-title = Meinen Kommentar Verlauf herunterladen
profile-account-download-comments-description =
  Du wirst eine Email mit einem Link erhalten, bei dem du deinen Kommentar
  Verlauf herunterladen kannst. Du kannst <strong>alle 14 Tage eine Anfrage machen.</strong>
profile-account-download-comments-request =
  Kommentar Verlauf anfragen
profile-account-download-comments-request-icon =
  .title = Kommentar Verlauf anfragen
profile-account-download-comments-recentRequest =
  Deine neusten Kommentare { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Deine letzte Anfrage war innerhalb der letzten 14 Tagen. Du kannst am
  { $timeStamp } deinen Kommentar Verlauf wieder anfragen.
profile-account-download-comments-requested =
  Anfrage eingereicht. Du kannst die nächste Anfrage in { framework-timeago-time }
  einreichen.
profile-account-download-comments-requestSubmitted =
  Deine Anfrage wurde erfolgreich übermittelt. Du kannst die nächste
  Anfrage für das Herunterladen der Kommentare in { framework-timeago-time }
  anfragen.
profile-account-download-comments-error =
  Wir konnten deine Anfrage zum Herunterladen nicht fertigstellen.
profile-account-download-comments-request-button = Anfragen

## Delete Account

profile-account-deleteAccount-title = Account löschen
profile-account-deleteAccount-deleteMyAccount = Meinen Account löschen
profile-account-deleteAccount-description =
  Wenn du deinen Account löschst, werden dein Profil und alle deine Kommentare
  von der Seite gelöscht.
profile-account-deleteAccount-requestDelete = Account Löschung beantragen

profile-account-deleteAccount-cancelDelete-description =
  Du hast bereits eine Anfrage zur Account Löschung eingereicht.
  Dein Account wird am { $date } gelöscht.
  Du kannst das Löschen des Accounts bis dann abbrechen.
profile-account-deleteAccount-cancelDelete = Account Löschung abbrechen

profile-account-deleteAccount-request = Anfragen
profile-account-deleteAccount-cancel = Abbrechen
profile-account-deleteAccount-pages-deleteButton = Meinen Account löschen
profile-account-deleteAccount-pages-cancel = Abbrechen
profile-account-deleteAccount-pages-proceed = Fortfahren
profile-account-deleteAccount-pages-done = Erledigt
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-sharedHeader = Meinen Account löschen

profile-account-deleteAccount-pages-descriptionHeader = Meinen Account löschen?
profile-account-deleteAccount-pages-descriptionText =
  Du willst deinen Account löschen? Das bedeutet:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Alle deine Kommentare werden von der Seite entfernt
profile-account-deleteAccount-pages-allCommentsDeleted =
  Alle deine Kommentare werden von unserer Datenbank gelöscht
profile-account-deleteAccount-pages-emailRemoved =
  Deine Email Adresse wird von unserem System entfernt

profile-account-deleteAccount-pages-whenHeader = Meinen Account löschen? Wann?
profile-account-deleteAccount-pages-whenSubHeader = Wann?
profile-account-deleteAccount-pages-whenSec1Header =
  Wann wird mein Account gelöscht?
profile-account-deleteAccount-pages-whenSec1Content =
  Dein Account wird 24 Stunden nach deiner Anfrage gelöscht.
profile-account-deleteAccount-pages-whenSec2Header =
  Kann ich weiterhin Kommentare schreiben bis mein Account gelöscht wird?
profile-account-deleteAccount-pages-whenSec2Content =
  Nein. Sobald du die Löschung deines Accounts beantragt hast, kannst du keine
  Kommentare mehr schreiben, auf Kommentare antworten oder Reaktionen nutzen.

profile-account-deleteAccount-pages-downloadCommentHeader = Meine Kommentare herunterladen?
profile-account-deleteAccount-pages-downloadSubHeader = Meine Kommentare herunterladen
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Bevor dein Account gelöscht wird, empfehlen wir dir deinen Kommentar Verlauf
  herunterzuladen. Sobald dein Account gelöscht ist, wirst du deinen Kommentar
  Verlauf nicht mehr herunterladen können.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mein Profil > Meinen Kommentar Verlauf herunterladen

profile-account-deleteAccount-pages-confirmHeader = Account Löschung bestätigen?
profile-account-deleteAccount-pages-confirmSubHeader = Bist du sicher?
profile-account-deleteAccount-pages-confirmDescHeader =
  Bist du sicher, dass du deinen Account löschen willst?
profile-account-deleteAccount-confirmDescContent =
  Um die Löschung des Accounts zu bestätigen tippe bitte die folgende Phrase in die
  Textbox unten ab:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Zum Bestätigen, unten die Phrase abtippen
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Passwort eingeben:

profile-account-deleteAccount-pages-completeHeader = Account Löschung angefragt
profile-account-deleteAccount-pages-completeSubHeader = Anfrage eingereicht
profile-account-deleteAccount-pages-completeDescript =
  Deine Anfrage wurde eingereicht und eine Bestätigung wurde an deine Email Adresse
  gesendet.
profile-account-deleteAccount-pages-completeTimeHeader =
  Dein Account wird am { $date } gelöscht
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Hast du deine Meinung geändert?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Einfach vor diesem Datum wieder mit deinem Account anmelden und <strong>Account Löschung abbrechen </strong>
  auswählen.
profile-account-deleteAccount-pages-completeTellUsWhy = Bitte gib uns den Grund an
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Wir würden gerne wissen wieso du deinen Account löschen möchtest. Bitte sende uns dein
  Feedback über unser Kommentar System via { $email }.
profile-account-changePassword-edit = Bearbeiten
profile-account-changePassword-change = Ändern


## Notifications
profile-notificationsTab = Benachrichtigungen
profile-account-notifications-emailNotifications = Email Benachrichtigungen
profile-account-notifications-emailNotifications = Email Benachrichtigungen
profile-account-notifications-receiveWhen = Benachrichtigungen erhalten wenn:
profile-account-notifications-onReply = Mein Kommentar Antworten erhält
profile-account-notifications-onFeatured = Mein Kommentar hervorgehoben wird
profile-account-notifications-onStaffReplies = Ein Redaktor auf meinen Kommentar antwortet
profile-account-notifications-onModeration = Mein ausstehender Kommentar überprüft wurde
profile-account-notifications-sendNotifications = Benachrichtigungen senden:
profile-account-notifications-sendNotifications-immediately = Sofort
profile-account-notifications-sendNotifications-daily = Täglich
profile-account-notifications-sendNotifications-hourly = Stündlich
profile-account-notifications-updated = Deine Benachrichtigungs Einstellungen wurden aktualisiert
profile-account-notifications-button = Benachrichtigungs Einstellungen aktualisieren
profile-account-notifications-button-update = Aktualisieren

## Report Comment Popover
comments-reportPopover =
  .description = Dialogbox um Kommentare zu melden
comments-reportPopover-reportThisComment = Diesen Kommentar melden
comments-reportPopover-whyAreYouReporting = Wieso meldest du diesen Kommentar?

comments-reportPopover-reasonOffensive = Dieser Kommentar ist beleidigend
comments-reportPopover-reasonAbusive = Das ist ein missbräuchliches Verhalten
comments-reportPopover-reasonIDisagree = Ich stimme diesem Kommentar nicht zu
comments-reportPopover-reasonSpam = Das sieht aus wie Werbung oder Marketing
comments-reportPopover-reasonOther = Anderes

comments-reportPopover-additionalInformation =
  Zusätzliche Informationen <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Bitte gib zusätzliche Informationen an, welche für die Moderatoren hilfreich sind.

comments-reportPopover-maxCharacters = Max. { $maxCharacters } Zeichen
comments-reportPopover-restrictToMaxCharacters = Bitte schränke deine Meldung auf { $maxCharacters } Zeichen ein
comments-reportPopover-cancel = Abbrechen
comments-reportPopover-submit = Einreichen

comments-reportPopover-thankYou = Vielen Dank!
comments-reportPopover-receivedMessage =
  Wir haben deine Nachricht erhalten. Meldungen von Mitgliedern wie dir schützen die Community.

comments-reportPopover-dismiss = Abweisen

## Submit Status
comments-submitStatus-dismiss = Abweisen
comments-submitStatus-submittedAndWillBeReviewed =
  Dein Kommentar wurde eingereicht und wird von einem Moderator überprüft
comments-submitStatus-submittedAndRejected =
  Dieser Kommentar wurde abgewiesen, weil er unsere Richtlinien verletzt

# Configure
configure-configureQuery-errorLoadingProfile = Fehler beim Laden der Konfigurationen
configure-configureQuery-storyNotFound = Artikel nicht gefunden

## Change username
profile-changeUsername-username = Benutzername
profile-changeUsername-success = Dein Benutzername wurde erfolgreich aktualisiert
profile-changeUsername-edit = Bearbeiten
profile-changeUsername-change = Ändern
profile-changeUsername-heading = Deinen Benutzernamen bearbeiten
profile-changeUsername-heading-changeYourUsername = Benutzernamen anpassen
profile-changeUsername-desc = Ändere deinen Benutzernamen, welcher auf all deinen früheren und zukünftigen Kommentaren angezeigt werden.<strong>Benutzernamen können alle { framework-timeago-time } geändert werden.</strong>
profile-changeUsername-desc-text = Ändere deinen Benutzernamen, welche auf all deinen früheren und zukünftigen Kommentaren angezeigt werden. Benutzernamen können alle { framework-timeago-time } geändert werden.
profile-changeUsername-current = Momentaner Benutzername
profile-changeUsername-newUsername-label = Neuer Benutzername
profile-changeUsername-confirmNewUsername-label = Neuen Benutzernamen bestätigen
profile-changeUsername-cancel = Abbrechen
profile-changeUsername-save = Speichern
profile-changeUsername-saveChanges = Änderungen speichern
profile-changeUsername-recentChange = Dein Benutzername wurde in den letzten { framework-timeago-time } geändert. Du kannst deinen Benutzernamen am { $nextUpdate } ändern.
profile-changeUsername-youChangedYourUsernameWithin =
  Du hast deinen Benutzernamen innerhalb der letzten { framework-timeago-time } geändert. Du kannst deinen Benutzernamen am { $nextUpdate } ändern.
profile-changeUsername-close = Schliessen

## Discussions tab

discussions-mostActiveDiscussions = Aktivste Diskussionen
discussions-mostActiveDiscussions-subhead = Nach den meisten Kommentaren innerhalb der letzten 24 Stunden auf { $siteName } sortiert.
discussions-mostActiveDiscussions-empty = Du hast an keinen Diskussionen teilgenommen
discussions-myOngoingDiscussions = Meine laufenden Diskussionen
discussions-myOngoingDiscussions-subhead = Wo du über { $orgName } kommentiert hast
discussions-viewFullHistory = Schaue den ganzen Kommentar Verlauf an
discussions-discussionsQuery-errorLoadingProfile = Fehler beim Laden des Profils
discussions-discussionsQuery-storyNotFound = Artikel nicht gefunden

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Diesen Stream konfigurieren
configure-stream-apply =
configure-stream-update = Aktualisieren
configure-stream-streamHasBeenUpdated =
  Dieser Stream wurde aktualisiert

configure-premod-title =
configure-premod-premoderateAllComments = Alle Kommentare vormoderieren
configure-premod-description =
  Moderatoren müssen alle Kommentare genehmigen bevor sie beim Artikel veröffentlicht werden.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Kommentare, welche Links enthalten vormoderieren
configure-premodLink-description =
  Moderatoren müssen alle Kommentare, welche einen Link enthalten, genehmigen bevor sie beim Artikel veröffentlicht werden.

configure-messageBox-title =
configure-addMessage-title =
  Eine Nachricht oder Frage hinzufügen
configure-messageBox-description =
configure-addMessage-description =
  Füge eine Nachricht zum Anfang der Kommentarbox für deine Leser hinzu. Nutze dies
  um ein Thema einzuleiten, eine Frage zu stellen oder Ankündigungen zum Artikel zu machen.
configure-addMessage-addMessage = Nachricht hinzufügen
configure-addMessage-removed = Nachricht wurde entfernt
config-addMessage-messageHasBeenAdded =
  Nachricht wurde der Kommentarbox hinzugefügt
configure-addMessage-remove = Entfernen
configure-addMessage-submitUpdate = Aktualisieren
configure-addMessage-cancel = Abbrechen
configure-addMessage-submitAdd = Nachricht hinzufügen

configure-messageBox-preview = Vorschau
configure-messageBox-selectAnIcon = Icon auswälen
configure-messageBox-iconConversation = Konversation
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Hilfe
configure-messageBox-iconWarning = Warnung
configure-messageBox-iconChatBubble = Chat Bubble
configure-messageBox-noIcon = Kein Icon
configure-messageBox-writeAMessage = Eine Nachricht schreiben

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Kommentar Stream schliessen
configure-closeStream-description =
  Dieser Kommentar Stream is momentan offen. Wenn du den Kommentar Stream schliesst,
  werden keine neuen Kommentare mehr übermittelt und alle vorher übermittelten Kommentare
  werden weiterhin angezeigt.
configure-closeStream-closeStream = Stream schliessen
configure-closeStream-theStreamIsNowOpen = Der Stream ist jetzt offen

configure-openStream-title = Stream öffnen
configure-openStream-description =
  Der Kommentar Stream ist momentan geschlossen. Wenn der Kommentar Stream
  geöffnet wird, können neue Kommentare übermittelt und angezeigt werden.
configure-openStream-openStream = Stream öffnen
configure-openStream-theStreamIsNowClosed = Der Stream ist jetzt geschlossen

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Das Q&A Format is momentan in der aktiven Entwicklung. Bitte kontaktiere uns
  für Feedback oder Anfragen.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Zum Q&A Format wechseln
configure-enableQA-description =
  Das Q&A Format erlaubt erlaubt Community Mitgliedern Fragen einzureichen, welche
  von ausgewählten Experten beantwortet werden können.
configure-enableQA-enableQA = Zum Q&A wechseln
configure-enableQA-streamIsNowComments =
  Dieser Stream ist jetzt im Kommentare Format

configure-disableQA-title = Diesen Q&A konfigurieren
configure-disableQA-description =
  Das Q&A Format erlaubt Community Mitgliedern Fragen einzureichen, welche
  von ausgewählten Experten beantwortet werden können.
configure-disableQA-disableQA = Zu Kommentare wechseln
configure-disableQA-streamIsNowQA =
  Der Stream ist jetzt im Q&A Format

configure-experts-title = Expert hinzufügen
configure-experts-filter-searchField =
  .placeholder = Nach Email oder Benutzername suchen
  .aria-label = Nach Email oder Benutzername suchen
configure-experts-filter-searchButton =
  .aria-label = Suchen
configure-experts-filter-description =
  Fügt einen Experten Badge zu Kommentaren von registrierten Nutzern nur auf dieser Seite
  hinzu. Neue Benutzer müssen sich zuerst registrieren und Kommentare auf einer Seite eröffnen
  um einen Account zu erstellen.
configure-experts-search-none-found = Es wurden keine Benutzer mit dieser Email oder Benutzername gefunden
configure-experts-
configure-experts-remove-button = Entfernen
configure-experts-load-more = Mehr laden
configure-experts-none-yet = Momentan gibt es bei diesem Q&A keine Experten
configure-experts-search-title = Nach einem Experten suchen
configure-experts-assigned-title = Experten
configure-experts-noLongerAnExpert = ist nicht länger Experte
comments-tombstone-ignore = Dieser Kommentar ist verborgen weil du {$username} ignoriert hast
comments-tombstone-showComment = Kommentare anzeigen
comments-tombstone-deleted =
  Dieser Kommentar ist nicht mehr verfügbar. Der Kommentator hat seinen Account gelöscht.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Dein Account wurde vorübergehend vom Kommentieren suspendiert
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  In Übereinstimmung mit den Community Richtlinien von { $organization } wurde dein
  Account vorübergehend suspendiert. Während du suspendiert bist, kannst du nicht
  kommentieren, Reaktionen nutzen oder Kommentare melden.
suspendInfo-until-pleaseRejoinThe =
  Bitte trete der Konversation auf { $until } wieder bei.

warning-heading = Dein Account wurde verwarnt
warning-explanation =
  In Übereinstimmung mit den Community Richtlinien wurde dein Account verwarnt.
warning-instructions =
  Um weiterhin mitmachen zu können, klicke unten bitte auf "Bestätigen".
warning-acknowledge = Bestätigen

warning-notice = Dein Account wurde verwarnt. Um weiterhin mitmachen zu können, <a>lies dir bitte die Meldung durch</a>.

profile-changeEmail-unverified = (Nicht verifiziert)
profile-changeEmail-current = (momentan)
profile-changeEmail-edit = Bearbeiten
profile-changeEmail-change = Ändern
profile-changeEmail-please-verify = Deine Email Adresse verifizieren
profile-changeEmail-please-verify-details =
  Eine Mail wurde gesendet an { $email } um deinen Account zu verifizieren.
  Du musst deine neue Email Adresse zuerst verifizieren bevor sie verwendet werden
  kann um dich einzuloggen oder um Benachrichtigungen zu erhalten.
profile-changeEmail-resend = Verifikation noch einmal senden
profile-changeEmail-heading = Deine Email Adresse bearbeiten
profile-changeEmail-changeYourEmailAddress =
  Deine Email Adresse ändern
profile-changeEmail-desc = Ändere die Email Adresse, welche zum Einloggen und für den Erhalt der Kommunikation über deinen Account, verwendet wird.
profile-changeEmail-newEmail-label = Neue Email Adresse
profile-changeEmail-password = Passwort
profile-changeEmail-password-input =
  .placeholder = Passwort
profile-changeEmail-cancel = Abbrechen
profile-changeEmail-submit = Speichern
profile-changeEmail-saveChanges = Änderungen speichern
profile-changeEmail-email = Email
profile-changeEmail-title = Email Adresse
profile-changeEmail-success = Deine Email wurde erfolgreich aktualisiert

## Ratings and Reviews

ratingsAndReviews-reviewsTab = Reviews
ratingsAndReviews-questionsTab = Fragen
ratingsAndReviews-noReviewsAtAll = Es gibt keine Reviews.
ratingsAndReviews-noQuestionsAtAll = Es gibt keine Fragen.
ratingsAndReviews-noReviewsYet = Es gibt noch keine Reviews. Schreibe den ersten.
ratingsAndReviews-noQuestionsYet = Es gibt noch keine Fragen. Stelle die erste.
ratingsAndReviews-selectARating = Wähle eine Bewertung aus
ratingsAndReviews-youRatedThis = Du hast das bewertet
ratingsAndReviews-showReview = Reviews anzeigen
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Bewerten und rezensieren
ratingsAndReviews-askAQuestion = Stelle eine Frage
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Noch keine Bewertungen
  [1] Basierend auf einer Bewertung
  *[other] Basierend auf { SHORT_NUMBER($count) } Bewertungen
}

ratingsAndReviews-allReviewsFilter = Alle Reviews
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Stern
  *[other] { $rating } Sterne
}

comments-addAReviewForm-rteLabel = Füge ein Review hinzu (optional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Zum Anfang des Artikels
stream-footer-links-top-of-comments = Zum Anfang der Kommentare
stream-footer-links-profile = Profil & Antworten
stream-footer-links-discussions = More Discussionen

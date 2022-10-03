### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Kommentare einbetten

general-moderate = Moderieren
general-archived = Archiv

general-userBoxUnauthenticated-joinTheConversation = An der Unterhaltung teilnehmen
general-userBoxUnauthenticated-signIn = Anmelden
general-userBoxUnauthenticated-register = Registrieren

general-authenticationSection =
  .aria-label = Authentifizierung

general-userBoxAuthenticated-signedIn =
  Angemeldet als
general-userBoxAuthenticated-notYou =
  Das bin ich nicht! <button>Abmelden</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Sie haben sich erfolgreich abgemeldet.

general-tabBar-commentsTab = Kommentare
general-tabBar-myProfileTab = Mein Benutzerprofil
general-tabBar-discussionsTab = Diskussionen
general-tabBar-reviewsTab = Bewertungen
general-tabBar-configure = Konfiguration

general-mainTablist =
  .aria-label = Primäre Tabliste

general-secondaryTablist =
  .aria-label = Sekundäre Tabliste

## Comment Count

comment-count-text =
  { $count ->
    [one] Kommentar
    *[other] Kommentare
  }

## Comments Tab

comments-postCommentForm-submit = Kommentar absenden
comments-stream-loadMore = Mehr laden
comments-allCommentsTab = Alle Kommentare
comments-featuredTab = Ausgewählt
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count ->
    [one] 1 Person, die diese Diskussion verfolgt
    *[other] { SHORT_NUMBER($count) } Personen, die diese Diskussion sehen
  }

comments-announcement-section =
  .aria-label = Ankündigung
comments-announcement-closeButton =
  .aria-label = Ankündigung schließen

comments-accountStatus-section =
  .aria-label = Benutzerkonto-Status

comments-featuredCommentTooltip-how = Wie wird ein Kommentar hervorgehoben?
comments-featuredCommentTooltip-handSelectedComments =
  Kommentare werden von unserem Team als lesenswert hervorgehoben.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Tooltip für hervorgehobene Kommentare
  .title = Tooltip für hervorgehobene Kommentare ein- oder ausschalten

comments-collapse-toggle =
  .aria-label = Kommentar-Thread zuklappen
comments-expand-toggle =
  .aria-label = Kommentar-Thread aufklappen
comments-bannedInfo-bannedFromCommenting = Ihr Benutzerkonto wurde für das Kommentieren gesperrt.
comments-bannedInfo-violatedCommunityGuidelines =
  Jemand mit Zugriff auf Ihr Benutzerkonto hat gegen unsere Community-Richtlinien verstoßen. Daher wurde Ihr Benutzerkonto gesperrt. Sie können nicht mehr kommentieren, Reaktionen verwenden oder Kommentare melden. Wenn Sie glauben, dass dies irrtümlich geschehen ist, wenden Sie sich bitte an unser Community-Team.

comments-noCommentsAtAll = Es gibt keine Kommentare zu diesem Beitrag.
comments-noCommentsYet = Es sind noch keine Kommentare vorhanden. Warum schreiben Sie nicht einen?

comments-streamQuery-storyNotFound = Beitrag nicht gefunden

comments-communityGuidelines-section =
  .aria-label = Community-Richtlinien

comments-commentForm-cancel = Abbrechen
comments-commentForm-saveChanges = Änderungen speichern
comments-commentForm-submit = Absenden

comments-postCommentForm-section =
  .aria-label = Einen Kommentar veröffentlichen
comments-replyList-showAll = Alle anzeigen
comments-replyList-showMoreReplies = Weitere Antworten anzeigen

comments-postComment-gifSearch = Nach einem GIF suchen
comments-postComment-gifSearch-search =
  .aria-label = Suche
comments-postComment-gifSearch-loading = Laden...
comments-postComment-gifSearch-no-results = Keine Ergebnisse gefunden für {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Unterstützt von giphy

comments-postComment-pasteImage = Bild-URL einfügen
comments-postComment-insertImage = Bild einfügen

comments-postComment-confirmMedia-youtube = Dieses YouTube-Video am Ende meines Kommentars einfügen?
comments-postComment-confirmMedia-twitter = Diesen Tweet am Ende meines Kommentars einfügen?
comments-postComment-confirmMedia-cancel = Abbrechen
comments-postComment-confirmMedia-add-tweet = Tweet hinzufügen
comments-postComment-confirmMedia-add-video = Video hinzufügen
comments-postComment-confirmMedia-remove = Entfernen
comments-commentForm-gifPreview-remove = Entfernen
comments-viewNew =
  { $count ->
    [1] Ansicht {$count} Neuer Kommentar
    *[other] Ansicht {$count} Neue Kommentare
  }
comments-loadMore = Mehr laden

comments-permalinkPopover =
  .description = Dialog, der einen Permalink zum Kommentar anzeigt
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink zum Kommentar
comments-permalinkButton-share = Teilen
comments-permalinkButton =
  .aria-label = Kommentar von {$username} teilen
comments-permalinkView-section =
  .aria-label = Einzelne Unterhaltung
comments-permalinkView-viewFullDiscussion = Vollständige Diskussion anzeigen
comments-permalinkView-commentRemovedOrDoesNotExist = Dieser Kommentar wurde entfernt oder existiert nicht.

comments-rte-bold =
  .title = Fett

comments-rte-italic =
  .title = Kursiv

comments-rte-blockquote =
  .title = Anführungszeichen

comments-rte-bulletedList =
  .title = Aufzählungsliste

comments-rte-strikethrough =
  .title = Durchgestrichen

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkasmus

comments-rte-externalImage =
  .title = Externes Bild

comments-remainingCharacters = { $remaining } verbleibende Zeichen

comments-postCommentFormFake-signInAndJoin = Anmelden und an der Unterhaltung teilnehmen

comments-postCommentForm-rteLabel = Einen Kommentar schreiben

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Antworten
comments-replyButton =
  .aria-label = Auf Kommentar von {$username} antworten

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Abschicken
comments-replyCommentForm-cancel = Abbrechen
comments-replyCommentForm-rteLabel = Eine Antwort schreiben
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Thread-Level { $level }:
comments-commentContainer-highlightedLabel = Hervorgehoben:
comments-commentContainer-ancestorLabel = Vorher:
comments-commentContainer-replyLabel =
  Antwort von { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Frage von { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Kommentar von { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Bearbeiten

comments-commentContainer-avatar =
  .alt = Avatar für { $username }

comments-editCommentForm-saveChanges = Änderungen speichern
comments-editCommentForm-cancel = Abbrechen
comments-editCommentForm-close = Schließen
comments-editCommentForm-rteLabel = Kommentar bearbeiten
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Bearbeiten: <time></time> verbleiben
comments-editCommentForm-editTimeExpired = Bearbeitungszeit abgelaufen. Sie können diesen Kommentar nicht mehr bearbeiten. Warum schreiben Sie keinen neuen?
comments-editedMarker-edited = Bearbeitet
comments-showConversationLink-readMore = Mehr aus dieser Unterhaltung lesen
comments-conversationThread-showMoreOfThisConversation =
  Mehr von dieser Unterhaltung anzeigen

## comments-permalinkView-currentViewing =
## comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Sie sehen gerade eine einzelne Unterhaltung.
comments-inReplyTo = Antwort auf <Username></Username>
comments-replyingTo = Antwort auf <Username></Username>

comments-reportButton-report = Melden
comments-reportButton-reported = Gemeldet
comments-reportButton-aria-report =
  .aria-label = Kommentar von {$username} melden
comments-reportButton-aria-reported =
  .aria-label = Gemeldet

comments-sortMenu-sortBy = Sortieren nach
comments-sortMenu-newest = Neueste
comments-sortMenu-oldest = Älteste
comments-sortMenu-mostReplies = Meiste Antworten

comments-userPopover =
  .description = Dialog mit weiteren Benutzerinformationen
comments-userPopover-memberSince = Mitglied seit: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorieren

comments-userIgnorePopover-ignoreUser = {$username} ignorieren?
comments-userIgnorePopover-description =
  Wenn Sie einen Benutzer ignorieren, werden Ihnen alle Kommentare, die dieser Benutzer auf der Website geschrieben hat, verborgen. Sie können dies später in Ihren Benutzerprofil rückgängig machen.
comments-userIgnorePopover-ignore = Ignorieren
comments-userIgnorePopover-cancel = Abbrechen

comments-userBanPopover-title = {$username} sperren?
comments-userBanPopover-description =
  Nach der Sperrung kann dieser Benutzer keine Kommentare mehr schreiben, Reaktionen verwenden oder Kommentare melden. Dieser Kommentar hier wird auch abgelehnt.
comments-userBanPopover-cancel = Abbrechen
comments-userBanPopover-ban = Sperren

comments-moderationDropdown-popover =
  .description = Dialog zur Moderation des Kommentars
comments-moderationDropdown-feature = Hervorheben
comments-moderationDropdown-unfeature = Nicht mehr hervorheben
comments-moderationDropdown-approve = Genehmigen
comments-moderationDropdown-approved = Zugelassen
comments-moderationDropdown-reject = Ablehnen
comments-moderationDropdown-rejected = Abgelehnt
comments-moderationDropdown-ban = Benutzer sperren
comments-moderationDropdown-banned = Gesperrt
## comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderationsansicht
comments-moderationDropdown-moderateStory = Beitrag moderieren
comments-moderationDropdown-caretButton =
  .aria-label = Moderieren

comments-moderationRejectedTombstone-title = Sie haben diesen Kommentar abgelehnt.
comments-moderationRejectedTombstone-moderateLink =
  Moderieren, um diese Entscheidung zu überprüfen

comments-featuredTag = Hervorgehoben

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction}-Kommentare von {$username}
    *[other] {$reaction}-Kommentare von {$username} (Gesamt: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction}-Kommentare von {$username}
    [one] {$reaction}-Kommentar von {$username}
    *[other] {$reaction}-Kommentare von {$username} (Gesamt: {$count})
  }

comments-jumpToComment-title = Ihre Antwort wurde unten gepostet.
comments-jumpToComment-GoToReply = Zur Antwort gehen

comments-mobileToolbar-closeButton =
  .aria-label = Schließen
comments-mobileToolbar-unmarkAll = Alles abwählen
comments-mobileToolbar-nextUnread = Nächstes Ungelesenes

comments-replyChangedWarning-theCommentHasJust =
  Dieser Kommentar wurde soeben bearbeitet. Die neueste Version wird oben angezeigt.

### Q&A

general-tabBar-qaTab = Fragen und Antworten

qa-postCommentForm-section =
  .aria-label = Eine Frage stellen

qa-answeredTab = Beantwortet
qa-unansweredTab = Unbeantwortet
qa-allCommentsTab = Alle

qa-answered-answerLabel =
  Antwort von {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Zur Unterhaltung
qa-answered-replies = Antworten

qa-noQuestionsAtAll =
  Es gibt keine Fragen zu diesem Beitrag.
qa-noQuestionsYet = (Noch keine Fragen)
  Es sind noch keine Fragen vorhanden. Warum stellen Sie nicht eine?
qa-viewNew =
  { $count ->
    [1] {$count} neue Frage ansehen
    *[other] {$count} neue Fragen ansehen
  }

qa-postQuestionForm-rteLabel = Eine Frage stellen
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Meiste Stimmen

qa-answered-tag = Beantwortet
qa-expert-tag = Experte

qa-reaction-vote = Abstimmen
qa-reaction-voted = Abgestimmt

qa-reaction-aria-vote = Abstimmen
  .aria-label = {$count ->
    [0] Stimmen für den Kommentar von {$username}
    *[other] ({$count}) Stimmen für den Kommentar von {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Stimmen für den Kommentar von {$username}
    [one] Stimme für den Kommentar von {$username}
    *[other] ({$count}) Stimmen für den Kommentar von {$username}
  }

qa-unansweredTab-doneAnswering = Erledigt

qa-expert-email = ({$email })

qa-answeredTooltip-how = Wie wird eine Frage beantwortet?
qa-answeredTooltip-answeredComments = (qa-answeredTooltip-answeredComments)
  Fragen werden von einem Q&A-Experten beantwortet.
qa-answeredTooltip-toggleButton =
  .aria-label = Tooltip für beantwortete Fragen
  .title = Tooltip für beantwortete Fragen ein- oder ausschalten

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Löschen des Benutzerkontos beantragt
comments-stream-deleteAccount-callOut-receivedDesc =
  Eine Anfrage zum Löschen Ihres Benutzerkontos wurde am { $date } empfangen.
comments-stream-deleteAccount-callOut-cancelDesc =
  Wenn Sie weiterhin Kommentare, Antworten oder Reaktionen hinterlassen möchten, können Sie Ihren Antrag auf Löschung Ihres Benutzerkontos bis { $date } stornieren.
comments-stream-deleteAccount-callOut-cancel =
  Antrag auf Löschen meines Benutzerkontos stornieren
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Löschen meines Benutzerkontos abbrechen

comments-permalink-copyLink = Link kopieren
comments-permalink-linkCopied = Link kopiert

### Embed Links

comments-embedLinks-showEmbeds = Eingebettete Links anzeigen
comments-embedLinks-hideEmbeds = Eingebettete Links ausblenden

comments-embedLinks-show-giphy = GIF anzeigen
comments-embedLinks-hide-giphy = GIF ausblenden

comments-embedLinks-show-youtube = Video anzeigen
comments-embedLinks-hide-youtube = Video ausblenden

comments-embedLinks-show-twitter = Tweet anzeigen
comments-embedLinks-hide-twitter = Tweet ausblenden

comments-embedLinks-show-external = Bild anzeigen
comments-embedLinks-hide-external = Bild ausblenden


### Featured Comments
comments-featured-label =
  Hervorgehobener Kommentar von {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Zur Unterhaltung
comments-featured-replies = Antworten

## Profile Tab

profile-myCommentsTab = Meine Kommentare
profile-myCommentsTab-comments = Meine Kommentare
profile-accountTab = Benutzerkonto
profile-preferencesTab = Präferenzen

### Bio
profile-bio-title = Biografie
profile-bio-description =
  Schreiben Sie eine Biografie, die in Ihrem Profil und bei Ihren Kommentaren öffentlich angezeigt wird. Sie muss weniger als 100 Zeichen umfassen.
profile-bio-remove = Entfernen
profile-bio-update = Aktualisieren
profile-bio-success = Ihre Biografie wurde erfolgreich aktualisiert.
profile-bio-removed = Ihre Biografie wurde entfernt.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Ihr Benutzerkonto wird voraussichtlich am { $date } gelöscht.
profile-accountDeletion-cancelDeletion =
  Antrag auf Löschen meines Benutzerkontos stornieren
profile-accountDeletion-cancelAccountDeletion =
  Löschen meines Benutzerkontos abbrechen

### Comment History
profile-commentHistory-section =
  .aria-label = Kommentar-Historie
profile-historyComment-commentLabel =
  Kommentare <RelativeTime></RelativeTime> zu { $storyTitle }
profile-historyComment-viewConversation = Unterhaltung anzeigen
profile-historyComment-replies = {$replyCount} Antworten
profile-historyComment-commentHistory = Kommentar-Historie
profile-historyComment-story = Beitrag: {$title}
profile-historyComment-comment-on = Kommentar zu:
profile-profileQuery-errorLoadingProfile = Fehler beim Laden des Profils
profile-profileQuery-storyNotFound = Beitrag nicht gefunden
profile-commentHistory-loadMore = Mehr laden
profile-commentHistory-empty = Sie haben keine Kommentare geschrieben.
profile-commentHistory-empty-subheading = Eine Historie Ihrer Kommentare wird hier angezeigt.

### Preferences

profile-preferences-mediaPreferences = Medienvorgaben
profile-preferences-mediaPreferences-alwaysShow = GIFs, Tweets, YouTube, etc. immer anzeigen
profile-preferences-mediaPreferences-thisMayMake = Dies kann dazu führen, dass die Kommentare langsamer geladen werden.
profile-preferences-mediaPreferences-update = Aktualisieren
profile-preferences-mediaPreferences-preferencesUpdated =
  Ihre Medienpräferenzen wurden aktualisiert.

### Account
profile-account-ignoredCommenters = Ignorierte Benutzer
profile-account-ignoredCommenters-description =
  Sie können andere Benutzer ignorieren, indem Sie auf den entsprechenden Benutzernamen klicken und Ignorieren wählen. Wenn Sie jemanden ignorieren, werden alle Kommentare vor Ihnen verborgen. Benutzer, die von Ihnen ignoriert werden, können weiterhin Ihre Kommentare sehen.
profile-account-ignoredCommenters-empty = Sie ignorieren derzeit niemanden.
profile-account-ignoredCommenters-stopIgnoring = Nicht mehr ignorieren
profile-account-ignoredCommenters-youAreNoLonger =
  Wird nicht mehr ignoriert
profile-account-ignoredCommenters-manage = Verwalten
profile-account-ignoredCommenters-cancel = Abbrechen
profile-account-ignoredCommenters-close = Schließen

profile-account-changePassword-cancel = Abbrechen
profile-account-changePassword = Passwort ändern
profile-account-changePassword-oldPassword = Altes Passwort
profile-account-changePassword-forgotPassword = Passwort vergessen?
profile-account-changePassword-newPassword = Neues Passwort
profile-account-changePassword-button = Passwort ändern
profile-account-changePassword-updated =
  Ihr Passwort wurde geändert.
profile-account-changePassword-password = Passwort

profile-account-download-comments-title = Meine Kommentar-Historie downloaden
profile-account-download-comments-description =
  Sie erhalten eine E-Mail mit einem Link zu Ihrer Kommentar-Historie. Einen Download können Sie <strong>einmal innerhalb von 14 Tagen</strong> anfordern.
profile-account-download-comments-request =
  Kommentar-Historie anfordern
profile-account-download-comments-request-icon =
  .title = Kommentar-Historie anfordern
profile-account-download-comments-recentRequest =
  Zuletzt angefordert: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Sie haben zuletzt vor weniger als 14 Tagen angefordert. Um Ihre Kommentare herunterzuladen, können Sie erneut anfordern ab: { $timeStamp }
profile-account-download-comments-requested =
  Antrag eingereicht. Sie können eine weitere Anfrage in { framework-timeago-time } stellen.
profile-account-download-comments-requestSubmitted =
  Ihre Anfrage wurde erfolgreich übermittelt. Sie können beantragen, Ihre Kommentar-Historie in { framework-timeago-time } erneut herunterzuladen.
profile-account-download-comments-error =
  Wir konnten Ihre Download-Anforderung nicht abschließen.
profile-account-download-comments-request-button = Anfrage

## Delete Account

profile-account-deleteAccount-title = Mein Benutzerkonto löschen
profile-account-deleteAccount-deleteMyAccount = Mein Benutzerkonto löschen
profile-account-deleteAccount-description =
  Wenn Sie Ihr Benutzerkonto löschen, wird Ihr Profil dauerhaft gelöscht und alle Ihre Kommentare werden von dieser Seite entfernt.
profile-account-deleteAccount-requestDelete = Löschen meines Benutzerkontos beantragen

profile-account-deleteAccount-cancelDelete-description =
  Sie haben bereits einen Antrag zum Löschen Ihres Benutzerkontos gestellt.
  Ihr Benutzerkonto wird am { $date } gelöscht.
  Sie können den Antrag bis zu diesem Zeitpunkt stornieren.
profile-account-deleteAccount-cancelDelete = Antrag auf Löschen meines Benutzerkontos stornieren

profile-account-deleteAccount-request = Antrag
profile-account-deleteAccount-cancel = Abbrechen
profile-account-deleteAccount-pages-deleteButton = Mein Benutzerkonto löschen
profile-account-deleteAccount-pages-cancel = Abbrechen
profile-account-deleteAccount-pages-proceed = Fortfahren
profile-account-deleteAccount-pages-done = Erledigt
profile-account-deleteAccount-pages-phrase =
  .aria-label = Text

profile-account-deleteAccount-pages-sharedHeader = Mein Benutzerkonto löschen

profile-account-deleteAccount-pages-descriptionHeader = Mein Benutzerkonto löschen?
profile-account-deleteAccount-pages-descriptionText =
  Sie versuchen, Ihr Benutzerkonto zu löschen. Das bedeutet:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Alle Ihre Kommentare werden von dieser Seite entfernt.
profile-account-deleteAccount-pages-allCommentsDeleted =
  Alle Ihre Kommentare werden aus unserer Datenbank gelöscht.
profile-account-deleteAccount-pages-emailRemoved =
  Ihre E-Mail-Adresse wird aus unserem System entfernt.

profile-account-deleteAccount-pages-whenHeader = Mein Benutzerkonto löschen: Wann?
profile-account-deleteAccount-pages-whenSubHeader = Wann?
profile-account-deleteAccount-pages-whenSec1Header =
  Wann wird mein Benutzerkonto gelöscht?
profile-account-deleteAccount-pages-whenSec1Content =
  Ihr Benutzerkonto wird 24 Stunden nach Übermittlung Ihres Antrags gelöscht.
profile-account-deleteAccount-pages-whenSec2Header =
  Kann ich noch Kommentare schreiben, bis mein Benutzerkonto gelöscht wird?
profile-account-deleteAccount-pages-whenSec2Content =
  Nein. Sobald Sie das Löschen Ihres Benutzerkontos beantragt haben, können Sie keine Kommentare mehr schreiben, auf Kommentare antworten oder Reaktionen auswählen.

profile-account-deleteAccount-pages-downloadCommentHeader = Meine Kommentare herunterladen?
profile-account-deleteAccount-pages-downloadSubHeader = Meine Kommentare herunterladen
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Bevor Ihr Benutzerkonto gelöscht wird, empfehlen wir Ihnen, Ihre Kommentar-Historie für Ihre Unterlagen herunterzuladen. Nachdem Ihr Benutzerkonto gelöscht wurde, können Sie Ihren Kommentarverlauf nicht mehr abrufen.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mein Profil > Meine Kommentar-Historie herunterladen

profile-account-deleteAccount-pages-confirmHeader = Löschen Ihres Benutzerkontos bestätigen?
profile-account-deleteAccount-pages-confirmSubHeader = Sind Sie sicher?
profile-account-deleteAccount-pages-confirmDescHeader =
  Sind Sie sicher, dass Sie Ihr Benutzerkonto löschen möchten?
profile-account-deleteAccount-confirmDescContent =
  Um zu bestätigen, dass Sie Ihr Benutzerkonto löschen möchten, geben Sie bitte den folgenden Text in das unten stehende Textfeld ein:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Geben Sie zur Bestätigung den folgenden Text ein:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Geben Sie Ihr Passwort ein:

profile-account-deleteAccount-pages-completeHeader = Löschen des Benutzerkontos beantragt
profile-account-deleteAccount-pages-completeSubHeader = Antrag eingereicht
profile-account-deleteAccount-pages-completeDescript =
  Ihr Antrag wurde eingereicht und eine Bestätigung an die mit Ihrem Benutzerkonto verknüpfte E-Mail-Adresse gesendet.
profile-account-deleteAccount-pages-completeTimeHeader =
  Ihr Benutzerkonto wird gelöscht am: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Sie haben es sich anders überlegt?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Melden Sie sich einfach vor diesem Zeitpunkt erneut mit ihrem Benutzernamen an und wählen Sie <strong>Antrag auf Löschen meines Benutzerkontos stornieren</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Sagen Sie uns, warum.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Wir würden gerne wissen, warum Sie Ihr Benutzerkonto löschen lassen wollen. Senden Sie uns Feedback, indem Sie eine E-Mail an: { $email } senden.
profile-account-changePassword-edit = Bearbeiten
profile-account-changePassword-change = Ändern


## Notifications
profile-notificationsTab = Benachrichtigungen
profile-account-notifications-emailNotifications = E-Mail-Benachrichtigungen
profile-account-notifications-emailNotifications = E-Mail-Benachrichtigungen
profile-account-notifications-receiveWhen = Benachrichtigungen erhalten, wenn:
profile-account-notifications-onReply = Mein Kommentar eine Antwort erhält
profile-account-notifications-onFeatured = Mein Kommentar hervorgehoben wird
profile-account-notifications-onStaffReplies = Ein Mitglied des Teams auf meinen Kommentar antwortet
profile-account-notifications-onModeration = Mein ausstehender Kommentar überprüft wurde
profile-account-notifications-sendNotifications = Benachrichtigungen senden:
profile-account-notifications-sendNotifications-immediately = Unmittelbar
profile-account-notifications-sendNotifications-daily = Täglich
profile-account-notifications-sendNotifications-hourly = Stündlich
profile-account-notifications-updated = Ihre Benachrichtigungseinstellungen wurden aktualisiert.
profile-account-notifications-button = Benachrichtigungseinstellungen aktualisieren
profile-account-notifications-buttonon-update = Aktualisieren

## Report Comment Popover
comments-reportPopover =
  .description = Dialog zum Melden von Kommentaren
comments-reportPopover-reportThisComment = Diesen Kommentar melden
comments-reportPopover-whyAreYouReporting = Warum melden Sie diesen Kommentar?

comments-reportPopover-reasonOffensive = Dieser Kommentar ist beleidigend.
comments-reportPopover-reasonAbusive = Dieser Benutzer ist beleidigend.
comments-reportPopover-reasonIDisagree = Ich stimme mit diesem Kommentar nicht überein.
comments-reportPopover-reasonSpam = Das sieht nach Werbung oder Marketing aus.
comments-reportPopover-reasonOther = Sonstiges

comments-reportPopover-additionalInformation =
  Zusätzliche Informationen <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Bitte hinterlassen Sie alle zusätzlichen Informationen, die für unsere Moderatoren hilfreich sein könnten.

comments-reportPopover-maxCharacters = Maximal { $maxCharacters } Zeichen
comments-reportPopover-restrictToMaxCharacters = Bitte beschränken Sie Ihre Informationen auf { $maxCharacters } Zeichen.
comments-reportPopover-cancel = Abbrechen
comments-reportPopover-submit = Abschicken

comments-reportPopover-thankYou = Vielen Dank!
comments-reportPopover-receivedMessage =
  Wir haben Ihre Nachricht erhalten. Informationen von Mitgliedern wie Ihnen sorgen für die Sicherheit der Community.

comments-reportPopover-dismiss = Ablehnen

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Diesen Kommentar melden
comments-archivedReportPopover-doesThisComment =
  Verletzt dieser Kommentar unsere Community-Richtlininien? Ist er beleidigend oder SPAM? Senden Sie eine E-Mail an unser Moderationsteam bei <a>{ $orgName }</a> mitsamt eines Links zum Kommentar und einer kurzen Erklärung.
comments-archivedReportPopover-needALink =
  Sie benötigen den Link zum Kommentar?
comments-archivedReportPopover-copyLink = Link kopieren

comments-archivedReportPopover-emailSubject = Kommentar melden
comments-archivedReportPopover-emailBody =
  Ich möchte den folgenden Kommentar melden:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Ich habe dafür folgende Gründe:

## Submit Status
comments-submitStatus-dismiss = Ablehnen
comments-submitStatus-submittedAndWillBeReviewed =
  Ihr Kommentar wurde abgeschickt und wird von einem Moderator geprüft.
comments-submitStatus-submittedAndRejected =
  Dieser Kommentar wurde wegen Verstoßes gegen unsere Richtlinien abgelehnt

# Configure
configure-configureQuery-errorLoadingProfile = Fehler
configure-configureQuery-storyNotFound = Beitrag nicht gefunden

## Archive
configure-archived-title = Dieser Kommentarverlauf wurde archiviert.
configure-archived-onArchivedStream =
  Bei archivierten Kommentarverläufen dürfen keine neuen Kommentare, Reaktionen oder Meldungen eingereicht werden. Außerdem können die Kommentare nicht moderiert werden.
configure-archived-toAllowTheseActions =
  Um diese Aktionen zu erlauben, nehmen Sie die Archivierung des Kommentarverläufs zurück.
configure-archived-unarchiveStream =  Nicht mehr archivieren

## Change username
profile-changeUsername-username = Benutzername
profile-changeUsername-success = Ihr Benutzername wurde erfolgreich geändert.
profile-changeUsername-edit = Bearbeiten
profile-changeUsername-change = Ändern
profile-changeUsername-heading = Meinen Benutzernamen bearbeiten
profile-changeUsername-heading-changeYourUsername = Meinen Benutzernamen ändern
profile-changeUsername-desc = Änderung des Benutzernamens für alle meine vergangenen und zukünftigen Kommentare. <strong>Benutzernamen können einmal innerhalb von { framework-timeago-time } geändert werden.</strong>
profile-changeUsername-desc-text = Änderung des Benutzernamens für alle meine vergangenen und zukünftigen Kommentare. Benutzernamen können einmal innerhalb von { framework-timeago-time } geändert werden.
profile-changeUsername-current = Aktueller Benutzername
profile-changeUsername-newUsername-label = Neuer Benutzername
profile-changeUsername-confirmNewUsername-label = Bestätigung des neuen Benutzernamens
profile-changeUsername-cancel = Abbrechen
profile-changeUsername-save = Speichern
profile-changeUsername-saveChanges = Änderungen speichern
profile-changeUsername-recentChange = Ihr Benutzername wurde kürzlich geändert. Sie können Ihren Benutzernamen ab { $nextUpdate } erneut ändern.
profile-changeUsername-youChangedYourUsernameWithin =
  Sie haben Ihren Benutzernamen innerhalb der vergangenen { framework-timeago-time } geändert. Sie können Ihren Benutzernamen erneut ändern ab: { $nextUpdate }.
profile-changeUsername-close = Schließen

## Discussions tab

discussions-mostActiveDiscussions = Die meisten aktiven Diskussionen
discussions-mostActiveDiscussions-subhead = Geordnet nach den meisten Kommentaren, die in den vergangenen 24 Stunden auf { $siteName } eingegangen sind
discussions-mostActiveDiscussions-empty = Sie haben sich an keinen Diskussionen beteiligt
discussions-myOngoingDiscussions = Meine laufenden Diskussionen
discussions-myOngoingDiscussions-subhead = Wo ich in { $orgName } kommentiert habe
discussions-viewFullHistory = Vollständige Kommentar-Historie anzeigen
discussions-discussionsQuery-errorLoadingProfile = Fehler beim Laden des Profils
discussions-discussionsQuery-storyNotFound = Beitrag nicht gefunden

## Comment Stream
## configure-stream-title =
configure-stream-title-configureThisStream =
  Diesen Kommentarverlauf konfigurieren
## configure-stream-apply =
configure-stream-update = Aktualisieren
configure-stream-streamHasBeenUpdated =
  Dieser Kommentarverlauf wurde aktualisiert.

## configure-premod-title =
configure-premod-premoderateAllComments = Alle Kommentare vormoderieren
configure-premod-description =
  Moderatoren müssen jeden Kommentar genehmigen, bevor er in diesem Beitrag veröffentlicht wird.

## configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Kommentare mit Links vormoderieren
configure-premodLink-description =
  Moderatoren müssen jeden Kommentar, der einen Link enthält, genehmigen, bevor er in diesem Beitrag veröffentlicht wird.

## configure-messageBox-title =
configure-addMessage-title =
  Nachricht oder Frage hinzufügen
## configure-messageBox-description =
configure-addMessage-description =
  Fügen Sie eine Nachricht am oberen Rand des Kommentarfeldes für Ihre Leser hinzu. Verwenden Sie dies, um ein Thema aufzugreifen, eine Frage zu stellen oder Ankündigungen zu diesem Beitrag zu machen.
configure-addMessage-addMessage = Nachricht hinzufügen
configure-addMessage-removed = Die Nachricht wurde entfernt.
config-addMessage-messageHasBeenAdded =
  Die Nachricht wurde dem Kommentarfeld hinzugefügt.
configure-addMessage-remove = Entfernen
configure-addMessage-submitUpdate = Aktualisieren
configure-addMessage-cancel = Abbrechen
configure-addMessage-submitAdd = Nachricht hinzufügen

configure-messageBox-preview = Vorschau
configure-messageBox-selectAnIcon = Ein Symbol auswählen
configure-messageBox-iconConversation = Unterhaltung
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Hilfe
configure-messageBox-iconWarning = Warnung
configure-messageBox-iconChatBubble = Chat-Blase
configure-messageBox-noIcon = Kein Symbol
configure-messageBox-writeAMessage = Eine Nachricht schreiben

## configure-closeStream-title =
configure-closeStream-closeCommentStream =
   Schließen
configure-closeStream-description =
  Dieser Kommentarverlauf ist derzeit geöffnet. Durch das Schließen dieses Kommentarverlaufs   können keine neuen Kommentare abgegeben werden. Ale zuvor abgegebenen Kommentare werden weiterhin angezeigt.
configure-closeStream-closeStream = Verlauf schließen
configure-closeStream-theStreamIsNowOpen = Der Verlauf ist jetzt offen.

configure-openStream-title = Verlauf öffnen
configure-openStream-description = Der Verlauf ist jetzt offen.
  Dieser Kommentarverlauf ist derzeit geschlossen. Durch das Öffnen dieses Kommentarverlaufs können neue Kommentare eingereicht und angezeigt werden.
configure-openStream-openStream = Verlauf öffnen
configure-openStream-theStreamIsNowClosed = Der Verlauf ist jetzt geschlossen.

## configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Das Q&A-Format befindet sich derzeit in Entwicklung. Bitte kontaktieren uns mit jeglichem Feedback oder Anfragen.

## configure-enableQA-title =
configure-enableQA-switchToQA =
  Zum Q&A-Format wechseln
configure-enableQA-description =
  Das Q&A-Format erlaubt es Community-Mitgliedern, Fragen zu stellen, die von ausgewählten
  Experten beantwortet werden.
configure-enableQA-enableQA = Zu Q&A wechseln
configure-enableQA-streamIsNowComments =
  Der Verlauf ist jetzt im Kommentarformat.

configure-disableQA-title = Q&A konfigurieren
configure-disableQA-description =
  Das Q&A-Format erlaubt es Community-Mitgliedern, Fragen zu stellen, die von ausgewählten
  Experten beantwortet werden.
configure-disableQA-disableQA = Zu Kommentaren wechseln
configure-disableQA-streamIsNowQA =
  Der Verlauf ist jetzt im Q&A-Format

configure-experts-title = Einen Experten hinzufügen
configure-experts-filter-searchField =
  .placeholder = Suche nach E-Mail-Adresse oder Benutzername
  .aria-label = Suche nach E-Mail-Adresse oder Benutzername
configure-experts-filter-searchButton =
  .aria-label = Suche
configure-experts-filter-description =
  Fügt den Kommentaren von registrierten Benutzern auf dieser Seite ein Expertenabzeichen hinzu. Neue Benutzer müssen sich erst anmelden und die Kommentare auf einer Seite öffnen, um ihr Benutzerkonto erstellen zu können.
configure-experts-search-none-found = Es wurden keine Benutzer mit dieser E-Mail-Adresse oder diesem Benutzernamen gefunden.
## configure-experts-
configure-experts-remove-button = Entfernen
configure-experts-load-more = Mehr laden
configure-experts-none-yet = Es gibt derzeit keine Experten für dieses Q&A.
configure-experts-search-title = Suche nach einem Experten
configure-experts-assigned-title = Experten
configure-experts-noLongerAnExpert = ist nicht länger ein Experte
comments-tombstone-ignore = Dieser Kommentar ist ausgeblendet, weil Sie {$username} derzeit ignorieren.
comments-tombstone-showComment = Kommentar anzeigen
comments-tombstone-deleted =
  Dieser Kommentar ist nicht mehr verfügbar. Der Benutzer hat sein Benutzerkonto gelöscht.
comments-tombstone-rejected =
  Dieser Benutzer wurde von einem Moderator wegen Verstoßes gegen unsere Community-Richtlinien gesperrt.

## suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Ihr Benutzerkonto wurde vorübergehend für Kommentare gesperrt.
## suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  In Übereinstimmung mit den Community-Richtlinien von { $organisation } wurde Ihr Benutzerkonto vorübergehend gesperrt. Während der Sperrung können Sie keine Kommentare verfassen, Reaktionen verwenden oder Kommentare melden.
suspendInfo-until-pleaseRejoinThe =
  Bitte nehmen Sie bis { $until } wieder an der Unterhaltung teil.

warning-heading = Warnung für mein Benutzerkonto
warning-explanation =
  In Übereinstimmung mit unseren Community-Richtlinien wurde für Ihr Benutzerkonto eine Verwarnung ausgesprochen.
warning-instructions =
  Um sich weiter an den Diskussionen zu beteiligen, klicken Sie bitte auf den Button "Bestätigen".
warning-acknowledge = Bestätigen

warning-notice = Für Ihr Benutzerkonto wurde eine Warnung ausgesprochen. Um sich weiter zu beteiligen, <a>prüfen Sie bitte die Warnmeldung</a>.

modMessage-heading = Moderator-Nachricht für mein Benutzerkonto
modMessage-acknowledge = Bestätigen

profile-changeEmail-unverified = (Nicht verifiziert)
profile-changeEmail-current = (Aktuell)
profile-changeEmail-edit = Bearbeiten
profile-changeEmail-change = Ändern
profile-changeEmail-please-verify = Meine E-Mail-Adresse verifizieren
profile-changeEmail-please-verify-details =
  Es wurde eine E-Mail an { $email } gesendet, um Ihr Benutzerkonto zu verifizieren. Sie müssen Ihre neue E-Mail-Adresse verifizieren, bevor Sie sich mit ihr anmelden oder Benachrichtigungen erhalten können.
profile-changeEmail-resend = Erneut verifizieren
profile-changeEmail-heading = E-Mail-Adresse bearbeiten
profile-changeEmail-changeYourEmailAddress =
  E-Mail-Adresse ändern
profile-changeEmail-desc = Ändernung der E-Mail-Adresse, mit der Sie sich anmelden und Mitteilungen über Ihr Benutzerkonto erhalten.
profile-changeEmail-newEmail-label = Neue E-Mail-Adresse
profile-changeEmail-password = Passwort
profile-changeEmail-password-input =
  .placeholder = Passwort
profile-changeEmail-cancel = Abbrechen
profile-changeEmail-submit = Speichern
profile-changeEmail-saveChanges = Änderungen speichern
profile-changeEmail-email = E-Mail-Adresse
profile-changeEmail-title = E-Mail Adresse
profile-changeEmail-success = Ihre E-Mail-Adresse wurde erfolgreich aktualisiert.

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Eine Bewertung abgeben oder eine Frage stellen

ratingsAndReviews-reviewsTab = Bewertungen
ratingsAndReviews-questionsTab = Fragen
ratingsAndReviews-noReviewsAtAll = Es gibt keine Bewertungen.
ratingsAndReviews-noQuestionsAtAll = Es sind keine Fragen vorhanden.
ratingsAndReviews-noReviewsYet = Es gibt noch keine Bewertungen. Warum schreiben Sie nicht eine?
ratingsAndReviews-noQuestionsYet = Es gibt noch keine Fragen. Warum stellen Sie nicht eine?
ratingsAndReviews-selectARating = Wählen Sie eine Bewertung aus.
ratingsAndReviews-youRatedThis = Sie haben das bewertet.
ratingsAndReviews-showReview = Bewertung anzeigen
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Bewerten und überprüfen
ratingsAndReviews-askAQuestion = Eine Frage stellen
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Noch keine Bewertungen
  [1] Eine Bewertung
  *[other] { SHORT_NUMBER($count) } Bewertungen
}

ratingsAndReviewss-allReviewsFilter = Alle Bewertungen
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Stern
  *[other] { $rating } Sterne
}

comments-addAReviewForm-rteLabel = Eine Bewertung hinzufügen (optional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Anfang des Artikels
  .title = Zum Anfang des Artikels gehen.
stream-footer-links-top-of-comments = Anfang der Kommentare
  .title = Zum Anfang der Kommentare gehen.
stream-footer-links-profile = Profil & Antworten
  .title = Zum Profil und den Antworten gehen.
stream-footer-links-discussions = Weitere Diskussionen
  .title = Zu weiteren Diskussionen gehen.
stream-footer-navigation =
  .aria-label = Kommentar-Fußzeile

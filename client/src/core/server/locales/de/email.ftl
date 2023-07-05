# Account Notifications

email-footer-accountNotification =
  Gesendet von <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Passwort zurücksetzen
email-template-accountNotificationForgotPassword =
  Hallo { $username },<br/><br/>
  Wir haben eine Anfrage erhalten, das Passwort auf <a data-l10n-name="organizationName">{ $organizationName }</a> zurückzusetzen.<br/><br/>
  Bitte folge diesem Link, um das Passwort zurückzusetzen: <a data-l10n-name="resetYourPassword">Klicke hier um das Passwort zurückzusetzen</a><br/><br/>
  <i>Wenn Du diese Anfrage nicht getätigt hast, kannst Du diese Email ignorieren.</i><br/>

email-subject-accountNotificationBan = Dein Konto wurde gesperrt
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Wenn Du denkst, dass Du irrtümlich gesperrt wurdest, kontaktiere bitte unser
  Team, indem Du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationPasswordChange = Dein Passwort wurde geändert
email-template-accountNotificationPasswordChange =
  Hallo { $username },<br/><br/>
  Das Passwort für Dein Konto wurde geändert.<br/><br/>
  Falls Du diese Änderung nicht vorgenommen hast, kontaktiere bitte unser Team,
  indem Du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationUpdateUsername = Dein Benutzername wurde geändert
email-template-accountNotificationUpdateUsername =
  Hallo { $username },<br/><br/>
  Danke für die Aktualisierung Deiner { $organizationName } Kontoinformationen. Deine Änderungen sind sofort aktiv. <br /><br />
  Falls Du diese Änderung nicht vorgenommen hast, kontaktiere bitte unser Team,
  indem Du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationSuspend = Dein Konto wurde suspendiert
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Wenn Du denkst, dass Du irrtümlich suspendiert wurdest, kontaktiere bitte unser
  Team, indem Du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationConfirmEmail = Email Adresse bestätigen
email-template-accountNotificationConfirmEmail =
  Hallo { $username },<br/><br/>
  Um Deine Email Adresse für das Kommentieren auf { $organizationName } zu bestätigen,
  folge bitte diesem Link: <a data-l10n-name="confirmYourEmail">Klicke hier um deine Email Adresse zu bestätigen</a><br/><br/>
  Falls Du kürzlich kein Konto zum Kommentieren auf
  { $organizationName } erstellt hast, kannst Du diese Email ignorieren.

email-subject-accountNotificationInvite = Coral Team Einladung
email-template-accountNotificationInvite =
  Du wurdest eingeladen um dem { $organizationName } Team auf Coral beizutreten. Finalisiere
  Deine Kontoerstellung <a data-l10n-name="invite">hier</a>.

email-subject-accountNotificationDownloadComments = Deine Kommentare sind bereit für den Download
email-template-accountNotificationDownloadComments =
  Deine Kommentare auf { $organizationName } vom { $date } sind jetzt für den Download bereit.<br /><br />
  <a data-l10n-name="downloadUrl">Meinen Kommentarverlauf herunterladen</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Dein Kommentatoren-Konto wird gelöscht
email-template-accountNotificationDeleteRequestConfirmation =
  Wir haben eine Anfrage zur Löschung Deines Kommentatoren-Kontos erhalten.
  Dein Konto wird am { $requestDate } gelöscht.<br /><br />
  Anschliessend werden alle Deine Kommentare von der Seite entfernt,
  aus der Datenbank gelöscht und Dein Benutzername und Deine Email Adresse
  werden aus unserem System entfernt. <br /><br />
  Falls Du Deine Meinung änderst, kannst Du Dich in Dein Konto einloggen
  und die Löschanfrage vor dem Löschdatum abbrechen.

email-subject-accountNotificationDeleteRequestCancel =
  Dein Antrag zur Konto-Löschung wurde abgebrochen
email-template-accountNotificationDeleteRequestCancel =
  Du hast Deinen Antrag zur Konto-Löschung auf { $organizationName } abgebrochen.
  Dein Konto wird nun reaktiviert.

email-subject-accountNotificationDeleteRequestCompleted =
  Dein Konto wurde gelöscht
email-template-accountNotificationDeleteRequestCompleted =
  Dein Kommentatoren-Konto auf { $organizationName } ist jetzt gelöscht. Wir bedauern, Dich
  gehen zu sehen! <br /><br />
  Wenn du der Diskussion in Zukunft wieder beitreten willst, kannst Du Dich mit einem
  neuen Account registrieren. <br /><br />
  Wenn Du uns ein Feedback geben möchtest, weshalb Du gegangen bist und wie wir unsere
  Diskussionserfahrung besser machen können, kannst Du uns über "Kontakt" auf unserer
  Seite kontaktieren.

# Notification

email-footer-notification =
  Gesendet von <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Von Benachrichtigungen abmelden</a>

## On Reply

email-subject-notificationOnReply = Jemand hat auf Deinen Kommentar auf { $organizationName } geantwortet
email-template-notificationOnReply =
  { $authorUsername } hat eine Antwort auf <a data-l10n-name="commentPermalink">Deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> geschrieben.

## On Featured

email-subject-notificationOnFeatured = Eine Deiner Kommentare wurde auf { $organizationName } hervorgehoben
email-template-notificationOnFeatured =
  Ein Mitglied unseres Teams hat <a data-l10n-name="commentPermalink">Deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> hervorgehoben.

## On Staff Reply

email-subject-notificationOnStaffReply = Jemand von { $organizationName } hat auf Deinen Kommentar geantwortet
email-template-notificationOnStaffReply =
  { $authorUsername } von { $organizationName } hat auf <a data-l10n-name="commentPermalink">Deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> geantwortet.

## On Comment Approved

email-subject-notificationOnCommentApproved = Dein Kommentar auf { $organizationName } wurde veröffentlicht
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Danke für das Einsenden deines Kommentars. Dein Kommentar wurde veröffentlicht: <a data-l10n-name="commentPermalink">Kommentar ansehen</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Dein Kommentar auf { $organizationName } wurde abgelehnt
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  Dein Kommentar entspricht leider nicht unseren Richtlinien und wurde darum entfernt.

# Notification Digest

email-subject-notificationDigest = Deine letzten Kommentar-Aktivitäten auf { $organizationName }

email-subject-testSmtpTest = Test Email von Coral
email-template-testSmtpTest = Das ist ein Test Email gesendet an { $email }

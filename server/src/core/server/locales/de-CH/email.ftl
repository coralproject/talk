# Account Notifications

email-footer-accountNotification =
  Gesendet von <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Passwort zurücksetzen
email-template-accountNotificationForgotPassword =
  Hallo { $username },<br/><br/>
  Wir haben eine Anfrage erhalten, das Passwort auf <a data-l10n-name="organizationName">{ $organizationName }</a> zurückzusetzen.<br/><br/>
  Bitte folge diesem Link, um das Passwort zurückzusetzen: <a data-l10n-name="resetYourPassword">Klicke hier um das Passwort zurückzusetzen</a><br/><br/>
  <i>Wenn du diese Anfrage nicht getätigt hast, kannst du diese Email ignorieren.</i><br/>

email-subject-accountNotificationBan = Dein Account wurde gesperrt
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Wenn du denkst, dass du irrtümlich gesperrt wurdest, kontaktiere bitte unser
  Team, indem du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationPasswordChange = Dein Passwort wurde geändert
email-template-accountNotificationPasswordChange =
  Hallo { $username },<br/><br/>
  Das Passwort für deinen Account wurde geändert.<br/><br/>
  Falls du diese Änderung nicht vorgenommen hast, kontaktiere bitte unser Team,
  indem du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationUpdateUsername = Dein Benutzername wurde geändert
email-template-accountNotificationUpdateUsername =
  Hallo { $username },<br/><br/>
  Danke für die Aktualisierung deiner { $organizationName } Account Informationen. Deine Änderungen sind sofort aktiv. <br /><br />
  Falls du diese Änderung nicht vorgenommen hast, kontaktiere bitte unser Team,
  indem du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationSuspend = Dein Account wurde suspendiert
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Wenn du denkst, dass du irrtümlich suspendiert wurdest, kontaktiere bitte unser
  Team, indem du auf unserer Seite auf "Kontakt" gehst.

email-subject-accountNotificationConfirmEmail = Email Adresse bestätigen
email-template-accountNotificationConfirmEmail =
  Hallo { $username },<br/><br/>
  Um deine Email Adresse für das Kommentieren auf { $organizationName } zu bestätigen, 
  folge bitte diesem Link: <a data-l10n-name="confirmYourEmail">Klicke hier um deine Email Adresse zu bestätigen</a><br/><br/>
  Falls du kürzlich keinen Account zum Kommentieren auf 
  { $organizationName } erstellt hast, kannst du diese Email ignorieren.

email-subject-accountNotificationInvite = Coral Team Einladung
email-template-accountNotificationInvite =
  Du wurdest eingeladen um dem { $organizationName } Team auf Coral beizutreten. Beende 
  deine Account Erstellung <a data-l10n-name="invite">hier</a>.

email-subject-accountNotificationDownloadComments = Deine Kommentare sind bereit für den Download
email-template-accountNotificationDownloadComments =
  Deine Kommentare auf { $organizationName } vom { $date } sind jetzt für den Download bereit.<br /><br />
  <a data-l10n-name="downloadUrl">Meinen Kommentarverlauf herunterladen</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Dein Kommentatoren Account wird gelöscht
email-template-accountNotificationDeleteRequestConfirmation =
  Wir haben eine Anfrage zur Löschung deines Kommentatoren Accounts erhalten.
  Dein Account wird am { $requestDate } gelöscht.<br /><br />
  Anschliessend werden alle deine Kommentare von der Seite entfernt,
  von der Datenbank gelöscht und dein Benutzername und deine Email Adresse 
  werden von unserem System entfernt. <br /><br />
  Falls du deine Meinung änderst, kannst du dich in deinen Account einloggen
  und die Löschanfrage vor dem Löschdatum abbrechen.

email-subject-accountNotificationDeleteRequestCancel =
  Dein Antrag zur Account-Löschung wurde abgebrochen
email-template-accountNotificationDeleteRequestCancel =
  Du hast deinen Antrag zur Account-Löschung auf { $organizationName } abgebrochen.
  Dein Account wird nun reaktiviert.

email-subject-accountNotificationDeleteRequestCompleted =
  Dein Account wurde gelöscht
email-template-accountNotificationDeleteRequestCompleted =
  Dein Kommentatoren-Account auf { $organizationName } ist jetzt gelöscht. Wir bedauern dich 
  gehen zu sehen! <br /><br />
  Wenn du der Diskussion in Zukunft wieder beitreten willst, kannst du dich mit einem 
  neuen Account registrieren. <br /><br />
  Wenn du uns ein Feedback geben möchtest, weshalb du gegangen bist und wie wir unsere
  Diskussionserfahrung besser machen können, kannst du uns über "Kontakt" auf unserer
  Seite kontaktieren.

# Notification

email-footer-notification =
  Gesendet von <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Von Benachrichtigungen abmelden</a>

## On Reply

email-subject-notificationOnReply = Jemand hat auf deinen Kommentar auf { $organizationName } geantwortet
email-template-notificationOnReply =
  { $authorUsername } hat eine Antwort auf <a data-l10n-name="commentPermalink">deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> geschrieben.

## On Featured

email-subject-notificationOnFeatured = Eine deiner Kommentare wurde auf { $organizationName } hervorgehoben
email-template-notificationOnFeatured =
  Ein Mitglied unseres Teams hat <a data-l10n-name="commentPermalink">deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> hervorgehoben.

## On Staff Reply

email-subject-notificationOnStaffReply = Jemand von { $organizationName } hat auf deinen Kommentar geantwortet
email-template-notificationOnStaffReply =
  { $authorUsername } von { $organizationName } hat auf <a data-l10n-name="commentPermalink">deinen Kommentar</a> zu <a data-l10n-name="storyLink">{ $storyTitle }</a> geantwortet.

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

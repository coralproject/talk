# Account Notifications

email-footer-accountNotification =
  Wysłane przez <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Żądanie zmiany hasła
email-template-accountNotificationForgotPassword =
  Hej { $username },<br/><br/>
  Otrzymaliśmy żądanie zmiany hasła na <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Prosimy o kliknięcie tego linku, żeby zmienić hasło: <a data-l10n-name="resetYourPassword">Kliknij tu, żeby zmienić hasło</a><br/><br/>
  <i>Jeśli nie wysyłaś/eś takiej prośby, zignoruj tego maila.</i><br/>

email-subject-accountNotificationBan = Twoje konto zostało zbanowane
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Jeśli uważasz, że stało się tak w wyniku pomyłki, skontaktuj się z naszym zespołem
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Twoje hasło zostało zmienione
email-template-accountNotificationPasswordChange =
  Hej { $username },<br/><br/>
  Hasło do Twojego konta zostało zmienione.<br/><br/>
  Jeśli stało się to bez Twojej wiedzy,
  skontaktuj się z naszym zespołem <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Twój login został zmieniony
email-template-accountNotificationUpdateUsername =
  Hej { $username },<br/><br/>
  Dziękujemy za zaktualizowanie danych Twojego konta w { $organizationName }.
  Dokonane zmiany będą widoczne od razu.<br /><br />
  Jeśli stało się to bez Twojej wiedzy, skontaktuj się z naszym zespołem <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Twoje konto zostało zawieszone
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Jeśli uważasz, że stało się tak w wyniku pomyłki, skontaktuj się z naszym zespołem
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Potwierdź email
email-template-accountNotificationConfirmEmail =
  Hej { $username },<br/><br/>
  Żeby potwierdzić Twój adres email, wykorzystywany do konta komentatora w { $organizationName },
  przejdź na tę stronę: <a data-l10n-name="confirmYourEmail">Potwierdź adres email</a><br/><br/>
  Jeśli ostatnio nie zakładałaś/eś takiego konta na
  { $organizationName }, możesz spokojnie zignorować ten email.

email-subject-accountNotificationInvite = Zaproszenie Coral Team
email-template-accountNotificationInvite =
  To jest zaproszenie do dołączenia do zespołu { $organizationName } na Coral. Dokończ
  ustawianie swojego konta <a data-l10n-name="invite">tutaj</a>.

email-subject-accountNotificationDownloadComments = Twoje komentarze są gotowe do pobrania
email-template-accountNotificationDownloadComments =
  Twoje komentarze na { $organizationName } są od { $date } gotowe do pobrania.<br /><br />
  <a data-l10n-name="downloadUrl">Pobierz swoje archiwum komentarzy</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Twoje konto komentarzy zostało zaplanowane do usunięcia
email-template-accountNotificationDeleteRequestConfirmation =
  Otrzymaliśmy żądanie usunięcia Twojego konta komentatora.
  Twoje konto zostanie usunięte { $requestDate }.<br /><br />
  Tego dnia Twoje komentarze zostaną usunięte ze strony i
  bazy danych a Twój login i hasło usunięte z naszego systemu.<br /><br />
  Jeśli zmienisz zdanie, możesz się zalogować ponownie i
  anulować usunięcie, ale musisz to zrobić przed terminem
  planowanego usunięcia konta.

email-subject-accountNotificationDeleteRequestCancel =
  Żądanie usunięcia konta zostało anulowane
email-template-accountNotificationDeleteRequestCancel =
  Anulowano żądanie usunięcia twojego konta na { $organizationName }.
  Twoje konto jest znów aktywne.

email-subject-accountNotificationDeleteRequestCompleted =
  Twoje konto zostało usunięte
email-template-accountNotificationDeleteRequestCompleted =
  Konto komentatora na { $organizationName } zostało usunięte. Żałujemy rozstania!<br /><br />
  Jeśli postanowisz wrócić do dyskusji w przyszłości, możesz się zarejestrować
  ponownie i założyć nowe konto.<br /><br />
  Jeśli chcesz nam przekazać swoją opinię, żebyśmy mogli zrozumieć dlaczego
  nas opuszczasz i co możemy, żeby poprawić jakość naszego ssystemu komentarzy
  wyślij nam wiadomość { $organizationContactEmail }.

# Notification

email-footer-notification =
  Wysłane przez<a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Wycofaj subskrypcję powiadomień</a>

## On Reply

email-subject-notificationOnReply = Ktoś odpowiada na Twój komentarz na { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } odpowiada na <a data-l10n-name="commentPermalink">Twój komentarz</a> opublikowany do <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = Twój komentarz został wyróżniony na { $organizationName }
email-template-notificationOnFeatured =
  Pracownik naszej redakcji wyróżnił Twój <a data-l10n-name="commentPermalink">komentarz</a> do <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Staff Reply

email-subject-notificationOnStaffReply = Ktoś odpowiada na Twój komentarz na { $organizationName }
email-template-notificationOnStaffReply =
  { $authorUsername } z { $organizationName } odpowiada na <a data-l10n-name="commentPermalink">komentarz</a>, który dodałaś/eś do <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Twój komentarz został opublikowany na { $organizationName }
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Dziękujemy za napisanie komentarza. Został on właśnie opublikowany: <a data-l10n-name="commentPermalink">Zobacz go</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Twój komentarz na { $organizationName } nie został opublikowany
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  Język, którego użyłaś/eś w jednym ze swoim komentarzy, nie jest zgodny z zasadami naszej społeczności i Twój komentarz został usunięty.

# Notification Digest

email-subject-notificationDigest = Twoja aktywność na { $organizationName }

email-subject-testSmtpTest = Testowa wiadomość z Coral
email-template-testSmtpTest = To jest testowa wiadomość wysłana na adres { $email }

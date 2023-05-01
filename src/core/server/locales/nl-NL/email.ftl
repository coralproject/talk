# Account Notifications

email-footer-accountNotification =
  Verstuurd door <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Wachtwoord Reset Aanvraag
email-template-accountNotificationForgotPassword =
  Hi { $username },<br/><br/>
  We hebben een verzoek ontvangen om je wachtwoord opnieuw in te stellen op <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Volg deze link om je wachtwoord te herstellen: <a data-l10n-name="resetYourPassword">Klik hier om je wachtwoord opnieuw in te stellen</a><br/><br/>
  <i>Als je hier niet om hebt gevraagd, kun je deze e-mail negeren.</i><br/>

email-subject-accountNotificationBan = Je account is verbannen
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
 Als je denkt dat dit ten onrechte is gedaan, neem dan contact op met
 ons <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Je wachtwoord is gewijzigd
email-template-accountNotificationPasswordChange =
  Hi { $username },<br/><br/>
  Het wachtwoord op je account is gewijzigd.<br/><br/>
  Als je deze wijziging niet hebt aangevraagd,
  neem dan contact op met ons: <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Je gebruikersnaam is gewijzigd
email-template-accountNotificationUpdateUsername =
  Hi { $username },<br/><br/>
  Bedankt voor het bijwerken van de accountgegevens van { $organizationName }. De door jou aangebrachte wijzigingen zijn onmiddellijk van kracht.<br /><br />
  Als je deze wijziging niet hebt aangebracht, neem dan contact op met ons via: <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Je account is geschorst
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Als je denkt dat dit ten onrechte is gedaan, neem dan contact op met
  ons <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Bevestig E-mail
email-template-accountNotificationConfirmEmail =
  Hi { $username },<br/><br/>
  Om je e-mailadres te bevestigen voor gebruik met je reactieaccount op { $organizationName },
  volg deze link: <a data-l10n-name="confirmYourEmail">Klik hier om je e-mail te bevestigen</a><br/><br/>
  Als je niet onlangs een reactieaccount hebt gemaakt met
   { $organizationName }, kun je deze e-mail veilig negeren.

email-subject-accountNotificationInvite = Coral Team uitnodiging
email-template-accountNotificationInvite =
  Je bent uitgenodigd om lid te worden van het { $organizationName }-team op Coral. Voltooi
  je account <a data-l10n-name="invite">hier</a>.

email-subject-accountNotificationDownloadComments = Je data is klaar om gedownload te worden
email-template-accountNotificationDownloadComments =
  Je data van { $organizationName } per { $date } is nu klaar om gedownload te worden.<br /><br />
  <a data-l10n-name="downloadUrl">Download mijn reacties archief</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Je account wordt binnenkort verwijderd
email-template-accountNotificationDeleteRequestConfirmation =
  Er is een verzoek ontvangen om je account te verwijderen.
  Je account staat gepland voor verwijdering op { $requestDate }.<br /><br />
  Na die tijd worden al je reacties van de site verwijderd,
  al je reacties worden uit onze database verwijderd en je
  gebruikersnaam en e-mailadres worden uit ons systeem verwijderd.<br /><br />
  Als je van gedachten verandert, kun inloggen met je account en het
  verzoek annuleren vóór je geplande accountverwijderingstijd.

email-subject-accountNotificationDeleteRequestCancel =
  Je verzoek om accountverwijdering is geannuleerd
email-template-accountNotificationDeleteRequestCancel =
  Je hebt je verzoek om accountverwijdering voor { $organizationName } geannuleerd.
  Je account is nu opnieuw geactiveerd.

email-subject-accountNotificationDeleteRequestCompleted =
  Je account is verwijderd
email-template-accountNotificationDeleteRequestCompleted =
  Je account voor { $organizationName } is nu verwijderd. Het spijt ons tot ziens!<br /><br />
  Als je in de toekomst opnieuw aan de discussie wilt deelnemen, kun je je aanmelden voor
  een nieuw account.<br /><br />
  Als je ons feedback wilt geven over waarom je bent weggegaan en wat we kunnen doen om ervoor te zorgen
  dat de discussie ervaring beter is, stuur ons een e-mail op:
   { $organisatieContactE-mail }.


# Notification

email-footer-notification =
  Verstuurd door <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Afmelden voor deze meldingen</a>

## On Reply

email-subject-notificationOnReply = Iemand heeft gereageerd op je reactie op { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } heeft gereageerd op <a data-l10n-name="commentPermalink">de reactie</a> die je hebt gepost op <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = Een van je reacties is uitgelicht op { $organizationName }
email-template-notificationOnFeatured =
  Een lid van ons team heeft <a data-l10n-name="commentPermalink">de reactie</a> uitgelicht die je op <a data-l10n-name="storyLink">{ $storyTitle }</a> hebt geplaatst.

## On Staff Reply

email-subject-notificationOnStaffReply = Iemand bij { $organizationName } heeft op je reactie gereageerd
email-template-notificationOnStaffReply =
  { $authorUsername } van { $organizationName } heeft gereageerd op <a data-l10n-name="commentPermalink">de reactie</a> die je hebt gepost op <a data-l10n-name="storyLink">{ $storyTitle }< /a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Je reactie op { $organizationName } is gepubliceerd
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Bedankt voor het indienen van je reactie. Je reactie is nu gepubliceerd: <a data-l10n-name="commentPermalink">Bekijk reactie</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Je reactie op { $organizationName } is niet gepubliceerd
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  De taal die in een van je reacties werd gebruikt, voldeed niet aan onze communityrichtlijnen, en daarom is de reactie verwijderd.

# Notification Digest

email-subject-notificationDigest = Je laatste reactieactiviteit bij { $organizationName }

email-subject-testSmtpTest = Test e-mail van Coral
email-template-testSmtpTest = Dit is een test-e-mail die is verzonden naar { $email }

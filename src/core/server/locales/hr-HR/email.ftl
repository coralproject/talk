# Account Notifications

email-footer-accountNotification =
  Poslano od <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Zahtjev za obnovu lozinke
email-template-accountNotificationForgotPassword =
  Zdravo { $username },<br/><br/>
  Zaprimili smo zahtjev za osnovu tvoje lozinke na <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Molimo slijedi ovu poveznicu kako bi namjestio novu lozinku: <a data-l10n-name="resetYourPassword">Klik za novu lozinku</a><br/><br/>
  <i>Ako nisi zatražio novu lozinku, zanemari ovaj email.</i><br/>

email-subject-accountNotificationBan = Tvoj račun je blokiran
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Ako smatraš da se dogodila greška, kontaktiraj nas
  ovdje <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Promijenjena lozinka
email-template-accountNotificationPasswordChange =
  Zdravo { $username },<br/><br/>
  Tvoja lozinka je promijenjena.<br/><br/>
  Ako nisi sam promijenio lozinku,
  javi nam se ovdje <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Promijenjeno korisničko ime
email-template-accountNotificationUpdateUsername =
  Zdravo { $username },<br/><br/>
  Hvala ti na ažuriranja svoj računa na { $organizationName }. Izmjene su već vidljive. <br /><br />
  Ako nisi napravio ovu izmjenu, javi nam se ovdje <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Račun je suspendiran
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Ako smatraš da se radi o greški, konktaktiraj nas
  ovdje <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Potvrdi email
email-template-accountNotificationConfirmEmail =
  Zdravo { $username },<br/><br/>
  Potvrdi svoju email adresu koju ćeš koristiti za komentiranje na{ $organizationName }
  molimo slijedi ovu poveznicu: <a data-l10n-name="confirmYourEmail">Klikni ovdje za potvrdu svog emaila</a><br/><br/>
  Ako nisi kreirao račun za komentiranje na
  { $organizationName }, možeš ignorirati ovaj email.

email-subject-accountNotificationInvite = Coral Tim pozivnica
email-template-accountNotificationInvite =
  Pozvan si pridružiti se { $organizationName } timu na Coralu.
  Završi svoju prijavu <a data-l10n-name="invite">ovdje</a>

email-subject-accountNotificationDownloadComments = Tvoji komentari su spremni za preuzimanje
email-template-accountNotificationDownloadComments =
  Tvoji komentari na { $organizationName } do { $date } su spremni za preuzimanje.<br /><br />
  <a data-l10n-name="downloadUrl">Preuzmi svoju arhivu komentara</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Tvoj račun za komentiranje je na rasporedu za brisanje
email-template-accountNotificationDeleteRequestConfirmation =
  Zahtjev za brisanjem tvojeg računa za komentiranje je zaprimljen.
  Tvoj će biti obrisan prema rasporedu { $requestDate }.<br /><br />
  Nakon toga će svi tvoji komentari biti uklonjeni sa stranice,
  sve tvoje komentare ćemo ukloniti iz baze i tvoj
  After that time all of your comments will be removed from the site,
  all of your comments will be removed from our database, and your
  username and email address will be removed from our system.<br /><br />
  If you change your mind you can sign into your account and cancel the
  request before your scheduled account deletion time.

email-subject-accountNotificationDeleteRequestCancel =
  Your account deletion request has been cancelled
email-template-accountNotificationDeleteRequestCancel =
  You have cancelled your account deletion request for { $organizationName }.
  Your account is now reactivated.

email-subject-accountNotificationDeleteRequestCompleted =
  Your account has been deleted
email-template-accountNotificationDeleteRequestCompleted =
  Your commenter account for { $organizationName } is now deleted. We're sorry to
  see you go!<br /><br />
  If you'd like to re-join the discussion in the future, you can sign up for
  a new account.<br /><br />
  If you'd like to give us feedback on why you left and what we can do to make
  the commenting experience better, please email us at
  { $organizationContactEmail }.

# Notification

email-footer-notification =
  Sent by <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Unsubscribe from these notifications</a>

## On Reply

email-subject-notificationOnReply = Someone has replied to your comment on { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } has replied to <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = One of your comments was featured on { $organizationName }
email-template-notificationOnFeatured =
  A member of our team has featured <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Staff Reply

email-subject-notificationOnStaffReply = Someone at { $organizationName } has replied to your comment
email-template-notificationOnStaffReply =
  { $authorUsername } of { $organizationName } has replied to <a data-l10n-name="commentPermalink">the comment</a> you posted on <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Your comment on { $organizationName } has been published
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Thank you for submitting your comment. Your comment has now been published: <a data-l10n-name="commentPermalink">View comment</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Your comment on { $organizationName } was not published
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  The language used in one of your comments did not comply with our community guidelines, and so the comment has been removed.

# Notification Digest

email-subject-notificationDigest = Your latest comment activity at { $organizationName }

email-subject-testSmtpTest = Test email from Coral
email-template-testSmtpTest = This is a test email sent to { $email }

# Account Notifications

email-footer-accountNotification =
  Mejlet skickades från <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Begäran om lösenordsnollställning
email-template-accountNotificationForgotPassword =
  Hej { $username },<br/><br/>
  Vi har mottagit en begäran om att att nollställa ditt lösenord för kommentarer hos <a data-l10n-name="organizationName">{ $organizationName }</a>.<br/><br/>
  Var god använd den här länken för att nollställa ditt lösenord: <a data-l10n-name="resetYourPassword">Clicka här för att nollställa ditt lösenord</a><br/><br/>
  <i>Om du inte begärt detta kan du ignorera detta mejl.</i><br/>

email-subject-accountNotificationBan = Du har blivit avstängd att kommentera via ditt konto.
email-template-accountNotificationBan =
  { $customMessage }<br /><br />  
  Om du anser att detta inte stämmer var god kontakta oss på <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Ditt lösenord har ändrats
email-template-accountNotificationPasswordChange =  
  Hej { $username },<br/><br/>
  Ditt lösenord har ändrats.<br/><br/>
  Om du inte begärt detta kan du kontakta oss på <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Ditt användarnamn har ändrats
email-template-accountNotificationUpdateUsername =
  Hej { $username },<br/><br/>
  Tack för att du uppdaterar din information hos oss på { $organizationName }. Ändringarna träder i kraft direkt. <br /><br />
  Om du inte begärt detta kan du kontakta oss på <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Du har blivit tillfälligt avstängd att kommentera via ditt konto.
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Om du anser att detta inte stämmer var god kontakta oss på <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Bekräfta e-postadress
email-template-accountNotificationConfirmEmail =
  Hej { $username },<br/><br/>
  För att bekräfta din e-postadress i kommentarssystemet hos { $organizationName }, använd den här länken:
  <a data-l10n-name="confirmYourEmail">Klicka här för att bekräfta din e-postadress</a><br/><br/>
  Om du inte känner igen detta meddelande kan du ignorera detta mejl.

email-subject-accountNotificationInvite = Inbjudan till vårt team i Corals kommentarsplattform
email-template-accountNotificationInvite =
  Du har nu fått en inbjudan att gå med i kommentarsteamet hos { $organizationName }. Ställ in ditt konto <a data-l10n-name="invite">här</a>.

email-subject-accountNotificationDownloadComments = Dina kommentarer är redo att laddas ner
email-template-accountNotificationDownloadComments =
  Dina kommentarer hos { $organizationName } fram till { $date } är nu tillgängliga för nedladdning.<br /><br />
  <a data-l10n-name="downloadUrl">Ladda ner arkivet med kommentarer</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Ditt kommentarskonto är på väg att bli raderat
email-template-accountNotificationDeleteRequestConfirmation =
  En begäran om att radera ditt kommentarskonto har mottagits. 
  Ditt konto kommer raderas den { $requestDate }.<br /><br />
  Efter detta datum kommer alla dina kommentarer raderas från sajten,
  alla kommentarer kommer raderas från databasen, 
  ditt användarnamn och email kommer radaras från vårt system.<br /><br />
  Om du ångrar dig kan du logga in på ditt konto och avbryta begäran innan detta datum.  

email-subject-accountNotificationDeleteRequestCancel =
  Din begäran om att raderan har nu blivit återkallad
email-template-accountNotificationDeleteRequestCancel =
  Du har avbrutit din begäran om radering av ditt konto hos { $organizationName }.
  Ditt konto är nu återaktiverat

email-subject-accountNotificationDeleteRequestCompleted =
  Ditt konto har nu blivit raderat
email-template-accountNotificationDeleteRequestCompleted =
  Ditt konto för kommentarer hos { $organizationName } är nu raderat. 
  Synd att du inte vill fortsätta hos oss! <br /><br />
  Om du vill fortsätta kommentera hos oss framöver kan du skapa ett nytt konto.<br /><br />
  Du får gärna återkomma med feedback varför du inte längre vill kommentera hos oss, 
  kontakta oss i så fall på { $organizationContactEmail }.

# Notification

email-footer-notification =
  <br />Skickat från <a data-l10n-name="organizationLink">{ $organizationName }</a> - <a data-l10n-name="unsubscribeLink">Jag vill inte längre ha dom här notifikationerna</a>

## On Reply

email-subject-notificationOnReply = Någon har svarat på din kommentar på { $organizationName }
email-template-notificationOnReply =
  { $authorUsername } Har svarat på <a data-l10n-name="commentPermalink">din kommentar</a> till artikeln <a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Featured

email-subject-notificationOnFeatured = Din artikelkommentar på { $organizationName } blev utvald
email-template-notificationOnFeatured =
  Din <a data-l10n-name="commentPermalink">kommentar</a> på artikeln <a data-l10n-name="storyLink">{ $storyTitle }</a> har blivit utvald av en av våra redaktörer.

## On Staff Reply

email-subject-notificationOnStaffReply = Någon från { $organizationName } har svarat på din kommentar
email-template-notificationOnStaffReply =
  { $authorUsername } på { $organizationName } har svarat på din <a data-l10n-name="commentPermalink">kommentar</a> som du skrev till artikeln<a data-l10n-name="storyLink">{ $storyTitle }</a>

## On Comment Approved

email-subject-notificationOnCommentApproved = Din kommentar på { $organizationName } har blivit publicerad
email-template-notificationOnCommentApproved =
  { $organizationName }<br /><br/>
  Tack för att du vill kommentera hos oss! Din kommentar har nu blivit publicerad: <a data-l10n-name="commentPermalink">Se kommentarer</a>

## On Comment Rejected

email-subject-notificationOnCommentRejected = Din kommentar på { $organizationName } publicerades inte
email-template-notificationOnCommentRejected =
  { $organizationName }<br /><br/>
  Språket i din kommentar följde inte våra regler. Kommentaren har därför raderats.

# Notification Digest

email-subject-notificationDigest = Din senaste kommentarsaktivitet på { $organizationName }

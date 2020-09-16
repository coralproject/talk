# Account Notifications

email-footer-accountNotification =
  Lähettäjä <a data-l10n-name="organizationLink">{ $organizationName }</a>

email-subject-accountNotificationForgotPassword = Pyyntösi uudesta salasanasta
email-template-accountNotificationForgotPassword =
  Hei { $username },<br/><br/>
  Saimme pyynnön, jonka mukaan haluat asettaa itsellesi uuden salasanan.<br/><br/>
  Pääset asettamaan uuden salasanan <a data-l10n-name="resetYourPassword">täältä</a>.<br/><br/>
  <i>Jos et ole pyytänyt salasanasi vaihtamista, voit poistaa tämän viestin.</i><br/>

email-subject-accountNotificationBan = Sinut on asetettu kirjoituskieltoon
email-template-accountNotificationBan =
  { $customMessage }<br /><br />
  Jos kielto on mielestäsi aiheeton, ota yhteyttä ylläpitoon 
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationPasswordChange = Salasanasi on päivitetty
email-template-accountNotificationPasswordChange =
  Hei { $username },<br/><br/>
  Kirjoittajatilisi salalsana on vaihdettu.<br/><br/>
  Jos et tehnyt vaihtopyyntöä, ole hyvä ja ota yhteyttä ylläpitoon
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationUpdateUsername = Kirjoittajanimesi on vaihdettu
email-template-accountNotificationUpdateUsername =
  Hei { $username },<br/><br/>
  Kiitos että päivitit { $organizationName } keskustelun kirjoittajatilisi tietoja. Tekemäsi muutokset ovat voimassa välittömästi. <br /><br />
  Jos et tehnyt tätä muutosta, ole hyvä ja ota yhteyttä ylläpitoon <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationSuspend = Sinut on asetettu kirjoituskieltoon
email-template-accountNotificationSuspend =
  { $customMessage }<br/><br/>
  Jos kielto on mielestäsi aiheeton, ota yhteyttä ylläpitoon 
  <a data-l10n-name="organizationContactEmail" >{ $organizationContactEmail }</a>.

email-subject-accountNotificationConfirmEmail = Vahvista sähköpostiosoite
email-template-accountNotificationConfirmEmail =
  Hei { $username },<br/><br/>
  Vahvista sähköpostiosoite { $organizationName } keskustelun kirjoittajatiliisi 
  <a data-l10n-name="confirmYourEmail">klikkaamalla tätä linkkiä</a><br/><br/>.
  Jos et ole äskettäin luonut tiliä { $organizationName } keskusteluun,
  voit jättää tämän viestin huomiotta.  

email-subject-accountNotificationInvite = Kutsu Coral ryhmään
email-template-accountNotificationInvite =
  Sinut on kutsuttu { $organizationName } Coral ryhmään.
  Viimeistele käyttäjätilisi <a data-l10n-name="invite">täällä</a>.

email-subject-accountNotificationDownloadComments = Kommenttihistoriasi on ladattavissa
email-template-accountNotificationDownloadComments =
  Olet pyytänyt kommenttihistoriasi lataamista { $date }. Kommenttisi ovat nyt ladattavissa.<br /><br />
  <a data-l10n-name="downloadUrl">Lataa kommenttihistoriasi tästä</a>

email-subject-accountNotificationDeleteRequestConfirmation =
  Kirjoittajatilisi on ajastettu poistettavaksi
email-template-accountNotificationDeleteRequestConfirmation =
  Olemme vastaanottaneet pyyntösi kirjoittajatilisi poistamiseksi.
  Kirjoittajatilisi on ajastettu poistettavaksi { $requestDate }.<br /><br />
  Kirjoittajatilin poistaminen poistaa pysyvästi kaikki kirjoittamasi kommentit.
  Kaikki kirjoittamasi kommentit poistetaan tietokannastamme ja kirjoittajanimesi ja
  Sähköpostiosoitteesi poistetaan järjestelmästämme.<br /><br />
  Voit kirjautua tilillesi ja peruuttaa poistopyynnön ajastettuun poistohetkeen asti.


email-subject-accountNotificationDeleteRequestCancel =
  Kirjoittajatilisi poistopyyntö on peruutettu
email-template-accountNotificationDeleteRequestCancel =
  Olet peruuttanut { $organizationName } kirjoittajatilisi poistopyynnon.
  Kirjoittajatilisi on aktivoitu uudellleen.

email-subject-accountNotificationDeleteRequestCompleted =
  Kirjoittajatilisi on poistettu
email-template-accountNotificationDeleteRequestCompleted =
  { $organizationName } kirjoittajatilisi on nyt poistettu.<br /><br />
  Jos haluat jatkossa liittyä keskusteluun mukaan voit luoda uuden tilin.<br /><br />
  Voit lähettää meille palautetta osoitteeseen { $organizationContactEmail }.





# Notification

email-footer-notification =
  <br /><br />Ystävällisin terveisin<br />$organizationName<br /><br />
  <i>Etkö enää halua tällaisia viestejä? <a data-l10n-name="unsubscribeLink">Paina tästä</a></i>
## On Reply

email-subject-notificationOnReply = Kirjoittamaasi kommenttiin on vastattu
email-template-notificationOnReply =
  { $authorUsername } on vastannut <a data-l10n-name="commentPermalink">kommenttiisi</a>, jonka kirjoitit keskusteluun: <a data-l10n-name="storyLink">{ $storyTitle }</a>.

## On Featured

email-subject-notificationOnFeatured = Kommenttisi on päässyt valitut-listalle
email-template-notificationOnFeatured =
  Ylläpito on valinnut kirjoittamasi <a data-l10n-name="commentPermalink">kommentin</a> valitut-listalle, jossa on keskustelun parhaita kommentteja. Kirjoitit valitut-listalle päässeen kommenttisi keskusteluun: <a data-l10n-name="storyLink">{ $storyTitle }</a>.

## On Staff Reply

email-subject-notificationOnStaffReply = Ylläpito on vastannut kommenttiisi
email-template-notificationOnStaffReply =
  Ylläpitäjä { $authorUsername } on vastannut <a data-l10n-name="commentPermalink">kommenttiin</a>, jonka kirjoitit keskusteluun: <a data-l10n-name="storyLink">{ $storyTitle }</a>.

## On Comment Approved

email-subject-notificationOnCommentApproved = Kommenttisi on julkaistu
email-template-notificationOnCommentApproved =
  Kiitos lähettämästäsi kommentista! Olemme nyt tarkastaneet kommenttisi ja 
  julkaisseet sen <a data-l10n-name="commentPermalink">täällä</a>.

## On Comment Rejected

email-subject-notificationOnCommentRejected = Kommenttisi on hylätty
email-template-notificationOnCommentRejected =
  Kiitos lähettämästäsi kommentista! Olemme tarkastaneet kommenttisi ja todenneet, että se rikkoo kommentoinnin sääntöjä. Tämän vuoksi kommenttiasi ei julkaista.<br /><br />
  Valitettavasti meillä ei ole mahdollisuutta perustella yksittäisiä tarkastuspäätöksiä yksityiskohtaisemmin. Pyydämme, että tutustut sääntöihimme ja kirjoitat sen jälkeen uuden kommentin.

# Notification Digest

email-subject-notificationDigest = Viimeisimmät kommenttisi

email-subject-testSmtpTest = Testisähköposti Coralista
email-template-testSmtpTest = Tämä on testisähköposti osoitteeseen { $email }

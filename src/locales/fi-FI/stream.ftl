### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Liity keskusteluun
general-userBoxUnauthenticated-signIn = Kirjaudu
general-userBoxUnauthenticated-register = Rekisteröidy

general-userBoxAuthenticated-signedInAs =
  Kirjoitat nimellä <Username></Username>

general-userBoxAuthenticated-notYou =
  Et sinä? <button>Kirjaudu ulos</button>

general-tabBar-commentsTab = Kommentit
general-tabBar-myProfileTab = Omat tiedot
general-tabBar-configure = Asetukset

## Comment Count

comment-count-text =
  { $count  ->
    [one] kommentti
    *[other] kommenttia
  }

## Comments Tab

comments-allCommentsTab = Kaikki
comments-featuredTab = Valitut
comments-featuredCommentTooltip-how = Miten kommentti pääsee valitut-listalle?
comments-featuredCommentTooltip-handSelectedComments =
  Ylläpito valitsee listalle mielestään parhaat kommentit.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Näytä valittujen ohje

comments-bannedInfo-bannedFromCommenting = Olemme asettaneet sinut kirjoituskieltoon. 
comments-bannedInfo-violatedCommunityGuidelines =
  Olemme asettaneet sinut kirjoituskieltoon, koska olet rikkonut kommentoinnin sääntöjä. Jos kielto on mielestäsi aiheeton, ota yhteyttä ylläpitoon.
   
comments-noCommentsAtAll = Jutussa ei ole kommentteja.
comments-noCommentsYet = Ei vielä kommentteja. Kirjoita ensimmäinen.

comments-streamQuery-storyNotFound = Juttua ei löytynyt

comments-postCommentForm-submit = Lähetä
comments-replyList-showAll = Näytä kaikki
comments-replyList-showMoreReplies = Näytä lisää vastauksia

comments-viewNew =
  { $count ->
    [1] Näytä uusi kommentti
    *[other] Näytä {$count} uutta kommenttia
  }
comments-loadMore = Näytä lisää

comments-permalinkPopover =
  .description = Ikkuna jossa on linkki kommenttiin 
comments-permalinkPopover-permalinkToComment =
  .aria-label = Linkki kommenttiin
comments-permalinkButton-share = Jaa
comments-permalinkView-viewFullDiscussion = Näytä koko keskustelu
comments-permalinkView-commentRemovedOrDoesNotExist = Kommenttia ei ole olemassa. Se on voitu poistaa.

comments-rte-bold =
  .title = Lihavoi

comments-rte-italic =
  .title = Kursivoi

comments-rte-blockquote =
  .title = Lainaa

comments-remainingCharacters = { $remaining } merkkiä jäljellä

comments-postCommentFormFake-signInAndJoin = Kirjaudu ja liity keskusteluun

comments-postCommentForm-rteLabel = Kirjoita kommentti

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Kirjoittaminen on estetty, sillä käyttäjä on merkitty poistettavaksi.

comments-replyButton-reply = Vastaa

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Lähetä
comments-replyCommentForm-cancel = Peruuta
comments-replyCommentForm-rteLabel = Vastaa
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Muokkaa

comments-editCommentForm-saveChanges = Tallenna muutokset
comments-editCommentForm-cancel = Peruuta
comments-editCommentForm-close = Sulje
comments-editCommentForm-rteLabel = Muokkaa
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = <time></time> aikaa muokata
comments-editCommentForm-editTimeExpired = Muokkausaika on päättynyt. Et voi enää muokata kommenttia.
comments-editedMarker-edited = Muokattu
comments-showConversationLink-readMore = Lue lisää tästä keskustelusta >
comments-conversationThread-showMoreOfThisConversation =
  Näytä lisää tästä keskustelusta

comments-permalinkView-currentViewing = Katsot parhaillaan
comments-permalinkView-singleConversation = YKSITTÄISTÄ KESKUSTELUA
comments-inReplyTo = Vastaus käyttäjälle <Username></Username>
comments-replyTo = Vastaus käyttäjälle <Username></Username>

comments-reportButton-report = Ilmoita asiaton kommentti
comments-reportButton-reported = Asiaton kommentti ilmoitettu

comments-sortMenu-sortBy = Järjestä
comments-sortMenu-newest = Uusimmat ensin
comments-sortMenu-oldest = Vanhimmat ensin
comments-sortMenu-mostReplies = Eniten vastauksia ensin

comments-userPopover =
  .description = Kirjoittajan tiedot
comments-userPopover-memberSince = Kirjoittanut alkaen: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Hiljennä

comments-userIgnorePopover-ignoreUser = Hiljennetäänkö {$username}?
comments-userIgnorePopover-description =
  Et enää näe hiljentämäsi kirjoittajan kommentteja. Voit perua hiljentämisen Omat tiedot -sivulla.
comments-userIgnorePopover-ignore = Hiljennä
comments-userIgnorePopover-cancel = Peruuta

comments-userBanPopover-title = Asetetaanko {$username} kirjoituskieltoon?
comments-userBanPopover-description =
  Kirjoituskiellossa oleva käyttäjä ei voi enää kirjoittaa kommentteja, reagoida niihin tai ilmoittaa muiden kommentteja asiattomiksi. Myös tämä kommentti hylätään.
comments-userBanPopover-cancel = Peruuta
comments-userBanPopover-ban = Aseta kirjoituskieltoon

comments-moderationDropdown-popover =
  .description = Moderointivalinnat
comments-moderationDropdown-feature = Valitut-listalle
comments-moderationDropdown-unfeature = Poista valitut-listalta
comments-moderationDropdown-approve = Hyväksy
comments-moderationDropdown-approved = Hyväksytty
comments-moderationDropdown-reject = Hylkää
comments-moderationDropdown-rejected = Hylätty
comments-moderationDropdown-ban = Aseta kirjoituskieltoon
comments-moderationDropdown-banned = Kirjoituskiellossa
comments-moderationDropdown-goToModerate = Siirry moderointiin
comments-moderationDropdown-caretButton =
  .aria-label = Moderoi

comments-rejectedTombstone =
  Olet hylännyt tämän kommentin.  <TextLink>Voit muuttaa päätöksen moderoinnin kautta.</TextLink>

comments-featuredTag = Valitut-listalla

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Kirjoittajan poistoa pyydetty
comments-stream-deleteAccount-callOut-receivedDesc =
  Olemme vastaanottaneet pyyntösi kirjoittajatilisi poistamiseksi { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Jos haluat jatkaa kirjoittamista, voit peruuttaa poistopyyntösi { $date } asti. 
comments-stream-deleteAccount-callOut-cancel =
  Peruuta poistopyyntö

### Featured Comments
comments-featured-gotoConversation = Siirry keskusteluun
comments-featured-replies = Vastauksia

## Profile Tab

profile-myCommentsTab = Omat kommentit
profile-myCommentsTab-comments = Omat kommentit
profile-accountTab = Käyttäjätiedot

accountSettings-manage-account = Muuta tietojasi

### Account Deletion

profile-accountDeletion-deletionDesc =
  Kirjoittajatilisi on ajastettu poistettavaksi { $date }.
profile-accountDeletion-cancelDeletion =
  Peruuta poistopyyntö

### Comment History
profile-historyComment-viewConversation = Näytä keskustelu
profile-historyComment-replies = Vastauksia {$replyCount}
profile-historyComment-commentHistory = Kommenttihistoria
profile-historyComment-story = Artikkeli: {$title}
profile-historyComment-comment-on = Keskusteluun:
profile-profileQuery-errorLoadingProfile = Virhe profiilia ladattaessa
profile-profileQuery-storyNotFound = Artikkelia ei löytynyt
profile-commentHistory-loadMore = Näytä lisää
profile-commentHistory-empty = Et ole vielä kirjoittanut kommentteja
profile-commentHistory-empty-subheading = Kirjoittamasi kommentit näkyvät tässä

### Account
profile-account-ignoredCommenters = Hiljennetyt kirjoittajat
profile-account-ignoredCommenters-description =
  Voit hiljentää haluamiesi kirjoittajien kommentit painamalla heidän nimeään ja valitsemalla Hiljennä. Et enää näe hiljentämiesi kirjoittajien kommentteja, mutta he näkevät edelleen sinun kirjoittamasi kommentit.
profile-account-ignoredCommenters-empty = Et ole hiljentänyt ketään
profile-account-ignoredCommenters-stopIgnoring = Peru hiljentäminen
profile-account-ignoredCommenters-manage = Muokkaa
profile-account-ignoredCommenters-cancel = Sulje

profile-account-changePassword-cancel = Peruuta
profile-account-changePassword = Vaihda salasana
profile-account-changePassword-oldPassword = Vanha salasana
profile-account-changePassword-forgotPassword = Unohditko salasanasi?
profile-account-changePassword-newPassword = Uusi salasana
profile-account-changePassword-button = Vaihda salasana
profile-account-changePassword-updated =
  Salasanasi on päivitetty
profile-account-changePassword-password = Salasana

profile-account-download-comments-title = Lataa kommenttihistoriasi
profile-account-download-comments-description =
  Saat sähköpostin, jossa on linkki kommenttihistoriasi lataamista varten. Voit tehdä latauspyynnön 14 vuorokauden välein.
profile-account-download-comments-request =
  Lataa kommenttihistoria
profile-account-download-comments-request-icon =
  .title = Lataa kommenttihistoria
profile-account-download-comments-recentRequest =
  Viimeisin latauspyyntösi: { $timeStamp }
profile-account-download-comments-requested =
  Seuraavaan mahdolliseen latauspyyntöön aikaa { framework-timeago-time }
profile-account-download-comments-request-button = Lähetä latauspyyntö

## Delete Account

profile-account-deleteAccount-title = Poista kirjoittajatilisi
profile-account-deleteAccount-description =
  Kirjoittajatilin poistaminen poistaa pysyvästi kaikki kirjoittamasi kommentit.
profile-account-deleteAccount-requestDelete = Pyydä kirjoittajatilin poistoa

profile-account-deleteAccount-cancelDelete-description =
  Olet pyytänyt kirjoittajatilisi poistoa. Tilisi poistetaan { $date }. Siihen asti voit perua pyyntösi.
profile-account-deleteAccount-cancelDelete = Peru poistopyyntö

profile-account-deleteAccount-request = Tee poistopyyntö
profile-account-deleteAccount-cancel = Peruuta
profile-account-deleteAccount-pages-deleteButton = Poista kirjoittajatilisi
profile-account-deleteAccount-pages-cancel = Peruuta
profile-account-deleteAccount-pages-proceed = Jatka
profile-account-deleteAccount-pages-done = Valmis
profile-account-deleteAccount-pages-phrase =
  .aria-label = Teksti

profile-account-deleteAccount-pages-descriptionHeader = Poista kirjoittajatilisi?
profile-account-deleteAccount-pages-descriptionText =
  Olet poistamassa kirjoittajatiliäsi. Se tarkoittaa, että:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Kaikki kirjoittamasi kommentit poistetaan tästä verkkopalvelusta
profile-account-deleteAccount-pages-allCommentsDeleted =
  Kaikki kirjoittamasi kommentit poistetaan tietokannastamme
profile-account-deleteAccount-pages-emailRemoved =
  Sähköpostiosoitteesi poistetaan järjestelmästämme

profile-account-deleteAccount-pages-whenHeader = Poista kirjoittajatilini: milloin?
profile-account-deleteAccount-pages-whenSec1Header =
  Milloin kirjoittajatilini poistetaan?
profile-account-deleteAccount-pages-whenSec1Content =
  Tilisi poistetaan 24 tunnin kuluttua poistopyynnön lähettämisestä.
profile-account-deleteAccount-pages-whenSec2Header =
  Voinko jatkaa kirjoittamista tilin poistoon asti?
profile-account-deleteAccount-pages-whenSec2Content =
  Poistumassa olevalla kirjoittajatilillä et voi enää kirjoittaa kommentteja tai tehdä muitakaan kommentteihin liittyviä asioita.

profile-account-deleteAccount-pages-downloadCommentHeader = Lataa kommenttisi?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Suosittelemme, että lataat kommenttihistoriasi itsellesi ennen kirjoittajatilisi poistamista. Kun tilisi on poistettu, et voi enää ladata kommenttihistoriaasi.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Omat tiedot > Lataa kommenttihistoriasi

profile-account-deleteAccount-pages-confirmHeader = Vahvista kirjoittajatilin poistaminen
profile-account-deleteAccount-pages-confirmDescHeader =
  Oletko varma, että haluat poistaa kirjoittajatilisi?
profile-account-deleteAccount-confirmDescContent =
  Poistopyynnön vahvistamiseksi kirjoita seuraava teksti alla olevaan laatikkoon:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Vahvista kirjoittamalla teksti:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Kirjoita salasanasi:

profile-account-deleteAccount-pages-completeHeader = Kirjoittajatilin poistoa pyydetty
profile-account-deleteAccount-pages-completeDescript =
  Pyyntösi on vastaanotettu ja sähköpostiisi on lähetetty vahvistusviesti.
profile-account-deleteAccount-pages-completeTimeHeader =
  Kirjoittajatilisi poistetaan: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Muutitko mieltäsi?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Kirjaudu uudelleen ennen poistoajankohtaa ja valitse
  <strong>Peru poistopyyntö</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Kerro meille miksi.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Haluaisimme tietää, miksi olet poistamassa kirjoittajatiliäsi. Voit lähettää meille palautetta osoitteeseen { $email }.
profile-account-changePassword-edit = Muokkaa


## Notifications
profile-notificationsTab = Ilmoitukset
profile-account-notifications-emailNotifications = Sähköposti-ilmoitukset
profile-account-notifications-receiveWhen = Lähetä minulle ilmoitus, kun
profile-account-notifications-onReply = kommenttiini vastataan
profile-account-notifications-onFeatured = kommenttini pääsee valitut-listalle
profile-account-notifications-onStaffReplies = ylläpitäjä vastaa kommenttiini
profile-account-notifications-onModeration = tarkastusta odottanut kommenttini on käsitelty
profile-account-notifications-sendNotifications = Lähetä ilmoitukset
profile-account-notifications-sendNotifications-immediately = heti
profile-account-notifications-sendNotifications-daily = kerran päivässä
profile-account-notifications-sendNotifications-hourly = kerran tunnissa
profile-account-notifications-updated = Ilmoitusasetuksesi on päivitetty
profile-account-notifications-button = Päivitä ilmoitusasetukset
profile-account-notifications-button-update = Päivitä

## Report Comment Popover
comments-reportPopover =
  .description = Ilmoita asiattomia kommentteja
comments-reportPopover-reportThisComment = Ilmoita asiaton kommentti
comments-reportPopover-whyAreYouReporting = Miksi ilmoitat tästä kommentista?

comments-reportPopover-reasonOffensive = Se on loukkaava
comments-reportPopover-reasonIDisagree = Olen asiasta eri mieltä
comments-reportPopover-reasonSpam = Se on mainos tai muu roskaviesti
comments-reportPopover-reasonOther = Muusta syystä

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Perustele ilmoituksesi tarkemmin (ei pakollinen) 

comments-reportPopover-maxCharacters = Korkeintaan { $maxCharacters } merkkiä
comments-reportPopover-cancel = Peruuta
comments-reportPopover-submit = Lähetä

comments-reportPopover-thankYou = Kiitos!
comments-reportPopover-receivedMessage =
  Ilmoituksesi on lähetetty. Poistamme kommentin, jos se on sääntöjemme vastainen.

comments-reportPopover-dismiss = Sulje

## Submit Status
comments-submitStatus-dismiss = Sulje
comments-submitStatus-submittedAndWillBeReviewed =
  Kommenttisi on lähetetty. Se julkaistaan tarkastuksen jälkeen.
comments-submitStatus-submittedAndRejected =
  Kommentti on hylätty koska se rikkoi kommentoinnin sääntöjä.

# Configure
configure-configureQuery-errorLoadingProfile = Konfiguraation lataamisessa tapahtui virhe
configure-configureQuery-storyNotFound = Juttua ei löytynyt

## Change username
profile-changeUsername-username = Kirjoittajan nimi
profile-changeUsername-success = Nimesi on vaihdettu
profile-changeUsername-edit = Muokkaa
profile-changeUsername-heading = Muokkaa nimeäsi
profile-changeUsername-desc = Vaihda nimi, joka näkyy kaikissa vanhoissa ja uusissa kommenteissasi. <strong>Nimen voi vaihtaa kerran per { framework-timeago-time }.</strong> 
profile-changeUsername-desc-text = Vaihda nimi, joka näkyy kaikissa vanhoissa ja uusissa kommenteissasi. <strong>Nimen voi vaihtaa kerran per { framework-timeago-time }.</strong>
profile-changeUsername-current = Nykyinen nimi
profile-changeUsername-newUsername-label = Uusi nimi
profile-changeUsername-confirmNewUsername-label = Vahvista uusi nimi
profile-changeUsername-cancel = Peruuta
profile-changeUsername-save = Tallenna
profile-changeUsername-recentChange = Nimesi on vaihdettu kuluneen { framework-timeago-time } aikana. Voit vaihtaa nimesi uudelleen { $nextUpdate }.
profile-changeUsername-close = Sulje

## Comment Stream
configure-stream-title = Muokkaa tämän kommenttiketjun asetuksia
configure-stream-apply = Tallenna

configure-premod-title = Kommenttien ennakkotarkastus
configure-premod-description =
  Ylläpidon on hyväksyttävä kommentti ennen kuin se julkaistaan.

configure-premodLink-title = Linkkejä sisältävien kommenttien ennakkotarkastus
configure-premodLink-description =
  Ylläpidon on hyväksyttävä linkkejä sisältävä kommentti ennen kuin se julkaistaan.

configure-liveUpdates-title = Reaaliaikainen päivitys käytössä 
configure-liveUpdates-description =
  Kun reaaliaikainen päivitys on käytössä, uusien kommenttien ja vastausten näkyminen ei vaadi sivulatausta, vaan tiedot päivittyvät välittömästi. Voit poistaa ominaisuuden käytöstä, jos se aiheuttaa kommenttien latautumisen hitautta poikkeuksellisen suosituissa jutuissa.

configure-messageBox-title = Näytä viestilaatikko
configure-messageBox-description =
  Näyttää viestin kommentointilaatikon yläpuolella.
  Voit käyttää viestilaatikkoa esimerkiksi keskustelun ohjaamiseen tai 
  kysymyksen tai juttuun liittyvän ilmoituksen tekemiseen.  
configure-messageBox-preview = Esikatsele
configure-messageBox-selectAnIcon = Valitse kuvake
configure-messageBox-iconConversation = Keskustelu
configure-messageBox-iconDate = Päiväys
configure-messageBox-iconHelp = Apua
configure-messageBox-iconWarning = Varoitus
configure-messageBox-iconChatBubble = Puhekupla
configure-messageBox-noIcon = Ei kuvaketta
configure-messageBox-writeAMessage = Kirjoita viesti

configure-closeStream-title = Sulje keskustelu
configure-closeStream-description =
  Keskustelu on tällä hetkellä avoinna. Suljettuun keskusteluun ei voi kirjoittaa uusia kommentteja, mutta vanhat kommentit jäävät näkyville.
configure-closeStream-closeStream = Sulje keskustelu

configure-openStream-title = Avaa keskustelu
configure-openStream-description =
  Keskustelu on tällä hetkellä suljettu. Avattuun keskusteluun voi jälleen kirjoittaa kommentteja.
configure-openStream-openStream = Avaa keskustelu

configure-moderateThisStream = Moderoi kommenttiketjua

comments-tombstone-ignore = Kommentti ei näy, koska olet hiljentänyt kirjoittajan {$username} 
comments-tombstone-deleted =
  Kommentti on poistettu, koska sen kirjoittaja on poistanut kirjoittajatilinsä.

suspendInfo-heading = Olemme asettaneet sinut määräaikaiseen kirjoituskieltoon. 
suspendInfo-info =
  Et saa kirjoittaa kommentteja, koska olet rikkonut kommentoinnin sääntöjä. Kirjoituskiellon aikana et voi myöskään reagoida toisten kommentteihin tai ilmoittaa niitä asiattomiksi. Kirjoituskieltosi päättyy { $until }. 

profile-changeEmail-unverified = (Vahvistamaton)
profile-changeEmail-edit = Muokkaa
profile-changeEmail-please-verify = Vahvista sähköpostiosoitteesi
profile-changeEmail-please-verify-details =
  Vahvistusviesti on lähetetty sähköpostiosoitteeseesi { $email }.
  Sinun tulee vahvistaa uusi sähköpostiosoitteesi ennen kuin voit käyttää sitä kirjautumiseen tai ilmoitusten vastaanottamiseen.
profile-changeEmail-resend = Lähetä vahvistusviesti uudelleen
profile-changeEmail-heading = Muokkaa sähköpostiosoitettasi
profile-changeEmail-desc = Vaihda sähköpostiosoite, jota käytät kirjautumiseen ja johon saat käyttäjätiliisi liittyviä viestejä. 
profile-changeEmail-current = Nykyinen sähköpostiosoite
profile-changeEmail-newEmail-label = Uusi sähköpostiosoite
profile-changeEmail-password = Salasana
profile-changeEmail-password-input =
  .placeholder = Salasana
profile-changeEmail-cancel = Peruuta
profile-changeEmail-submit = Tallenna
profile-changeEmail-email = Sähköposti

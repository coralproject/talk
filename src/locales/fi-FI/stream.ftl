### Localization for Embed Stream

## General

general-moderate = Moderoi

general-userBoxUnauthenticated-joinTheConversation = Liity keskusteluun
general-userBoxUnauthenticated-signIn = Kirjaudu
general-userBoxUnauthenticated-register = Rekisteröidy

general-userBoxAuthenticated-signedIn =
  Kirjoitat nimellä
general-userBoxAuthenticated-notYou =
  Et sinä? <button>Kirjaudu ulos</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  You have been successfully signed out

general-tabBar-commentsTab = Kommentit
general-tabBar-myProfileTab = Omat tiedot
general-tabBar-discussionsTab = Keskustelut
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
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 henkilö lukee keskustelua
    *[other] { SHORT_NUMBER($count) } henkilöä lukee keskustelua
  }

comments-featuredCommentTooltip-how = Miten kommentti pääsee valitut-listalle?
comments-featuredCommentTooltip-handSelectedComments =
  Ylläpito valitsee listalle mielestään parhaat kommentit.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Näytä valittujen ohje
  .title = Näytä valittujen ohje

comments-collapse-toggle =
  .aria-label = Pienennä keskusteluketju
comments-bannedInfo-bannedFromCommenting = Olemme asettaneet sinut kirjoituskieltoon.
comments-bannedInfo-violatedCommunityGuidelines =
  Olemme asettaneet sinut kirjoituskieltoon, koska olet rikkonut kommentoinnin sääntöjä. Jos kielto on mielestäsi aiheeton, ota yhteyttä ylläpitoon.




comments-noCommentsAtAll = Jutussa ei ole kommentteja.
comments-noCommentsYet = Ei vielä kommentteja. Kirjoita ensimmäinen.

comments-streamQuery-storyNotFound = Juttua ei löytynyt

comments-commentForm-cancel = Peruuta
comments-commentForm-saveChanges = Tallenna muutokset
comments-commentForm-submit = Lähetä

comments-postCommentForm-submit = Lähetä
comments-replyList-showAll = Näytä kaikki
comments-replyList-showMoreReplies = Näytä lisää vastauksia

comments-postComment-gifSearch = Hae GIF kuvaa
comments-postComment-gifSearch-search =
  .aria-label = Hae
comments-postComment-gifSearch-loading = Ladataan...
comments-postComment-gifSearch-no-results = Ei tuloksia haulle {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Liitä kuvan osoite
comments-postComment-insertImage = Lisää

comments-postComment-confirmMedia-youtube = Lisää tämä YouTube video kommenttisi loppuun?
comments-postComment-confirmMedia-twitter = Lisää tämä twiitti kommenttisi loppuun?
comments-postComment-confirmMedia-cancel = Peruuta
comments-postComment-confirmMedia-add-tweet = Lisää twiitti
comments-postComment-confirmMedia-add-video = Lisää video
comments-postComment-confirmMedia-remove = Poista
comments-commentForm-gifPreview-remove = Poista
comments-viewNew =
  { $count ->
    [1] Näytä yksi uusi kommentti
    *[other] Näytä {$count} uutta kommenttia
  }
comments-loadMore = Näytä lisää

comments-permalinkPopover =
  .description = Ikkuna jossa on linkki kommenttiin
comments-permalinkPopover-permalinkToComment =
  .aria-label = Linkki kommenttiin
comments-permalinkButton-share = Jaa
comments-permalinkButton =
  .aria-label = Jaa kommentti käyttäjältä {$username}
comments-permalinkView-viewFullDiscussion = Näytä koko keskustelu
comments-permalinkView-commentRemovedOrDoesNotExist = Kommenttia ei ole olemassa. Se on voitu poistaa.

comments-rte-bold =
  .title = Lihavoi

comments-rte-italic =
  .title = Kursivoi

comments-rte-blockquote =
  .title = Lainaa

comments-rte-bulletedList =
  .title = Luettelo

comments-rte-strikethrough =
  .title = Yliviivaus

comments-rte-spoiler = Piilotus

comments-rte-sarcasm = Sarkasmi

comments-rte-externalImage =
  .title = Ulkoinen kuva

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
comments-replyButton =
  .aria-label = Vastaa käyttäjän {$username} kommenttiin

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Lähetä
comments-replyCommentForm-cancel = Peruuta
comments-replyCommentForm-rteLabel = Vastaa
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Muokkaa

comments-commentContainer-avatar =
  .alt = Käyttäjän { $username } avatar

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

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Katsot parhaillaan yksittäistä keskustelua
comments-inReplyTo = Vastaus käyttäjälle <Username></Username>
comments-replyingTo = Vastaus käyttäjälle <Username></Username>

comments-reportButton-report = Ilmoita
comments-reportButton-reported = Ilmoitettu
comments-reportButton-aria-report =
  .aria-label = Ilmoita asiaton kommentti käyttäjältä {$username}
comments-reportButton-aria-reported =
  .aria-label = Asiaton kommentti ilmoitettu

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
  Et enää näe hiljentämäsi kirjoittajan kommentteja.
  Voit perua hiljentämisen Omat tiedot -sivulla.

comments-userIgnorePopover-ignore = Hiljennä
comments-userIgnorePopover-cancel = Peruuta

comments-userBanPopover-title = Asetetaanko {$username} kirjoituskieltoon?
comments-userBanPopover-description =
  Kirjoituskiellossa oleva käyttäjä ei voi enää kirjoittaa kommentteja,
  reagoida niihin tai ilmoittaa muiden kommentteja asiattomiksi.
  Myös tämä kommentti hylätään.
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
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderoi
comments-moderationDropdown-moderateStory = Moderoi juttu
comments-moderationDropdown-caretButton =
  .aria-label = Moderoi

comments-moderationRejectedTombstone-title = Olet hylännyt tämän kommentin.
comments-moderationRejectedTombstone-moderateLink =
  Voit muuttaa päätöksen moderoinnin kautta.

comments-featuredTag = Valitut-listalla

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} kommentti käyttäjältä {$username}
    *[other] {$reaction} ({$count}) kommentti käyttäjältä {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} kommentti käyttäjältä {$username}
    [one] {$reaction} kommentti käyttäjältä {$username}
    *[other] {$reaction} ({$count}) kommentti käyttäjältä {$username}
  }

comments-jumpToComment-title = Vastauksesi näkyy alla
comments-jumpToComment-GoToReply = Siirry vastaukseen

### Q&A

general-tabBar-qaTab = K&V

qa-answeredTab = Vastatut
qa-unansweredTab = Ei vastauksia
qa-allCommentsTab = Kaikki

qa-noQuestionsAtAll =
  Tälle jutulle ei ole kysymyksiä.
qa-noQuestionsYet =
  Ei vielä kysymyksiä. Kysy ensimmäinen.
qa-viewNew =
  { $count ->
    [1] Avaa {$count} uusi kysymys
    *[other] Avaa {$count} uutta kysymystä
  }

qa-postQuestionForm-rteLabel = Lähetä kysymys
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Eniten ääniä saaneet

qa-answered-tag = vastattu
qa-expert-tag = asiantuntija

qa-reaction-vote = Äänestä
qa-reaction-voted = Äänestetty

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Äänestä kommenttia käyttäjältä {$username}
    *[other] Äänestä ({$count}) kommenttia käyttäjältä {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Äänestetty kommenttia käyttäjältä {$username}
    [one] Äänestetty kommenttia käyttäjältä {$username}
    *[other] Äänestetty ({$count}) kommenttia käyttäjältä {$username}
  }

qa-unansweredTab-doneAnswering = Valmis

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Kuinka kysymyksiin vastataan?
qa-answeredTooltip-answeredComments =
  Kysymyksiin vastaa K&V asiantuntija.
qa-answeredTooltip-toggleButton =
  .aria-label = Näytä kysymysten ja vastausten ohje
  .title = Näytä kysymysten ja vastausten ohje

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Kirjoittajan poistoa pyydetty
comments-stream-deleteAccount-callOut-receivedDesc =
  Olemme vastaanottaneet pyyntösi kirjoittajatilisi poistamiseksi { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Jos haluat jatkaa kirjoittamista, voit peruuttaa poistopyyntösi { $date } asti.

comments-stream-deleteAccount-callOut-cancel =
  Peruuta kirjoittajatilin poistopyyntö
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Peruuta kirjoittajatilin poisto

comments-permalink-copyLink = Kopioi linkki
comments-permalink-linkCopied = Linkki kopioitu

### Embed Links

comments-embedLinks-showEmbeds = Näytä upotukset
comments-embedLinks-hideEmbeds = Piilota upotukset

comments-embedLinks-show-giphy = Näytä GIF
comments-embedLinks-hide-giphy = Piilota GIF

comments-embedLinks-show-youtube = Näytä video
comments-embedLinks-hide-youtube = Piilota video

comments-embedLinks-show-twitter = Näytä twiitti
comments-embedLinks-hide-twitter = Piilota twiitti

comments-embedLinks-show-external = Näytä kuva
comments-embedLinks-hide-external = Piilota kuva


### Featured Comments
comments-featured-gotoConversation = Siirry keskusteluun
comments-featured-replies = Vastauksia

## Profile Tab

profile-myCommentsTab = Omat kommentit
profile-myCommentsTab-comments = Omat kommentit
profile-accountTab = Käyttäjätiedot
profile-preferencesTab = Asetukset

### Bio
profile-bio-title = Bio
profile-bio-description =
  Kirjoita profiilissasi julkisesti näkyvä bio.
  Enintään 100 merkkiä.
profile-bio-remove = Poista
profile-bio-update = Päivitä
profile-bio-success = Biografiasi päivitettiin.
profile-bio-removed = Biografiasi poistettiin.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Kirjoittajatilisi on ajastettu poistettavaksi { $date }.
profile-accountDeletion-cancelDeletion =
  Peruuta kirjoittajatilin poistopyyntö
profile-accountDeletion-cancelAccountDeletion =
  Peruuta kirjoittajatilin poisto

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

### Preferences

profile-preferences-mediaPreferences = Media-asetukset
profile-preferences-mediaPreferences-alwaysShow = Näytä aina GIF kuvat, tweetit, YouTube videot ym.
profile-preferences-mediaPreferences-thisMayMake = Tämä saattaa hidastaa kommenttien latautumista
profile-preferences-mediaPreferences-update = Päivitä
profile-preferences-mediaPreferences-preferencesUpdated =
  Media-asetuksesi on päivitetty

### Account
profile-account-ignoredCommenters = Hiljennetyt kirjoittajat
profile-account-ignoredCommenters-description =
  Voit hiljentää haluamiesi kirjoittajien kommentit painamalla heidän nimeään ja valitsemalla Hiljennä.
  Et enää näe hiljentämiesi kirjoittajien kommentteja, mutta he näkevät edelleen sinun kirjoittamasi kommentit.


profile-account-ignoredCommenters-empty = Et ole hiljentänyt ketään
profile-account-ignoredCommenters-stopIgnoring = Peru hiljentäminen
profile-account-ignoredCommenters-youAreNoLonger =
  Et enää hiljennä
profile-account-ignoredCommenters-manage = Muokkaa
profile-account-ignoredCommenters-cancel = Peruuta
profile-account-ignoredCommenters-close = Sulje

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
  Saat sähköpostin, jossa on linkki kommenttihistoriasi lataamista varten.
  Voit tehdä latauspyynnön 14 vuorokauden välein.
profile-account-download-comments-request =
  Lataa kommenttihistoria
profile-account-download-comments-request-icon =
  .title = Lataa kommenttihistoria
profile-account-download-comments-recentRequest =
  Viimeisin latauspyyntösi: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Viimeisin latauspyyntösi on kuluvan 14 vuorokauden ajalta.
  Voit tehdä seuraavan latauspyynnön { $timeStamp }
profile-account-download-comments-requested =
  Pyyntö lähetetty. Seuraavaan mahdolliseen latauspyyntöön on aikaa { framework-timeago-time }
profile-account-download-comments-requestSubmitted =
  Latauspyyntösi on lähetetty onnistuneesti.
  Seuraavaan latauspyyntöön on aikaa { framework-timeago-time }.
profile-account-download-comments-error =
  Latauspyynnön suorittaminen ei onnistunut.
profile-account-download-comments-request-button = Lähetä latauspyyntö

## Delete Account

profile-account-deleteAccount-title = Poista kirjoittajatilisi
profile-account-deleteAccount-deleteMyAccount = Poista kirjoittajatilisi
profile-account-deleteAccount-description =
  Kirjoittajatilin poistaminen poistaa pysyvästi kaikki kirjoittamasi kommentit.

profile-account-deleteAccount-requestDelete = Pyydä kirjoittajatilin poistoa

profile-account-deleteAccount-cancelDelete-description =
  Olet pyytänyt kirjoittajatilisi poistoa.
  Tilisi poistetaan { $date }.
  Siihen asti voit perua pyyntösi.
profile-account-deleteAccount-cancelDelete = Peru poistopyyntö

profile-account-deleteAccount-request = Tee poistopyyntö
profile-account-deleteAccount-cancel = Peruuta
profile-account-deleteAccount-pages-deleteButton = Poista kirjoittajatilisi
profile-account-deleteAccount-pages-cancel = Peruuta
profile-account-deleteAccount-pages-proceed = Jatka
profile-account-deleteAccount-pages-done = Valmis
profile-account-deleteAccount-pages-phrase =
  .aria-label = Teksti

profile-account-deleteAccount-pages-sharedHeader = Poista kirjoittajatilisi

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
profile-account-deleteAccount-pages-whenSubHeader = Milloin?
profile-account-deleteAccount-pages-whenSec1Header =
  Milloin kirjoittajatilini poistetaan?
profile-account-deleteAccount-pages-whenSec1Content =
  Tilisi poistetaan 24 tunnin kuluttua poistopyynnön lähettämisestä.
profile-account-deleteAccount-pages-whenSec2Header =
  Voinko jatkaa kirjoittamista tilin poistoon asti?
profile-account-deleteAccount-pages-whenSec2Content =
  Poistumassa olevalla kirjoittajatilillä et voi enää kirjoittaa kommentteja
  tai tehdä muitakaan kommentteihin liittyviä asioita.

profile-account-deleteAccount-pages-downloadCommentHeader = Lataa kommenttisi?
profile-account-deleteAccount-pages-downloadSubHeader = Lataa kommenttisi
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Suosittelemme, että lataat kommenttihistoriasi itsellesi ennen kirjoittajatilisi poistamista.
  Kun tilisi on poistettu, et voi enää ladata kommenttihistoriaasi.

profile-account-deleteAccount-pages-downloadCommentsPath =
  Omat tiedot > Lataa kommenttihistoriasi

profile-account-deleteAccount-pages-confirmHeader = Vahvista kirjoittajatilin poistaminen
profile-account-deleteAccount-pages-confirmSubHeader = Oletko varma?
profile-account-deleteAccount-pages-confirmDescHeader =
  Oletko varma, että haluat poistaa kirjoittajatilisi?
profile-account-deleteAccount-confirmDescContent =
  Poistopyynnön vahvistamiseksi kirjoita seuraava teksti alla olevaan laatikkoon:

profile-account-deleteAccount-pages-confirmPhraseLabel =
  Vahvista kirjoittamalla teksti:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Kirjoita salasanasi:

profile-account-deleteAccount-pages-completeHeader = Kirjoittajatilin poistoa pyydetty
profile-account-deleteAccount-pages-completeSubHeader = Pyyntö lähetetty
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
  Haluaisimme tietää, miksi olet poistamassa kirjoittajatiliäsi.
  Voit lähettää meille palautetta osoitteeseen { $email }.
profile-account-changePassword-edit = Muokkaa
profile-account-changePassword-change = Vaihda


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
comments-reportPopover-reasonAbusive = Se on herjaava
comments-reportPopover-reasonIDisagree = Olen asiasta eri mieltä
comments-reportPopover-reasonSpam = Se on mainos tai muu roskaviesti
comments-reportPopover-reasonOther = Muusta syystä

comments-reportPopover-additionalInformation =
  Lisätietoja <optional>ei pakollinen</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Perustele ilmoituksesi tarkemmin

comments-reportPopover-maxCharacters = Korkeintaan { $maxCharacters } merkkiä
comments-reportPopover-restrictToMaxCharacters = Rajoita ilmoitus { $maxCharacters } merkkiin
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
profile-changeUsername-change = Vaihda
profile-changeUsername-heading = Muokkaa nimeäsi
profile-changeUsername-heading-changeYourUsername = Vaihda nimesi
profile-changeUsername-desc = Vaihda nimi, joka näkyy kaikissa vanhoissa ja uusissa kommenteissasi. <strong>Nimen voi vaihtaa kerran per { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Vaihda nimi, joka näkyy kaikissa vanhoissa ja uusissa kommenteissasi. <strong>Nimen voi vaihtaa kerran per { framework-timeago-time }.</strong>
profile-changeUsername-current = Nykyinen nimi
profile-changeUsername-newUsername-label = Uusi nimi
profile-changeUsername-confirmNewUsername-label = Vahvista uusi nimi
profile-changeUsername-cancel = Peruuta
profile-changeUsername-save = Tallenna
profile-changeUsername-saveChanges = Tallenna muutokset
profile-changeUsername-recentChange = Nimesi on vaihdettu kuluneen { framework-timeago-time } aikana. Voit vaihtaa nimesi uudelleen { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Vaihdoit nimesi kuluneen { framework-timeago-time } aikana. Voit vaihtaa nimesi uudelleen { $nextUpdate }.
profile-changeUsername-close = Sulje

## Discussions tab

discussions-mostActiveDiscussions = Aktiivisimmat keskustelut
discussions-mostActiveDiscussions-subhead = { $siteName } sivuston keskustelut jotka ovat saaneet eniten kommentteja kuluneen 24 tunnin aikana
discussions-mostActiveDiscussions-empty = Et ole osallistunut keskusteluihin
discussions-myOngoingDiscussions = Keskustelut joissa olen mukana
discussions-myOngoingDiscussions-subhead = Osallistumani keskustelut sivustolla { $orgName }
discussions-viewFullHistory = Näytä koko kommenttihistoria
discussions-discussionsQuery-errorLoadingProfile = Tietojen lataaminen epäonnistui
discussions-discussionsQuery-storyNotFound = Juttua ei löytynyt

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Muokkaa tämän kommenttiketjun asetuksia
configure-stream-apply =
configure-stream-update = Tallenna
configure-stream-streamHasBeenUpdated =
  Kommenttiketju päivitettiin

configure-premod-title =
configure-premod-premoderateAllComments = Kommenttien ennakkotarkastus
configure-premod-description =
  Ylläpidon on hyväksyttävä kommentti ennen kuin se julkaistaan.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Linkkejä sisältävien kommenttien ennakkotarkastus
configure-premodLink-description =
  Ylläpidon on hyväksyttävä linkkejä sisältävä kommentti ennen kuin se julkaistaan.

configure-messageBox-title =
configure-addMessage-title =
  Lisää viesti tai kysymys
configure-messageBox-description =
configure-addMessage-description =
  Lisää viesti kommentointilaatikon yläpuolella.
  Voit käyttää viestilaatikkoa esimerkiksi keskustelun ohjaamiseen tai
  kysymyksen tai juttuun liittyvän ilmoituksen tekemiseen.
configure-addMessage-addMessage = Lisää viesti
configure-addMessage-removed = Viesti on poistettu
config-addMessage-messageHasBeenAdded =
  Viesti on lisätty kommentointilaatikkoon
configure-addMessage-remove = Poista
configure-addMessage-submitUpdate = Päivitä
configure-addMessage-cancel = Peruuta
configure-addMessage-submitAdd = Lisää viesti

configure-messageBox-preview = Esikatsele
configure-messageBox-selectAnIcon = Valitse kuvake
configure-messageBox-iconConversation = Keskustelu
configure-messageBox-iconDate = Päiväys
configure-messageBox-iconHelp = Apua
configure-messageBox-iconWarning = Varoitus
configure-messageBox-iconChatBubble = Puhekupla
configure-messageBox-noIcon = Ei kuvaketta
configure-messageBox-writeAMessage = Kirjoita viesti

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Sulje keskustelu
configure-closeStream-description =
  Keskustelu on tällä hetkellä avoinna.
  Suljettuun keskusteluun ei voi kirjoittaa uusia kommentteja,
  mutta vanhat kommentit jäävät näkyville.
configure-closeStream-closeStream = Sulje keskustelu
configure-closeStream-theStreamIsNowOpen = Keskustelu on nyt avattu

configure-openStream-title = Avaa keskustelu
configure-openStream-description =
  Keskustelu on tällä hetkellä suljettu.
  Avattuun keskusteluun voi jälleen kirjoittaa kommentteja.
configure-openStream-openStream = Avaa keskustelu
configure-openStream-theStreamIsNowClosed = Keskustelu on nyt suljettu

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  K&V toiminnallisuutta kehitetään aktiivisesti.
  Ota yhteyttä jos haluat antaa palautetta tai kehitysehdotuksia.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Vaihda K&V muotoon
configure-enableQA-description =
  K&V muodossa kommentoijat voivat jättää kysymyksiä erikseen valittujen
  asiantuntijoiden vastattavaksi.
configure-enableQA-enableQA = Vaihda K&V muotoon
configure-enableQA-streamIsNowComments =
  Ketju on nyt kommentointimuodossa

configure-disableQA-title = K&V asetukset
configure-disableQA-description =
  K&V muodossa kommentoijat voivat jättää kysymyksiä erikseen valittujen
  asiantuntijoiden vastattavaksi.
configure-disableQA-disableQA = Vaihda kommentointimuotoon
configure-disableQA-streamIsNowQA =
  Ketju on nyt K&V muodossa

configure-experts-title = Lisää asiantuntija
configure-experts-filter-searchField =
  .placeholder = Hae sähköpostiosoitteen tai käyttäjänimen perusteella
  .aria-label = Hae sähköpostiosoitteen tai käyttäjänimen perusteella
configure-experts-filter-searchButton =
  .aria-label = Hae
configure-experts-filter-description =
  Lisää Asiantuntija -leiman valituille käyttäjille vain tällä sivulla.
  Uusien käyttäjien on ensin luotava kirjoittajatili ja
  vierailtava kommenttisivulla.
configure-experts-search-none-found = No users were found with that email or username
configure-experts-
configure-experts-remove-button = Poista
configure-experts-load-more = Lataa lisää
configure-experts-none-yet = Tälle K&V ketjulle ei ole vielä lisätty asiantuntijoita
configure-experts-search-title = Hae asiantuntijaa
configure-experts-assigned-title = Asiantuntijat
configure-experts-noLongerAnExpert = ei ole enää asiantuntija
comments-tombstone-ignore = Kommentti ei näy, koska olet hiljentänyt kirjoittajan {$username}
comments-tombstone-showComment = Näytä kommentti
comments-tombstone-deleted =
  Kommentti on poistettu, koska sen kirjoittaja on poistanut kirjoittajatilinsä.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Olemme asettaneet sinut määräaikaiseen kirjoituskieltoon.
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  Et saa kirjoittaa kommentteja, koska olet rikkonut kommentoinnin sääntöjä.
  Kirjoituskiellon aikana et voi myöskään reagoida toisten kommentteihin tai
  ilmoittaa niitä asiattomiksi.
suspendInfo-until-pleaseRejoinThe =
  Kirjoituskieltosi päättyy { $until }.

warning-heading = Kirjoittajatilillesi on annettu varoitus
warning-explanation =
  Kirjoittajatilillesi on annettu varoitus kommentoinnin sääntöjen rikkomisesta
warning-instructions =
  Pääset jatkamaan keskusteluihin osallistumista kun klikkaat "Vahvista" painiketta.
warning-acknowledge = Vahvista

warning-notice = Kirjoittajatilillesi on annettu varoitus. <a>Lue varoitusviesti</a> jotta pääset jatkamaan keskusteluihin osallistumista.

profile-changeEmail-unverified = (Vahvistamaton)
profile-changeEmail-current = (nykyinen)
profile-changeEmail-edit = Muokkaa
profile-changeEmail-change = Vaihda
profile-changeEmail-please-verify = Vahvista sähköpostiosoitteesi
profile-changeEmail-please-verify-details =
  Vahvistusviesti on lähetetty sähköpostiosoitteeseesi { $email }.
  Sinun tulee vahvistaa uusi sähköpostiosoitteesi ennen kuin voit
  käyttää sitä kirjautumiseen tai ilmoitusten vastaanottamiseen.
profile-changeEmail-resend = Lähetä vahvistusviesti uudelleen
profile-changeEmail-heading = Muokkaa sähköpostiosoitettasi
profile-changeEmail-changeYourEmailAddress =
  Vaihda sähköpostiosoitteesi
profile-changeEmail-desc = Vaihda sähköpostiosoite, jota käytät kirjautumiseen ja johon saat kirjoittajatiliisi liittyviä viestejä.
profile-changeEmail-newEmail-label = Uusi sähköpostiosoite
profile-changeEmail-password = Salasana
profile-changeEmail-password-input =
  .placeholder = Salasana
profile-changeEmail-cancel = Peruuta
profile-changeEmail-submit = Tallenna
profile-changeEmail-saveChanges = Tallenna muutokset
profile-changeEmail-email = Sähköposti
profile-changeEmail-title = Sähköpostiosoite
profile-changeEmail-success = Sähköpostiosoitteesi on vahdettu

## Ratings and Reviews

ratingsAndReviews-reviewsTab = Arvostelut
ratingsAndReviews-questionsTab = Kysymykset
ratingsAndReviews-noReviewsAtAll = Ei arvosteluja
ratingsAndReviews-noQuestionsAtAll = Ei kysymyksiä
ratingsAndReviews-noReviewsYet = Arvosteluja ei ole vielä lisätty.
ratingsAndReviews-noQuestionsYet = Kysymyksiä ei ole vielä lisätty.
ratingsAndReviews-selectARating = Valitse arvosana
ratingsAndReviews-youRatedThis = Annoit arvosanan
ratingsAndReviews-showReview = Näytä arvostelu
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Anna arvosana ja arvostele
ratingsAndReviews-askAQuestion = Kysy kysymys
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Ei arvosteluja
  [1] Yksi arvostelu
  *[other] { SHORT_NUMBER($count) } arvostelua
}

ratingsAndReviews-allReviewsFilter = Kaikki arvostelut
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 tähti
  *[other] { $rating } tähteä
}

comments-addAReviewForm-rteLabel = Lisää arvostelu (ei pakollinen)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Artikkelin alkuun
stream-footer-links-top-of-comments = Kommenttien alkuun
stream-footer-links-profile = Profiili & vastaukset
stream-footer-links-discussions = Lisää keskusteluja

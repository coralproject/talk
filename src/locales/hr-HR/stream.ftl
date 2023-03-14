### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Ugradnja komentara

general-moderate = Moderiraj
general-archived = Arhivirano

general-userBoxUnauthenticated-joinTheConversation = Pridružite se razgovoru
general-userBoxUnauthenticated-signIn = Prijavite se
general-userBoxUnauthenticated-register = Registrirajte se

general-authenticationSection =
  .aria-label = Autentikacija

general-userBoxAuthenticated-signedIn =
  Prijavljeni ste kao
general-userBoxAuthenticated-notYou =
  Niste vi? <button>Odjavite se</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Uspješno ste se odjavili

general-tabBar-commentsTab = Komentari
general-tabBar-myProfileTab = Moj profil
general-tabBar-discussionsTab = Rasprave
general-tabBar-reviewsTab = Ocjene
general-tabBar-configure = Postavke

general-mainTablist =
  .aria-label = Glavnih kartica

general-secondaryTablist =
  .aria-label = Sporedna kartica

## Comment Count

comment-count-text =
  { $count  ->
    [one] Komentar
    *[other] Komentara
  }

comment-count-text-ratings =
  { $count  ->
    [one] Ocjena
    [few] Ocjene
    *[other] Ocjena
  }

## Comments Tab

comments-allCommentsTab = Svi komentari
comments-featuredTab = Istaknuto
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 osoba čita ovu raspravu
    [few] { SHORT_NUMBER($count) } osobe čitaju ovu raspravu
    *[other] { SHORT_NUMBER($count) } osoba čita ovu raspravu
  }

comments-announcement-section =
  .aria-label = Obavijest
comments-announcement-closeButton =
  .aria-label = Zatvori obavijest

comments-accountStatus-section =
  .aria-label = Status računa

comments-featuredCommentTooltip-how = Kako se komentar ističe?
comments-featuredCommentTooltip-handSelectedComments =
  Komentari su odabrani od strane našeg tima kao vrijedni čitanja.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Prebacite na prikaz istaknutih komentara
  .title = Prebaci na prikaz istaknutih komentara

comments-collapse-toggle =
  .aria-label = Sklopi raspravu
comments-expand-toggle =
  .aria-label = Proširi raspravu
comments-bannedInfo-bannedFromCommenting = Vašem računu je zabranjeno komentiranje.
comments-bannedInfo-violatedCommunityGuidelines =
  Netko s pristupom vašem računu je kršio naše smjernice zajednice.
  Kao rezultat, vaš račun je zabranjen. Više nećete moći komentirati,
  koristiti reakcije ili prijavljivati komentare. Ako mislite da je
  to učinjeno pogrešno, obratite se našem timu zajednice.

comments-noCommentsAtAll = Nema komentara na ovoj vijesti.
comments-noCommentsYet = Nema komentara na ovoj vijesti. Zašto ne napišete jedan?

comments-streamQuery-storyNotFound = Vijest nije pronađena

comments-communityGuidelines-section =
  .aria-label = Pravidla zajednice

comments-commentForm-cancel = Otkaži
comments-commentForm-saveChanges = Spremi promjene
comments-commentForm-submit = Pošalji

comments-postCommentForm-section =
  .aria-label = Objavi komentar
comments-postCommentForm-submit = Pošalji
comments-replyList-showAll = Prikaži sve
comments-replyList-showMoreReplies = Prikaži više komentara

comments-postComment-gifSearch = Potraži GIF
comments-postComment-gifSearch-search =
  .aria-label = Traži
comments-postComment-gifSearch-loading = Ućitavanje...
comments-postComment-gifSearch-no-results = Nema rezultata za {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Zalijepite URL slike
comments-postComment-insertImage = Umetni

comments-postComment-confirmMedia-youtube = Dodajte ovaj YouTube video na kraj komentara?
comments-postComment-confirmMedia-twitter = Dodajte ovaj Tweet na kraj komentara?
comments-postComment-confirmMedia-cancel = Otkaži
comments-postComment-confirmMedia-add-tweet = Dodajte Tweet
comments-postComment-confirmMedia-add-video = Dodajte video
comments-postComment-confirmMedia-remove = Uklonite
comments-commentForm-gifPreview-remove = Uklonite
comments-viewNew-loading = Učitavanje...
comments-viewNew =
  { $count ->
    [1] Pogledajte {$count} novi komentar
    [few] Pogledajte {$count} nova komentara
    *[other] Pogledajte {$count} novih komentara
  }
comments-loadMore = Učitajte više
comments-loadAll = Učitajte sve komentare
comments-loadAll-loading = Učitavanje...

comments-permalinkPopover =
  .description = Prozor s poveznicom na komentar
comments-permalinkPopover-permalinkToComment =
  .aria-label = Poveznica na komentar
comments-permalinkButton-share = Podijelite
comments-permalinkButton =
  .aria-label = Podijelite komentar od {$username}
comments-permalinkView-section =
  .aria-label = Jedna rasprava
comments-permalinkView-viewFullDiscussion = Vidi cijelu raspravu
comments-permalinkView-commentRemovedOrDoesNotExist = Ovaj komentar je uklonjen ili ne postoji.

comments-rte-bold =
  .title = Podebljano

comments-rte-italic =
  .title = Kurziv

comments-rte-blockquote =
  .title = Citat

comments-rte-bulletedList =
  .title = Lista

comments-rte-strikethrough =
  .title = Precrtano

comments-rte-spoiler = Skriveni tekst

comments-rte-sarcasm = Sarkazam

comments-rte-externalImage =
  .title = Vanjska slika

comments-remainingCharacters = { $remaining } preostalih znakova

comments-postCommentFormFake-signInAndJoin = Prijavite se i pridružite se raspravi

comments-postCommentForm-rteLabel = Objavite komentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Odgovorite
comments-replyButton =
  .aria-label = Odgovorite na komentar od {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Pošaljite
comments-replyCommentForm-cancel = Otkaži
comments-replyCommentForm-rteLabel = Napišite odgovor
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Razine rasprave { $level }:
comments-commentContainer-highlightedLabel = Naglašeno:
comments-commentContainer-ancestorLabel = Prethodni komentar:
comments-commentContainer-replyLabel =
  Odgovor od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Pitanje od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Komentar od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Uredite

comments-commentContainer-avatar =
  .alt = Avatar za { $username }

comments-editCommentForm-saveChanges = Spremite promjene
comments-editCommentForm-cancel = Otkažite
comments-editCommentForm-close = Zatvorite
comments-editCommentForm-rteLabel = Uredite komentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Uredite: preostalo vrijeme <time></time>
comments-editCommentForm-editTimeExpired = Vrijeme za uređivanje je isteklo. Više ne možete uređivati ovaj komentar. Zašto ne biste objavili još jedan?
comments-editedMarker-edited = Uređeno
comments-showConversationLink-readMore = Pročitajte više o ovoj raspravi >
comments-conversationThread-showMoreOfThisConversation =
  Prikaži više ove rasprave

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Trenutno pregledavate jednu raspravu
comments-inReplyTo = U odgovoru <Username></Username>
comments-replyingTo = Odgovarate <Username></Username>

comments-reportButton-report = Prijavite
comments-reportButton-reported = Prijavljeno
comments-reportButton-aria-report =
  .aria-label = Prijavite komentar od {$username}
comments-reportButton-aria-reported =
  .aria-label = Prijavljeno

comments-sortMenu-sortBy = Sortirajte po
comments-sortMenu-newest = Najnovije
comments-sortMenu-oldest = Najstarije
comments-sortMenu-mostReplies = Najviše odgovora

comments-userPopover =
  .description = Skočni prozor s više informacija o korisniku
comments-userPopover-memberSince = Član od: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignorirajte

comments-userIgnorePopover-ignoreUser = Ignorirajte {$username}?
comments-userIgnorePopover-description =
  Kad ignorirate komentatora, svi komentari
  koje je napisao na stranici bit će skriveni
  od vas. To možete poništiti kasnije iz Mojeg profila.
comments-userIgnorePopover-ignore = Ignorirajte
comments-userIgnorePopover-cancel = Otkažite

comments-userBanPopover-title = Blokirajte {$username}?
comments-userSiteBanPopover-title = Blokirajte {$username} s ove stranice?
comments-userBanPopover-description =
  Jednom blokiranim, ovaj korisnik više neće moći
  komentirati, koristiti reakcije ili prijavljivati komentare.
  Ovaj komentar će također biti odbijen.
comments-userBanPopover-cancel = Otkažite
comments-userBanPopover-ban = Blokirajte

comments-moderationDropdown-popover =
  .description = A popover menu to moderate the comment
comments-moderationDropdown-feature = Feature
comments-moderationDropdown-unfeature = Un-feature
comments-moderationDropdown-approve = Approve
comments-moderationDropdown-approved = Approved
comments-moderationDropdown-reject = Reject
comments-moderationDropdown-rejected = Rejected
comments-moderationDropdown-ban = Ban User
comments-moderationDropdown-siteBan = Site Ban
comments-moderationDropdown-banned = Banned
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderation view
comments-moderationDropdown-moderateStory = Moderate story
comments-moderationDropdown-caretButton =
  .aria-label = Moderate

comments-moderationRejectedTombstone-title = Odbili ste ovaj komentar.
comments-moderationRejectedTombstone-moderateLink =
  Idite na moderiranje da biste pregledali odluku

comments-featuredTag = Izdvojeno

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    *[other] {$reaction} komentara od {$username} (Ukupno: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    [one] {$reaction} kometar od {$username}
    *[other] {$reaction} kometara od {$username} (Ukupno: {$count})
  }

comments-jumpToComment-title = Vaš odgovor je objavljen ispod
comments-jumpToComment-GoToReply = Idi na odgovor

comments-mobileToolbar-closeButton =
  .aria-label = Zatvorite
comments-mobileToolbar-unmarkAll = Označite sve kao pročitano
comments-mobileToolbar-nextUnread = Sljedeće nepročitano

comments-replyChangedWarning-theCommentHasJust =
  Ovaj komentar je upravo uređen. Najnovija verzija je prikazana iznad.

### Q&A

general-tabBar-qaTab = PiO

qa-postCommentForm-section =
  .aria-label = Postavite pitanje

qa-answeredTab = Odgovoreno
qa-unansweredTab = Neodgovoreno
qa-allCommentsTab = Sve

qa-answered-answerLabel =
  Odgovor od {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Idi na raspravu
qa-answered-replies = Odgovori

qa-noQuestionsAtAll =
  Nema pitanja na ovoj priči.
qa-noQuestionsYet =
  Nema pitanja još. Zašto ne postavite jedno?
qa-viewNew-loading = Učitavamo...
qa-viewNew =
  { $count ->
    [1] Pogledajte {$count} Novo Pitanje
    [few] Pogledajte {$count} Nova Pitanja
    *[other] Pogledatje {$count} Novih pitanja
  }

qa-postQuestionForm-rteLabel = Postavite pitanje
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Najviše glasova

qa-answered-tag = odgovoreno
qa-expert-tag = stručnjak

qa-reaction-vote = Glasajte
qa-reaction-voted = Glasali ste

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Glasajte za komentar od {$username}
    *[other] Glasajte ({$count}) za komentar za {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Glasali ste za komentar od {$username}
    [one] Glasali ste za komentar od {$username}
    *[other] Voted ({$count}) for comment by {$username}
  }

qa-unansweredTab-doneAnswering = Završeno

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Kako je odgovoreno?
qa-answeredTooltip-answeredComments =
  Na pitanja odgovaraju stručnjaci za PiO.
qa-answeredTooltip-toggleButton =
  .aria-label = Prikažite odgovore
  .title = Prikažite odgovore

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Zahtjev za brisanje računa
comments-stream-deleteAccount-callOut-receivedDesc =
  Zahtjev za brisanje računa je primljen { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Ako želite nastaviti ostavljati komentare, odgovore ili reakcije,
  možete poništiti zahtjev za brisanje računa prije { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Otkazivanje zahtjeva za brisanje računa
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Otkazivanje zahtjeva za brisanje računa

comments-permalink-copyLink = Kopirajte poveznicu
comments-permalink-linkCopied = Poveznica je kopirana

### Embed Links

comments-embedLinks-showEmbeds = Prikažite ugrađene objave
comments-embedLinks-hideEmbeds = Sakrijte ugrađene objave

comments-embedLinks-show-giphy = Prikaži GIF
comments-embedLinks-hide-giphy = Sakrij GIF

comments-embedLinks-show-youtube = Prikaži video
comments-embedLinks-hide-youtube = Sakrij video

comments-embedLinks-show-twitter = Prikaži Tweet
comments-embedLinks-hide-twitter = Sakrij Tweet

comments-embedLinks-show-external = Prikaži sliku
comments-embedLinks-hide-external = Sakrij sliku

comments-embedLinks-expand = Proširite

### Featured Comments
comments-featured-label =
  Izdvojeni komentar od {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Idi na raspravu
comments-featured-replies = Odgovori

## Profile Tab

profile-myCommentsTab = Moji komentari
profile-myCommentsTab-comments = Moji komentari
profile-accountTab = Račun
profile-preferencesTab = Postavke

### Bio
profile-bio-title = Bio
profile-bio-description =
  Napravite bio za prikaz javno na vašem profilu za komentiranje.
  Mora biti manje od 100 znakova.
profile-bio-remove = Uklonite bio
profile-bio-update = Ažurirajte bio
profile-bio-success = Vaša biografija je ažurirana.
profile-bio-removed = Vaša biografija je uklonjena.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Vaš račun će biti trajno izbrisan { $date }.
profile-accountDeletion-cancelDeletion =
  Otkažite brisanje računa
profile-accountDeletion-cancelAccountDeletion =
  Otkažite brisanje računa

### Comment History
profile-commentHistory-section =
  .aria-label = Povijest komentara
profile-historyComment-commentLabel =
  Komentar <RelativeTime></RelativeTime> na { $storyTitle }
profile-historyComment-viewConversation = Pregledaj raspravu
profile-historyComment-replies = Odgovora {$replyCount}
profile-historyComment-commentHistory = Povijest komentara
profile-historyComment-story = Objava: {$title}
profile-historyComment-comment-on = Komentar na:
profile-profileQuery-errorLoadingProfile = Greška pri učitavanju profila
profile-profileQuery-storyNotFound = Objava nije pronađena
profile-commentHistory-loadMore = Učitajte više
profile-commentHistory-empty = Niste ostavili komentare.
profile-commentHistory-empty-subheading = Poviješću komentara možete pratiti svoje komentare.

profile-commentHistory-archived-thisIsAllYourComments =
  Ovo su svi vaši komentari of prije { $value } { $unit ->
    [second] { $value ->
      [1] sekunde
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minute
      [few] minute
      *[other] minuta
    }
    [hour] { $value ->
      [1] sata
      [few] sata
      *[other] sati
    }
    [day] { $value ->
      [1] dana
      [few] dana
      *[other] dana
    }
    [week] { $value ->
      [1] tjedna
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjeseca
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godine
      *[other] godina
    }
    *[other] nepoznata jedinica
  }. Kako bi vidjeli sve vaše komentare, obratite nam se.

### Preferences

profile-preferences-mediaPreferences = Postavke medija
profile-preferences-mediaPreferences-alwaysShow = Uvijek prikažite GIF-ove, Tweet-ove, YouTube itd.
profile-preferences-mediaPreferences-thisMayMake = Ovo može učiniti da se komentari sporo učitavaju
profile-preferences-mediaPreferences-update = Ažurirajte
profile-preferences-mediaPreferences-preferencesUpdated =
  Postavke medija su ažurirane.

### Account
profile-account-ignoredCommenters = Ignorirani komentatori
profile-account-ignoredCommenters-description =
  Možeš ignorirati druge komentatore klikom na njihovo korisničko ime
  i odabirom Ignoriraj. Kada ignorirate nekoga, svi njegovi
  komentari su skriveni od vas. Komentatori koje ignorirate i dalje će
  moći vidjeti vaše komentare.
profile-account-ignoredCommenters-empty = Trenutno ne ignorirate nikoga.
profile-account-ignoredCommenters-stopIgnoring = Prestanite ignorirati
profile-account-ignoredCommenters-youAreNoLonger =
  Više ne ignorirate nikoga.
profile-account-ignoredCommenters-manage = Uredite
profile-account-ignoredCommenters-cancel = Otkažite
profile-account-ignoredCommenters-close = Zatvorite

profile-account-changePassword-cancel = Otkažite
profile-account-changePassword = Promijenite lozinku
profile-account-changePassword-oldPassword = Stara lozinka
profile-account-changePassword-forgotPassword = Zaboravili ste lozinku?
profile-account-changePassword-newPassword = Nova lozinka
profile-account-changePassword-button = Promijenite lozinku
profile-account-changePassword-updated =
  Vaša lozinka je ažurirana
profile-account-changePassword-password = Lozinka

profile-account-download-comments-title = Preuzmite povijest komentara
profile-account-download-comments-description =
  Primit ćete e-poštu s vezom za preuzimanje povijesti komentara.
  Možete napraviti <strong>jedan zahtjev za preuzimanje svakih 14 dana.</strong>
profile-account-download-comments-request =
  Zahtjev za povijest komentara
profile-account-download-comments-request-icon =
  .title = Zahtjev za povijest komentara
profile-account-download-comments-recentRequest =
  Vaš najnoviji zahtjev: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Vaš najnoviji zahtjev je bio prije 14 dana. Možete napraviti
  zahtjev za preuzimanje komentara ponovno: { $timeStamp }
profile-account-download-comments-requested =
  Zahtjev je poslan. Možete napraviti novi zahtjev za preuzimanje za { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Vaš zahtjev je uspješno poslan. Možete napraviti novi zahtjev
  za preuzimanje za { framework-timeago-time }.
profile-account-download-comments-error =
  Nismo mogli dovršiti vaš zahtjev za preuzimanje.
profile-account-download-comments-request-button = Zatražite

## Delete Account

profile-account-deleteAccount-title = Delete My Account
profile-account-deleteAccount-deleteMyAccount = Delete my account
profile-account-deleteAccount-description =
  Deleting your account will permanently erase your profile and remove
  all your comments from this site.
profile-account-deleteAccount-requestDelete = Request account deletion

profile-account-deleteAccount-cancelDelete-description =
  You have already submitted a request to delete your account.
  Your account will be deleted on { $date }.
  You may cancel the request until that time.
profile-account-deleteAccount-cancelDelete = Cancel account deletion request

profile-account-deleteAccount-request = Request
profile-account-deleteAccount-cancel = Cancel
profile-account-deleteAccount-pages-deleteButton = Delete my account
profile-account-deleteAccount-pages-cancel = Cancel
profile-account-deleteAccount-pages-proceed = Proceed
profile-account-deleteAccount-pages-done = Done
profile-account-deleteAccount-pages-phrase =
  .aria-label = Phrase

profile-account-deleteAccount-pages-sharedHeader = Delete my account

profile-account-deleteAccount-pages-descriptionHeader = Delete my account?
profile-account-deleteAccount-pages-descriptionText =
  You are attempting to delete your account. This means:
profile-account-deleteAccount-pages-allCommentsRemoved =
  All of your comments are removed from this site
profile-account-deleteAccount-pages-allCommentsDeleted =
  All of your comments are deleted from our database
profile-account-deleteAccount-pages-emailRemoved =
  Your email address is removed from our system

profile-account-deleteAccount-pages-whenHeader = Delete my account: When?
profile-account-deleteAccount-pages-whenSubHeader = When?
profile-account-deleteAccount-pages-whenSec1Header =
  When will my account be deleted?
profile-account-deleteAccount-pages-whenSec1Content =
  Your account will be deleted 24 hours after your request has been submitted.
profile-account-deleteAccount-pages-whenSec2Header =
  Can I still write comments until my account is deleted?
profile-account-deleteAccount-pages-whenSec2Content =
  No. Once you've requested account deletion, you can no longer write comments,
  reply to comments, or select reactions.

profile-account-deleteAccount-pages-downloadCommentHeader = Download my comments?
profile-account-deleteAccount-pages-downloadSubHeader = Download my comments
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Before your account is deleted, we recommend you download your comment
  history for your records. After your account is deleted, you will be
  unable to request your comment history.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Download My Comment History

profile-account-deleteAccount-pages-confirmHeader = Confirm account deletion?
profile-account-deleteAccount-pages-confirmSubHeader = Are you sure?
profile-account-deleteAccount-pages-confirmDescHeader =
  Are you sure you want to delete your account?
profile-account-deleteAccount-confirmDescContent =
  To confirm you would like to delete your account please type in the following
  phrase into the text box below:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  To confirm, type phrase below:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Enter your password:

profile-account-deleteAccount-pages-completeHeader = Account deletion requested
profile-account-deleteAccount-pages-completeSubHeader = Request submitted
profile-account-deleteAccount-pages-completeDescript =
  Your request has been submitted and a confirmation has been sent to the email
  address associated with your account.
profile-account-deleteAccount-pages-completeTimeHeader =
  Your account will be deleted on: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Changed your mind?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Simply sign in to your account again before this time and select
  <strong>Cancel Account Deletion Request</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Tell us why.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  We'd like to know why you chose to delete your account. Send us feedback on
  our comment system by emailing { $email }.
profile-account-changePassword-edit = Edit
profile-account-changePassword-change = Change


## Notifications
profile-notificationsTab = Obavijesti
profile-account-notifications-emailNotifications = Email obavijesti
profile-account-notifications-emailNotifications = Email obavijesti
profile-account-notifications-receiveWhen = Primite obavijesti kada:
profile-account-notifications-onReply = Moj komentar dobije odgovor
profile-account-notifications-onFeatured = Moj komentar bude izdvojen
profile-account-notifications-onStaffReplies = Moj komentar dobije odgovor od osoblja
profile-account-notifications-onModeration = Moj komentar bude moderiran
profile-account-notifications-sendNotifications = Šalji obavijesti:
profile-account-notifications-sendNotifications-immediately = Odmah
profile-account-notifications-sendNotifications-daily = Dnevno
profile-account-notifications-sendNotifications-hourly = Svaki sat
profile-account-notifications-updated = Vaše postavke obavijesti su ažurirane.
profile-account-notifications-button = Ažuriraj postavke obavijesti
profile-account-notifications-button-update = Ažuriraj

## Report Comment Popover
comments-reportPopover =
  .description = A dialog for reporting comments
comments-reportPopover-reportThisComment = Prijavi ovaj komentar
comments-reportPopover-whyAreYouReporting = Zašto prijavljujete ovaj komentar?

comments-reportPopover-reasonOffensive = Ovaj komentar je uvredljiv
comments-reportPopover-reasonAbusive = Ovaj komentator je uvredljiv
comments-reportPopover-reasonIDisagree = Ne slažem se s ovim komentarom
comments-reportPopover-reasonSpam = Ovo izgleada kao spam
comments-reportPopover-reasonOther = Drugo

comments-reportPopover-additionalInformation =
  Dodatne informacije <optional>Neobavezno</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Moli vas da ostavite dodatne informacije koje bi mogle biti korisne našim moderatorima.

comments-reportPopover-maxCharacters = Maks. { $maxCharacters } Znakova
comments-reportPopover-restrictToMaxCharacters = Molimo ograničite svoj izvještaj na { $maxCharacters } znakova
comments-reportPopover-cancel = Otkaži
comments-reportPopover-submit = Pošalji

comments-reportPopover-thankYou = Hvala Vam!
comments-reportPopover-receivedMessage =
  Primili smo vašu poruku. Prijave od članova kao što ste vi čuvaju zajednicu sigurnom.

comments-reportPopover-dismiss = Otpusti

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Prijavi ovaj komentar
comments-archivedReportPopover-doesThisComment =
  Krši li ovaj komentar naše smjernice zajednice? Je li uvredljiv ili spam?
  Pošaljite email našem timu za moderaciju na <a>{ $orgName }</a> s vezom za
  ovaj komentar i kratak opis.
comments-archivedReportPopover-needALink =
  Trebate poveznicu na ovaj komentar?
comments-archivedReportPopover-copyLink = Kopirajte vezu

comments-archivedReportPopover-emailSubject = Report comment
comments-archivedReportPopover-emailBody =
  I would like to report the following comment:
  %0A
  { $permalinkURL }
  %0A
  %0A
  For the reasons stated below:

## Submit Status
comments-submitStatus-dismiss = Dismiss
comments-submitStatus-submittedAndWillBeReviewed =
  Your comment has been submitted and will be reviewed by a moderator
comments-submitStatus-submittedAndRejected =
  This comment has been rejected for violating our guidelines

# Configure
configure-configureQuery-errorLoadingProfile = Error loading configure
configure-configureQuery-storyNotFound = Story not found

## Archive
configure-archived-title = This comment stream has been archived
configure-archived-onArchivedStream =
  On archived streams, no new comments, reactions, or reports may be
  submitted. Also, comments cannot be moderated.
configure-archived-toAllowTheseActions =
  To allow these actions, unarchive the stream.
configure-archived-unarchiveStream = Unarchive stream

## Change username
profile-changeUsername-username = Username
profile-changeUsername-success = Your username has been successfully updated
profile-changeUsername-edit = Edit
profile-changeUsername-change = Change
profile-changeUsername-heading = Edit your username
profile-changeUsername-heading-changeYourUsername = Change your username
profile-changeUsername-desc = Change the username that will appear on all of your past and future comments. <strong>Usernames can be changed once every { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Change the username that will appear on all of your past and future comments. Usernames can be changed once every { framework-timeago-time }.
profile-changeUsername-current = Current username
profile-changeUsername-newUsername-label = New username
profile-changeUsername-confirmNewUsername-label = Confirm new username
profile-changeUsername-cancel = Cancel
profile-changeUsername-save = Save
profile-changeUsername-saveChanges = Save Changes
profile-changeUsername-recentChange = Your username has been changed in the last . You may change your username again on { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  You changed your username within the last { framework-timeago-time }. You may change your username again on: { $nextUpdate }.
profile-changeUsername-close = Close

## Discussions tab

discussions-mostActiveDiscussions = Most active discussions
discussions-mostActiveDiscussions-subhead = Ranked by the most comments received over the last 24 hours on { $siteName }
discussions-mostActiveDiscussions-empty = You haven’t participated in any discussions
discussions-myOngoingDiscussions = My ongoing discussions
discussions-myOngoingDiscussions-subhead = Where you’ve commented across { $orgName }
discussions-viewFullHistory = View full comment history
discussions-discussionsQuery-errorLoadingProfile = Error loading profile
discussions-discussionsQuery-storyNotFound = Story not found

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Configure this stream
configure-stream-apply =
configure-stream-update = Update
configure-stream-streamHasBeenUpdated =
  This stream has been updated

configure-premod-title =
configure-premod-premoderateAllComments = Pre-moderate all comments
configure-premod-description =
  Moderators must approve any comment before it is published to this story.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Pre-moderate comments containing links
configure-premodLink-description =
  Moderators must approve any comment that contains a link before it is published to this story.

configure-messageBox-title =
configure-addMessage-title =
  Add a message or question
configure-messageBox-description =
configure-addMessage-description =
  Add a message to the top of the comment box for your readers. Use this
  to pose a topic, ask a question or make announcements relating to this
  story.
configure-addMessage-addMessage = Add message
configure-addMessage-removed = Message has been removed
config-addMessage-messageHasBeenAdded =
  The message has been added to the comment box
configure-addMessage-remove = Remove
configure-addMessage-submitUpdate = Update
configure-addMessage-cancel = Cancel
configure-addMessage-submitAdd = Add message

configure-messageBox-preview = Preview
configure-messageBox-selectAnIcon = Select an icon
configure-messageBox-iconConversation = Conversation
configure-messageBox-iconDate = Date
configure-messageBox-iconHelp = Help
configure-messageBox-iconWarning = Warning
configure-messageBox-iconChatBubble = Chat bubble
configure-messageBox-noIcon = No icon
configure-messageBox-writeAMessage = Write a message

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Close comment stream
configure-closeStream-description =
  This comment stream is currently open. By closing this comment stream,
  no new comments may be submitted and all previously submitted comments
  will still be displayed.
configure-closeStream-closeStream = Close Stream
configure-closeStream-theStreamIsNowOpen = The stream is now open

configure-openStream-title = Open Stream
configure-openStream-description =
  This comment stream is currently closed. By opening this comment
  stream new comments may be submitted and displayed.
configure-openStream-openStream = Open Stream
configure-openStream-theStreamIsNowClosed = The stream is now closed

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  The Q&A format is currently in active development. Please contact
  us with any feedback or requests.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Switch to Q&A format
configure-enableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-enableQA-enableQA = Switch to Q&A
configure-enableQA-streamIsNowComments =
  This stream is now in comments format

configure-disableQA-title = Configure this Q&A
configure-disableQA-description =
  The Q&A format allows community members to submit questions for chosen
  experts to answer.
configure-disableQA-disableQA = Switch to Comments
configure-disableQA-streamIsNowQA =
  This stream is now in Q&A format

configure-experts-title = Add an Expert
configure-experts-filter-searchField =
  .placeholder = Search by email or username
  .aria-label = Search by email or username
configure-experts-filter-searchButton =
  .aria-label = Search
configure-experts-filter-description =
  Adds an Expert Badge to comments by registered users, only on this
  page. New users must first sign up and open the comments on a page
  to create their account.
configure-experts-search-none-found = No users were found with that email or username
configure-experts-
configure-experts-remove-button = Remove
configure-experts-load-more = Load More
configure-experts-none-yet = There are currently no experts for this Q&A.
configure-experts-search-title = Search for an expert
configure-experts-assigned-title = Experts
configure-experts-noLongerAnExpert = is no longer an expert
comments-tombstone-ignore-user = This comment is hidden because you ignored this user.
comments-tombstone-showComment = Show comment
comments-tombstone-deleted =
  This comment is no longer available. The commenter has deleted their account.
comments-tombstone-rejected =
  This comment has been removed by a moderator for violating our community guidelines.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Your account has been temporarily suspended from commenting
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  In accordance with { $organization }'s community guidelines your
  account has been temporarily suspended. While suspended you will not
  be able to comment, use reactions or report comments.
suspendInfo-until-pleaseRejoinThe =
  Please rejoin the conversation on { $until }

warning-heading = Your account has been issued a warning
warning-explanation =
  In accordance with our community guidelines your account has been issued a warning.
warning-instructions =
  To continue participating in discussions, please press the "Acknowledge" button below.
warning-acknowledge = Acknowledge

warning-notice = Your account has been issued a warning. To continue participating please <a>review the warning message</a>.

modMessage-heading = Your account has been sent a message by a moderator
modMessage-acknowledge = Acknowledge

profile-changeEmail-unverified = (Unverified)
profile-changeEmail-current = (current)
profile-changeEmail-edit = Edit
profile-changeEmail-change = Change
profile-changeEmail-please-verify = Verify your email address
profile-changeEmail-please-verify-details =
  An email has been sent to { $email } to verify your account.
  You must verify your new email address before it can be used
  to sign in to your account or to receive notifications.
profile-changeEmail-resend = Resend verification
profile-changeEmail-heading = Edit your email address
profile-changeEmail-changeYourEmailAddress =
  Change your email address
profile-changeEmail-desc = Change the email address used for signing in and for receiving communication about your account.
profile-changeEmail-newEmail-label = New email address
profile-changeEmail-password = Password
profile-changeEmail-password-input =
  .placeholder = Password
profile-changeEmail-cancel = Cancel
profile-changeEmail-submit = Save
profile-changeEmail-saveChanges = Save changes
profile-changeEmail-email = Email
profile-changeEmail-title = Email address
profile-changeEmail-success = Your email has been successfully updated

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Submit a Review or Ask a Question

ratingsAndReviews-reviewsTab = Reviews
ratingsAndReviews-questionsTab = Questions
ratingsAndReviews-noReviewsAtAll = There are no reviews.
ratingsAndReviews-noQuestionsAtAll = There are no questions.
ratingsAndReviews-noReviewsYet = There are no reviews yet. Why don't you write one?
ratingsAndReviews-noQuestionsYet = There are no questions yet. Why don't you ask one?
ratingsAndReviews-selectARating = Select a rating
ratingsAndReviews-youRatedThis = You rated this
ratingsAndReviews-showReview = Show review
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Rate and Review
ratingsAndReviews-askAQuestion = Ask a Question
ratingsAndReviews-basedOnRatings = { $count ->
  [0] No ratings yet
  [1] Based on 1 rating
  *[other] Based on { SHORT_NUMBER($count) } ratings
}

ratingsAndReviews-allReviewsFilter = All reviews
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Zvijezda
  [few] { $rating } Zvijezde
  *[other] { $rating } Zvijezdi
}

comments-addAReviewForm-rteLabel = Add a review (optional)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Vrh članka
  .title = Idi na vrh članka
stream-footer-links-top-of-comments = Vrh komentara
  .title = Idi na vrh komentara
stream-footer-links-profile = Profil i odgovori
  .title = Idi na profil i odgovore
stream-footer-links-discussions = Više rasprava
  .title = Idi na više rasprava
stream-footer-navigation =
  .aria-label = Podnožje komentara

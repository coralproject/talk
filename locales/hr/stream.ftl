### Lokalizacija za Ugrađeni Stream

## Općenito

general-commentsEmbedSection =
  .aria-label = Ugrađeni Komentari

general-moderate = Moderiraj
general-archived = Arhivirano

general-userBoxUnauthenticated-joinTheConversation = Pridružite se razgovoru
general-userBoxUnauthenticated-signIn = Prijavite se
general-userBoxUnauthenticated-register = Registrirajte se

general-authenticationSection =
  .aria-label = Autentifikacija

general-userBoxAuthenticated-signedIn =
  Prijavljeni ste kao
general-userBoxAuthenticated-notYou =
  Niste vi? <button>Odjavite se</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Uspješno ste se odjavili

general-tabBar-commentsTab = Komentari
general-tabBar-myProfileTab = Moj Profil
general-tabBar-discussionsTab = Rasprave
general-tabBar-reviewsTab = Recenzije
general-tabBar-configure = Konfiguriraj
general-tabBar-notifications = Obavijesti
general-tabBar-notifications-hasNew = Obavijesti (ima novih)

general-mainTablist =
  .aria-label = Glavni Popis Kartica

general-secondaryTablist =
  .aria-label = Sekundarni Popis Kartica

## Broj Komentara

comment-count-text =
  { $count  ->
    [one] Komentar
    *[other] Komentari
  }

comment-count-text-ratings =
  { $count  ->
    [one] Ocjena
    *[other] Ocjene
  }

## Kartica Komentara
addACommentButton =
  .aria-label = Dodajte komentar. Ovaj gumb će premjestiti fokus na dno komentara.

comments-allCommentsTab = Svi Komentari
comments-featuredTab = Istaknuto
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 osoba gleda ovu raspravu
    *[other] { SHORT_NUMBER($count) } ljudi gleda ovu raspravu
  }

comments-announcement-section =
  .aria-label = Obavijest
comments-announcement-closeButton =
  .aria-label = Zatvori Obavijest

comments-accountStatus-section =
  .aria-label = Status Računa

comments-featuredCommentTooltip-how = Kako je komentar istaknut?
comments-featuredCommentTooltip-handSelectedComments =
  Komentari su odabrani od strane našeg tima kao vrijedni čitanja.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Prebaci tooltip istaknutih komentara
  .title = Prebaci tooltip istaknutih komentara

comment-top-commenter-tooltip-header = <icon></icon> Najbolji komentator
comment-top-commenter-tooltip-details = Jedan od njihovih komentara je istaknut u posljednjih 10 dana

comment-new-commenter-tooltip-details = Novi komentator, pozdravite ga

comments-collapse-toggle-with-username =
  .aria-label = Sakrij komentar od { $username } i njegove odgovore
comments-collapse-toggle-without-username =
  .aria-label = Sakrij komentar i njegove odgovore
comments-expand-toggle-with-username =
  .aria-label = Prikaži komentar od { $username } i njegove odgovore
comments-expand-toggle-without-username =
  .aria-label = Prikaži komentar i njegove odgovore
comments-bannedInfo-bannedFromCommenting = Vaš račun je zabranjen za komentiranje.
comments-bannedInfo-violatedCommunityGuidelines =
  Netko s pristupom vašem računu je prekršio naše smjernice zajednice. Kao rezultat toga, vaš račun je zabranjen. Više nećete moći komentirati, koristiti reakcije ili prijavljivati komentare. Ako mislite da je ovo greška, kontaktirajte naš tim za zajednicu.

comments-noCommentsAtAll = Nema komentara na ovu priču.
comments-noCommentsYet = Još nema komentara. Zašto ne biste napisali jedan?

comments-streamQuery-storyNotFound = Priča nije pronađena

comments-communityGuidelines-section =
  .aria-label = Smjernice Zajednice

comments-commentForm-cancel = Otkaži
comments-commentForm-saveChanges = Spremi promjene
comments-commentForm-submit = Pošalji

comments-postCommentForm-section =
  .aria-label = Objavi Komentar
comments-postCommentForm-submit = Pošalji
comments-replyList-showAll = Prikaži Sve
comments-replyList-showMoreReplies = Prikaži Više Odgovora

comments-postComment-gifSearch = Pretraži GIF
comments-postComment-gifSearch-search =
  .aria-label = Pretraži
comments-postComment-gifSearch-search-loadMore = Učitaj više
comments-postComment-gifSearch-loading = Učitavanje...
comments-postComment-gifSearch-no-results = Nema rezultata za {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy
comments-postComment-gifSearch-powered-by-tenor =
  .alt = Powered by tenor

comments-postComment-pasteImage = Zalijepi URL slike
comments-postComment-insertImage = Umetni

comments-postComment-confirmMedia-youtube = Dodati ovaj YouTube video na kraj vašeg komentara?
comments-postComment-confirmMedia-twitter = Dodati ovu objavu na kraj vašeg komentara?
comments-postComment-confirmMedia-bluesky = Dodati ovu objavu na kraj vašeg komentara?
comments-postComment-confirmMedia-cancel = Otkaži
comments-postComment-confirmMedia-add-tweet = Dodaj objavu
comments-postComment-confirmMedia-add-bluesky = Dodaj objavu
comments-postComment-confirmMedia-add-video = Dodaj video
comments-postComment-confirmMedia-remove = Ukloni
comments-commentForm-gifPreview-remove = Ukloni
comments-viewNew-loading = Učitavanje...
comments-viewNew =
  { $count ->
    [1] Prikaži {$count} Novi Komentar
    *[other] Prikaži {$count} Novih Komentara
  }
comments-loadMore = Učitaj Više
comments-loadAll = Učitaj Sve Komentare
comments-loadAll-loading = Učitavanje...

comments-permalinkPopover =
  .description = Dijalog koji prikazuje trajnu poveznicu na komentar
comments-permalinkPopover-permalinkToComment =
  .aria-label = Trajna poveznica na komentar
comments-permalinkButton-share = Podijeli
comments-permalinkButton =
  .aria-label = Podijeli komentar od {$username}
comments-permalinkButton-copyReportLink = Kopiraj poveznicu za prijavu
comments-permalinkView-section =
  .aria-label = Jedan Razgovor
comments-permalinkView-viewFullDiscussion = Prikaži cijelu raspravu
comments-permalinkView-commentRemovedOrDoesNotExist = Ovaj komentar je uklonjen ili ne postoji.

comments-permalinkView-reportIllegalContent-title = Prijavi potencijalno nezakonit sadržaj
comments-permalinkView-reportIllegalContent-description = Molimo ispunite ovaj obrazac najbolje što možete kako bi naš moderacijski tim mogao donijeti odluku i po potrebi konzultirati pravni odjel naše stranice.
comments-permalinkView-reportIllegalContent-reportingComment = Prijavljujete ovaj komentar
comments-permalinkView-reportIllegalContent-lawBrokenDescription-inputLabel = Koji zakon smatrate da je prekršen? (obavezno)
comments-permalinkView-reportIllegalContent-additionalInformation-inputLabel = Molimo uključite dodatne informacije zašto je ovaj komentar nezakonit (obavezno)
comments-permalinkView-reportIllegalContent-additionalInformation-helperText = Bilo koji detalj koji uključite pomoći će nam u daljnjoj istrazi
comments-permalinkView-reportIllegalContent-additionalComments-inputLabel = Želite li prijaviti još neke komentare zbog potencijalno nezakonitog sadržaja?
comments-permalinkView-reportIllegalContent-bonafideBelief-checkbox = Vjerujem da su informacije uključene u ovu prijavu točne i potpune
comments-permalinkView-reportIllegalContent-additionalComments-addCommentURLButton = <Button></Button>Dodaj
comments-permalinkView-reportIllegalContent-additionalComment-commentURLButton = URL komentara
comments-permalinkView-reportIllegalContent-additionalComments-deleteButton = <icon></icon> Izbriši
comments-permalinkView-reportIllegalContent-submit = Pošalji prijavu
comments-permalinkView-reportIllegalContent-additionalComments-commentNotFoundError = Komentar nije pronađen. Molimo unesite valjani URL komentara
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError = Ovo nije valjani URL. Molimo unesite valjani URL komentara
comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError = Već ste dodali ovaj komentar u ovu prijavu. Molimo dodajte jedinstveni URL komentara
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLLengthError = Duljina dodatnog URL-a komentara premašuje maksimalnu.
comments-permalinkView-reportIllegalContent-additionalComments-previouslyReportedCommentError = Već ste prijavili ovaj komentar zbog potencijalno nezakonitog sadržaja. Možete prijaviti komentar iz ovog razloga samo jednom.
comments-permalinkView-reportIllegalContent-confirmation-successHeader = Primili smo vašu prijavu nezakonitog sadržaja
comments-permalinkView-reportIllegalContent-confirmation-description = Vaša prijava će sada biti pregledana od strane našeg moderacijskog tima. Dobit ćete obavijest kada se donese odluka. Ako se utvrdi da sadržaj sadrži potencijalno nezakonit sadržaj, bit će uklonjen sa stranice i mogu se poduzeti daljnje mjere protiv komentatora.
comments-permalinkView-reportIllegalContent-confirmation-errorHeader = Hvala vam na podnošenju ove prijave
comments-permalinkView-reportIllegalContent-confirmation-errorDescription = Nismo uspjeli podnijeti vašu prijavu iz sljedećih razloga:
comments-permalinkView-reportIllegalContent-confirmation-returnToComments = Sada možete zatvoriti ovu karticu kako biste se vratili na komentare

comments-rte-bold =
  .title = Podebljano

comments-rte-italic =
  .title = Kurziv

comments-rte-blockquote =
  .title = Citat

comments-rte-bulletedList =
  .title = Popis s točkama

comments-rte-strikethrough =
  .title = Precrtano

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkazam

comments-rte-externalImage =
  .title = Vanjska Slika

comments-remainingCharacters = { $remaining } preostalih znakova

comments-postCommentFormFake-signInAndJoin = Prijavite se i Pridružite Razgovoru

comments-postCommentForm-rteLabel = Objavi komentar

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Odgovori
comments-replyButton =
  .aria-label = Odgovori na komentar od {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Pošalji
comments-replyCommentForm-cancel = Otkaži
comments-replyCommentForm-rteLabel = Napiši odgovor
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Razina Niti { $level }:
comments-commentContainer-highlightedLabel = Istaknuto:
comments-commentContainer-ancestorLabel = Predak:
comments-commentContainer-replyLabel =
  Odgovor od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Pitanje od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Komentar od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Uredi

comments-commentContainer-avatar =
  .alt = Avatar za { $username }

Here is the translated content for the `locales/en-US/stream.ftl` file from line 368 to the end:

```unknown
comments-editCommentForm-saveChanges = Spremi promjene
comments-editCommentForm-cancel = Otkaži
comments-editCommentForm-close = Zatvori
comments-editCommentForm-rteLabel = Uredi komentar
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Uredi: <time></time> preostalo
comments-editCommentForm-editTimeExpired = Vrijeme za uređivanje je isteklo. Više ne možete uređivati ovaj komentar. Zašto ne biste objavili novi?
comments-editedMarker-edited = Uređeno
comments-showConversationLink-readMore = Pročitaj Više o Ovom Razgovoru >
comments-conversationThread-showMoreOfThisConversation =
  Prikaži Više o Ovom Razgovoru

comments-permalinkView-currentlyViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Trenutno gledate jedan razgovor
comments-inReplyTo = U odgovoru na <Username></Username>
comments-replyingTo = Odgovarate na <Username></Username>

comments-reportButton-report = Prijavi
comments-reportButton-reported = Prijavljeno
comments-reportButton-aria-report =
  .aria-label = Prijavi komentar od {$username}
comments-reportButton-aria-reported =
  .aria-label = Prijavljeno

comments-sortMenu-sortBy = Sortiraj po
comments-sortMenu-newest = Najnovije
comments-sortMenu-oldest = Najstarije
comments-sortMenu-mostReplies = Najviše odgovora

comments-userPopover =
  .description = Popover s više informacija o korisniku
comments-userPopover-memberSince = Član od: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignoriraj

comments-userIgnorePopover-ignoreUser = Ignorirati {$username}?
comments-userIgnorePopover-description =
  Kada ignorirate komentatora, svi komentari koje
  je napisao na stranici bit će skriveni od vas. Možete
  poništiti ovo kasnije iz Moj Profil.
comments-userIgnorePopover-ignore = Ignoriraj
comments-userIgnorePopover-cancel = Otkaži

comments-userSpamBanPopover-title = Spam zabrana
comments-userSpamBanPopover-header-username = Korisničko ime
comments-userSpamBanPopover-header-description = Spam zabrana će
comments-userSpamBanPopover-callout = Samo za korištenje na očitim spam računima
comments-userSpamBanPopover-description-list-banFromComments = Zabraniti ovom računu komentiranje
comments-userSpamBanPopover-description-list-rejectAllComments = Odbiti sve komentare napisane od strane ovog računa
comments-userSpamBanPopover-confirmation = Upišite "{$text}" za potvrdu

comments-userBanPopover-title = Zabraniti {$username}?
comments-userSiteBanPopover-title = Zabraniti {$username} s ove stranice?
comments-userBanPopover-description =
  Jednom zabranjen, ovaj korisnik više neće moći
  komentirati, koristiti reakcije ili prijavljivati komentare.
  Ovaj komentar će također biti odbijen.
comments-userBanPopover-cancel = Otkaži
comments-userBanPopover-ban = Zabrani
comments-userBanPopover-moderator-ban-error = Ne mogu se zabraniti računi s moderatorskim privilegijama
comments-userBanPopover-moreContext = Za više konteksta, idite na
comments-userBanPopover-moderationView = Moderacijski prikaz

comments-userSiteBanPopover-confirm-title = {$username} je sada zabranjen
comments-userSiteBanPopover-confirm-spam-banned = Ovaj račun više ne može komentirati, koristiti reakcije ili prijavljivati komentare
comments-userSiteBanPopover-confirm-comments-rejected = Svi komentari ovog računa su odbijeni
comments-userSiteBanPopover-confirm-closeButton = Zatvori
comments-userSiteBanPopover-confirm-reviewAccountHistory = Još uvijek možete pregledati povijest ovog računa pretraživanjem u Coralovom
comments-userSiteBanPopover-confirm-communitySection = Odjeljak zajednice

comments-moderationDropdown-popover =
  .description = Popover izbornik za moderiranje komentara
comments-moderationDropdown-feature = Istakni
comments-moderationDropdown-unfeature = Ukloni isticanje
comments-moderationDropdown-approve = Odobri
comments-moderationDropdown-approved = Odobreno
comments-moderationDropdown-reject = Odbij
comments-moderationDropdown-rejected = Odbijeno
comments-moderationDropdown-spam-ban = Spam zabrana
comments-moderationDropdown-ban = Zabrani korisnika
comments-moderationDropdown-siteBan = Zabrani na stranici
comments-moderationDropdown-banned = Zabranjeno
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderacijski prikaz
comments-moderationDropdown-moderateStory = Moderiraj priču
comments-moderationDropdown-caretButton =
  .aria-label = Moderiraj

comments-moderationDropdown-embedCode = Ugradi kod
comments-moderationDropdown-embedCodeCopied = Kod kopiran

comments-moderationRejectedTombstone-title = Odbili ste ovaj komentar.
comments-moderationRejectedTombstone-moderateLink =
  Idite na moderiranje kako biste pregledali ovu odluku

comments-featuredTag = Istaknuto
comments-featuredBy = Istaknuo <strong>{$username}</strong>

# $reaction može biti "Poštovanje" kao primjer. Budite oprezni pri prevođenju na druge jezike s različitim gramatičkim slučajevima.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    *[other] {$reaction} komentar od {$username} (Ukupno: {$count})
  }

# $reaction može biti "Poštovano" kao primjer. Budite oprezni pri prevođenju na druge jezike s različitim gramatičkim slučajevima.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} komentar od {$username}
    [one] {$reaction} komentar od {$username}
    *[other] {$reaction} komentar od {$username} (Ukupno: {$count})
  }

comments-jumpToComment-title = Vaš odgovor je objavljen ispod
comments-jumpToComment-GoToReply = Idi na odgovor

comments-mobileToolbar-unmarkAll = Označi sve kao pročitano
comments-mobileToolbar-nextUnread = Sljedeće nepročitano

comments-refreshComments-closeButton = Zatvori <icon></icon>
  .aria-label = Zatvori
comments-refreshComments-refreshButton = <icon></icon> Osvježi komentare
  .aria-label = Osvježi komentare
comments-refreshQuestions-refreshButton = <icon></icon> Osvježi pitanja
  .aria-label = Osvježi pitanja
comments-refreshReviews-refreshButton = <icon></icon> Osvježi recenzije
  .aria-label = Osvježi recenzije

comments-replyChangedWarning-theCommentHasJust =
  Ovaj komentar je upravo uređen. Najnovija verzija je prikazana iznad.

comments-mobileToolbar-notifications-closeButton =
  .aria-label = Zatvori obavijesti

### Q&A

general-tabBar-qaTab = Pitanja i Odgovori

qa-postCommentForm-section =
  .aria-label = Postavite Pitanje

qa-answeredTab = Odgovoreno
qa-unansweredTab = Neodgovoreno
qa-allCommentsTab = Svi

qa-answered-answerLabel =
  Odgovor od {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Idi na razgovor
qa-answered-replies = Odgovori

qa-noQuestionsAtAll =
  Nema pitanja na ovoj priči.
qa-noQuestionsYet =
  Još nema pitanja. Zašto ne biste postavili jedno?
qa-viewNew-loading = Učitavanje...
qa-viewNew =
  { $count ->
    [1] Pogledajte {$count} Novo Pitanje
    *[other] Pogledajte {$count} Nova Pitanja
  }

qa-postQuestionForm-rteLabel = Postavite pitanje
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Najviše glasova

qa-answered-tag = odgovoreno
qa-expert-tag = stručnjak

qa-reaction-vote = Glasaj
qa-reaction-voted = Glasano

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Glas za komentar od {$username}
    *[other] Glas ({$count}) za komentar od {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Glasano za komentar od {$username}
    [one] Glasano za komentar od {$username}
    *[other] Glasano ({$count}) za komentar od {$username}
  }

qa-unansweredTab-doneAnswering = Gotovo

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Kako je pitanje odgovoreno?
qa-answeredTooltip-answeredComments =
  Pitanja odgovaraju stručnjaci za pitanja i odgovore.
qa-answeredTooltip-toggleButton =
  .aria-label = Prebaci tooltip za odgovorena pitanja
  .title = Prebaci tooltip za odgovorena pitanja

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Zahtjev za brisanje računa
comments-stream-deleteAccount-callOut-receivedDesc =
  Zahtjev za brisanje vašeg računa primljen je { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Ako želite nastaviti ostavljati komentare, odgovore ili reakcije,
  možete otkazati zahtjev za brisanje računa prije { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Otkazati zahtjev za brisanje računa
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Otkazati brisanje računa

comments-permalink-copyLink = Kopiraj poveznicu
comments-permalink-linkCopied = Poveznica kopirana

### Embed Links

comments-embedLinks-showEmbeds = Prikaži ugrađene sadržaje
comments-embedLinks-hideEmbeds = Sakrij ugrađene sadržaje

comments-embedLinks-show-gif = Prikaži GIF

comments-embedLinks-hide-gif = Sakrij GIF

comments-embedLinks-show-youtube = Prikaži video
comments-embedLinks-hide-youtube = Sakrij video

comments-embedLinks-show-twitter = Prikaži post
comments-embedLinks-hide-twitter = Sakrij post

comments-embedLinks-show-bluesky = Prikaži post
comments-embedLinks-hide-bluesky = Sakrij post

comments-embedLinks-show-external = Prikaži sliku
comments-embedLinks-hide-external = Sakrij sliku

comments-embedLinks-expand = Proširi

### Featured Comments
comments-featured-label =
  Istaknuti Komentar od {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Idi na razgovor
comments-featured-gotoConversation-label-with-username =
  .aria-label = Idi na razgovor za ovaj istaknuti komentar od korisnika { $username } u glavnom toku komentara
comments-featured-gotoConversation-label-without-username =
  .aria-label = Idi na razgovor za ovaj istaknuti komentar u glavnom toku komentara
comments-featured-replies = Odgovori

## Profile Tab

profile-myCommentsTab = Moji Komentari
profile-myCommentsTab-comments = Moji komentari
profile-accountTab = Račun
profile-preferencesTab = Postavke

### Bio
profile-bio-title = Bio
profile-bio-description =
  Napišite bio koji će se javno prikazivati na vašem profilu za komentiranje. Mora biti
  kraći od 100 znakova.
profile-bio-remove = Ukloni
profile-bio-update = Ažuriraj
profile-bio-success = Vaš bio je uspješno ažuriran.
profile-bio-removed = Vaš bio je uklonjen.

### Account Deletion

profile-accountDeletion-deletionDesc =
  Vaš račun je zakazan za brisanje { $date }.
profile-accountDeletion-cancelDeletion =
  Otkazati zahtjev za brisanje računa
profile-accountDeletion-cancelAccountDeletion =
  Otkazati brisanje računa

### Comment History
profile-commentHistory-section =
  .aria-label = Povijest Komentara
profile-historyComment-commentLabel =
  Komentar <RelativeTime></RelativeTime> na { $storyTitle }
profile-historyComment-viewConversation = Pogledaj Razgovor
profile-historyComment-replies = Odgovori {$replyCount}
profile-historyComment-commentHistory = Povijest Komentara
profile-historyComment-story = Priča: {$title}
profile-historyComment-comment-on = Komentar na:
profile-profileQuery-errorLoadingProfile = Pogreška pri učitavanju profila
profile-profileQuery-storyNotFound = Priča nije pronađena
profile-commentHistory-loadMore = Učitaj Više
profile-commentHistory-empty = Niste napisali nijedan komentar
profile-commentHistory-empty-subheading = Povijest vaših komentara će se pojaviti ovdje

profile-commentHistory-archived-thisIsAllYourComments =
  Ovo su svi vaši komentari iz prethodnih { $value } { $unit ->
    [second] { $value ->
    [...]
    *[other] nepoznata jedinica
  }. Da biste vidjeli ostatak vaših komentara, kontaktirajte nas.

### Preferences

profile-preferences-mediaPreferences = Postavke Medija
profile-preferences-mediaPreferences-alwaysShow = Uvijek prikaži GIF-ove, X postove, YouTube, itd.
profile-preferences-mediaPreferences-thisMayMake = Ovo može usporiti učitavanje komentara
profile-preferences-mediaPreferences-update = Ažuriraj
profile-preferences-mediaPreferences-preferencesUpdated =
  Vaše postavke medija su ažurirane

### Account
profile-account-ignoredCommenters = Ignorirani Komentatori
profile-account-ignoredCommenters-description =
  Možete ignorirati druge komentatore klikom na njihovo korisničko ime
  i odabirom Ignoriraj. Kada nekoga ignorirate, svi njihovi
  komentari će biti skriveni od vas. Komentatori koje ignorirate će i dalje
  moći vidjeti vaše komentare.
profile-account-ignoredCommenters-empty = Trenutno ne ignorirate nikoga
profile-account-ignoredCommenters-stopIgnoring = Prestani ignorirati
profile-account-ignoredCommenters-youAreNoLonger =
  Više ne ignorirate
profile-account-ignoredCommenters-manage = Upravljaj
  .aria-label = Upravljaj ignoriranim komentatorima
profile-account-ignoredCommenters-cancel = Otkaži
profile-account-ignoredCommenters-close = Zatvori

profile-account-changePassword-cancel = Otkaži
profile-account-changePassword = Promijeni Lozinku
profile-account-changePassword-oldPassword = Stara Lozinka
profile-account-changePassword-forgotPassword = Zaboravili ste lozinku?
profile-account-changePassword-newPassword = Nova Lozinka
profile-account-changePassword-button = Promijeni Lozinku
profile-account-changePassword-updated =
  Vaša lozinka je ažurirana
profile-account-changePassword-password = Lozinka

profile-account-download-comments-title = Preuzmi povijest mojih komentara
profile-account-download-comments-description =
  Dobit ćete e-mail s poveznicom za preuzimanje povijesti vaših komentara.
  Možete napraviti <strong>jedan zahtjev za preuzimanje svakih 14 dana.</strong>
profile-account-download-comments-request =
  Zahtjev za povijest komentara
profile-account-download-comments-request-icon =
  .title = Zahtjev za povijest komentara
profile-account-download-comments-recentRequest =
  Vaš najnoviji zahtjev: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Vaš najnoviji zahtjev je bio unutar posljednjih 14 dana. Možete
  ponovno zatražiti preuzimanje komentara na: { $timeStamp }
profile-account-download-comments-requested =
  Zahtjev poslan. Možete poslati novi zahtjev za { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Vaš zahtjev je uspješno poslan. Možete ponovno zatražiti
  preuzimanje povijesti komentara za { framework-timeago-time }.
profile-account-download-comments-error =
  Nismo uspjeli dovršiti vaš zahtjev za preuzimanje.
profile-account-download-comments-request-button = Zahtjev

## Delete Account

profile-account-deleteAccount-title = Izbriši Moj Račun
profile-account-deleteAccount-deleteMyAccount = Izbriši moj račun
profile-account-deleteAccount-description =
  Brisanje vašeg računa će trajno izbrisati vaš profil i ukloniti
  sve vaše komentare s ove stranice.
profile-account-deleteAccount-requestDelete = Zahtjev za brisanje računa

profile-account-deleteAccount-cancelDelete-description =
  Već ste poslali zahtjev za brisanje računa.
  Vaš račun će biti izbrisan { $date }.
  Možete otkazati zahtjev do tog vremena.
profile-account-deleteAccount-cancelDelete = Otkazati zahtjev za brisanje računa

profile-account-deleteAccount-request = Zahtjev
profile-account-deleteAccount-cancel = Otkaži
profile-account-deleteAccount-pages-deleteButton = Izbriši moj račun
profile-account-deleteAccount-pages-cancel = Otkaži
profile-account-deleteAccount-pages-proceed = Nastavi
profile-account-deleteAccount-pages-done = Gotovo
profile-account-deleteAccount-pages-phrase =
  .aria-label = Fraza

profile-account-deleteAccount-pages-sharedHeader = Izbriši moj račun

profile-account-deleteAccount-pages-descriptionHeader = Izbriši moj račun?
profile-account-deleteAccount-pages-descriptionText =
  Pokušavate izbrisati svoj račun. To znači:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Svi vaši komentari su uklonjeni s ove stranice
profile-account-deleteAccount-pages-allCommentsDeleted =
  Svi vaši komentari su izbrisani iz naše baze podataka
profile-account-deleteAccount-pages-emailRemoved = Vaša e-mail adresa je uklonjena iz naše baze podataka

profile-account-deleteAccount-pages-whenHeader = Izbriši moj račun: Kada?
profile-account-deleteAccount-pages-whenSubHeader = Kada?
profile-account-deleteAccount-pages-whenSec1Header =
  Kada će moj račun biti izbrisan?
profile-account-deleteAccount-pages-whenSec1Content =
  Vaš račun će biti izbrisan 24 sata nakon što je vaš zahtjev podnesen.
profile-account-deleteAccount-pages-whenSec2Header =
  Mogu li i dalje pisati komentare dok moj račun nije izbrisan?
profile-account-deleteAccount-pages-whenSec2Content =
  Ne. Nakon što ste zatražili brisanje računa, više ne možete pisati komentare,
  odgovarati na komentare ili birati reakcije.

profile-account-deleteAccount-pages-downloadCommentHeader = Preuzmi moje komentare?
profile-account-deleteAccount-pages-downloadSubHeader = Preuzmi moje komentare
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Prije nego što vaš račun bude izbrisan, preporučujemo da preuzmete povijest
  svojih komentara za svoje zapise. Nakon što vaš račun bude izbrisan, nećete
  moći zatražiti povijest svojih komentara.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Moj Profil > Preuzmi Povijest Mojih Komentara

profile-account-deleteAccount-pages-confirmHeader = Potvrdi brisanje računa?
profile-account-deleteAccount-pages-confirmSubHeader = Jeste li sigurni?
profile-account-deleteAccount-pages-confirmDescHeader =
  Jeste li sigurni da želite izbrisati svoj račun?
profile-account-deleteAccount-confirmDescContent =
  Da biste potvrdili da želite izbrisati svoj račun, upišite sljedeću
  frazu u tekstualno polje ispod:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Za potvrdu, upišite frazu ispod:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Unesite svoju lozinku:

profile-account-deleteAccount-pages-completeHeader = Zahtjev za brisanje računa podnesen
profile-account-deleteAccount-pages-completeSubHeader = Zahtjev podnesen
profile-account-deleteAccount-pages-completeDescript =
  Vaš zahtjev je podnesen i potvrda je poslana na e-mail adresu
  povezanu s vašim računom.
profile-account-deleteAccount-pages-completeTimeHeader =
  Vaš račun će biti izbrisan na: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Promijenili ste mišljenje?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Jednostavno se ponovno prijavite na svoj račun prije ovog vremena i odaberite
  <strong>Otkazati Zahtjev za Brisanje Računa</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Recite nam zašto.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Željeli bismo znati zašto ste odlučili izbrisati svoj račun. Pošaljite nam povratne informacije o
  našem sustavu komentara putem e-maila na { $email }.
profile-account-changePassword-edit = Uredi
profile-account-changePassword-change = Promijeni
  .aria-label = Promijeni lozinku

## Obavijesti
profile-notificationsTab = Obavijesti
profile-account-notifications-emailNotifications = E-Mail Obavijesti
profile-account-notifications-emailNotifications = Email Obavijesti
profile-account-notifications-receiveWhen = Primajte obavijesti kada:
profile-account-notifications-onReply = Moj komentar dobije odgovor
profile-account-notifications-onFeatured = Moj komentar je istaknut
profile-account-notifications-onStaffReplies = Član osoblja odgovori na moj komentar
profile-account-notifications-onModeration = Moj komentar na čekanju je pregledan
profile-account-notifications-sendNotifications = Pošalji Obavijesti:
profile-account-notifications-sendNotifications-immediately = Odmah
profile-account-notifications-sendNotifications-daily = Dnevno
profile-account-notifications-sendNotifications-hourly = Svakih sat vremena
profile-account-notifications-updated = Vaše postavke obavijesti su ažurirane
profile-account-notifications-button = Ažuriraj Postavke Obavijesti
profile-account-notifications-button-update = Ažuriraj

profile-account-notifications-inPageNotifications = Obavijesti
profile-account-notifications-includeInPageWhen = Obavijesti me kada

profile-account-notifications-inPageNotifications-on = Značke uključene
profile-account-notifications-inPageNotifications-off = Značke isključene

profile-account-notifications-showReplies-fromAnyone = od bilo koga
profile-account-notifications-showReplies-fromStaff = od člana osoblja
profile-account-notifications-showReplies =
  .aria-label = Prikaži odgovore od

## Popover za Prijavu Komentara
comments-reportPopover =
  .description = Dijalog za prijavu komentara
comments-reportPopover-reportThisComment = Prijavi Ovaj Komentar
comments-reportPopover-whyAreYouReporting = Zašto prijavljujete ovaj komentar?

comments-reportPopover-reasonOffensive = Ovaj komentar je uvredljiv
comments-reportPopover-reasonAbusive = Ovaj komentator je zlostavljački
comments-reportPopover-reasonIDisagree = Ne slažem se s ovim komentarom
comments-reportPopover-reasonSpam = Ovo izgleda kao oglas ili marketing
comments-reportPopover-reasonOther = Drugo

comments-reportPopover-additionalInformation =
  Dodatne informacije <optional>Opcionalno</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Molimo ostavite sve dodatne informacije koje bi mogle biti korisne našim moderatorima.

comments-reportPopover-maxCharacters = Maks. { $maxCharacters } Znakova
comments-reportPopover-restrictToMaxCharacters = Molimo ograničite svoju prijavu na { $maxCharacters } znakova
comments-reportPopover-cancel = Otkaži
comments-reportPopover-submit = Pošalji

comments-reportPopover-thankYou = Hvala!
comments-reportPopover-receivedMessage =
  Primili smo vašu poruku. Prijave članova poput vas čuvaju zajednicu sigurnom.

comments-reportPopover-dismiss = Odbaci

comments-reportForm-reportIllegalContent-button = Ovaj komentar sadrži potencijalno nezakonit sadržaj
comments-reportForm-signInToReport = Morate se prijaviti da biste prijavili komentar koji krši naše smjernice

## Arhivirani Popover za Prijavu Komentara

comments-archivedReportPopover-reportThisComment = Prijavi Ovaj Komentar
comments-archivedReportPopover-doesThisComment =
  Da li ovaj komentar krši naše smjernice zajednice? Je li ovo uvredljivo ili spam?
  Pošaljite e-mail našem timu za moderiranje na <a>{ $orgName }</a> s poveznicom na
  ovaj komentar i kratkim objašnjenjem.
comments-archivedReportPopover-needALink =
  Trebate poveznicu na ovaj komentar?
comments-archivedReportPopover-copyLink = Kopiraj poveznicu

comments-archivedReportPopover-emailSubject = Prijavi komentar
comments-archivedReportPopover-emailBody =
  Želio bih prijaviti sljedeći komentar:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Iz sljedećih razloga:

## Status Podnošenja
comments-submitStatus-dismiss = Odbaci
comments-submitStatus-submittedAndWillBeReviewed =
  Vaš komentar je podnesen i bit će pregledan od strane moderatora
comments-submitStatus-submittedAndRejected =
  Ovaj komentar je odbijen zbog jezika koji krši naše smjernice

# Konfiguracija
configure-configureQuery-errorLoadingProfile = Pogreška pri učitavanju konfiguracije
configure-configureQuery-storyNotFound = Priča nije pronađena

## Arhiva
configure-archived-title = Ovaj tok komentara je arhiviran
configure-archived-onArchivedStream =
  Na arhiviranim tokovima, novi komentari, reakcije ili prijave ne mogu biti
  podneseni. Također, komentari ne mogu biti moderirani.
configure-archived-toAllowTheseActions =
  Da biste omogućili ove radnje, de-arhivirajte tok.
configure-archived-unarchiveStream = De-arhiviraj tok

## Promjena korisničkog imena
profile-changeUsername-username = Korisničko ime
profile-changeUsername-success = Vaše korisničko ime je uspješno ažurirano
profile-changeUsername-edit = Uredi
profile-changeUsername-change = Promijeni
  .aria-label = Promijeni korisničko ime
profile-changeUsername-heading = Uredi svoje korisničko ime
profile-changeUsername-heading-changeYourUsername = Promijeni svoje korisničko ime
profile-changeUsername-desc = Promijenite korisničko ime koje će se pojaviti na svim vašim prošlim i budućim komentarima. <strong>Korisnička imena se mogu mijenjati jednom svakih { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Promijenite korisničko ime koje će se pojaviti na svim vašim prošlim i budućim komentarima. Korisnička imena se mogu mijenjati jednom svakih { framework-timeago-time }.
profile-changeUsername-current = Trenutno korisničko ime
profile-changeUsername-newUsername-label = Novo korisničko ime
profile-changeUsername-confirmNewUsername-label = Potvrdite novo korisničko ime
profile-changeUsername-cancel = Otkaži
profile-changeUsername-save = Spremi
profile-changeUsername-saveChanges = Spremi Promjene
profile-changeUsername-recentChange = Vaše korisničko ime je promijenjeno u posljednjih . Možete ponovno promijeniti svoje korisničko ime na { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Promijenili ste svoje korisničko ime unutar posljednjih { framework-timeago-time }. Možete ponovno promijeniti svoje korisničko ime na: { $nextUpdate }.
profile-changeUsername-close = Zatvori

## Kartica Rasprave

discussions-mostActiveDiscussions = Najaktivnije rasprave
discussions-mostActiveDiscussions-subhead = Rangirano prema najviše komentara primljenih u posljednja 24 sata na { $siteName }
discussions-mostActiveDiscussions-empty = Niste sudjelovali ni u jednoj raspravi
discussions-myOngoingDiscussions = Moje tekuće rasprave
discussions-myOngoingDiscussions-subhead = Gdje ste komentirali na { $orgName }
discussions-viewFullHistory = Pogledaj punu povijest komentara
discussions-discussionsQuery-errorLoadingProfile = Pogreška pri učitavanju profila
discussions-discussionsQuery-storyNotFound = Priča nije pronađena

## Tok Komentara
configure-stream-title =
configure-stream-title-configureThisStream =
  Konfiguriraj ovaj tok
configure-stream-apply =
configure-stream-update = Ažuriraj
configure-stream-streamHasBeenUpdated =
  Ovaj tok je ažuriran

configure-premod-title =
configure-premod-premoderateAllComments = Pre-moderiraj sve komentare
configure-premod-description =
  Moderatori moraju odobriti svaki komentar prije nego što bude objavljen na ovoj priči.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Pre-moderiraj komentare koji sadrže poveznice
configure-premodLink-description =
  Moderatori moraju odobriti svaki komentar koji sadrži poveznicu prije nego što bude objavljen na ovoj priči.

configure-messageBox-title =
configure-addMessage-title =
  Dodaj poruku ili pitanje
configure-messageBox-description =
configure-addMessage-description =
  Dodajte poruku na vrh okvira za komentare za svoje čitatelje. Koristite ovo
  za postavljanje teme, postavljanje pitanja ili davanje obavijesti vezanih uz ovu
  priču.
configure-addMessage-addMessage = Dodaj poruku
configure-addMessage-removed = Poruka je uklonjena
config-addMessage-messageHasBeenAdded =
  Poruka je dodana u okvir za komentare
configure-addMessage-remove = Ukloni
configure-addMessage-submitUpdate = Ažuriraj
configure-addMessage-cancel = Otkaži
configure-addMessage-submitAdd = Dodaj poruku

configure-messageBox-preview = Pregled
configure-messageBox-selectAnIcon = Odaberite ikonu
configure-messageBox-iconConversation = Razgovor
configure-messageBox-iconDate = Datum
configure-messageBox-iconHelp = Pomoć
configure-messageBox-iconWarning = Upozorenje
configure-messageBox-iconChatBubble = Balon za razgovor
configure-messageBox-noIcon = Bez ikone
configure-messageBox-writeAMessage = Napišite poruku

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Zatvori tok komentara
configure-closeStream-description =
  Ovaj tok komentara je trenutno otvoren. Zatvaranjem ovog toka komentara,
  novi komentari ne mogu biti podneseni i svi prethodno podneseni komentari
  će i dalje biti prikazani.
configure-closeStream-closeStream = Zatvori Tok
configure-closeStream-theStreamIsNowOpen = Tok je sada otvoren

configure-openStream-title = Otvori Tok
configure-openStream-description =
  Ovaj tok komentara je trenutno zatvoren. Otvaranjem ovog toka
  komentara novi komentari mogu biti podneseni i prikazani.
configure-openStream-openStream = Otvori Tok
configure-openStream-theStreamIsNowClosed = Tok je sada zatvoren

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Format Pitanja i Odgovora je trenutno u aktivnom razvoju. Molimo kontaktirajte
  nas s povratnim informacijama ili zahtjevima.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Prebaci na format Pitanja i Odgovora
configure-enableQA-description =
  Format Pitanja i Odgovora omogućuje članovima zajednice da postavljaju pitanja odabranim
  stručnjacima za odgovore.
configure-enableQA-enableQA = Prebaci na Pitanja i Odgovore
configure-enableQA-streamIsNowComments =
  Ovaj tok je sada u formatu komentara

configure-disableQA-title = Konfiguriraj ovaj Pitanja i Odgovori
configure-disableQA-description =
  Format Pitanja i Odgovora omogućuje članovima zajednice da postavljaju pitanja odabranim
  stručnjacima za odgovore.
configure-disableQA-disableQA = Prebaci na Komentare
configure-disableQA-streamIsNowQA =
  Ovaj tok je sada u formatu Pitanja i Odgovora

configure-experts-title = Dodaj Stručnjaka
configure-experts-filter-searchField =
  .placeholder = Pretraži po e-mailu ili korisničkom imenu
  .aria-label = Pretraži po e-mailu ili korisničkom imenu
configure-experts-filter-searchButton =
  .aria-label = Pretraži
configure-experts-filter-description =
  Dodaje Značku Stručnjaka komentarima registriranih korisnika, samo na ovoj
  stranici. Novi korisnici se prvo moraju prijaviti i otvoriti komentare na stranici
  kako bi kreirali svoj račun.
configure-experts-search-none-found = Nisu pronađeni korisnici s tim e-mailom ili korisničkim imenom
configure-experts-
configure-experts-remove-button = Ukloni
configure-experts-load-more = Učitaj Više
configure-experts-none-yet = Trenutno nema stručnjaka za ovaj Pitanja i Odgovori.
configure-experts-search-title = Pretraži stručnjaka
configure-experts-assigned-title = Stručnjaci
configure-experts-noLongerAnExpert = više nije stručnjak
comments-tombstone-ignore-user = Ovaj komentar je skriven jer ste ignorirali ovog korisnika.
comments-tombstone-showComment = Prikaži komentar
comments-tombstone-deleted =
  Ovaj komentar više nije dostupan. Komentator je izbrisao svoj račun.
comments-tombstone-rejected =
  Ovaj komentar je uklonjen od strane moderatora zbog kršenja naših smjernica zajednice.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Vaš račun je privremeno suspendiran od komentiranja
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  U skladu s { $organization } smjernicama zajednice vaš
  račun je privremeno suspendiran. Dok je suspendiran, nećete
  moći komentirati, koristiti reakcije ili prijavljivati komentare.
suspendInfo-until-pleaseRejoinThe =
  Molimo ponovno se pridružite razgovoru na { $until }

warning-heading = Vaš račun je dobio upozorenje
warning-explanation =
  U skladu s našim smjernicama zajednice vaš račun je dobio upozorenje.
warning-instructions =
  Da biste nastavili sudjelovati u raspravama, molimo pritisnite gumb "Potvrdi" ispod.
warning-acknowledge = Potvrdi

warning-notice = Vaš račun je dobio upozorenje. Da biste nastavili sudjelovati, molimo <a>pregledajte poruku upozorenja</a>.

modMessage-heading = Vaš račun je dobio poruku od moderatora
modMessage-acknowledge = Potvrdi

profile-changeEmail-unverified = (Neprovjereno)
profile-changeEmail-current = (trenutno)
profile-changeEmail-edit = Uredi
profile-changeEmail-change = Promijeni
  .aria-label = Promijeni e-mail
profile-changeEmail-please-verify = Potvrdite svoju e-mail adresu
profile-changeEmail-please-verify-details =
  E-mail je poslan na { $email } za potvrdu vašeg računa.
  Morate potvrditi svoju novu e-mail adresu prije nego što se može koristiti
  za prijavu na vaš račun ili za primanje obavijesti.
profile-changeEmail-resend = Ponovno pošalji potvrdu
profile-changeEmail-heading = Uredi svoju e-mail adresu
profile-changeEmail-changeYourEmailAddress =
  Promijeni svoju e-mail adresu
profile-changeEmail-desc = Promijenite e-mail adresu koja se koristi za prijavu i za primanje komunikacija o vašem računu.
profile-changeEmail-newEmail-label = Nova e-mail adresa
profile-changeEmail-password = Lozinka
profile-changeEmail-password-input =
  .placeholder = Lozinka
profile-changeEmail-cancel = Otkaži
profile-changeEmail-submit = Spremi
profile-changeEmail-saveChanges = Spremi promjene
profile-changeEmail-email = E-mail
profile-changeEmail-title = E-mail adresa
profile-changeEmail-success = Vaš e-mail je uspješno ažuriran

## Ocjene i Recenzije

ratingsAndReviews-postCommentForm-section =
  .aria-label = Pošaljite recenziju ili postavite pitanje

ratingsAndReviews-reviewsTab = Recenzije
ratingsAndReviews-questionsTab = Pitanja
ratingsAndReviews-noReviewsAtAll = Nema recenzija.
ratingsAndReviews-noQuestionsAtAll = Nema pitanja.
ratingsAndReviews-noReviewsYet = Još nema recenzija. Zašto ne biste napisali jednu?
ratingsAndReviews-noQuestionsYet = Još nema pitanja. Zašto ne biste postavili jedno?
ratingsAndReviews-selectARating = Odaberite ocjenu
ratingsAndReviews-youRatedThis = Ocijenili ste ovo
ratingsAndReviews-showReview = Prikaži recenziju
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Ocijenite i Recenzirajte
ratingsAndReviews-askAQuestion = Postavite Pitanje
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Još nema ocjena
  [1] Na temelju 1 ocjene
  *[other] Na temelju { SHORT_NUMBER($count) } ocjena
}

ratingsAndReviews-allReviewsFilter = Sve recenzije
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Zvjezdica
  *[other] { $rating } Zvjezdica
}

comments-addAReviewForm-rteLabel = Dodajte recenziju (opcionalno)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Vrh stranice
  .title = Idi na vrh stranice
stream-footer-links-top-of-comments = Vrh komentara
  .title = Idi na vrh komentara
stream-footer-links-profile = Profil i Odgovori
  .title = Idi na profil i odgovore
stream-footer-links-discussions = Više rasprava
  .title = Idi na više rasprava
stream-footer-navigation =
  .aria-label = Podnožje komentara

## Obavijesti

notifications-title = Obavijesti
notifications-loadMore = Učitaj Više
notifications-loadNew = Učitaj Novo

notifications-adjustPreferences = Podesite postavke obavijesti u Moj Profil &gt;<button>Postavke.</button>

notification-comment-toggle-default-open = - Komentar
notification-comment-toggle-default-closed = + Komentar

notifications-comment-showRemovedComment = + Prikaži uklonjeni komentar
notifications-comment-hideRemovedComment = - Sakrij uklonjeni komentar

notification-comment-description-featured = vaš komentar na "{ $title }" je istaknut od strane člana našeg tima.
notification-comment-description-default = na "{ $title }"
notification-comment-media-image = Slika
notification-comment-media-embed = Ugradnja
notification-comment-media-gif = Gif

notifications-yourIllegalContentReportHasBeenReviewed =
  Vaša prijava nezakonitog sadržaja je pregledana
notifications-yourCommentHasBeenRejected =
  Vaš komentar je odbijen
notifications-yourCommentHasBeenApproved =
  Vaš komentar je odobren
notifications-yourPreviouslyRejectedCommentHasBeenApproved =
  Vaš komentar je prethodno odbijen. Sada je odobren.
notifications-yourCommentHasBeenFeatured =
  Vaš komentar je istaknut
notifications-yourCommentHasReceivedAReply =
  Novi odgovor od { $author }
notifications-defaultTitle = Obavijest

notifications-rejectedComment-body =
  Sadržaj vašeg komentara je bio protiv naših smjernica zajednice. Komentar je uklonjen.
notifications-rejectedComment-wasPending-body =
  Sadržaj vašeg komentara je bio protiv naših smjernica zajednice.
notifications-reasonForRemoval = Razlog za uklanjanje
notifications-legalGrounds = Pravna osnova
notifications-additionalExplanation = Dodatno objašnjenje

notifications-repliedComment-hideReply = - Sakrij odgovor
notifications-repliedComment-showReply = + Prikaži odgovor
notifications-repliedComment-hideOriginalComment = - Sakrij moj originalni komentar
notifications-repliedComment-showOriginalComment = + Prikaži moj originalni komentar

notifications-dsaReportLegality-legal = Zakonit sadržaj
notifications-dsaReportLegality-illegal = Potencijalno nezakonit sadržaj
notifications-dsaReportLegality-unknown = Nepoznato

notifications-rejectionReason-offensive = Ovaj komentar sadrži uvredljiv jezik
notifications-rejectionReason-abusive = Ovaj komentar sadrži zlostavljački jezik
notifications-rejectionReason-spam = Ovaj komentar je neželjena pošta
notifications-rejectionReason-bannedWord = Zabranjena riječ
notifications-rejectionReason-ad = Ovaj komentar je oglas
notifications-rejectionReason-illegalContent = Ovaj komentar sadrži potencijalno nezakonit sadržaj
notifications-rejectionReason-harassmentBullying = Ovaj komentar sadrži uznemiravajući ili maltretirajući jezik
notifications-rejectionReason-misinformation = Ovaj komentar sadrži dezinformacije
notifications-rejectionReason-hateSpeech = Ovaj komentar sadrži govor mržnje
notifications-rejectionReason-irrelevant = Ovaj komentar je nebitan za raspravu
notifications-rejectionReason-other = Drugo
notifications-rejectionReason-other-customReason = Drugo - { $customReason }
notifications-rejectionReason-unknown = Nepoznato

notifications-reportDecisionMade-legal =
  Dana <strong>{ $date }</strong> prijavili ste komentar koji je napisao <strong>{ $author }</strong> zbog potencijalno nezakonitog sadržaja. Nakon pregleda vaše prijave, naš moderacijski tim je odlučio da ovaj komentar <strong>ne sadrži nezakonit sadržaj.</strong> Hvala vam što pomažete u održavanju sigurnosti naše zajednice.
notifications-reportDecisionMade-illegal =
  Dana <strong>{ $date }</strong> prijavili ste komentar koji je napisao <strong>{ $author }</strong> zbog potencijalno nezakonitog sadržaja. Nakon pregleda vaše prijave, naš moderacijski tim je odlučio da ovaj komentar <strong>sadrži nezakonit sadržaj</strong> i uklonjen je. Mogu se poduzeti daljnje mjere protiv komentatora, no nećete biti obaviješteni o dodatnim koracima. Hvala vam što pomažete u održavanju sigurnosti naše zajednice.

notifications-methodOfRedress-none =
  Sve odluke o moderaciji su konačne i ne mogu se žaliti
notifications-methodOfRedress-email =
  Da biste se žalili na odluku koja se ovdje pojavljuje, molimo kontaktirajte <a>{ $email }</a>
notifications-methodOfRedress-url =
  Da biste se žalili na odluku koja se ovdje pojavljuje, molimo posjetite <a>{ $url }</a>

notifications-youDoNotCurrentlyHaveAny = Trenutno nemate nijednu obavijest

notifications-floatingIcon-close = zatvori

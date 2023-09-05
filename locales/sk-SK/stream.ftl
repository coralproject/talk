### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Vložené komentáre

general-moderate = Moderovať
general-archived = Archivované

general-userBoxUnauthenticated-joinTheConversation = Zapojiť sa do diskusie
general-userBoxUnauthenticated-signIn = Prihlasiť sa
general-userBoxUnauthenticated-register = Registrovať sa

general-authenticationSection =
  .aria-label = Autentizácia

general-userBoxAuthenticated-signedIn =
  Prihlásený ako
general-userBoxAuthenticated-notYou =
  Nie ste to vy? <button>Odhláste sa</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Boli ste úspešne odhlásený

general-tabBar-commentsTab = Komentáre
general-tabBar-myProfileTab = Môj profil
general-tabBar-discussionsTab = Diskusia
general-tabBar-reviewsTab = Reviews
general-tabBar-configure = Nastavenia diskusie

general-mainTablist =
  .aria-label = Hlavné záložky

general-secondaryTablist =
  .aria-label = Sekundárne záložky

## Comment Count

comment-count-text =
  { $count  ->
    [one] komentár
    [few] komentáre
    *[many] komentárov
  }

comment-count-text-ratings =
  { $count  ->
    [one] hodnotenie
    [few] hodnotenia
    *[many] hodnotení
  }

## Comments Tab
addACommentButton =
  .aria-label = Pridať komentár. Po stlačení sa presuniete na spodok komentárov.

comments-allCommentsTab = Všetky komentáre
comments-featuredTab = Odporúčané
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 osoba si číta diskusiu
    [few] { $count } osoby si čítajú diskusiu
    *[many] { SHORT_NUMBER($count) } osôb si číta diskusiu
  }

comments-announcement-section =
  .aria-label = Oznámenie
comments-announcement-closeButton =
  .aria-label = Oznam o zatvorení

comments-accountStatus-section =
  .aria-label = Status účtu

comments-featuredCommentTooltip-how = Ako sú vyberané odporúčané komentáre?
comments-featuredCommentTooltip-handSelectedComments =
  Odporúčané komentáre sú vyberané priamo redakciou.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Zapnúť/vypnúť popis odporúčaných komentárov
  .title = Zapnúť/vypnúť popis odporúčaných komentárov

comments-collapse-toggle-with-username =
  .aria-label = Skryť komentáre od { $username } a všetky jeho/jej odpovede
comments-collapse-toggle-without-username =
  .aria-label = Skryť komentár a všetky odpovede
comments-expand-toggle-with-username =
  .aria-label = Zobraziť komentár od { $username } and jeho/jej odpovede
comments-expand-toggle-without-username =
  .aria-label = Zobraziť komentár a odpovede
comments-bannedInfo-bannedFromCommenting = Vášmu účtu bolo zakázané komentovať.
comments-bannedInfo-violatedCommunityGuidelines =
  Niekto s prístupom k vášmu účtu porušil naše diskusné pravidlá, v dôsledku toho vám bolo
  zakázané komentovať. Ak si myslíte že sa to stalo omylom alebo s týmto rozhodnutím nesúhlasíte,
  prosím kontaktujte nás.

comments-noCommentsAtAll = Žiadne komentáre
comments-noCommentsYet = Zatiaľ nie sú v diskusií žiadne komentáre. Chcete otvoriť diskusiu?

comments-streamQuery-storyNotFound = Článok nebol nájdený

comments-communityGuidelines-section =
  .aria-label = Pokynu pre komunitu

comments-commentForm-cancel = Zrušiť
comments-commentForm-saveChanges = Uložiť zmeny
comments-commentForm-submit = Publikovať

comments-postCommentForm-section =
  .aria-label = Text komentára
comments-postCommentForm-submit = Publikovať
comments-replyList-showAll = Zobraziť všetky
comments-replyList-showMoreReplies = Zobraziť ďalšie odpovede

comments-postComment-gifSearch = Vyhladať GIF
comments-postComment-gifSearch-search =
  .aria-label = Hladať
comments-postComment-gifSearch-loading = Načítam...
comments-postComment-gifSearch-no-results = Žiadne výsledky pre: {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Powered by giphy

comments-postComment-pasteImage = Vložit odkaz na  obrázok
comments-postComment-insertImage = Vložiť

comments-postComment-confirmMedia-youtube = Pridať toto video YouTube na koniec komentára?
comments-postComment-confirmMedia-twitter = Pridať tento tweet na koniec komentára?
comments-postComment-confirmMedia-cancel = Zrušiť
comments-postComment-confirmMedia-add-tweet = Pridať Tweet
comments-postComment-confirmMedia-add-video = Pridať video
comments-postComment-confirmMedia-remove = Zmazať
comments-commentForm-gifPreview-remove = Zmazať
comments-viewNew-loading = Načítam...
comments-viewNew =
  { $count ->
    [1] Zobraziť {$count} nový komentár
    [few] Zobraziť {$count} nové komentáre
    *[many] Zobraziť {$count} nových komentárov
  }
comments-loadMore = Zobraziť viac
comments-loadAll = Zobraziť všetky komentáre
comments-loadAll-loading = Načítam...

comments-permalinkPopover =
  .description = Dialógové okno zobrazujúce trvalý odkaz na komentár
comments-permalinkPopover-permalinkToComment =
  .aria-label = Trvalý odkaz na komentár
comments-permalinkButton-share = Zdieľať
comments-permalinkButton =
  .aria-label = Zdieľať {$username}
comments-permalinkView-section =
  .aria-label = Samostatné vlákno diskusie
comments-permalinkView-viewFullDiscussion = Zobraziť celú diskusiu
comments-permalinkView-commentRemovedOrDoesNotExist = Tento komentár bol odstránený alebo neexistuje.

comments-rte-bold =
  .title = Tučné

comments-rte-italic =
  .title = Šikmé

comments-rte-blockquote =
  .title = Citát

comments-rte-bulletedList =
  .title = Odrážkový zoznam

comments-rte-strikethrough =
  .title = Preškrtnuté

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkazmus

comments-rte-externalImage =
  .title = Externý obrázok

comments-remainingCharacters =
  { $remaining ->
  [1] Ostáva { $remaining } znak
  [few] Ostávajú { $remaining } znaky
  *[many] Ostáva { $remaining } znakov
  }
comments-postCommentFormFake-signInAndJoin = Prihláste sa a pripojte sa do diskusie

comments-postCommentForm-rteLabel = Text komentára

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Odpovedať
comments-replyButton =
  .aria-label = Odpovedať na komentár od {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Odoslať
comments-replyCommentForm-cancel = Zrušit
comments-replyCommentForm-rteLabel = Napíšte odpoveď
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = Úroveň { $level }:
comments-commentContainer-highlightedLabel = Zvýraznené:
comments-commentContainer-ancestorLabel = Predok:
comments-commentContainer-replyLabel =
  Odpoveď od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Otázka od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Komentár od { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Upraviť

comments-commentContainer-avatar =
  .alt = Avatar užívateľa { $username }

comments-editCommentForm-saveChanges = Uložit zmeny
comments-editCommentForm-cancel = Zrušiť
comments-editCommentForm-close = Zavriet
comments-editCommentForm-rteLabel = Upraviť komentár
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Upraviť: ostáva <time></time>
comments-editCommentForm-editTimeExpired = Čas úprav vypršal. Tento komentár už nemôžete upravovať. Nechcete uverejniť ďalší?
comments-editedMarker-edited = Upravené
comments-showConversationLink-readMore = Prečítať ďalšie príspevky konverzácie >
comments-conversationThread-showMoreOfThisConversation =
  Zobraziť ďalšie príspevky konverzácie

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  Práve si prezeráte vlákno konverzácie
comments-inReplyTo = V odpovedi na <Username></Username>
comments-replyingTo = Odpoveď na <Username></Username>

comments-reportButton-report = Nahlásiť
comments-reportButton-reported = Nahlásené
comments-reportButton-aria-report =
  .aria-label = Nahlásiť komentár od {$username}
comments-reportButton-aria-reported =
  .aria-label = Nahlásený

comments-sortMenu-sortBy = Zoradiť podľa
comments-sortMenu-newest = Najnovšie
comments-sortMenu-oldest = Najstaršie
comments-sortMenu-mostReplies = Najviac odpovedí

comments-userPopover =
  .description = Vyskakovacie okno s ďalšími informáciami o používateľovi
comments-userPopover-memberSince = Zaregistrovaný { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Skryť

comments-userIgnorePopover-ignoreUser = Skryť príspevky od {$username}?
comments-userIgnorePopover-description =
  Všetky komentáre od používateľa budu skryté. Túto akciu môžete zrušiť v nastaveniach vášho profilu.
comments-userIgnorePopover-ignore = Skryť
comments-userIgnorePopover-cancel = Zrušiť

comments-userBanPopover-title = Udeliť BAN {$username}?
comments-userSiteBanPopover-title = Chete udeliť BAN {$username}?
comments-userBanPopover-description =
  Po udelení BANu sa užívateľ nebude môcť akýmkoľvek spôsobom zapájať do diskusie.
comments-userBanPopover-cancel = Zrušiť
comments-userBanPopover-ban = Udeliť BAN

comments-moderationDropdown-popover =
  .description = Menu na moderovanie komentára
comments-moderationDropdown-feature = Odporučiť
comments-moderationDropdown-unfeature = Zrušiť odporúčanie
comments-moderationDropdown-approve = Schváliť
comments-moderationDropdown-approved = Schválené
comments-moderationDropdown-reject = Zamietnuť
comments-moderationDropdown-rejected = Zamietnuté
comments-moderationDropdown-ban = Udeliť BAN používateľovi
comments-moderationDropdown-siteBan = BAN na celý web
comments-moderationDropdown-banned = ZaBANované
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Externá moderácia
comments-moderationDropdown-moderateStory = Externá moderácia (článok)
comments-moderationDropdown-caretButton =
  .aria-label = Moderovať

comments-moderationRejectedTombstone-title = Tento komentár bol zamietnutý.
comments-moderationRejectedTombstone-moderateLink =
  Chodťe do moderácie článku ak chcete zrevidovať toto rozhodnutie

comments-featuredTag = Odporúčané

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [1] {$reaction} komentár od  {$username}
    [few] odporúčané komentáre od  {$username}
    *[many] {$reaction} komentárov od {$username} (Celkovo: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] odporúčaných komentárov od {$username}
    [one] odporúčaný komentár od {$username}
    [few] odporúčané komentáre od {$username}
    *[many] odporúčaných ({$count}) komentárov od {$username}
  }

comments-jumpToComment-title = Vaša odpoveď bola uverejnená nižšie
comments-jumpToComment-GoToReply = Ísť na odpoveď

comments-mobileToolbar-closeButton =
  .aria-label = Zavrieť
comments-mobileToolbar-unmarkAll = Označiť všetky ako prečítané
comments-mobileToolbar-nextUnread = Dalšie neprečítané

comments-replyChangedWarning-theCommentHasJust =
  Tento komentár bol práve upravený. Najnovšia verzia je zobrazená vyššie.

### Q&A

general-tabBar-qaTab = Otázky a odpovede

qa-postCommentForm-section =
  .aria-label = Uverejniť otázku

qa-answeredTab = Zodpovedané
qa-unansweredTab = Nezpodovedané
qa-allCommentsTab = Všetky

qa-answered-answerLabel =
  Odpoveď od {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = Prejsť do konverzácie
qa-answered-replies = Odpovede

qa-noQuestionsAtAll =
  Zatiaľ neboli položené žiadne otázky.
qa-noQuestionsYet =
  Zatiaľ neboli položené žiadne otázky.
qa-viewNew-loading = Načítam...
qa-viewNew =
  { $count ->
    [1] Zobraziť {$count} novú otázku
    [few] Zobraziť {$count} nové otázky
    *[many] Zobraziť {$count} nových otázok
  }

qa-postQuestionForm-rteLabel = Položiť otázku
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Najviac hlasov

qa-answered-tag = zodpovedané
qa-expert-tag = expert

qa-reaction-vote = Zahlasovať
qa-reaction-voted = Zahlasované

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] hlasov pre {$username}
    [1] hlas pre {$username}
    [few] hlasy pre {$username}
    *[many] hlasov ({$count}) pre komentár od {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] hlasov pre komentár od {$username}
    [one] hlas pre komentár od {$username}
    [few] hlasy pre komentár od {$username}
    *[many] hlasov ({$count}) pre komentár od {$username}
  }

qa-unansweredTab-doneAnswering = Koniec

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Kto odpovedá na otázky
qa-answeredTooltip-answeredComments =
  Na otázky odpovedá odborník na konkrétnu tému.
qa-answeredTooltip-toggleButton =
  .aria-label = Zapnút/vypnúť popis
  .title = Zapnút/vypnúť popis

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Žiadosť o odstránenie účtu
comments-stream-deleteAccount-callOut-receivedDesc =
  Dňa { $date } bola prijatá žiadosť o odstránenie vášho účtu.
comments-stream-deleteAccount-callOut-cancelDesc =
  Ak chcete pokračovať v zapájaní sa do diskusie, svoju žiadosť o odstránenie
  účtu môžete zrušit do { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Zrušiť žiadosť o odstránenie účtu
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Zrušiť odstránenie účtu

comments-permalink-copyLink = Skopírovať odkaz
comments-permalink-linkCopied = Odkaz skopírovaný

### Embed Links

comments-embedLinks-showEmbeds = Zobraziť vložené položky
comments-embedLinks-hideEmbeds = Skryť vložené položky

comments-embedLinks-show-giphy = Zobraziť GIF
comments-embedLinks-hide-giphy = Skryť GIF

comments-embedLinks-show-youtube = Zobraziť video
comments-embedLinks-hide-youtube = Skryť video

comments-embedLinks-show-twitter = Zobraziť Tweet
comments-embedLinks-hide-twitter = Skryť Tweet

comments-embedLinks-show-external = Zobraziť obrázok
comments-embedLinks-hide-external = Skryť obrázok

comments-embedLinks-expand = Rozbaliť

### Featured Comments
comments-featured-label =
  Odporúčaný komentár od {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Prejsť do konverzácie
comments-featured-gotoConversation-label-with-username =
  .aria-label = Prejsť na odporúčaný komentár od { $username } v hlavnom diskusnom vlákne
comments-featured-gotoConversation-label-without-username =
  .aria-label = Prejšt na odporúčaný komentár v hlavnom diskusno vlákne
comments-featured-replies = Odpovede

## Profile Tab

profile-myCommentsTab = Moje komentáre
profile-myCommentsTab-comments = Moje komentáre
profile-accountTab = Môj účet
profile-preferencesTab = Nastavenia

### Bio
profile-bio-title = Diskusný profil
profile-bio-description =
  Napíšte prosím svoj krátky diskusný profil.
profile-bio-remove = Zmazať
profile-bio-update = Uložiť
profile-bio-success = Profil bol úspešne aktualizovaný.
profile-bio-removed = Profil bol zmazaný.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Váš účet je naplánovaný na odstránenie { $date }.
profile-accountDeletion-cancelDeletion =
  Zrušiť žiadosť o odstránenie účtu
profile-accountDeletion-cancelAccountDeletion =
  Zrušiť odstránenie účtu

### Comment History
profile-commentHistory-section =
  .aria-label = História komentárov
profile-historyComment-commentLabel =
  Komentár <RelativeTime></RelativeTime> v článku { $storyTitle }
profile-historyComment-viewConversation = Zobraziť diskusiu
profile-historyComment-replies = {$replyCount} odpovedí
profile-historyComment-commentHistory = História komentárov
profile-historyComment-story = Článok: {$title}
profile-historyComment-comment-on = Komentár v:
profile-profileQuery-errorLoadingProfile = Chyba pri načítavaní profilu
profile-profileQuery-storyNotFound = Článok nebol nájdený
profile-commentHistory-loadMore = Načítať viac
profile-commentHistory-empty = Nenapísali ste zatiaľ žiadne komentáre
profile-commentHistory-empty-subheading = Tu sa zobrazí história vašich komentárov

profile-commentHistory-archived-thisIsAllYourComments =
  Toto sú všetky vaše komentáre od { $value } { $unit ->
    [second] { $value ->
      [1] sekundy
      *[other] sekúnd
    }
    [minute] { $value ->
      [1] minúty
      *[other] minút
    }
    [hour] { $value ->
      [1] hodiny
      *[other] hodín
    }
    [day] { $value ->
      [1] dňa
      *[other] dní
    }
    [week] { $value ->
      [1] týždňa
      *[other] týždňov
    }
    [month] { $value ->
      [1] mesiaca
      *[other] mesiacov
    }
    [year] { $value ->
      [1] roku
      *[other] rokov
    }
    *[other] neznáma hodnota
  }. Ak chcete zobraziť zvyšok svojich komentárov, kontaktujte nás.

### Preferences

profile-preferences-mediaPreferences = Nastavenia medií
profile-preferences-mediaPreferences-alwaysShow = Vždy zobrazovať súbory GIF, Tweety, YouTube atď.
profile-preferences-mediaPreferences-thisMayMake = Toto nastavenie môže spomaliť načítanie komentárov
profile-preferences-mediaPreferences-update = Uložiť
profile-preferences-mediaPreferences-preferencesUpdated =
  Vaše nastavenia boli aktualizované

### Account
profile-account-ignoredCommenters = Skrytí diskutujúci
profile-account-ignoredCommenters-description =
  Môžete skryť ostatných diskutujúcich po kliknutí na ich meno a stlačení tlačítka "Skryť".
  Po skrytí konkrétneho užívateľa neuvidíte žiadne jeho/jej komentáre
profile-account-ignoredCommenters-empty = Momentálne nemáte skrytých používateľov.
profile-account-ignoredCommenters-stopIgnoring = Odkryť
profile-account-ignoredCommenters-youAreNoLonger =
  Už nemáte skrytého užívateľa
profile-account-ignoredCommenters-manage = Spravovať
  .aria-label = Spravovať skrytých užívateľov
profile-account-ignoredCommenters-cancel = Zrušiť
profile-account-ignoredCommenters-close = Zavrieť

profile-account-changePassword-cancel = Zrušiť
profile-account-changePassword = Zmeniť heslo
profile-account-changePassword-oldPassword = Staré heslo
profile-account-changePassword-forgotPassword = Zabudli ste svoje heslo?
profile-account-changePassword-newPassword = Nové heslo
profile-account-changePassword-button = Zmeniť heslo
profile-account-changePassword-updated =
  Vaše heslo bolo aktualizované
profile-account-changePassword-password = Heslo

profile-account-download-comments-title = Stiahnite si moju históriu komentárov
profile-account-download-comments-description =
  Dostanete e-mail s odkazom na stiahnutie histórie komentárov.
  Môžete podať <strong>jednu žiadosť o stiahnutie každých 14 dní.</strong>
profile-account-download-comments-request =
  Vyžiadajte si históriu komentárov
profile-account-download-comments-request-icon =
  .title = Vyžiadajte si históriu komentárov
profile-account-download-comments-recentRequest =
  Vaša posledná žiadosť: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Vaša posledná žiadosť bola zadaná pred menej ako 14 dňami.
  Ďalšiu žiadosť môžete poslať: { $timeStamp }
profile-account-download-comments-requested =
  Žiadosť odoslaná. Ďalšiu žiadosť môžete odoslať v { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Vaša žiadosť bola úspešne odoslaná. Opätovnú žiadosť môžete
  poslať o { framework-timeago-time }.
profile-account-download-comments-error =
  Vašu žiadosť o stiahnutie sa nám nepodarilo dokončiť.
profile-account-download-comments-request-button = Požiadať

## Delete Account

profile-account-deleteAccount-title = Odstrániť môj účet
profile-account-deleteAccount-deleteMyAccount = Odstrániť môj účet
profile-account-deleteAccount-description =
  Odstránením účtu natrvalo vymažete a odstránite svoj profil a
  všetky vaše komentáre z tejto stránky.
profile-account-deleteAccount-requestDelete = Požiadať o vymazanie účtu

profile-account-deleteAccount-cancelDelete-description =
  Žiadosť o odstránenie účtu ste už odoslali.
  Váš účet bude vymazaný dňa { $date }.
  Do tej doby môžete žiadosť zrušiť.
profile-account-deleteAccount-cancelDelete = Zrušiť žiadosť o odstránenie účtu

profile-account-deleteAccount-request = Požiadať
profile-account-deleteAccount-cancel = Zrušiť
profile-account-deleteAccount-pages-deleteButton = Zmazať môj účet
profile-account-deleteAccount-pages-cancel = Zrušiť
profile-account-deleteAccount-pages-proceed = Pokračovať
profile-account-deleteAccount-pages-done = Hotovo
profile-account-deleteAccount-pages-phrase =
  .aria-label = Fráza

profile-account-deleteAccount-pages-sharedHeader = Zmazanie účtu

profile-account-deleteAccount-pages-descriptionHeader = Odstrániť môj účet?
profile-account-deleteAccount-pages-descriptionText =
  Pokúšate sa odstrániť svoj účet. To znamená:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Všetky vaše komentáre budú z nášho webu odstránené
profile-account-deleteAccount-pages-allCommentsDeleted =
  Všetky vaše komentáre budú z našej databázy vymazané
profile-account-deleteAccount-pages-emailRemoved =
  Vaša e-mailová adresa bude z nášho systému odstránená

profile-account-deleteAccount-pages-whenHeader = Odstrániť môj účet: Kedy?
profile-account-deleteAccount-pages-whenSubHeader = Kedy?
profile-account-deleteAccount-pages-whenSec1Header =
  Kedy bude môj účet vymazaný?
profile-account-deleteAccount-pages-whenSec1Content =
  Váš účet bude vymazaný 24 hodín po odoslaní vašej žiadosti.
profile-account-deleteAccount-pages-whenSec2Header =
  Môžem stále písať komentáre, kým nebude môj účet odstránený?
profile-account-deleteAccount-pages-whenSec2Content =
  Nie. Po požiadaní o odstránenie účtu sa už nemôžete zapájať do diskusií.

profile-account-deleteAccount-pages-downloadCommentHeader = Stiahnuť moje komentáre?
profile-account-deleteAccount-pages-downloadSubHeader = Stiahnuť moje komentáre
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Pred odstránením účtu vám odporúčame stiahnuť si históriu komentárov.
  Po odstránení účtu to už nebude možné.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Môj profil > Stiahnút históriu komentárov

profile-account-deleteAccount-pages-confirmHeader = Potvrdiť odstránenie účtu?
profile-account-deleteAccount-pages-confirmSubHeader = Ste si istý?
profile-account-deleteAccount-pages-confirmDescHeader =
  Naozaj chcete odstrániť svoj účet?
profile-account-deleteAccount-confirmDescContent =
  Ak chcete potvrdiť zmazanie svojho účtu, prosím prepíšte nasledovnú frázu do políčka nižšie.
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Pre potvrdenie zadajte frázu nižšie:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Zadajte vaše heslo:

profile-account-deleteAccount-pages-completeHeader = Žiadosť o odstránenie účtu
profile-account-deleteAccount-pages-completeSubHeader = Žiadosť bola odoslaná
profile-account-deleteAccount-pages-completeDescript =
  Vaša žiadosť bola odoslaná a potvrdenie bolo odoslané na váš e-mail.
profile-account-deleteAccount-pages-completeTimeHeader =
  Váš účet bude odstránený dňa: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Zmenili ste názor?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Jednoducho sa prihláste do svojho účtu a vyberte
  <strong>Zrušiť žiadosť o vymazanie účtu</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Uveďte váš dôvod.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Radi by sme vedeli, prečo ste sa rozhodli odstrániť svoj účet.
  Pošlite nám prosím spätnú väzbu na { $email }.
profile-account-changePassword-edit = Upraviť
profile-account-changePassword-change = Zmeniť


## Notifications
profile-notificationsTab = Upozornenia
profile-account-notifications-emailNotifications = E-mailové upozornenia
profile-account-notifications-emailNotifications = E-mailové upozornenia
profile-account-notifications-receiveWhen = Dostávať upozornenia v prípade:
profile-account-notifications-onReply = Dostanem odpoveď na komentár
profile-account-notifications-onFeatured = Môj komentár bol vybraný medzi odporúčané
profile-account-notifications-onStaffReplies = Redakcia odpovedala na môj komentár
profile-account-notifications-onModeration = Môj komentár čakajúci na schválenie bol vyhodnotený moderátorom
profile-account-notifications-sendNotifications = Odosielať upozornenia:
profile-account-notifications-sendNotifications-immediately = Okamžite
profile-account-notifications-sendNotifications-daily = Denne
profile-account-notifications-sendNotifications-hourly = Raz za hodinu
profile-account-notifications-updated = Nastavenia upozornení boli aktualizované
profile-account-notifications-button = Uložiť nastavenia upozornení
profile-account-notifications-button-update = Uložit

## Report Comment Popover
comments-reportPopover =
  .description = Dialóg na nahlasovanie komentárov
comments-reportPopover-reportThisComment = Nahlásiť tento komentár
comments-reportPopover-whyAreYouReporting = Prečo chcete nahlásiť komentár?

comments-reportPopover-reasonOffensive = Komentár je nenávistný
comments-reportPopover-reasonAbusive = Komentár je urážlivý
comments-reportPopover-reasonIDisagree = Nesúhlasím s týmto komentárom
comments-reportPopover-reasonSpam = Komentár je reklama alebo marketing
comments-reportPopover-reasonOther = Iný dôvod

comments-reportPopover-additionalInformation =
  Ďalšie informácie <optional>Voliteľné</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Prosím uveďte ďalšie informácie ktoré môžu byť nápomocné pre moderátorov.

comments-reportPopover-maxCharacters = Max. { $maxCharacters } znakov
comments-reportPopover-restrictToMaxCharacters = Prosím skráťte popis na  { $maxCharacters } znakov
comments-reportPopover-cancel = Zrušiť
comments-reportPopover-submit = Odoslať

comments-reportPopover-thankYou = Ďakujeme!
comments-reportPopover-receivedMessage =
  Vašu správu sme dostali. Hlásenia od diskutérov ako vy udržujú našu komunitu v bezpečí.

comments-reportPopover-dismiss = Zamietnuť

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Nahlásiť tento komentár
comments-archivedReportPopover-doesThisComment =
  Porušuje tento komentár naše pravidlá? Je komentár urážlivý alebo spam?
  Pošlite e-mail nášmu moderátorskému tímu na adresu <a>{ $orgName }</a> s odkazom na
  tento komentár a krátke vysvetlenie.
comments-archivedReportPopover-needALink =
  Potrebujete odkaz na tento komentár?
comments-archivedReportPopover-copyLink = Skopírovať odkaz

comments-archivedReportPopover-emailSubject = Nahlásiť komentár
comments-archivedReportPopover-emailBody =
  Chcel by som nahlásiť nasledujúci komentár:
  %0A
  { $permalinkURL }
  %0A
  %0A
  z dôvodov uvedených nižšie:

## Submit Status
comments-submitStatus-dismiss = Zamietnuť
comments-submitStatus-submittedAndWillBeReviewed =
  Váš komentár bol odoslaný a bude posúdený moderátorom
comments-submitStatus-submittedAndRejected =
  Tento komentár bol zamietnutý z dôvodu porušenia našich pravidiel

# Configure
configure-configureQuery-errorLoadingProfile = Chyba pri načítaní nastavenia
configure-configureQuery-storyNotFound = Článok nebol nájdený

## Archive
configure-archived-title = Táto diskusia je zamknutá.
configure-archived-onArchivedStream =
  V zamknutej diskusii nie je možné pridávať nové komentáre, odpovede alebo nahlasovať komentáre.
configure-archived-toAllowTheseActions =
  Ak chcete povoliť tieto akcie, odomknite diskusiu.
configure-archived-unarchiveStream = Odomknúť diskusiu

## Change username
profile-changeUsername-username = Používateľské meno
profile-changeUsername-success = Vaše používateľské meno bolo úspešne zmenené
profile-changeUsername-edit = Upraviť
profile-changeUsername-change = Zmeniť
profile-changeUsername-heading = Zmeniť vaše používateľské meno
profile-changeUsername-heading-changeYourUsername = Zmeniť vaše používateľské meno
profile-changeUsername-desc = Zmeniť používateľské meno, ktoré sa bude zobrazovať vo všetkých vašich minulých a budúcich komentároch. <strong>Používateľské meno je možné zmeniť raz za { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Zmeniť používateľské meno, ktoré sa bude zobrazovať vo všetkých vašich minulých a budúcich komentároch. Používateľské meno je možné zmeniť raz za { framework-timeago-time }.
profile-changeUsername-current = Súčasné používateľské meno
profile-changeUsername-newUsername-label = Nové používateľské meno
profile-changeUsername-confirmNewUsername-label = Potvrďte nové používateľské meno
profile-changeUsername-cancel = Zrušiť
profile-changeUsername-save = Uložiť
profile-changeUsername-saveChanges = Uložiť zmeny
profile-changeUsername-recentChange = Vaše používateľské meno bolo nedávno zmenené. Ďalšiu zmenu môžete vykonať po { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  Zmenili ste si používateľské meno { framework-timeago-time } dozadu. Ďalšiu zmenu môžete vykonať: { $nextUpdate }.
profile-changeUsername-close = Zavrieť

## Discussions tab

discussions-mostActiveDiscussions = Najaktívnejšie diskusie
discussions-mostActiveDiscussions-subhead = Zoradené podľa najväčšieho počtu komentárov za posledných 24 hodín na { $siteName }
discussions-mostActiveDiscussions-empty = Neprispeli ste do žiadnej diskusie
discussions-myOngoingDiscussions = Moje prebiehajúce diskusie
discussions-myOngoingDiscussions-subhead = Diskusie do ktorých ste sa zapojili na { $orgName }
discussions-viewFullHistory = Zobraziť celú históriu komentárov
discussions-discussionsQuery-errorLoadingProfile = Chyba pri načítavaní profilu
discussions-discussionsQuery-storyNotFound = Článok nebol nájdený

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  Nastavenia tejto diskusie
configure-stream-apply =
configure-stream-update = Uložiť
configure-stream-streamHasBeenUpdated =
  Nastavenia boli uložené

configure-premod-title =
configure-premod-premoderateAllComments = Všetky komentáre budú vyžadovať schválenie
configure-premod-description =
  Moderátori musia schváliť každý komentár v diskusii pod týmto článkom.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  Každý komentár obsahujúci odkaz bude vyžadovať schválenie
configure-premodLink-description =
  Moderátori musia schváliť akýkoľvek komentár obsahujúci odkaz.

configure-messageBox-title =
configure-addMessage-title =
  Pridať správu alebo otázku
configure-messageBox-description =
configure-addMessage-description =
  Pridať správu do hornej časti poľa na pridávanie komentárov. Použite túto funkciu na pridanie
  témy, otázky alebo oznámenia vzťahujúceho sa k tomuto článku.
configure-addMessage-addMessage = Pridať správu
configure-addMessage-removed = Správa bola zmazaná
config-addMessage-messageHasBeenAdded =
  Správa bola pridaná.
configure-addMessage-remove = Zmazať
configure-addMessage-submitUpdate = Uložiť
configure-addMessage-cancel = Zrušiť
configure-addMessage-submitAdd = Pridať správu

configure-messageBox-preview = Náhľad
configure-messageBox-selectAnIcon = Vybrať ikonu
configure-messageBox-iconConversation = Diskusia
configure-messageBox-iconDate = Dátum
configure-messageBox-iconHelp = Pomoc
configure-messageBox-iconWarning = Varovanie
configure-messageBox-iconChatBubble = Chatová bublina
configure-messageBox-noIcon = Žiadna ikona
configure-messageBox-writeAMessage = Napísať správu

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  Zamknúť diskusiu
configure-closeStream-description =
  Táto diskusia je momentálne otvorená. Po uzamknutí diskusie nebude možné
  pridať ďalšie príspevky, odpovede alebo hodnotenia.
configure-closeStream-closeStream = Zamknúť diskusiu
configure-closeStream-theStreamIsNowOpen = Diskusia je teraz odomknutá

configure-openStream-title = Odomknúť diskusiu
configure-openStream-description =
  Diskusia je momentálne zamknutá. Otvorením diskusie sa povolí možnosť pridať komentáre.
configure-openStream-openStream = Odomknúť diskusiu
configure-openStream-theStreamIsNowClosed = Diskusia je momentálne zamknutá

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  Formát otázok a odpovedí je momentálne v aktívnom vývoji.

configure-enableQA-title =
configure-enableQA-switchToQA =
  Prepnúť na formát otázok a odpovedí (Q&A)
configure-enableQA-description =
  Formát Q&A umožňuje diskutujúcim zadávať otázky pre vybraných odborníkov
configure-enableQA-enableQA = Prepnúť na formát otázok a odpovedí
configure-enableQA-streamIsNowComments =
  Táto diskusia je momentálene v štandardnom móde.

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

comments-tombstone-ignore-user = Komentár sa nezobrazuje pretože ste si daného uživateľa skryli.
comments-tombstone-showComment = Zobraziť komentár
comments-tombstone-deleted =
  Tento komentár už nie je dostupný. Užívateľ odstránil svoj účet.
comments-tombstone-rejected =
  Tento komentár bol odstránený moderátorom z dôvodu porušenia pravidiel diskusie.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  Na vašom účte bola dočasne pozastavená možnosť komentovania
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  Bola vám dočasne pozastavená možnosť komentovania.
suspendInfo-until-pleaseRejoinThe =
  Do diskusií sa budete môcť opäť zapojiť { $until }

warning-heading = Váš účet dostal varovanie
warning-explanation =
    V súlade s pravidlami diskusii dostal váš účet varovanie.
warning-instructions =
  Ak chcete pokračovať v účasti na diskusiách, stlačte tlačidlo „Potvrdiť“ nižšie.
warning-acknowledge = Potvrdiť

warning-notice = Váš účet dostal varovanie. Ak chcete pokračovať v účasti na diskusiách, <a>prečítajte si upozornenie</a>.

modMessage-heading = Vášmu účtu bola odoslaná správa od moderátora
modMessage-acknowledge = Potvrdiť

profile-changeEmail-unverified = (Nepotvrdený)
profile-changeEmail-current = (current)
profile-changeEmail-edit = Upraviť
profile-changeEmail-change = Zmeniť
profile-changeEmail-please-verify = Overiť svoju e-mailovú adresu
profile-changeEmail-please-verify-details =
  E-mail na overenie vášho účtu bol odoslaný na { $email }.
profile-changeEmail-resend = Znova odoslať overovací e-mail
profile-changeEmail-heading = Upravte svoju e-mailovú adresu
profile-changeEmail-changeYourEmailAddress =
  Upravte svoju e-mailovú adresu
profile-changeEmail-desc = Zmeňte e-mailovú adresu používanú na prihlásenie.
profile-changeEmail-newEmail-label = Nová e-mailová adresa
profile-changeEmail-password = Heslo
profile-changeEmail-password-input =
  .placeholder = Heslo
profile-changeEmail-cancel = Zrušiť
profile-changeEmail-submit = Uložiť
profile-changeEmail-saveChanges = Uložiť zmeny
profile-changeEmail-email = E-mail
profile-changeEmail-title = E-mailová adresa
profile-changeEmail-success = Váš email bol úspešne aktualizovaný

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Submit a Review or Ask a Question

ratingsAndReviews-reviewsTab = Hodnotenia
ratingsAndReviews-questionsTab = Otázky
ratingsAndReviews-noReviewsAtAll = Žiadne hodnotenia.
ratingsAndReviews-noQuestionsAtAll = Žiadne otázky.
ratingsAndReviews-noReviewsYet = Zatiaľ tu nie sú žiadne hodnotenia.
ratingsAndReviews-noQuestionsYet = Zatiaľ nie sú žiadne otázky.
ratingsAndReviews-selectARating = Vyberte hodnotenie
ratingsAndReviews-youRatedThis = Už ste to ohodnotili
ratingsAndReviews-showReview = Ukázať hodnotenie
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Ohodnotiť
ratingsAndReviews-askAQuestion = Opýtať sa otázku
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Zatiaľ žiadne hodnotenie
  [1] Na základe jedného hodnotenia
  *[other] Na základe { SHORT_NUMBER($count) } hodnotení
}

ratingsAndReviews-allReviewsFilter = Všetky hodnotenia
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 hviezda
  [few] { $rating } hviezdy
  *[many] { $rating } hviezd
}

comments-addAReviewForm-rteLabel = Pridať hodnotenie (voliteľné)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = Začiatok článku
  .title = Prejsť na začiatok článku
stream-footer-links-top-of-comments = Začiatok komentárov
  .title = Prejsť na začiatok komentárov
stream-footer-links-profile = Profil a odpovede
  .title = Prejsť na profil a odpovede
stream-footer-links-discussions = Ďalšie diskusie
  .title = Prejsť na ďalšie diskusie
stream-footer-navigation =
  .aria-label = Pätička komentárov


### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = Kommentek embeddelése

general-moderate = Moderálás
general-archived = Archiválva

general-userBoxUnauthenticated-joinTheConversation = Csatlakozás a beszélgetéshez
general-userBoxUnauthenticated-signIn = Bejelentkezés
general-userBoxUnauthenticated-register = Regisztráció

general-authenticationSection =
  .aria-label = Hitelesítés

general-userBoxAuthenticated-signedIn =
  Bejelentkezve mint
general-userBoxAuthenticated-notYou =
  Nem te vagy? <button>Sign Out</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Ön sikeresen kijelentkezett

general-tabBar-commentsTab = Hozzászólások
general-tabBar-myProfileTab = Fiókom
general-tabBar-discussionsTab = Eszmecserék
general-tabBar-reviewsTab = Vélemények
general-tabBar-configure = Beállítások

general-mainTablist =
  .aria-label = Elsődleges fülek

general-secondaryTablist =
  .aria-label = Másodlagos fülek

## Comment Count

comment-count-text =
  { $count  ->
    [one] Hozzászólás
    *[other] Hozzászólás
  }

## Comments Tab

comments-allCommentsTab = Összes hozzászólás
comments-featuredTab = Kiemelt
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 ember figyeli a beszélgetést
    *[other] { SHORT_NUMBER($count) } ember figyeli a beszélgetést
  }

comments-announcement-section =
  .aria-label = Közlemény
comments-announcement-closeButton =
  .aria-label = Közlemény bezárása

comments-accountStatus-section =
  .aria-label = Fiók állapota

comments-featuredCommentTooltip-how = Hogyan jelenik meg egy hozzászólás?
comments-featuredCommentTooltip-handSelectedComments =
  A hozzászólásokat csapatunk választja ki olvasásra érdemesnek.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Kiemelt megjegyzések tooltip bekapcsolása
  .title = Kiemelt megjegyzések tooltip

comments-collapse-toggle =
  .aria-label = Kommentszekció becsukása
comments-expand-toggle =
  .aria-label = Kommentszekció kinyitása
comments-bannedInfo-bannedFromCommenting = A fiókodat eltiltották a kommenteléstől
comments-bannedInfo-violatedCommunityGuidelines =
  Valaki, akinek hozzáférése van a fiókjához, megsértette a közösségünket irányelveit. Ennek eredményeképpen a fiókját letiltottuk. Nem lesz többé nem lesz lehetősége kommentelni, reakciókat használni vagy kommenteket jelenteni. Ha úgy gondolja, hogy hogy ez tévedésből történt, kérjük, lépjen kapcsolatba a csapatunkkal.

comments-noCommentsAtAll = Nincsenek hozzászólások a cikk alatt
comments-noCommentsYet = Még nincsenek hozzászólások. Miért nem írja meg az elsőt?

comments-streamQuery-storyNotFound = A cikk nem található

comments-communityGuidelines-section =
  .aria-label = Közösségi iránymutatások

comments-commentForm-cancel = Mégsem
comments-commentForm-saveChanges = Változtatások mentése
comments-commentForm-submit = Elküldés

comments-postCommentForm-section =
  .aria-label = Komment közzététele
comments-postCommentForm-submit = Közzététel
comments-replyList-showAll = Minden találat megmutatása
comments-replyList-showMoreReplies = Több válasz megjelenítése

comments-postComment-gifSearch = GIF keresése
comments-postComment-gifSearch-search =
  .aria-label = Keresés
comments-postComment-gifSearch-loading = Betöltés...
comments-postComment-gifSearch-no-results = Nincs találat a {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = a giphy jóvoltából

comments-postComment-pasteImage = Kép URL beillesztése
comments-postComment-insertImage = Beillesztés

comments-postComment-confirmMedia-youtube = Adja hozzá ezt a YouTube-videót a hozzászólása végére?
comments-postComment-confirmMedia-twitter = Adja hozzá ezt a Tweetet a hozzászólása végére?
comments-postComment-confirmMedia-cancel = Mégsem
comments-postComment-confirmMedia-add-tweet = Tweet hozzáadása
comments-postComment-confirmMedia-add-video = Videó hozzáadása
comments-postComment-confirmMedia-remove = Törlés
comments-commentForm-gifPreview-remove = Törlés
comments-viewNew =
  { $count ->
    [1] View {$count} Új komment
    *[other] View {$count} Új kommentek
  }
comments-loadMore = Több betöltése

comments-permalinkPopover =
  .description = Egy párbeszédpanel, amely a megjegyzésre mutató hivatkozást jelenít meg
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink a megjegyzéshez
comments-permalinkButton-share = Megosztás
comments-permalinkButton =
  .aria-label = Komment megosztása {$username}
comments-permalinkView-section =
  .aria-label = Egyetlen beszélgetés
comments-permalinkView-viewFullDiscussion = A teljes beszélgetés megjelenítése
comments-permalinkView-commentRemovedOrDoesNotExist = Ezt a megjegyzést eltávolították, vagy nem létezik.


comments-rte-bold =
  .title = Félkövér

comments-rte-italic =
  .title = Dőlt

comments-rte-blockquote =
  .title = Szövegblokk

comments-rte-bulletedList =
  .title = Lista

comments-rte-strikethrough =
  .title = Áthúzás

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Szarkazmus

comments-rte-externalImage =
  .title = Külső kép

comments-remainingCharacters = { $remaining } karakter maradt hátra

comments-postCommentFormFake-signInAndJoin = Jelentkezzen be és csatlakozzon a beszélgetéshez

comments-postCommentForm-rteLabel = Hozzászólás közzététele

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = Válasz
comments-replyButton =
  .aria-label = Válasz {$username} hozzászólására

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Küldés
comments-replyCommentForm-cancel = Mégsem
comments-replyCommentForm-rteLabel = Válasz írása
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = végrehajtási szál{ $level }:
comments-commentContainer-highlightedLabel = Kiemelve:
comments-commentContainer-ancestorLabel = Előző:
comments-commentContainer-replyLabel =
  Válasz { $username } felhasználótól <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  Kérdés { $username } felhasználótól  <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  Komment { $username } felhasználótól <RelativeTime></RelativeTime>
comments-commentContainer-editButton = Szerkesztés

comments-commentContainer-avatar =
  .alt = { $username } profilképe

comments-editCommentForm-saveChanges = Változtatások mentése
comments-editCommentForm-cancel = Mégsem
comments-editCommentForm-close = Bezárás
comments-editCommentForm-rteLabel = komment szerkesztése
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Szerkesztés: <time></time> maradt
comments-editCommentForm-editTimeExpired = A szerkesztési idő lejárt. Ezt a hozzászólást már nem szerkesztheti tovább. Miért nem ír egy másikat?
comments-editedMarker-edited = Szerkesztve
comments-showConversationLink-readMore = Még több hozzászólás elolvasása ebből a beszélgetésből >
comments-conversationThread-showMoreOfThisConversation =
  Még több mutatása ebből a beszélgetésből

comments-permalinkView-youAreCurrentlyViewing =
  Jelenleg egyetlen beszélgetést tekinteszt meg
comments-inReplyTo = Válasz <Username></Username> felhasználónak
comments-replyingTo = Válaszolj <Username></Username> felhasználónak

comments-reportButton-report = Jelentés
comments-reportButton-reported = Jelentve
comments-reportButton-aria-report =
  .aria-label = {$username} kommentjének jelentése
comments-reportButton-aria-reported =
  .aria-label = Jelentve

comments-sortMenu-sortBy = Rendezés
comments-sortMenu-newest = Legújabb
comments-sortMenu-oldest = Legrégebbi
comments-sortMenu-mostReplies = Legtöbb válasz

comments-userPopover =
  .description = Felugró ablak a felhasználó további információval
comments-userPopover-memberSince = { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") } óta tag
comments-userPopover-ignore = Lenémít

comments-userIgnorePopover-ignoreUser = Lenémítja {$username} felhasználót?
comments-userIgnorePopover-description =
  Ha lenémít egy kommentelőt, az összes kommentje, amit az oldalra írt, el lesz rejtve Ön elől. Ezt később visszacsinálhatja a Saját profilból.
comments-userIgnorePopover-ignore = Lenémítás
comments-userIgnorePopover-cancel = Mégsem

comments-userBanPopover-title = Kitilja {$username}?
comments-userBanPopover-description =
  A kitiltás után ez a felhasználó többé nem fog tudni kommentelni, reakciókat használni vagy kommenteket jelenteni. Ez a hozzászólás szintén elutasításra kerül.
comments-userBanPopover-cancel = Mégsem
comments-userBanPopover-ban = Ban

comments-moderationDropdown-popover =
  .description = Felugró menü a kommentek moderálásához
comments-moderationDropdown-feature = Megjelenítés
comments-moderationDropdown-unfeature = Elrejtés
comments-moderationDropdown-approve = Elfogadás
comments-moderationDropdown-approved = Elfogadva
comments-moderationDropdown-reject = Elutasítás
comments-moderationDropdown-rejected = Elutasítva
comments-moderationDropdown-ban = Felhasználó kitiltása
comments-moderationDropdown-banned = Kitiltva
## comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = Moderációs megjelenítés
comments-moderationDropdown-moderateStory = Cikk moderálása
comments-moderationDropdown-caretButton =
  .aria-label = Moderálás

comments-moderationRejectedTombstone-title = Elutasította ezt a hozzászólást
comments-moderationRejectedTombstone-moderateLink =
  Moderálás megnyitása a döntés felülvizsgálatához

comments-featuredTag = Megjelenített

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} {$username} kommentje
    *[other] {$reaction} {$username} kommentjei (Total: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction}  {$username} kommentje
    [one] {$reaction} {$username} kommentje
    *[other] {$reaction} {$username} kommentjei (Total: {$count})
  }

comments-jumpToComment-title = A válaszát lentebb közzétettük
comments-jumpToComment-GoToReply = Válasz

comments-mobileToolbar-closeButton =
  .aria-label = Bezárás
comments-mobileToolbar-unmarkAll = Kijelölés visszavonása
comments-mobileToolbar-nextUnread = Következő olvasatlan

comments-replyChangedWarning-theCommentHasJust =
  Ezt a megjegyzést most szerkesztették. A legfrissebb verzió fent látható.

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = Kérdés írása

qa-answeredTab = Megválaszolt
qa-unansweredTab = Megválaszolatlan
qa-allCommentsTab = Összes

qa-answered-gotoConversation = Tovább a beszélgetéshez
qa-answered-replies = Válaszok

qa-noQuestionsAtAll =
  Nincsenek kérdések ennél a cikknél.
qa-noQuestionsYet =
  Még nincsenek kérdések. Miért nem tesz fel egyet?
qa-viewNew =
  { $count ->
    [1] View {$count} Új kérdés
    *[other] View {$count} Új kérdések
  }

qa-postQuestionForm-rteLabel = Kérdés közzététele
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = legtöbb szavazat

qa-answered-tag = megválaszolt
qa-expert-tag = Szakértő

qa-reaction-vote = Szavazás
qa-reaction-voted = Szavazott

qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] {$username} kommentjére szavazott
    [one] {$username} kommentjére szavazott
    *[other] ({$count}) Szavazat {$username} kommentjére
  }

qa-unansweredTab-doneAnswering = Kész

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Hogyan válaszolnak egy kérdésre?
qa-answeredTooltip-answeredComments =
  A kérdésekre Q&A szakértők válaszolnak.
qa-answeredTooltip-toggleButton =
  .aria-label = Megválaszolt kérdések ablak közötti váltás
  .title = TMegválaszolt kérdések ablak közötti váltás

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title = Fiók törlését kérvényezte
comments-stream-deleteAccount-callOut-receivedDesc =
  { $date }. napon fiókja törlésére vonatkozó kérelem érkezett
comments-stream-deleteAccount-callOut-cancelDesc =
  Ha továbbra is szeretnél hozzászólásokat, válaszokat vagy reakciókat hagyni, { $date }. előtt visszavonhatja a fiókja törlésére vonatkozó kérelmét
comments-stream-deleteAccount-callOut-cancel =
  A fiók törlési kérelmének visszavonása
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  A fiók törlési kérelmének visszavonása

comments-permalink-copyLink = Link másolása
comments-permalink-linkCopied = Link másolva

### Embed Links

comments-embedLinks-showEmbeds = Beágyazások megjelenítése
comments-embedLinks-hideEmbeds = Beágyazások elrejtése

comments-embedLinks-show-giphy = GIF megjelenítése
comments-embedLinks-hide-giphy = GIF elrejtése

comments-embedLinks-show-youtube = Videó megjelenítése
comments-embedLinks-hide-youtube = Videó elrejtése

comments-embedLinks-show-twitter = Tweet megjelenítése
comments-embedLinks-hide-twitter = Tweet elrejtése

comments-embedLinks-show-external = Kép megjelenítése
comments-embedLinks-hide-external = Kép elrejtése


### Featured Comments
comments-featured-label =
  Kiemelt komment {$username} felhasználótól <RelativeTime></RelativeTime>
comments-featured-gotoConversation = Tovább a beszélgetéshez
comments-featured-replies = Válaszok

## Profile Tab

profile-myCommentsTab = Hozzászólásaim
profile-myCommentsTab-comments = Hozzászólásaim
profile-accountTab = Fiók
profile-preferencesTab = Preferenciák

### Bio
profile-bio-title = Bemutatkozás
profile-bio-description =
  Adjon meg egy bemutatkozást, ami nyilvánosan megjelenhet a profilján. Max. 100 karakter
profile-bio-remove = Eltávolítás
profile-bio-update = Frissítés
profile-bio-success = A bemutatkozását sikeresen frissítette
profile-bio-removed = A bemutatkozását sikeresen törölte


### Account Deletion

profile-accountDeletion-deletionDesc =
  Fiókja { $date }. napon törlésre kerül
profile-accountDeletion-cancelDeletion =
  A fiók törlési kérelmének visszavonása
profile-accountDeletion-cancelAccountDeletion =
  A fiók törlési kérelmének visszavonása

### Comment History
profile-commentHistory-section =
  .aria-label = Hozzászólási előzmények
profile-historyComment-commentLabel =
  Komment <RelativeTime></RelativeTime> a { $storyTitle } cikk alatt
profile-historyComment-viewConversation = Beszélgetés megjelenítése
profile-historyComment-replies = Válaszok {$replyCount}
profile-historyComment-commentHistory = Hozzászólások előzménye
profile-historyComment-story = Cikk: {$title}
profile-historyComment-comment-on = Komment:
profile-profileQuery-errorLoadingProfile = Hiba a profil betöltése közben
profile-profileQuery-storyNotFound = A cikk nem található
profile-commentHistory-loadMore = Még több betöltése
profile-commentHistory-empty = Ön nem írt semmilyen megjegyzést
profile-commentHistory-empty-subheading = Az Ön hozzászólásai itt fognak megjelenni

### Preferences

profile-preferences-mediaPreferences = Média preferenciák
profile-preferences-mediaPreferences-alwaysShow = GIFek, Tweetek, YouTube-videók állandó megjelenítése
profile-preferences-mediaPreferences-thisMayMake = Ez lassabbá teheti a hozzászólások betöltését
profile-preferences-mediaPreferences-update = Frissítés
profile-preferences-mediaPreferences-preferencesUpdated =
  A médiabeállítások frissültek

### Account
profile-account-ignoredCommenters = Lenémított felhasználók
profile-account-ignoredCommenters-description =
  Lenémíthat más felhasználókat, amennyiben a felhasználónevükre kattint,és kiválasztja a némítás lehetőséget. A lenémított felhasználó hozzászólásait elrejtjük ön elől, de a lenémított felhasználó látni fogja az ön hozzászólásait.
profile-account-ignoredCommenters-empty = Jelenleg nem némít le senkit
profile-account-ignoredCommenters-stopIgnoring = Némítás feloldása
profile-account-ignoredCommenters-youAreNoLonger =
  Többé nem némítja a felhasználót
profile-account-ignoredCommenters-manage = Kezelés
profile-account-ignoredCommenters-cancel = Mégsem
profile-account-ignoredCommenters-close = Bezárás

profile-account-changePassword-cancel = Mégsem
profile-account-changePassword = Jelszó megváltoztatása
profile-account-changePassword-oldPassword = Régi jelszó
profile-account-changePassword-forgotPassword = Elfelejtette a jelszavát?
profile-account-changePassword-newPassword = Új jelszó
profile-account-changePassword-button = Jelszó megváltoztatása
profile-account-changePassword-updated =
  Sikeresen frissítette a jelszavát
profile-account-changePassword-password = Jelszó

profile-account-download-comments-title = Hozzászlósi előzmények letöltése
profile-account-download-comments-description =
  Kapni fog egy e-mailt, amely tartalmaz egy linket a hozzászólási előzmények letöltéséhez.
  <strong>14 napon belül csak egyszer kérvényezheti az előzmények letöltését.</strong>
profile-account-download-comments-request =
  Hozzászólási előzmények kérvényezése
profile-account-download-comments-request-icon =
  .title = Hozzászólási előzmények kérvényezése
profile-account-download-comments-recentRequest =
  A legutóbbi lekérése: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  A legutóbbi kérvénye 14 napon belül volt. Legközelebb { $timeStamp } napon kérvényezheti újból a letöltést
profile-account-download-comments-requested =
  Kérés elküldve. Legközelebb { framework-timeago-time }. kérvényezheti újból a letöltést.
profile-account-download-comments-requestSubmitted =
  A kérését sikeresen elküldte. Legközelebb { framework-timeago-time }. kérheti a letöltést
profile-account-download-comments-error =
  Nem tudtuk teljesíteni a letöltési kérését.
profile-account-download-comments-request-button = Kérés

## Delete Account

profile-account-deleteAccount-title = Fiókom törlése
profile-account-deleteAccount-deleteMyAccount = Fiókom törlése
profile-account-deleteAccount-description =
  A fiókod törlése véglegesen törölni fogja az adataidat és a hozzászólásaidat
  a rendszerünkből.
profile-account-deleteAccount-requestDelete = Fiók törlésének kérése
profile-account-deleteAccount-cancelDelete-description =
  Már kérted a fiókod törlését.
  A fiókod törölve lesz ekkor: { $date }.
  Eddig az időpontig visszavonhatod a törlést.
profile-account-deleteAccount-cancelDelete = Törlés kérésének visszavonása
profile-account-deleteAccount-request = Törlöm
profile-account-deleteAccount-cancel = Visszavonom
profile-account-deleteAccount-pages-deleteButton = Fiókom törlése
profile-account-deleteAccount-pages-cancel = Visszavonás
profile-account-deleteAccount-pages-proceed = Folytatás
profile-account-deleteAccount-pages-done = Kész
profile-account-deleteAccount-pages-phrase =
  .aria-label = Folyamatban

profile-account-deleteAccount-pages-sharedHeader = Fiókom törlése

profile-account-deleteAccount-pages-descriptionHeader = Törli a fiókját?
profile-account-deleteAccount-pages-descriptionText =
  Ön megpróbálja törölni a fiókját. Ez azt jelenti, hogy:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Az összes eddigi hozzászólása törlődik az oldalról
profile-account-deleteAccount-pages-allCommentsDeleted =
  Az összes eddigi hozzászólása törlődik az adatbázisunkból
profile-account-deleteAccount-pages-emailRemoved =
  Az e-mail címe kikerül a rendszerünkből

profile-account-deleteAccount-pages-whenHeader = Fiókom törlése: mikor?
profile-account-deleteAccount-pages-whenSubHeader = mikor?
profile-account-deleteAccount-pages-whenSec1Header =
  Mikor törlik a fiókomat?
profile-account-deleteAccount-pages-whenSec1Content =
  A fiókját 24 órával a folyamat megindítása után töröljük.
profile-account-deleteAccount-pages-whenSec2Header =
  A fiókom törlése után is írhatod még hozzászólásokat?
profile-account-deleteAccount-pages-whenSec2Content =
  Nem. Miután a fiókja törlését kérte, nem tud majd kommentelni, reagálni, válaszolni a hozzászólásokra.

profile-account-deleteAccount-pages-downloadCommentHeader = Letölti a hozzászólásait?
profile-account-deleteAccount-pages-downloadSubHeader = Hozzászólásaim letöltése
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Mielőtt törli a fiókját, azt ajánljuk, töltse le a hozzászólási előzményeit. Erre nem lesz lehetősége a fiók törlése után.
profile-account-deleteAccount-pages-downloadCommentsPath =
  My Profile > Hozzászólási előzmények letöltése

profile-account-deleteAccount-pages-confirmHeader = Megerősíti a törlést?
profile-account-deleteAccount-pages-confirmSubHeader = Biztos benne?
profile-account-deleteAccount-pages-confirmDescHeader =
  Biztosan törölni akarja a fiókját?
profile-account-deleteAccount-confirmDescContent =
  Ha szeretné megerősíteni, hogy törölni szeretné fiókját, kérjük, írja be a következő kifejezést az alábbi szövegdobozba:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  A megerősítéshez írja le az alábbi szöveget
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Adja meg a jelszavát:

profile-account-deleteAccount-pages-completeHeader = Kérvényezte a fiók törlését
profile-account-deleteAccount-pages-completeSubHeader = Kérés elküldve
profile-account-deleteAccount-pages-completeDescript =
  A kérését elküldte. Visszaigazolást küldtünk a fiókjához tartozó e-mail címre.
profile-account-deleteAccount-pages-completeTimeHeader =
  A fiókját { $date } napon fogjuk törölni
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Meggondolta magát?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Jelentkezzen be újból, és válassza a  <strong>Törlési kérelem felfüggesztését</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Kérjük mondja el, miért.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Szeretnénk tudni, miért döntött a fiókja törlése mellett. Írja meg a válaszát a { $email }. címre
profile-account-changePassword-edit = Szerkesztés
profile-account-changePassword-change = Változtatás


## Notifications
profile-notificationsTab = Értesítések
profile-account-notifications-emailNotifications = E-Mail Értesítések
profile-account-notifications-emailNotifications = Email Értesítések
profile-account-notifications-receiveWhen = Értesítést kérek:
profile-account-notifications-onReply = Válasz érkezett a hozzászólásomra
profile-account-notifications-onFeatured = Kiemelték a hozzászólásomat
profile-account-notifications-onStaffReplies = Egy szerkesztő válaszolt a hozzászólásomra
profile-account-notifications-onModeration = A függőben lévő hozzászólásomat felülvizsgálták
profile-account-notifications-sendNotifications = Értesítéseket kérek:
profile-account-notifications-sendNotifications-immediately = Azonnal
profile-account-notifications-sendNotifications-daily = Naponta
profile-account-notifications-sendNotifications-hourly = Óránként
profile-account-notifications-updated = Az értesítéssel kapcsolatos beállításai frissültek
profile-account-notifications-button = Értesítésekkel kapcsolatos beállítások frissítése
profile-account-notifications-button-update = Frissítés

## Report Comment Popover
comments-reportPopover =
  .description = Párbeszédablak a kommentek jelentésére
comments-reportPopover-reportThisComment = Hozzászólás jelentése
comments-reportPopover-whyAreYouReporting = Miért jelenti ezt a hozzászólást?

comments-reportPopover-reasonOffensive = Ez a hozzászólás sértő
comments-reportPopover-reasonAbusive = A hozzászóló sértegető
comments-reportPopover-reasonIDisagree = Nem értek egyet a hozzászólással
comments-reportPopover-reasonSpam = Reklám vagy egyéb marketingtevékenység
comments-reportPopover-reasonOther = Egyén

comments-reportPopover-additionalInformation =
  További infomáció <optional>Optional</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Kérjük, írjon le minden további információt, amely hasznos lehet a moderátorainknak.

comments-reportPopover-maxCharacters = Max. { $maxCharacters } karakter
comments-reportPopover-restrictToMaxCharacters = Kérjük, a jelentését { $maxCharacters } karakter közé szorítani
comments-reportPopover-cancel = Mégsem
comments-reportPopover-submit = Küldés

comments-reportPopover-thankYou = Köszönjük!
comments-reportPopover-receivedMessage =
  Megkaptuk az üzenetét. Az Önhöz hasonló tagok jelentései biztosítják a közösség biztonságát.

comments-reportPopover-dismiss = Bezárás

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = Hozzászólás jelentése
comments-archivedReportPopover-doesThisComment =
  Ez a hozzászólás sérti a közösségi irányelveket? Esetleg spam?
  Írjon nekünk a <a>{ $orgName }</a> címre a linkkel, és egy rövid magyarázattal együtt.
comments-archivedReportPopover-needALink =
  Szüksége van egy linkre?
comments-archivedReportPopover-copyLink = Link másolása

comments-archivedReportPopover-emailSubject = Hozzászólás jelentése
comments-archivedReportPopover-emailBody =
  Ezt a hozzászólást jelenteni szeretném:
  %0A
  { $permalinkURL }
  %0A
  %0A
  Az alábbi okok miatt:

## Submit Status
comments-submitStatus-dismiss = Elutasítva
comments-submitStatus-submittedAndWillBeReviewed =
  A hozzászólását egy moderátor fogja ellenőrizni.
comments-submitStatus-submittedAndRejected =
  Ezt a hozzászólást elutasítottuk, mert sérti az irányelveinket.

# Configure
configure-configureQuery-errorLoadingProfile = Hiba a konfiguráció betöltése során
configure-configureQuery-storyNotFound = A cikk nem található

## Archive
configure-archived-title = A kommentszekciót archiválták
configure-archived-onArchivedStream =
  On archived streams, no new comments, reactions, or reports may be
  submitted. Also, comments cannot be moderated.
  Az archivált kommentszekciókhoz nem lehet hozzászólni, nem lehet reagálni, és jelenti sem a hozzászólásokat, és azokat nem is lehet moderálni.
configure-archived-toAllowTheseActions =
  Amennyiben ezt akarja csinálni, oldja fel az archiválást
configure-archived-unarchiveStream = Archiválás feloldása

## Change username
profile-changeUsername-username = Felhasználónév
profile-changeUsername-success = Sikeresen frissítette a felhasználónevét
profile-changeUsername-edit = Szerkesztés
profile-changeUsername-change = Változtatás
profile-changeUsername-heading = Változtasson a felhasználó nevén
profile-changeUsername-heading-changeYourUsername = Változtassa meg a felhasználó nevét
profile-changeUsername-desc = Változtassan meg a felhasználó nevét, amely megjelenik a hozzászólása fölött <strong>A felhasználónevét { framework-timeago-time } csak egyszer változtathatja meg.</strong>
profile-changeUsername-desc-text = Változtassa meg a felhasználó nevét, ami az összes eddigi és jövőbeli kommentje fölött ott lesz. A felhasználónevét{ framework-timeago-time }.  változtatta meg.
profile-changeUsername-current = Jelenlegi felhasználónév
profile-changeUsername-newUsername-label = Új felhasználónév
profile-changeUsername-confirmNewUsername-label = Új felhasználónév megerősítése
profile-changeUsername-cancel = Mégsem
profile-changeUsername-save = Mentés
profile-changeUsername-saveChanges = Változtatások mentése
profile-changeUsername-recentChange = A felhasználói nevét a legutóbb változtatta meg. Legközelebb { $nextUpdate }.változtathatja meg
profile-changeUsername-youChangedYourUsernameWithin =
  A felhasználónevét{ framework-timeago-time } időszakon belül változtatta meg. Legközelebb: { $nextUpdate } napon változtathatja meg a felhasználónevét.
profile-changeUsername-close = Bezárás

## Discussions tab

discussions-mostActiveDiscussions = Legaktívabb beszélgetések
discussions-mostActiveDiscussions-subhead = Az elmúlt 24 órában a legtöbb kommentet kapott  { $siteName }
discussions-mostActiveDiscussions-empty = Még nem vettél részt ezekben a beszélgetésekben
discussions-myOngoingDiscussions = A jelenlegi beszélgetéseim
discussions-myOngoingDiscussions-subhead = Ahol eddig kommenteltél { $orgName }
discussions-viewFullHistory = Teljes kommenttörténet megtekintése
discussions-discussionsQuery-errorLoadingProfile = Hiba a profil betöltésekor
discussions-discussionsQuery-storyNotFound = A sztori nem található

## Comment Stream
configure-stream-title-configureThisStream =
  A stream konfigurálása
configure-stream-update = Update
configure-stream-streamHasBeenUpdated =
  A stream frissítve

configure-premod-description =
  A moderátoroknak engedélyeznie kell a kommenteket, mielőtt nyilvánosan megjelennének.

configure-premodLink-description =
  A moderátoroknak engedélyezniük kell a linket tartalmazó kommenteket, mielőtt nyilvánosan megjelennének.

configure-addMessage-title =
  Üzenet vagy kérdés hozzáadása
configure-addMessage-description =
  Adj hozzá egy üzenetet a kommentmező tetejére az olvasók számára. Használd ezt témafelvetéshez, hogy kérdést tegyen fel, vagy üzenetet írjon a sztorival kapcsolatosan.
configure-addMessage-addMessage = Üzenet hozzáadása
configure-addMessage-removed = Üzenet eltávolítva
config-addMessage-messageHasBeenAdded =
  Az üzenet megjelent a kommentboxban.
configure-addMessage-remove = Eltávolítás
configure-addMessage-submitUpdate = Frissítés
configure-addMessage-cancel = CMegszakítás
configure-addMessage-submitAdd = Üzenet hozzáadása

configure-messageBox-preview = Előnézet
configure-messageBox-selectAnIcon = Ikon kiválasztása
configure-messageBox-iconConversation = Beszélgetés
configure-messageBox-iconDate = Dátum
configure-messageBox-iconHelp = Segítség
configure-messageBox-iconWarning = Figyelmeztetés
configure-messageBox-iconChatBubble = Chatbuborék
configure-messageBox-noIcon = Nincs ikon
configure-messageBox-writeAMessage = Üzenet írása

configure-closeStream-closeCommentStream =
  Kommentáram bezárása
configure-closeStream-description =
  A kommentáram jelenleg nyitott. Ha bezárod a kommentáramot, akkor nem lehet új kommentet hozzáadni, de a már megjelent kommentek megmaradnak.
configure-closeStream-closeStream = Stream bezárása
configure-closeStream-theStreamIsNowOpen = A stream jelenleg nyitott.

configure-openStream-title = Stream megnyitása
configure-openStream-description =
  A kommentáram jelenleg zárt. Ha megnyitod ezt a kommentáramot, akkor új kommentek is megjelenhetnek.
configure-openStream-openStream = Stream megnyitása
configure-openStream-theStreamIsNowClosed = A stream jelenleg zárt.

qa-experimentalTag-tooltip-content =
  A kérdezz-felelek formátum jelenleg fejlesztés alatt áll. Kérünk, lépj kapcsolatba velünk visszajelzésekért vagy kérelmekért.

configure-enableQA-switchToQA =
  Váltás kérdezz-felelek formátumra.
configure-enableQA-description =
  A kérdezz-felelek formátum lehetőséget ad a közösség tagjainak arra, hogy szakértőktől kapjanak választ a kérdésükre.
configure-enableQA-streamIsNowComments =
  A stream jelenleg komment formátumban van.

configure-disableQA-description =
  A kérdezz-felelek formátum lehetőséget ad a közösség tagjainak arra, hogy szakértőktől kapjanak választ a kérdésükre.
configure-disableQA-streamIsNowQA =
  A stream jelenleg kérdezz-felelek formátumban van.

configure-experts-title = Szakértő hozzáadása
configure-experts-filter-searchField =
  .placeholder = Keresés email vagy felhasználónév alapján
  .aria-label = Keresés email vagy felhasználónév alapján
configure-experts-filter-searchButton =
  .aria-label = Keresés
configure-experts-filter-description =
  Hozzáad egy szakértői jelvényt, de csak ezen az oldalon. Az új felhasználóknak regisztrálniuk kell, hogy megnyissák a kommentek az oldalon, hogy létrehozzák a felhasználói fiókjukat.
configure-experts-search-none-found = Nem találtunk felhasználót ilyen email vagy felhasználónév alatt.
configure-experts-remove-button = Eltávolítás
configure-experts-load-more = Több betöltése
configure-experts-none-yet = Jelenleg nincsenek szakértők ebben a kérdezz-felelekben.
configure-experts-search-title = Search for an expert
configure-experts-assigned-title = Experts
configure-experts-noLongerAnExpert = többé nem szakértő
comments-tombstone-ignore = Ez a komment rejtett, mert némítottad őt: {$username}
comments-tombstone-showComment = Komment megjelenítése
comments-tombstone-deleted =
  This comment is no longer available. A kommentelő törölte a fiókját.
comments-tombstone-rejected =
  Ezt a kommentelőt egy moderátor eltávolította a közösségi irányelvek megsértése miatt.

suspendInfo-heading-yourAccountHasBeen =
  A fiókodat átmenetileg felfüggesztették, nem kommentelhetsz.
suspendInfo-description-inAccordanceWith =
  A { $organization } közösségi irányelveinek megfelelően átmenetileg felfüggesztett téged. Ezen időszak alatt nem kommentelhetsz, nem reagálhatsz és nem jelenthetsz kommenteket.
suspendInfo-until-pleaseRejoinThe =
  Ekkor térhetsz vissza a kommenteléshez: { $until }

warning-heading = A fiókod figyelmeztetést kapott
warning-explanation =
  In accordance with our community guidelines your account has been issued a warning.
warning-instructions =
  Ahhoz, hogy résztvehess a beszélgetésben, nyomd meg a lenti "Elfogadom" gombot.
warning-acknowledge = Elfogadom

warning-notice = A fiókod figyelmeztetést kapott. Ahhoz, hogy továbbra is részt vehess <a>vizsgáld felül a figyelmeztető üzenetet</a>.

modMessage-heading = A fiókod üzenetet kapott egy moderátortól
modMessage-acknowledge = Elfogadom

profile-changeEmail-unverified = (Ellenőrizetlen)
profile-changeEmail-current = (jelenlegi)
profile-changeEmail-edit = Szerkesztés
profile-changeEmail-change = Módosítás
profile-changeEmail-please-verify = Erősítsd meg az email címed
profile-changeEmail-please-verify-details =
  Küldtünk erre a címre egy emailt, hogy megerősítsd a fiókod: { $email }.
  Meg kell erősítened az email címed, mielőtt bejelentkezhetnél a fiókodba vagy értesítéseket kaphatnál.
profile-changeEmail-resend = Megerősítő újraküldése
profile-changeEmail-heading = Email cím szerkesztése
profile-changeEmail-changeYourEmailAddress =
  Email cím megváltoztatása
profile-changeEmail-desc = Változtasd meg az email címet, amit a kommunikációra és a fiókodhoz használsz.
profile-changeEmail-newEmail-label = Új email cím
profile-changeEmail-password = Jelszó
profile-changeEmail-password-input =
  .placeholder = Jelszó
profile-changeEmail-cancel = Megszakítás
profile-changeEmail-submit = Mentés
profile-changeEmail-saveChanges = Módosítások mentése
profile-changeEmail-email = Email
profile-changeEmail-title = Email cím
profile-changeEmail-success = Sikeresen frissítetted az email címed.

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = Elemzés küldése vagy kérdés feltétele

ratingsAndReviews-reviewsTab = Elemzések
ratingsAndReviews-questionsTab = Kérdések
ratingsAndReviews-noReviewsAtAll = Nincsenek elemzések.
ratingsAndReviews-noQuestionsAtAll = Nincsenek kérdések.
ratingsAndReviews-noReviewsYet = Még nincsenek felülvizsgálatok. Szeretnél írni egyet?
ratingsAndReviews-noQuestionsYet = Még nincsenek kérdések. Szeretnél feltenni egyet?
ratingsAndReviews-selectARating = Válassz minősítést
ratingsAndReviews-youRatedThis = A te minősítésed
ratingsAndReviews-showReview = Elemzés megjelenítése
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = Értékelés és Elemzés
ratingsAndReviews-askAQuestion = Kérdés feltevése
ratingsAndReviews-basedOnRatings = { $count ->
  [0] Még nincsenek értékelések
  [1] 1 értékelés alapján
  *[other] Based on { SHORT_NUMBER($count) } ratings
}

ratingsAndReviews-allReviewsFilter = Minden elemzés
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] 1 Csillag
  *[other] { $rating } Csillagok
}

comments-addAReviewForm-rteLabel = Elemzés hozzáadása (opcionális)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = A cikk teteje
  .title = Ugrás a cikk tetejére
stream-footer-links-top-of-comments = A kommentek teteje
  .title = Ugrás a kommentek tetejére
stream-footer-links-profile = Profil és válaszok
  .title = Ugrás a profilhoz és a válaszokhoz
stream-footer-links-discussions = Több beszélgetés
  .title = Ugrás a több beszélgetésre
stream-footer-navigation =
  .aria-label = Hozzászólások lábléc

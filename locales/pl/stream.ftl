### Localization for Embed Stream

## General

general-moderate = Moderacja

general-userBoxUnauthenticated-joinTheConversation = Dołącz do rozmowy
general-userBoxUnauthenticated-signIn = Zaloguj się
general-userBoxUnauthenticated-register = Rejestracja

general-userBoxAuthenticated-signedIn =
  Twój login to

general-userBoxAuthenticated-notYou =
  To nie Ty? <button>Wyloguj</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Jesteś wylogowany/a

general-tabBar-commentsTab = Komentarze
general-tabBar-myProfileTab = Mój profil
general-tabBar-discussionsTab = Dyskusje
general-tabBar-configure = Konfiguracja

## Comment Count

comment-count-text =
  { $count  ->
    [one] Komentarz
    [few] Komentarze
    *[many] Komentarzy
  }

## Comments Tab

comments-allCommentsTab = Wszystkie
comments-featuredTab = Wyróżnione
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers = { SHORT_NUMBER($count) } obserwuje

comments-featuredCommentTooltip-how = Jak komentarze zostają wyróżnione?
comments-featuredCommentTooltip-handSelectedComments =
  Komentarze szczególnie warte przeczytania są wyróżniane przez naszą redakcję.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Włącz opis funkcji wyróżniania
  .title = Włącz opis funkcji wyróżniania

comments-collapse-toggle =
  .aria-label = Zwiń wątek komentarzy
comments-bannedInfo-bannedFromCommenting = Twoje konto zostało zablokowane i nie możesz komentować.
comments-bannedInfo-violatedCommunityGuidelines =
  Ktoś z dostępem do Twojego konta złamał zasady obowiązujące w
  naszej społeczności. W rezultacie tych działań, Twoje konto
  zostało zbanowane. Nie masz już więcej możliwości komentowania,
  ocenienia albo zgłaszania komentarzy. Jeśli uważasz, że stało się
  to w wyniku błędu, skontaktuj się z naszym zespołem.

comments-noCommentsAtAll = Nie ma komentarzy do tego artykułu.
comments-noCommentsYet = Nie ma jeszcze żadnych komentarzy. Może chcesz napisać pierwszy?

comments-streamQuery-storyNotFound = Artykuł nie został odnaleziony.

comments-commentForm-cancel = Anuluj
comments-commentForm-saveChanges = Zapisz zmiany
comments-commentForm-submit = Wyślij

comments-postCommentForm-submit = Wyślij
comments-replyList-showAll = Wszystkie
comments-replyList-showMoreReplies = Pokaż więcej odpowiedzi

comments-postCommentForm-gifSeach = Poszukaj GIFa
comments-postComment-gifSearch-loading = Ładuję...
comments-postComment-gifSearch-no-results = Nie znaleziono żadnego pliku dla {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Pracuje na giphy

comments-postComment-pasteImage = Wklej adres URL obrazka
comments-postComment-insertImage = Wstaw

comments-postComment-confirmMedia-youtube = Dodać ten film YouTube na dole Twojego komentarza?
comments-postComment-confirmMedia-twitter = Dodać ten tweet na dole Twojego komentarza?
comments-postComment-confirmMedia-cancel = Anuluj
comments-postComment-confirmMedia-add-tweet = Dodaj Tweet
comments-postComment-confirmMedia-add-video = Dodaj film
comments-postComment-confirmMedia-remove = Usuń
comments-commentForm-gifPreview-remove = Usuń
comments-viewNew =
  { $count ->
    [one] Zobacz {$count} nowy komentarz
    [few] Zobacz {$count} nowe komentarze
    *[many] Zobacz {$count} nowych komentarzy
  }
comments-loadMore = Załaduj więcej

comments-permalinkPopover =
  .description = Dialog pokazujący permalink do komentarza.
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink do komentarza
comments-permalinkButton-share = Dalej
comments-permalinkButton =
  .aria-label = Udostępnij komentarz {$username}
comments-permalinkView-viewFullDiscussion = Zobacz pełną dyskusję
comments-permalinkView-commentRemovedOrDoesNotExist = Ten komentarz został usunięty albo nie istnieje.

comments-rte-bold =
  .title = Pogrubienie

comments-rte-italic =
  .title = Kursywa

comments-rte-blockquote =
  .title = Cytat

comments-rte-bulletedList =
  .title = Lista nienumerowana

comments-rte-strikethrough =
  .title = Przekreślenie

comments-rte-spoiler = Spoiler

comments-rte-sarcasm = Sarkazm

comments-rte-externalImage =
  .title = Zewnętrzny obrazek

comments-remainingCharacters = Możesz jeszcze napisać  { $remaining } znaków

comments-postCommentFormFake-signInAndJoin = Zaloguj się i dołącz do rozmów

comments-postCommentForm-rteLabel = Opublikuj komentarz

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentForm-userScheduledForDeletion-warning =
  Komentowanie nie jest możliwe, kiedy Twoje konto jest oznaczone jako konto do usunięcia.

comments-replyButton-reply = Odpowiedz
comments-replyButton =
  .aria-label = Odpowiedz na komentarz {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Wyślij
comments-replyCommentForm-cancel = Anuluj
comments-replyCommentForm-rteLabel = Odpowiedz
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Edytuj

comments-commentContainer-avatar =
  .alt = Awatar { $username }

comments-editCommentForm-saveChanges = Zapisz zmiany
comments-editCommentForm-cancel = Anuluj
comments-editCommentForm-close = Zamknij
comments-editCommentForm-rteLabel = Edytuj komentarz
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Edycja: jeszcze przez <time></time>
comments-editCommentForm-editTimeExpired = Czas na możliwą edycję minął. Nie możesz już zmienić treści tego komentarza. A może napisz jeszcze jeden?
comments-editedMarker-edited = Zmieniony
comments-showConversationLink-readMore = Przeczytaj więcej w tej konwersacji >
comments-conversationThread-showMoreOfThisConversation =
  Pokaż więcej w konwersacji

comments-permalinkView-youAreCurrentlyViewing =
  W tej chwili widzisz pojedynczy wątek komentarzy
comments-inReplyTo = W odpowiedzi do <Username></Username>
comments-replyingTo = Odpowiadasz: <Username></Username>

comments-reportButton-report = Zgłoś
comments-reportButton-reported = Zgłoszony
comments-reportButton-aria-report =
  .aria-label = Zgłoś komentarz {$username}
comments-reportButton-aria-reported =
  .aria-label = Zgłoszono

comments-sortMenu-sortBy = Sortuj wg
comments-sortMenu-newest = Najnowsze
comments-sortMenu-oldest = Najstarsze
comments-sortMenu-mostReplies = Najwięcej odpowiedzi

comments-userPopover =
  .description = Okienko z informacją o użytkowniku
comments-userPopover-memberSince = Użytkownik od: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Ignoruj

comments-userIgnorePopover-ignoreUser = Ignorować {$username}?
comments-userIgnorePopover-description =
  Kiedy ignorujesz użytkownika, wszystkie jej/jego komentarze
  będą przed Tobą ukryte. Możesz później cofnąć tę operację
  w swoim Profilu.
comments-userIgnorePopover-ignore = Ignoruj
comments-userIgnorePopover-cancel = Anuluj

comments-userBanPopover-title = Zbanować {$username}?
comments-userBanPopover-description =
  Po zbanowaniu, nie będzie już mógł/mogła
  komentować, reagować, zgłaszać komentarzy.
  Ten komentarz zostanie usunięty.
comments-userBanPopover-cancel = Anuluj
comments-userBanPopover-ban = Banuj

comments-moderationDropdown-popover =
  .description = Okienko do moderowania komentarz
comments-moderationDropdown-feature = Wyróżnij
comments-moderationDropdown-unfeature = Od-wyróżnij
comments-moderationDropdown-approve = Aprobuj
comments-moderationDropdown-approved = Zaaprobowany
comments-moderationDropdown-reject = Odrzuć
comments-moderationDropdown-rejected = Odrzucony
comments-moderationDropdown-ban = Zbanuj użytkownika
comments-moderationDropdown-banned = Zbanowany
comments-moderationDropdown-moderationView = Widok moderacji
comments-moderationDropdown-moderateStory = Moderuj komentarze
comments-moderationDropdown-caretButton =
  .aria-label = Moderuj

comments-moderationRejectedTombstone-title = Odrzuciłaś/eś ten komentarz.
comments-moderationRejectedTombstone-moderateLink =
  Przejdź do moderacji, by przyjrzeć się tej decyzji.

comments-featuredTag = Wyróżniony

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} comment by {$username}
    *[other] {$reaction} ({$count}) comment by {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} na komentarz {$username}
    [one] {$reaction} na komentarz {$username}
    [few] {$reaction} ({$count}) na komentarz {$username}
    *[many] {$reaction} ({$count}) na komentarz {$username}
  }

### Q&A

general-tabBar-qaTab = Q&A

### nienajlepsze, ale mieści się na ekranie smartfona...
qa-answeredTab = Odpowiedź
qa-unansweredTab = Bez
qa-allCommentsTab = Wszystkie

qa-noQuestionsAtAll =
  Nie ma pytań do tego artykułu.
qa-noQuestionsYet =
  Nie ma jeszcze żadnych pytań. Może chcesz zadać swoje?
qa-viewNew =
  { $count ->
    [one] Zobacz {$count} nowe pytanie
    [few] Zobacz {$count} nowe pytania
    *[many] Zobacz {$count} nowych pytań
  }

qa-postQuestionForm-rteLabel = Zadaj pytanie
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Najwięcej głosów

qa-answered-tag = z odpowiedzią
qa-expert-tag = ekspert

qa-reaction-vote = Zagłosuj
qa-reaction-voted = Twój głos

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] Zagłosuj na komentarz {$username}
    *[other] ({$count}) Zagłosuj na komentarz {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] Głosów na komentarz {$username}
    [one] Głos na komentarz {$username}
    [few] {$count} głosy na komentarz {$username}
    *[many] {$count} głosów na komentarz {$username}
  }

qa-unansweredTab-doneAnswering = Gotowe

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Kto udziela odpowiedzi na pytania?
qa-answeredTooltip-answeredComments =
  Odpowiedzi są udzielane przez wyznaczonych ekspertów.
qa-answeredTooltip-toggleButton =
  .aria-label = Przełącz dymek do pytań z odpowiedzią
  .title = Przełącz dymek do pytań z odpowiedzią

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Wysłano prośbę o usunięcie konta
comments-stream-deleteAccount-callOut-receivedDesc =
  Twoja prośba o usunięcie konta została przyjęta { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Jeśli chcesz nadal publikować komentarze, odpowiadać na nie lub reagować,
  możesz anulować swoją prośbę o usunięcie konta przed { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Anuluj prośbę o usunięcie konta
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Anuluj prośbę o usunięcie konta

### Embed Links

comments-embedLinks-showEmbeds = Pokaż embedy
comments-embedLinks-hideEmbeds = Ukryj embedy

comments-embedLinks-show-giphy = Pokaż GIF
comments-embedLinks-hide-giphy = Ukryj GIF

comments-embedLinks-show-youtube = Pokaż film
comments-embedLinks-hide-youtube = Ukryj film

comments-embedLinks-show-twitter = Pokaż Tweet
comments-embedLinks-hide-twitter = Ukryj Tweet

comments-embedLinks-show-external = Pokaż obrazek
comments-embedLinks-hide-external = Ukryj obrazek


### Featured Comments
comments-featured-gotoConversation = Przejdź do wątku
comments-featured-replies = Odpowiedzi

## Profile Tab

profile-myCommentsTab = Moje komentarze
profile-myCommentsTab-comments = Moje komentarze
profile-accountTab = Konto
profile-preferencesTab = Ustawienia

### Bio
profile-bio-title = Bio
profile-bio-description =
  Napisz krótko o sobie. Ta notka będzie wyświetlana w twoim profilu.
  Nie może być dłuższa niż 99 znaków.
profile-bio-remove = Usuń
profile-bio-update = Zmień


### Account Deletion

profile-accountDeletion-deletionDesc =
  Twoje konto zostanie usunięte { $date }.
profile-accountDeletion-cancelDeletion =
  Anuluj prośbę o usunięcie konta
profile-accountDeletion-cancelAccountDeletion =
  Anuluj prośbę o usunięcie konta

### Comment History
profile-historyComment-viewConversation = Zobacz konwersację
profile-historyComment-replies = Odpowiedzi {$replyCount}
profile-historyComment-commentHistory = Historia komentarzy
profile-historyComment-story = Artykuł: {$title}
profile-historyComment-comment-on = Komentarz do:
profile-profileQuery-errorLoadingProfile = Błąd podczas ładowania profilu
profile-profileQuery-storyNotFound = Artykuł nie został odnaleziony
profile-commentHistory-loadMore = Załaduj więcej
profile-commentHistory-empty = Nie masz jeszcze żadnych komentarzy
profile-commentHistory-empty-subheading = Tutaj pojawi się lista napisanych przez Ciebie komentarzy.

### Preferences

profile-preferences-mediaPreferences = Ustawienia mediów
profile-preferences-mediaPreferences-alwaysShow = Zawsze pokazuj GIFy, Tweety, YouTube, etc.
profile-preferences-mediaPreferences-thisMayMake = To może spowodować, że komentarze będą się wolniej ładować
profile-preferences-mediaPreferences-update = Zmień
profile-preferences-mediaPreferences-preferencesUpdated =
  Twoje ustawienia mediów zostały zapisane

### Account
profile-account-ignoredCommenters = Ignorowani komentatorzy
profile-account-ignoredCommenters-description =
  Możesz ignorować innych po kliknięciu w ich profil
  i wybraniu opcji Ignoruj. Kiedy kogoś ignorujesz,
  jej/jego komentarze są ukryte przed Tobą. Ale Twoje
  komentarze nadal są dla nich widoczne.
profile-account-ignoredCommenters-empty = Nie ignorujesz nikogo
profile-account-ignoredCommenters-stopIgnoring = Przestań ignorować
profile-account-ignoredCommenters-youAreNoLonger =
  Już nie ignorujesz
profile-account-ignoredCommenters-manage = Zarządzaj
profile-account-ignoredCommenters-cancel = Anuluj
profile-account-ignoredCommenters-close = Zamknij

profile-account-changePassword-cancel = Anuluj
profile-account-changePassword = Zmień hasło
profile-account-changePassword-oldPassword = Stare hasło
profile-account-changePassword-forgotPassword = Nie pamiętasz hasła?
profile-account-changePassword-newPassword = Nowe hasło
profile-account-changePassword-button = Zmień hasło
profile-account-changePassword-updated =
  Twoje hasło zostało zmienione
profile-account-changePassword-password = Hasło

profile-account-download-comments-title = Pobierz historię swoich komentarzy
profile-account-download-comments-description =
  Dostaniesz email z linkiem do pobrania historii Twoich komentarzy.
  Możesz pobrać archiwum tylko <strong>1 raz w ciągu 14 dni.</strong>
profile-account-download-comments-request =
  Pobierz historię komentarzy
profile-account-download-comments-request-icon =
  .title = Pobierz historię komentarzy
profile-account-download-comments-recentRequest =
  Twoja ostatnia prośba: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  Twoja ostatnia prośba została złożona w ciągu ostatnich 2 tygodni.
  Możesz wystąpić o ściągnięcie swoich komentarzy: { $timeStamp }
profile-account-download-comments-requested =
  Prośba została wysłana. Następną prośbę możesz wysłać za { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Twoje żądanie zostało przyjęte. Możesz wystąpić o kolejne ściągnięcie
  historii swoich komentarzy najwcześniej { framework-timeago-time }.
profile-account-download-comments-error =
  Nie mogliśmy spełnić Twojej prośby o ściągnięcie.
profile-account-download-comments-request-button = Wyślij

## Delete Account

profile-account-deleteAccount-title = Usuń moje konto
profile-account-deleteAccount-deleteMyAccount = Usuń moje konto
profile-account-deleteAccount-description =
  Usunięcie konta spowoduje usunięcie profilu i wszystkich napisanych
  przez Ciebie komentarzy z naszej strony.
profile-account-deleteAccount-requestDelete = Wyślij prośbę o usunięcie konta

profile-account-deleteAccount-cancelDelete-description =
  Wysłałaś/eś już prośbę o usunięcie konta.
  Konto zostanie usunięte { $date }.
  Do tego czasu możesz jeszcze anulować ten proces.
profile-account-deleteAccount-cancelDelete = Anuluj usunięcie konta

profile-account-deleteAccount-request = Poproszę
profile-account-deleteAccount-cancel = Anuluj
profile-account-deleteAccount-pages-deleteButton = Usuń moje konto
profile-account-deleteAccount-pages-cancel = Anuluj
profile-account-deleteAccount-pages-proceed = Przejdź dalej
profile-account-deleteAccount-pages-done = Wykonane
profile-account-deleteAccount-pages-phrase =
  .aria-label = Fraza

profile-account-deleteAccount-pages-sharedHeader = Usunięcie konta

profile-account-deleteAccount-pages-descriptionHeader = Usunąć moje konto?
profile-account-deleteAccount-pages-descriptionText =
  Próbujesz usunąć swoje kontro. To oznacza, że:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Wszystkie Twoje komentarze zostaną usunięte z tej strony
profile-account-deleteAccount-pages-allCommentsDeleted =
  Wszystkie komentarze zostają usunięte z naszej bazy danych
profile-account-deleteAccount-pages-emailRemoved =
  Twój adres email zostanie usunięty z naszego systemu

profile-account-deleteAccount-pages-whenHeader = Usunięcie konta: Kiedy?
profile-account-deleteAccount-pages-whenSubHeader = Kiedy?
profile-account-deleteAccount-pages-whenSec1Header =
  Kiedy moje konto zostanie usunięte?
profile-account-deleteAccount-pages-whenSec1Content =
  Twoje konto zostanie usunięte w ciągu 24h od wysłania Twojego żądania.
profile-account-deleteAccount-pages-whenSec2Header =
  Czy mogę nadal komentować, dopóki moje konto nie zostało usunięte?
profile-account-deleteAccount-pages-whenSec2Content =
  Nie. Po wysłaniu życzenia usunięcia konta, nie możesz już dodawać komentarzy,
  odpowiadać lub reagować na komentarze.

profile-account-deleteAccount-pages-downloadCommentHeader = Pobrać moje komentarze?
profile-account-deleteAccount-pages-downloadSubHeader = Ściągnij swoje komentarze
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Zanim Twoje konto zostanie usunięte, polecamy skorzystanie z opcji
  pobrania historii Twoich komentarzy. Nie będzie to możliwe
  po usunięciu konta.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mój profil > Pobierz historię moich komentarzy

profile-account-deleteAccount-pages-confirmHeader = Potwierdzasz życzenie usunięcia?
profile-account-deleteAccount-pages-confirmSubHeader = Na pewno?
profile-account-deleteAccount-pages-confirmDescHeader =
  Na pewno chcesz usunąć swoje konto?
profile-account-deleteAccount-confirmDescContent =
  Żeby potwierdzić usunięcie swojego konta, wpisz proszę następującą frazę
  w pole poniżej:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Żeby potwierdzić przepisz poniżej:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Podaj swoje hasło:

profile-account-deleteAccount-pages-completeHeader = Zażądano usunięcie konta
profile-account-deleteAccount-pages-completeSubHeader = Prośba wysłana
profile-account-deleteAccount-pages-completeDescript =
  Twoje życzenie zostało wysłane i na adres email powiązany z Twoim kontem
  wysłaliśmy link do potwierdzenia.
profile-account-deleteAccount-pages-completeTimeHeader =
  Twoje konto zostanie usunięte: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Zmiana decyzji?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Po prostu zaloguj się na swoje konto ponownie, zanim upłynie ten czas
  i wybierz <strong>Anuluj usunięcie konta</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Powiedz nam czemu.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Chcielibyśmy wiedzieć czemu chcesz usunąć swoje konto. Możesz nam wysłaś
  swoją opinię na adres { $email }.
profile-account-changePassword-edit = Zmień
profile-account-changePassword-change = Zmień


## Notifications
profile-notificationsTab = Powiadomienia
profile-account-notifications-emailNotifications = Powiadomienia email
profile-account-notifications-emailNotifications = Powiadomienia email
profile-account-notifications-receiveWhen = Otrzymuj powiadomienia kiedy:
profile-account-notifications-onReply = Ktoś odpowiada na mój komentarz
profile-account-notifications-onFeatured = Mój komentarz zostanie wyróżniony
profile-account-notifications-onStaffReplies = Ktoś z redakcji serwisu odpowiada na mój komentarz
profile-account-notifications-onModeration = Zapadnie decyzja w sprawie publikacji mojego oczekującego komentarza
profile-account-notifications-sendNotifications = Wysyłaj powiadomienia:
profile-account-notifications-sendNotifications-immediately = Od razu
profile-account-notifications-sendNotifications-daily = Raz na dzień
profile-account-notifications-sendNotifications-hourly = Raz na godzinę
profile-account-notifications-updated = Ustawienia dotyczące powiadomień zostały zmienione
profile-account-notifications-button = Zmień ustawienia powiadomień
profile-account-notifications-button-update = Zmień

## Report Comment Popover
comments-reportPopover =
  .description = Okienko zgłaszania komentarzy
comments-reportPopover-reportThisComment = Zgłoś ten komentarz
comments-reportPopover-whyAreYouReporting = Czemu zgłaszasz ten komentarz?

comments-reportPopover-reasonOffensive = Ten komentarz jest obraźliwy
comments-reportPopover-reasonAbusive = Ten komentarz krzywdzi
comments-reportPopover-reasonIDisagree = Nie zgadzam się z tym komentarzem
comments-reportPopover-reasonSpam = To wygląda na spam albo reklamę
comments-reportPopover-reasonOther = Inny powód

comments-reportPopover-additionalInformation =
  Dodatkowe informacje <optional>Opcjonalne</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Prosimy, napisz coś więcej, co może się przydać moderatorom. (Opcjonalnie)

comments-reportPopover-maxCharacters = Maks. znaków { $maxCharacters }
comments-reportPopover-restrictToMaxCharacters = Prosimy o ograniczenie długości raportu do maks. { $maxCharacters } znaków.
comments-reportPopover-cancel = Anuluj
comments-reportPopover-submit = Wyślij

comments-reportPopover-thankYou = Dziękujemy!
comments-reportPopover-receivedMessage =
  Dostaliśmy Twoją wiadomość. To dzięki takim właśnie wiadomościom nasza społeczność może być bezpieczna.

comments-reportPopover-dismiss = Zamknij

## Submit Status
comments-submitStatus-dismiss = Zamknij
comments-submitStatus-submittedAndWillBeReviewed =
  Twój komentarz został wysłany i będzie zatwierdzony przez moderatora
comments-submitStatus-submittedAndRejected =
  Ten komentarz został odrzucony z powodu niezgodności z naszym regulaminem

# Configure
configure-configureQuery-errorLoadingProfile = Błąd podczas wgrywania konfiguracji
configure-configureQuery-storyNotFound = Artykuł nie został odnaleziony

## Change username
profile-changeUsername-username = Login
profile-changeUsername-success = Twój login został zmieniony
profile-changeUsername-edit = Zmień
profile-changeUsername-change = Zmień
profile-changeUsername-heading = Zmień swój login
profile-changeUsername-heading-changeYourUsername = Zmień swój login
profile-changeUsername-desc = Zmień login, który pojawia się przy wszystkich obecnych i przyszłych komentarzach. <strong>Login można zmieniać raz na { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Zmień login, który pojawia się przy wszystkich obecnych i przyszłych komentarzach. Login można zmieniać raz na { framework-timeago-time }.
profile-changeUsername-current = Aktualny login
profile-changeUsername-newUsername-label = Nowy login
profile-changeUsername-confirmNewUsername-label = Potwierdź nowy login
profile-changeUsername-cancel = Anuluj
profile-changeUsername-save = Zapisz
profile-changeUsername-saveChanges = Zapisz zmiany
profile-changeUsername-recentChange = Twój login był zmieniany w ciągu ostatnich { framework-timeago-time }. Możesz zmienić login { $nextUpdate }
profile-changeUsername-youChangedYourUsernameWithin =
  Zmieniałaś/eś swój login w ciągu ostatnich { framework-timeago-time }. Następna zmiana będzie możliwa najwcześniej: { $nextUpdate }.
profile-changeUsername-close = Zamknij

## Discussions tab

discussions-mostActiveDiscussions = Najbardziej aktywne dyskusje
discussions-mostActiveDiscussions-subhead = Ułożone według największej liczby komentarzy w ciągu ostatnich 24h na { $siteName }
discussions-mostActiveDiscussions-empty = Nie uczestniczysz w żadnych dyskusjach
discussions-myOngoingDiscussions = Moje aktywne dyskusje
discussions-myOngoingDiscussions-subhead = Jeśli komentujesz w { $orgName }
discussions-viewFullHistory = Zobacz swoją pełną historię
discussions-discussionsQuery-errorLoadingProfile = Błąd podczas ładowania Twojego profilu
discussions-discussionsQuery-storyNotFound = Tego artykułu nie udało nam się odnaleźć

## Comment Stream
configure-stream-title-configureThisStream =
  Skonfiguruj ten strumień
configure-stream-update = Zaktualizuj
configure-stream-streamHasBeenUpdated =
  Tej strumień został odświeżony

configure-premod-premoderateAllComments = Wstępnie moderuj wszystkie komentarze
configure-premod-description =
  Moderatorzy muszą zaaprobować wszystkie komentarze zanim zostaną opublikowane przy tym artykule.

configure-premodLink-commentsContainingLinks =
  Wstępnie moderuj komentarze zawierające linki
configure-premodLink-description =
  Moderatorzy muszą zaaprobować wszystkie komentarze zawierające link zanim zostaną opublikowane przy tym artykule.

configure-addMessage-title =
  Dodaj wiadomość lub pytanie
configure-addMessage-description =
  Dodaj wiadomość na górze pola komentarzy dla swoich użytkowników.
  Używaj tego jako sugestię do rozpoczęcia dyskusji, zadanie pytania
  albo opublikowanie ogłoszenia powiązanego z komentarzami dla artykułu.
configure-addMessage-addMessage = Dodaj wiadomość
configure-addMessage-removed = Wiadomość została usunięta
config-addMessage-messageHasBeenAdded =
  Wiadomość została dodana do pola komentarzy
configure-addMessage-remove = Usuń
configure-addMessage-submitUpdate = Zaktualizuj
configure-addMessage-cancel = Anuluj
configure-addMessage-submitAdd = Dodaj wiadomość

configure-messageBox-preview = Podgląd
configure-messageBox-selectAnIcon = Wybierz ikonę
configure-messageBox-iconConversation = Konwersacja
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Pomoc
configure-messageBox-iconWarning = Ostrzeżenie
configure-messageBox-iconChatBubble = Dymek
configure-messageBox-noIcon = Brak ikony
configure-messageBox-writeAMessage = Napisz wiadomość

configure-closeStream-closeCommentStream =
  Zamknij strumień komentarzy
configure-closeStream-description =
  Ten strumień komentarzy jest teraz otwarty. Jeśli zostanie zamknięty
  nie będzie można dodawać już nowych komentarzy, ale stare nadal będą
  widoczne.
configure-closeStream-closeStream = Zamknij
configure-closeStream-theStreamIsNowOpen = Strumień jest teraz otwarty

configure-openStream-title = Otwórz strumień
configure-openStream-description =
  Ten strumień komentarzy jest zamknięty. Jeśli go otworzysz
  użytkownicy będą mogli dodawać nowe komentarze.
configure-openStream-openStream = Otwórz
configure-openStream-theStreamIsNowClosed = Strumień jest teraz zamknięty

qa-experimentalTag-tooltip-content =
  Format Q&A jest teraz aktywnie rozwijany. Napisz do nas
  jeśli masz uwagi lub pytania.

configure-enableQA-switchToQA =
  Przełącz na format Q&A
configure-enableQA-description =
  Format Q&A pozwala użytkownikom zadawać pytania wybranym przez Ciebie
  ekspertom.
configure-enableQA-enableQA = Przełącz na Q&A
configure-enableQA-streamIsNowComments =
  Ten strumień jest teraz w formacie komentarzy

configure-disableQA-title = Skonfiguruj ten Q&A
configure-disableQA-description =
  Format Q&A pozwala użytkownikom zadawać pytania wybranym przez Ciebie
  ekspertom.
configure-disableQA-disableQA = Przełącz na komentarze
configure-disableQA-streamIsNowQA =
  Ten strumień jest teraz w formacie Q&A

configure-experts-title = Dodaj eksperta
configure-experts-filter-searchField =
  .placeholder = Szukaj według emaila lub loginu
  .aria-label = Szukaj według emaila lub loginu
configure-experts-filter-searchButton =
  .aria-label = Szukaj
configure-experts-filter-description =
  Dodaje etykietę Eksperta do komentarzy zarejestrowanych użytkowników,
  tylko na tej stronie. Nowi użytkownicy muszą się wcześniej zarejestrować
  i otworzyć komentarze na stronie, żeby powstało ich konto.
configure-experts-search-none-found = Nie znaleźliśmy użytkowników o takim emailu lub loginie
configure-experts-remove-button = Usuń
configure-experts-load-more = Więcej
configure-experts-none-yet = W tej chwili nie ma żadnego eksperta przypisanego do tego Q&A.
configure-experts-search-title = Szukaj eksperta
configure-experts-assigned-title = Eksperci
configure-experts-noLongerAnExpert = nie jest już ekspertem
comments-tombstone-ignore = Ten komentarz jest ukryty, ponieważ ignorujesz {$username}
comments-tombstone-showComment = Pokaż komentarz
comments-tombstone-deleted =
  Ten komentarz nie jest już dostępny. Komentator usunął swoje konto.

suspendInfo-heading-yourAccountHasBeen =
  Twoje konto zostało chwilowo zawieszone i na razie nie możesz komentować.
suspendInfo-description-inAccordanceWith =
  Zgodnie z regulaminem społeczności { $organization } Twoje
  konto zostało chwilowo zawieszone. Dopóki jest zawieszone nie
  możesz komentować, reagować ani zgłaszać innych komentarzy.
suspendInfo-until-pleaseRejoinThe =
  Wróc do nas { $until }

warning-heading = Twój użytkownik dostał ostrzeżenie
warning-explanation =
  W zgodzie z zasadami naszej społeczności twoje konto dostało ostrzeżenie.
warning-instructions =
  Żeby kontynuować uczestnictwo w dyskusjach, prosimy o potwierdzenie "Przyjęcia" do wiadomości guzikiem poniżej.
warning-acknowledge = Przyjmuję

warning-notice = Twoje konto dostało ostrzeżenie. Żeby dalej uczestniczyć w dyskusjach prosimy o <a>zapoznanie się z wiadomością</a>.

profile-changeEmail-unverified = (Niepotwierdzone)
profile-changeEmail-current = (aktualne)
profile-changeEmail-edit = Zmień
profile-changeEmail-change = Zmień
profile-changeEmail-please-verify = Potwierdź swój email
profile-changeEmail-please-verify-details =
  Email do weryfikacji konta został wysłany na { $email }.
  Musisz potwierdzić swoje konto, zanim będzie można się
  zalogować i otrzymywać powiadomienia.
profile-changeEmail-resend = Ponowna weryfikacja
profile-changeEmail-heading = Zmień email
profile-changeEmail-changeYourEmailAddress =
  Zmień adres email
profile-changeEmail-desc = Zmień adres email używany do logowania i otrzymywania powiadomień.
profile-changeEmail-newEmail-label = Nowy adres email
profile-changeEmail-password = Hasło
profile-changeEmail-password-input =
  .placeholder = Hasło
profile-changeEmail-cancel = Anuluj
profile-changeEmail-submit = Zapisz
profile-changeEmail-saveChanges = Zapisz zmiany
profile-changeEmail-email = Email
profile-changeEmail-title = Adres email
profile-changeEmail-success = Twój adres email został zmieniony

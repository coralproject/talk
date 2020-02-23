### Localization for Embed Stream

## General

general-userBoxUnauthenticated-joinTheConversation = Dołącz do rozmowy
general-userBoxUnauthenticated-signIn = Zaloguj się
general-userBoxUnauthenticated-register = Rejestracja

general-userBoxAuthenticated-signedInAs =
  Twój login to <Username></Username>.

general-userBoxAuthenticated-notYou =
  To nie Ty? <button>Wyloguj</button>

general-tabBar-commentsTab = Komentarze
general-tabBar-myProfileTab = Mój profil
general-tabBar-configure = Konfiguracja

## Comment Count

comment-count-text =
  { $count  ->
    [one] Komentarz
    [few] Komentarze
    *[many] Komentarzy
  }

## Comments Tab

comments-allCommentsTab = Wszystkich komentarzy
comments-featuredTab = Wyróżnione
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-featuredCommentTooltip-how = Jak komentarze zostają wyróżnione?
comments-featuredCommentTooltip-handSelectedComments =
  Komentarze szczególnie warte przeczytania są wyróżniane przez naszą redakcję.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Włącz opis funkcji wyróżniania

comments-bannedInfo-bannedFromCommenting = Twoje konto zostało zablokowane i nie możesz komentować.
comments-bannedInfo-violatedCommunityGuidelines =
  Someone with access to your account has violated our community
  guidelines. As a result, your account has been banned. You will no
  longer be able to comment, respect or report comments. If you think
  this has been done in error, please contact our community team.

comments-noCommentsAtAll = Nie ma komentarzy do tego artykułu.
comments-noCommentsYet = Nie ma jeszcze żadnych komentarzy. Może chcesz napisać pierwszy?

comments-streamQuery-storyNotFound = Artykuł nie został odnaleziony.

comments-postCommentForm-submit = Wyślij
comments-replyList-showAll = Wszystkie
comments-replyList-showMoreReplies = Pokaż więcej odpowiedzi

comments-viewNew =
  { $count ->
    [one] Zobacz {$count} nowy komentarz
    [few] Zobacz {$count} nowe komentarze
    *[many] Zobacz {$count} nowych komentarzy
  }
comments-loadMore = Załaduj więcej

comments-permalinkPopover =
  .description = A dialog showing a permalink to the comment
comments-permalinkPopover-permalinkToComment =
  .aria-label = Permalink do komentarza
comments-permalinkButton-share = Podziel się
comments-permalinkView-viewFullDiscussion = Zobacz pełną dyskusję
comments-permalinkView-commentRemovedOrDoesNotExist = This comment has been removed or does not exist.

comments-rte-bold =
  .title = Pogrubienie

comments-rte-italic =
  .title = Kursywa

comments-rte-blockquote =
  .title = Cytat

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

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Wyślij
comments-replyCommentForm-cancel = Anuluj
comments-replyCommentForm-rteLabel = Odpowiedz
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Edytuj

comments-editCommentForm-saveChanges = Zapisz zmiany
comments-editCommentForm-cancel = Anuluj
comments-editCommentForm-close = Zamknij
comments-editCommentForm-rteLabel = Edytuj komentarz
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = Edycja: pozostało <time></time>
comments-editCommentForm-editTimeExpired = Czas na możliwą edycję minął. Nie możesz już zmienić treści tego komentarza. A może napisz jeszcze jeden?
comments-editedMarker-edited = Zmieniony
comments-showConversationLink-readMore = Przeczytaj więcej w tej konwersacji >
comments-conversationThread-showMoreOfThisConversation =
  Pokaż więcej w konwersacji

comments-permalinkView-currentViewing = W tej chwili oglądasz
comments-permalinkView-singleConversation = WĄTEK
comments-inReplyTo = W odpowiedzi do <Username></Username>
comments-replyTo = Odpowiadasz: <Username></Username>

comments-reportButton-report = Zgłoś
comments-reportButton-reported = Zgłoszony

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
comments-moderationDropdown-goToModerate = Przejdź do moderacji
comments-moderationDropdown-caretButton =
  .aria-label = Moderuj

comments-rejectedTombstone =
  Odrzuciłaś/eś ten komentarz. <TextLink>Przejdź do moderacji, by przyjrzeć się tej decyzji.</TextLink>

comments-featuredTag = Wyróżniony

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Account deletion requested
comments-stream-deleteAccount-callOut-receivedDesc =
  A request to delete your account was received on { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  If you would like to continue leaving comments, replies or reactions,
  you may cancel your request to delete your account before { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Cancel account deletion request

### Featured Comments
comments-featured-gotoConversation = Go to Conversation
comments-featured-replies = Replies

## Profile Tab

profile-myCommentsTab = Moje komentarze
profile-myCommentsTab-comments = Moje komentarze
profile-accountTab = Konto
profile-preferencesTab = Ustawienia

accountSettings-manage-account = Zarządzaj swoim kontem

### Account Deletion

profile-accountDeletion-deletionDesc =
  Twoje konto zostanie usunięte { $date }.
profile-accountDeletion-cancelDeletion =
  Anuluj prośbę o usunięcie konta.

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

### Account
profile-account-ignoredCommenters = Ignorowani komentatorzy
profile-account-ignoredCommenters-description =
  Możesz ignorować innych po kliknięciu w ich profil
  i wybraniu opcji Ignoruj. Kiedy kogoś ignorujesz, 
  jej/jego komentarze są ukryte przed Tobą. Ale Twoje 
  komentarze nadal są dla nich widoczne.
profile-account-ignoredCommenters-empty = Nie ignorujesz nikogo
profile-account-ignoredCommenters-stopIgnoring = Przestań ignorować
profile-account-ignoredCommenters-manage = Zarządzaj
profile-account-ignoredCommenters-cancel = Anuluj

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
profile-account-download-comments-requested =
  Prośba została wysłana. Następną prośbę możesz wysłać za { framework-timeago-time }.
profile-account-download-comments-request-button = Wyślij

## Delete Account

profile-account-deleteAccount-title = Usuń moje konto
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
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Zanim Twoje konto zostanie usunięte, polecamy skorzystanie z opcji
  pobrania historii Twoich komentarzy. Nie będzie to możliwe 
  po usunięciu konta. 
profile-account-deleteAccount-pages-downloadCommentsPath =
  Mój profil > Pobierz historię moich komentarzy

profile-account-deleteAccount-pages-confirmHeader = Potwierdzasz życzenie usunięcia?
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


## Notifications
profile-notificationsTab = Powiadomienia
profile-account-notifications-emailNotifications = Powiadomienia E-Mail
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
comments-reportPopover-reasonIDisagree = Nie zgadzam się z tym komentarzem
comments-reportPopover-reasonSpam = To wygląda na spam albo reklamę
comments-reportPopover-reasonOther = Inny powód

comments-reportPopover-pleaseLeaveAdditionalInformation =
  Prosimy, napisz coś więcej, co może się przydać moderatorom. (Opcjonalnie)

comments-reportPopover-maxCharacters = Maks. znaków { $maxCharacters }
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
profile-changeUsername-heading = Zmień swój login
profile-changeUsername-desc = Zmień login, który pojawia się przy wszystkich obecnych i przyszłych komentarzach. <strong>Login można zmieniać raz na { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = Zmień login, który pojawia się przy wszystkich obecnych i przyszłych komentarzach. Login można zmieniać raz na { framework-timeago-time }.
profile-changeUsername-current = Aktualny login
profile-changeUsername-newUsername-label = Nowy login
profile-changeUsername-confirmNewUsername-label = Potwierdź nowy login
profile-changeUsername-cancel = Anuluj
profile-changeUsername-save = Zapisz
profile-changeUsername-recentChange = Twój login był zmieniany w ciągu ostatnich { framework-timeago-time }. Możesz zmienić login { $nextUpdate }
profile-changeUsername-close = Zamknij

## Comment Stream
configure-stream-title = Skonfiguruj ten strumień komentarzy
configure-stream-apply = Zastosuj

configure-premod-title = Włącz Pre-Moderację
configure-premod-description =
  Moderatorzy muszą zaaprobować wszystkie komentarze zanim zostaną opublikowane przy tym artykule.

configure-premodLink-title = Pre-Moderacja komentarzy zawierających link
configure-premodLink-description =
  Moderatorzy muszą zaaprobować wszystkie komentarze zawierające link zanim zostaną opublikowane przy tym artykule.

configure-liveUpdates-title = Włącz Aktualizację Na Żywo dla tego artykułu
configure-liveUpdates-description =
  Kiedy włączysz tę opcję, komentarze będą aktualizowane 
  od razu po wysłaniu, bez czekania na przeładowanie strony.
  Możesz wyłączyć tę opcję, w rzadko spotykanej sytuacji, gdy 
  artykuł ma tak dużo odwiedzin, że komentarze ładują się
  zbyt wolno. 
  
configure-messageBox-title = Włącz Boks Wiadomości dla tego artykułu
configure-messageBox-description =
  Dodaj wiadomość na górze pola komentarzy dla Twoich użytkowników.
  Używaj tego jako sugestię do rozpoczęcia dyskusji, zadanie pytania
  albo opublikowanie ogłoszenia powiązanego z komentarzami dla artykułu.
configure-messageBox-preview = Podgląd
configure-messageBox-selectAnIcon = Wybierz ikonę
configure-messageBox-iconConversation = Konwersacja
configure-messageBox-iconDate = Data
configure-messageBox-iconHelp = Pomoc
configure-messageBox-iconWarning = Ostrzeżenie
configure-messageBox-iconChatBubble = Dymek
configure-messageBox-noIcon = Brak ikony
configure-messageBox-writeAMessage = Napisz wiadomość

configure-closeStream-title = Zamknij strumień komentarzy
configure-closeStream-description =
  Ten strumień komentarzy jest teraz otwarty. Jeśli zostanie zamknięty
  nie będzie można dodawać już nowych komentarzy, ale stare nadal będą
  widoczne.
configure-closeStream-closeStream = Zamknij strumień

configure-openStream-title = Otwórz strumień
configure-openStream-description =
  Ten strumień komentarzy jest zamknięty. Jeśli go otworzysz
  użytkownicy będą mogli dodawać nowe komentarze.
configure-openStream-openStream = Otwórz strumień

configure-moderateThisStream = Moderuj ten strumień

comments-tombstone-ignore = Ten komentarz jest ukryty, ponieważ ignorujesz {$username}
comments-tombstone-deleted =
  Ten komentarz nie jest już dostępny. Komentator usunął swoje konto.

suspendInfo-heading = Twoje konto zostało chwilowo zawieszone i na razie nie możesz komentować.
suspendInfo-info =
  W zgodzie z regulaminem społeczności { $organization } Twoje
  konto zostało chwilowo zawieszone. Dopóki jest zawieszone nie
  możesz komentować, reagować ani zgłaszać innych komentarzy. 
  Wróc do nas { $until }

profile-changeEmail-unverified = (Niepotwierdzone)
profile-changeEmail-edit = Zmień
profile-changeEmail-please-verify = Potwierdź swój email
profile-changeEmail-please-verify-details =
  Email do weryfikacji konta został wysłały na { $email }.
  Musisz potwierdzić swoje konto, zanim będzie można się
  zalogować i otrzymywać powiadomienia. 
profile-changeEmail-resend = Ponowna weryfikacja
profile-changeEmail-heading = Zmień email
profile-changeEmail-desc = Zmień adres email używany do logowania i otrzymywania powiadomień.
profile-changeEmail-current = Aktualny email
profile-changeEmail-newEmail-label = Nowy adres email
profile-changeEmail-password = Hasło
profile-changeEmail-password-input =
  .placeholder = Hasło
profile-changeEmail-cancel = Anuluj
profile-changeEmail-submit = Zapisz
profile-changeEmail-email = Email
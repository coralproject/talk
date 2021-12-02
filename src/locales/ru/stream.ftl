### Localization for Embed Stream

## General

general-moderate = Модерирование

general-userBoxUnauthenticated-joinTheConversation = Присоединиться к обсуждению
general-userBoxUnauthenticated-signIn = Войти
general-userBoxUnauthenticated-register = Зарегистрироваться

general-userBoxAuthenticated-signedInAs =
  Вы зашли как: <Username></Username>.
general-userBoxAuthenticated-signedIn =
  Вы зашли как

general-userBoxAuthenticated-notYou =
  Это не Вы? <button>Выйти</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  Вы успешно вышли из системы

general-tabBar-commentsTab = Комментарии
general-tabBar-myProfileTab = Профиль
general-tabBar-configure = Конфигурирование

## Comment Count

comment-count-text =
  { $count ->
    [one] Комментарий
    [few] Комментария
    *[many] Комментариев
  }

## Comments Tab

comments-allCommentsTab = Все сообщения
comments-featuredTab = Рекомендуемые
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] 1 человек просматривает это обсуждение
    [few] { SHORT_NUMBER($count) } человека просматривают это обсуждение
    *[other] { SHORT_NUMBER($count) } человек просматривают это обсуждение
  }
comments-featuredCommentTooltip-how = Как сделать комментарий рекомендуемым?
comments-featuredCommentTooltip-handSelectedComments =
  Некоторые комментарии выбираются модератором, как важные для прочтения.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = Тултип переключателя важных комментариев
  .title = Тултип переключателя важных комментариев

comments-collapse-toggle =
  .aria-label = Свернуть ветку комментариев
comments-bannedInfo-bannedFromCommenting = Ваш аккаунт заблокирован для комментирования.
comments-bannedInfo-violatedCommunityGuidelines =
  Кто-то, имеющий доступ к Вашей учетной записи, нарушил правила сервиса.
  В результате, Ваш аккаунт был заблокирован.
  Если Вы считаете, что это было сделано ошибочно - свяжитесь с нами.


comments-noCommentsAtAll = Комментарии отсутствуют.
comments-noCommentsYet = Комментарии отсутствуют. Пожалуйста, оставьте свой.

comments-streamQuery-storyNotFound = Произошла ошибка загрузки целевой страницы.

comments-commentForm-cancel = Отменить
comments-commentForm-saveChanges = Сохранить изменения
comments-commentForm-submit = Отправить

comments-postCommentForm-submit = Отправить
comments-replyList-showAll = Показать все
comments-replyList-showMoreReplies = Показать больше ответов

comments-postCommentForm-gifSeach = Искать GIF
comments-postComment-gifSearch-search =
  .aria-label = Искать
comments-postComment-gifSearch-loading = Поиск...
comments-postComment-gifSearch-no-results = Ничего не найдено по «{$query}»
comments-postComment-gifSearch-powered-by-giphy =
  .alt = Работает с помощью giphy

comments-postComment-pasteImage = Вставить URL изображения
comments-postComment-insertImage = Вставить

comments-postComment-confirmMedia-youtube = Добавить это видеос YouTube в конце комментария?
comments-postComment-confirmMedia-twitter = Добавить этот Твит в конце комментария?
comments-postComment-confirmMedia-cancel = Отменить
comments-postComment-confirmMedia-add-tweet = Добавить Твит
comments-postComment-confirmMedia-add-video = Добавить видео
comments-postComment-confirmMedia-remove = Удалить
comments-commentForm-gifPreview-remove = Удалить
comments-viewNew =
  { $count ->
    [one] Показать {$count} новый комментарий
    [few] Показать {$count} новых комментария
    *[many] Показать {$count} новых комментариев
  }
comments-loadMore = Загрузить еще
comments-permalinkPopover =
  .description = Диалоговое окно для показа ссылки на комментарий
comments-permalinkPopover-permalinkToComment =
  .aria-label = Ссылка на комментарий
comments-permalinkButton-share = Поделиться
comments-permalinkButton =
  .aria-label = Поделиться
comments-permalink-copyLink = Скопировать ссылку
comments-permalink-linkCopied = Ссылка скопирована
comments-permalinkView-viewFullDiscussion = Показать все
comments-permalinkView-commentRemovedOrDoesNotExist = Этот комментарий был удален, либо его не существует.

comments-rte-bold =
  .title = Жирный

comments-rte-italic =
  .title = Курсив

comments-rte-blockquote =
  .title = Сноска

comments-rte-bulletedList =
  .title = Маркированный список

comments-rte-strikethrough =
  .title = Зачеркнутый

comments-rte-spoiler = Спойлер

comments-rte-sarcasm = Сарказм

comments-rte-externalImage =
  .title = Изображение

comments-remainingCharacters = { $remaining ->
    [one] Остался {$remaining} символ
    [few] Осталось {$remaining} символа
    *[many] Осталось {$remaining} символов
  }

comments-postCommentFormFake-signInAndJoin = Войти и оставить комментарий
comments-postCommentForm-rteLabel = Написать комментарий
comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }
comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }
comments-postCommentForm-userScheduledForDeletion-warning =
  Комментирование отключено, т.к. Ваша учетная запись запланирована к удалению.

comments-replyButton-reply = Ответить
comments-replyButton =
  .aria-label = Ответить

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = Отправить
comments-replyCommentForm-cancel = Отменить
comments-replyCommentForm-rteLabel = Написать ответ
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-editButton = Изменить

comments-commentContainer-avatar =
  .alt = Аватар для { $username }

comments-editCommentForm-saveChanges = Сохранить изменения
comments-editCommentForm-cancel = Отменить
comments-editCommentForm-close = Закрыть
comments-editCommentForm-rteLabel = Изменить комментарий
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = На редактирование осталось: <time></time>
comments-editCommentForm-editTimeExpired = Время редактирования истекло. Вы больше не можете отредактировать этот комментарий. Пожалуйста, напишите новый!
comments-editedMarker-edited = Изменено
comments-showConversationLink-readMore = Смотреть еще >
comments-conversationThread-showMoreOfThisConversation =
  Смотреть еще

comments-permalinkView-currentViewing = Вы смотрите
comments-permalinkView-singleConversation = SINGLE CONVERSATION
comments-permalinkView-youAreCurrentlyViewing =
  Вы просматриваете единичное обсуждение
comments-inReplyTo = Ответ для <Username></Username>
comments-replyingTo = Ответить: <Username></Username>

comments-reportButton-report = Сообщить
comments-reportButton-reported = Сообщено
comments-reportButton-aria-report =
  .aria-label = Сообщить
comments-reportButton-aria-reported =
  .aria-label = Сообщено

comments-sortMenu-sortBy = Сортировать по
comments-sortMenu-newest = Новые
comments-sortMenu-oldest = Старые
comments-sortMenu-mostReplies = Популярные

comments-userPopover =
  .description = Больше информации о пользователе
comments-userPopover-memberSince = Участник с: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = Игнорировать

comments-userIgnorePopover-ignoreUser = Игнорировать {$username}?
comments-userIgnorePopover-description =
  При игнорировании, все комментарии данного пользователя будут скрыты.
  Вы можете отменить игнорирование во вкладке "Профиль"

comments-userIgnorePopover-ignore = Игнорировать
comments-userIgnorePopover-cancel = Отменить

comments-userBanPopover-title = Забанить {$username}?
comments-userBanPopover-description =
  После того, как пользователь будет забанен, он больше не сможет
  добавлять, отвечать и оценивать комментарии. Также, текущий комментарий будет отклонен.
comments-userBanPopover-cancel = Отменить
comments-userBanPopover-ban = Забанить


comments-moderationDropdown-popover =
  .description = Всплывающее меню для модерации этого комментария.
comments-moderationDropdown-feature = Важный
comments-moderationDropdown-unfeature = Не важный
comments-moderationDropdown-approve = Принять
comments-moderationDropdown-approved = Принят
comments-moderationDropdown-reject = Отклонить
comments-moderationDropdown-rejected = Отклонен
comments-moderationDropdown-ban = Забанить пользователя
comments-moderationDropdown-banned = Забанен
comments-moderationDropdown-goToModerate = Перейти к модерированию
comments-moderationDropdown-moderationView = Перейти к модерированию
comments-moderationDropdown-moderateStory = Модерация раздела
comments-moderationDropdown-caretButton =
  .aria-label = Модерирование

comments-rejectedTombstone = Вы отклонили этот комментарий.
comments-rejectedTombstone-moderateLink =
  Перейдите к модерированию, что бы увидеть причину.

comments-featuredTag = Важный

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} комментариев от {$username}
    *[other] {$reaction} ({$count}) комментариев от {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} комментариев от {$username}
    [one] {$reaction} комментарий {$username}
    *[other] {$reaction} ({$count}) комментариев от {$username}
  }

### Q&A

general-tabBar-qaTab = Вопрос/ответ

qa-answeredTab = Отвечено
qa-unansweredTab = Не отвечено
qa-allCommentsTab = Все

qa-noQuestionsAtAll =
  Нет вопросов для этого раздела
qa-noQuestionsYet =
  Вопросов пока нет. Пожалуйста, задайте свой!
qa-viewNew =
  { $count ->
    [one] Показать {$count} новый вопрос
    [few] Показать {$count} новых вопроса
    *[many] Показать {$count} новых вопросов
  }
qa-postQuestionForm-rteLabel = Задать вопрос
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = Самые популярные

qa-answered-tag = отвечено
qa-expert-tag = эксперт

qa-reaction-vote = Голосовать
qa-reaction-voted = Проголосовано
qa-reaction-aria-vote =
  .aria-label = Голосовать
qa-reaction-voted =
  .aria-label = Проголосовано









qa-unansweredTab-doneAnswering = Завершено

qa-expert-email = ({ $email })

qa-answeredTooltip-how = Подходит ли ответ?
qa-answeredTooltip-answeredComments =
  На вопросы отвечает специалист поддержки.
qa-answeredTooltip-toggleButton =
  .aria-label = Переключатель подсказок ответов на вопросы


### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  Запрошено удаление аккаунта
comments-stream-deleteAccount-callOut-receivedDesc =
  Запрос на удаление Вашего аккаунта получен { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  Если Вы хотите продолжить добавлять, отвечать и оценивать
  комментарии - Вы должны отменить запрос на
  удаление Вашего аккаунта до { $date }.
comments-stream-deleteAccount-callOut-cancel =
  Отменить запрос на удаление аккаунта
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  Отменить удаление аккаунта

### Embed Links
comments-embedLinks-showEmbeds = Показать вставки
comments-embedLinks-hideEmbeds = Скрыть вставки

comments-embedLinks-show-giphy = Показать GIF
comments-embedLinks-hide-giphy = Скрыть GIF

comments-embedLinks-show-youtube = Показать видел
comments-embedLinks-hide-youtube = Скрыть видео

comments-embedLinks-show-twitter = Показать твит
comments-embedLinks-hide-twitter = Скрыть твит

comments-embedLinks-show-external = Показать изображение
comments-embedLinks-hide-external = Скрыть изображение


### Featured Comments
comments-featured-gotoConversation = Перейти к обсуждению
comments-featured-replies = Ответы

## Profile Tab
profile-myCommentsTab = Мои комментарии
profile-myCommentsTab-comments = Мои комментарии
profile-accountTab = Аккаунт
profile-preferencesTab = Настройки
accountSettings-manage-account = Настройте свой аккаунт

### Bio
profile-bio-title = Биография
profile-bio-description =
  Добавьте биографию, которая будет отображено в вашем профиле.
  Должна быть не более 100 символов.
profile-bio-remove = Удалить
profile-bio-update = Обновить
profile-bio-success = Биография успешно обновлена.
profile-bio-removed = Биография удалена.


### Account Deletion

profile-accountDeletion-deletionDesc =
  Ваш аккаунт запланирован к удалению { $date }.
profile-accountDeletion-cancelDeletion =
  Отменить запрос на удаление аккаунта
profile-accountDeletion-cancelAccountDeletion =
  Отменить удаление аккаунта

### Comment History
profile-historyComment-viewConversation = Перейти к обсуждению
profile-historyComment-replies = Ответов: {$replyCount}
profile-historyComment-commentHistory = История комментария
profile-historyComment-story = Раздел: {$title}
profile-historyComment-comment-on = Комментировать:
profile-profileQuery-errorLoadingProfile = Ошибка при загрузке профиля
profile-profileQuery-storyNotFound = Раздел не найден
profile-commentHistory-loadMore = Показать еще
profile-commentHistory-empty = Вы не написали ни одного комментария
profile-commentHistory-empty-subheading = История Ваших комментариев появится здесь

### Preferences

profile-preferences-mediaPreferences = Настройки медиа
profile-preferences-mediaPreferences-alwaysShow = Всегда покаывать GIF, твиты, Youtube и пр.
profile-preferences-mediaPreferences-thisMayMake = Комментарии могут грузиться медленнее
profile-preferences-mediaPreferences-update = Обновить
profile-preferences-mediaPreferences-preferencesUpdated =
  Настройки медиа обновлены

### Account
profile-account-ignoredCommenters = Игнорируемые участники
profile-account-ignoredCommenters-description =
  Вы можете добавить участника в "Игнорируемые" нажав на его ник, и выбрав "Игнорировать".
  При игнорировании, все комментарии этого участника будут скрыты от Вас.
  При этом, Ваши комментарии все еще будут видны игнорируемому участнику.
profile-account-ignoredCommenters-empty = Список игнорируемых участников пуст.
profile-account-ignoredCommenters-stopIgnoring = Перестать игнорировать
profile-account-ignoredCommenters-youAreNoLonger =
  Вы больше не игнорируете
profile-account-ignoredCommenters-manage = Управление
profile-account-ignoredCommenters-cancel = Отмена
profile-account-ignoredCommenters-close = Закрыть

profile-account-changePassword-cancel = Отмена
profile-account-changePassword = Изменить пароль
profile-account-changePassword-oldPassword = Старый пароль
profile-account-changePassword-forgotPassword = Забыли свой пароль?
profile-account-changePassword-newPassword = Новый пароль
profile-account-changePassword-button = Изменить пароль
profile-account-changePassword-updated =
  Пароль был изменен
profile-account-changePassword-password = Пароль

profile-account-download-comments-title = Скачать историю моих комментариев
profile-account-download-comments-description =
  Вы получите email со ссылкой для загрузки истории Ваших комментариев.
  Вы можете выполнять скачивание<strong>не чаще одного раза в 14 дней</strong>
profile-account-download-comments-request =
  Запрос истории комментариев
profile-account-download-comments-request-icon =
  .title = Запрос истории комментариев
profile-account-download-comments-recentRequest =
  Ваш предыдущий запрос: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  С момента Вашего предыдущего запроса прошло менее 14 дней.
  Следующая попытка: {$ timeStamp}
profile-account-download-comments-requested =
  Запрос отправлен. Вы можете отправить следующий запрос через { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  Ваш запрос был успешно отправлен. Вы можете повторить загрузку
  истории комментариев через {framework-timeago-time}.
profile-account-download-comments-error =
  We were unable to complete your download request.
profile-account-download-comments-request-button = Запрос


## Delete Account

profile-account-deleteAccount-title = Удалить мой аккаунт
profile-account-deleteAccount-deleteMyAccount = Удалить мой аккаунт
profile-account-deleteAccount-description =
  Удаление Вашей учетной записи навсегда удалит ваш профиль
  и все Ваши комментарии с этого сайта.
profile-account-deleteAccount-requestDelete = Запросить удаление аккаунта

profile-account-deleteAccount-cancelDelete-description =
  Вы уже отправили запрос на удаление своей учетной записи.
  Ваша учетная запись будет удалена {$ date}.
  Вы можете отменить запрос до этого времени.
profile-account-deleteAccount-cancelDelete = Отменить запрос на удаление аккаунта

profile-account-deleteAccount-request = Запрос
profile-account-deleteAccount-cancel = Отмена
profile-account-deleteAccount-pages-deleteButton = Удалить мой аккаунт
profile-account-deleteAccount-pages-cancel = Отменить
profile-account-deleteAccount-pages-proceed = Продолжить
profile-account-deleteAccount-pages-done = Завершено
profile-account-deleteAccount-pages-phrase =
  .aria-label = Фраза

profile-account-deleteAccount-pages-sharedHeader = Удалить мой аккаунт

profile-account-deleteAccount-pages-descriptionHeader = Удалить аккаунт?
profile-account-deleteAccount-pages-descriptionText =
  Вы пытаетесь удалить свой аккаунт. Это означает:
profile-account-deleteAccount-pages-allCommentsRemoved =
  Все Ваши комментарии будут удалены с этого сайта
profile-account-deleteAccount-pages-allCommentsDeleted =
  Все Ваши комментарии будут удалены с из базы данных
profile-account-deleteAccount-pages-emailRemoved =
  Ваш email будет удален из нашей системы

profile-account-deleteAccount-pages-whenHeader = Удаление моего аккаунта: когда?
profile-account-deleteAccount-pages-whenSubHeader = Когда?
profile-account-deleteAccount-pages-whenSec1Header =
  Когда мой аккаунт будет удален?
profile-account-deleteAccount-pages-whenSec1Content =
  Ваш аккаунт будет удален через 24 часа после отправки запроса.
profile-account-deleteAccount-pages-whenSec2Header =
  Могу ли я писать комментарии, пока учетная запись еще не удалена?
profile-account-deleteAccount-pages-whenSec2Content =
  Нет. Как только вы запросили удаление аккаунта, Вы больше
  не можете добавлять, отвечать и оценивать комментарии.

profile-account-deleteAccount-pages-downloadCommentHeader = Скачать комментарии?
profile-account-deleteAccount-pages-downloadSubHeader = Скачать комментарии?
profile-account-deleteAccount-pages-downloadCommentsDesc =
  Перед удалением учетной записи, рекомендуется скачать историю комментариев.
  После удаления учетной записи восстановить комментарии будет невозможно.
profile-account-deleteAccount-pages-downloadCommentsPath =
  Профиль > Скачать историю моих комментариев


profile-account-deleteAccount-pages-confirmHeader = Подтвердить удаление аккаунта?
profile-account-deleteAccount-pages-confirmSubHeader = Вы уверены?
profile-account-deleteAccount-pages-confirmDescHeader =
  Вы уверены, что хотите удалить свой аккаунт?
profile-account-deleteAccount-confirmDescContent =
  Чтобы подтвердить, что Вы хотите удалить свою учетную запись, введите следующую
  фразу в текстовое поле ниже:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  Для подтверждения, введите фразу ниже:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  Введите пароль:

profile-account-deleteAccount-pages-completeHeader = Запрошено удаление аккаунта
profile-account-deleteAccount-pages-completeSubHeader = Запрос отправлен
profile-account-deleteAccount-pages-completeDescript =
  Ваш запрос отправлен. На адрес электронной почты, связанный с Вашей
  учетной записью, было отправлено подтверждение.
profile-account-deleteAccount-pages-completeTimeHeader =
  Ваша учетная запись будет удалена: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = Передумали?
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  Просто войдите в свою учетную запись до указанного времени и выберите
  <strong>Отменить запрос на удаление аккаунта </strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = Пожалуйста, опишите причину удаления.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  Расскажите нам, почему Вы решили удалить свой аккаунт.
  Это поможет сделать сервис лучше! Отправить свой отзыв можно сюда: { $email }.
profile-account-changePassword-edit = Редактировать
profile-account-changePassword-change = Изменить


## Notifications
profile-notificationsTab = Уведомления
profile-account-notifications-emailNotifications = E-Mail уведомления
profile-account-notifications-emailNotifications = Email уведомления
profile-account-notifications-receiveWhen = Я хочу получать уведомления, когда:
profile-account-notifications-onReply = Поступает ответ на мой комментарий
profile-account-notifications-onFeatured = Мой комментарий отмечают как "важный"
profile-account-notifications-onStaffReplies = Администратор отвечает на мой комментарий
profile-account-notifications-onModeration = Мой комментарий проходит модерацию
profile-account-notifications-sendNotifications = Отправлять уведомления:
profile-account-notifications-sendNotifications-immediately = Сразу
profile-account-notifications-sendNotifications-daily = Ежедневно
profile-account-notifications-sendNotifications-hourly = Каждый час
profile-account-notifications-updated = Ваши настройки уведомлений были обновлены
profile-account-notifications-button = Обновить настройки уведомлений
profile-account-notifications-button-update = Обновить

## Report Comment Popover
comments-reportPopover =
  .description = Диалог для сообщения о комментарии
comments-reportPopover-reportThisComment = Сообщить об этом комментарии
comments-reportPopover-whyAreYouReporting = Почему Вы хотите сообщить об этом комментарии?

comments-reportPopover-reasonOffensive = Этот комментарий оскорбительный
comments-reportPopover-reasonAbusive = Это оскорбительное поведение
comments-reportPopover-reasonIDisagree = Я не согласен с этим комментарием
comments-reportPopover-reasonSpam = Это похоже на рекламу или маркетинг
comments-reportPopover-reasonOther = Другое

comments-reportPopover-additionalInformation =
  Дополнительная информация <optional>Необязательно</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  Пожалуйста, оставьте любую дополнительную информацию, которая может быть полезна нашим модераторам.

comments-reportPopover-maxCharacters = Максимум символов: { $maxCharacters }
comments-reportPopover-restrictToMaxCharacters = Пожалуйста, ограничьте свое сообщение { $maxCharacters } символами
comments-reportPopover-cancel = Отменить
comments-reportPopover-submit = Отправить

comments-reportPopover-thankYou = Спасибо!
comments-reportPopover-receivedMessage =
  Мы получили Ваше сообщение. Благодаря Вам, сообщество становится безопаснее!

comments-reportPopover-dismiss = Отклонить

## Submit Status
comments-submitStatus-dismiss = Отклонить
comments-submitStatus-submittedAndWillBeReviewed =
  Ваш комментарий отправлен и будет рассмотрен модератором
comments-submitStatus-submittedAndRejected =
  Этот комментарий был отклонен из-за нарушения правил

# Configure
configure-configureQuery-errorLoadingProfile = Ошибка загрузки конфигурации
configure-configureQuery-storyNotFound = Раздел не найден

## Change username
profile-changeUsername-username = Ник
profile-changeUsername-success = Ваш ник успешно обновлен
profile-changeUsername-edit = Редактировать
profile-changeUsername-change = Изменить
profile-changeUsername-heading = Редактировать ник
profile-changeUsername-heading-changeYourUsername = Изменить ник
profile-changeUsername-desc = Измените ник, который будет отображаться во всех Ваших прошлых и будущих комментариях. <strong>Ник можно менять не чаще чем {framework-timeago-time}.</strong>
profile-changeUsername-desc-text = Измените ник, который будет отображаться во всех Ваших прошлых и будущих комментариях. Ник можно менять не чаще чем {framework-timeago-time}.
profile-changeUsername-current = Текущий ник
profile-changeUsername-newUsername-label = Новый ник
profile-changeUsername-confirmNewUsername-label = Подтвердить новый ник
profile-changeUsername-cancel = Отменить
profile-changeUsername-save = Сохранить
profile-changeUsername-saveChanges = Сохранить изменения
profile-changeUsername-recentChange = Вы уже изменяли свой ник за последние {framework-timeago-time}. Вы можете снова изменить его: {$ nextUpdate}
profile-changeUsername-youChangedYourUsernameWithin =
  Вы уже изменяли свой ник за последние {framework-timeago-time}. Вы можете снова изменить его: {$ nextUpdate}
profile-changeUsername-close = Закрыть

## Discussions tab

discussions-mostActiveDiscussions = Наиболее активные обсуждения
discussions-mostActiveDiscussions-subhead = Ранжировано по наибольшему числу комментариев за последние 24 часа на { $siteName }
discussions-mostActiveDiscussions-empty = Вы еще не участвовали ни в одном обсуждении
discussions-myOngoingDiscussions = Мои текущие обсуждения
discussions-myOngoingDiscussions-subhead = Где вы комментироали по { $orgName }
discussions-viewFullHistory = Посмотреть полную историю
discussions-discussionsQuery-errorLoadingProfile = Ошибка загрузки профиля
discussions-discussionsQuery-storyNotFound = Обсуждение не найдено

## Comment Stream
configure-stream-title = Настройка текущего раздела комментариев
configure-stream-title-configureThisStream =
  Настройка текущего раздела
configure-stream-apply = Применить
configure-stream-update = Обновить
configure-stream-streamHasBeenUpdated =
  Раздел обновлен

configure-premod-title = Включить премодерацию
configure-premod-premoderateAllComments = Пре-модерация всех комментариев
configure-premod-description =
  Модераторы должны будут одобрить любой комментарий, прежде чем он будет опубликован в этом разделе.

configure-premodLink-title = Премодерация комментариев, включающих ссылки
configure-premodLink-commentsContainingLinks =
  Премодерация комментариев, включающих ссылки
configure-premodLink-description =
  Модераторы должны будут одобрить любой комментарий, содержащий ссылку, прежде чем он будет опубликован в этом разделе.

configure-messageBox-title = Включить закрепляемое сообщение для этого раздела
configure-addMessage-title =
  Включить закрепляемое сообщение для этого раздела
configure-messageBox-description =
  Добавьте сообщение в верхнюю часть комментариев. Это можно использовать для того,
  что бы предложить тему для обсуждения, сделать объявление, и т.д.
configure-addMessage-description =
  Добавьте сообщение в верхнюю часть комментариев. Это можно использовать для того,
  что бы предложить тему для обсуждения, сделать объявление, и т.д.
configure-addMessage-addMessage = Добавить сообщение
configure-addMessage-removed = Сообщение было удалено
config-addMessage-messageHasBeenAdded =
  Сообщение было добавлено
configure-addMessage-remove = Удалить
configure-addMessage-submitUpdate = Обновить
configure-addMessage-cancel = Отменить
configure-addMessage-submitAdd = Добавить сообщение

configure-messageBox-preview = Предпросмотр
configure-messageBox-selectAnIcon = Выбрать иконку
configure-messageBox-iconConversation = Обсуждение
configure-messageBox-iconDate = Дата
configure-messageBox-iconHelp = Помощь
configure-messageBox-iconWarning = Предупреждение
configure-messageBox-iconChatBubble = Иконка чата
configure-messageBox-noIcon = Без иконки
configure-messageBox-writeAMessage = Написать сообщение

configure-closeStream-title = Отключить комментирование в разделе
configure-closeStream-closeCommentStream =
  Отключить комментирование в разделе
configure-closeStream-description =
  Комментарии в этом разделе в настоящее время включены. Отключив их,
  новые комментарии не смогут быть добавлены, но все ранее
  отправленные комментарии будут отображаться.
configure-closeStream-closeStream = Отключить
configure-closeStream-theStreamIsNowOpen = Комментирование в разделе включено

configure-openStream-title = Включить комментирование в разделе
configure-openStream-description =
  Комментарии в этом разделе в настоящее время отключены. Включив их,
  можно будет отправлять новые комментарии.
configure-openStream-openStream = Включить
configure-openStream-theStreamIsNowClosed = Комментирование в разделе отключено

configure-moderateThisStream = Модерировать этот раздел

qa-experimentalTag-tooltip-content =
  Формат вопросов/ответов в настоящее время находится в активной разработке.
  Пожалуйста, сообщайте нам о любых проблемах при использовании данного функционала.

configure-enableQA-title = Переключиться в формат вопросов/ответов
configure-enableQA-switchToQA =
  Переключиться в формат вопросов/ответов
configure-enableQA-description =
  Формат вопросов и ответов позволяет участникам задавать вопросы,
  на которые будут отвечать специалисты.
configure-enableQA-enableQA = Переключиться на вопросы/ответы
configure-enableQA-streamIsNowComments =
  Теперь раздел переведен в формат комментирования

configure-disableQA-title = Переключиться в формат комментирования
configure-disableQA-description =
  Формат вопросов и ответов позволяет участникам задавать вопросы,
  на которые будут отвечать специалисты.
configure-disableQA-disableQA = Переключиться на комментарии
configure-disableQA-streamIsNowQA =
  Теперь раздел переведен в формат "вопрос/ответ"

configure-experts-title = Добавить специалиста
configure-experts-filter-searchField =
  .placeholder = Поиск по email или по нику
  .aria-label = Поиск по email или по нику
configure-experts-filter-searchButton =
  .aria-label = Поиск
configure-experts-filter-description =
  Добавляет значок специалиста для комментариев зарегистрированных пользователей,
  только для этого раздела. Новые пользователи должны сначала зарегистрироваться
  и открыть комментарии в разделе, чтобы создать свою учетную запись.
configure-experts-search-none-found = Пользователи с таким email или ником не найдены
configure-experts-remove-button = Удалить
configure-experts-load-more = Загрузить еще
configure-experts-none-yet = В настоящее время нет специалистов по этому вопросу.
configure-experts-search-title = Поиск специалиста
configure-experts-assigned-title = Специалисты
configure-experts-noLongerAnExpert = больше не специалист
comments-tombstone-ignore = Этот комментарий скрыт, потому что вы проигнорировали {$username}
comments-tombstone-showComment = Посмотреть комментарий
comments-tombstone-deleted =
  Этот комментарий больше не доступен. Участник удалил свою учетную запись.

suspendInfo-heading = Для Вашего аккаунта временно приостановелно комментирование.
suspendInfo-heading-yourAccountHasBeen =
  Для Вашего аккаунта временно приостановелно комментирование.
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  В соответствии с правилами сообщества {$organization} Ваша учетная запись была
  временно заблокирована. Во время блокировки Вы не можете
  добавлять, отвечать и оценивать комментарии.
suspendInfo-until-pleaseRejoinThe =
  Пожалуйста, присоединяйтесь к разговору позже: { $until }

profile-changeEmail-unverified = (Непроверенный)
profile-changeEmail-current = (Текущий)
profile-changeEmail-edit = Редактировать
profile-changeEmail-change = Изменить
profile-changeEmail-please-verify = Проверьте свой email
profile-changeEmail-please-verify-details =
  На {$ email} было отправлено подтверждение.
  Вы должны подтвердить свой новый email, прежде чем его можно будет использовать для
  входа в свою учетную запись или для получения уведомлений.
profile-changeEmail-resend = Отправить подтверждение еще раз
profile-changeEmail-heading = Редактирование email-адреса
profile-changeEmail-changeYourEmailAddress =
  Изменить email-адрес
profile-changeEmail-desc = Изменить email-адрес, используемый для входа и получения сообщений.
profile-changeEmail-newEmail-label = Новый email-адрес
profile-changeEmail-password = Пароль
profile-changeEmail-password-input =
  .placeholder = Пароль
profile-changeEmail-cancel = Отменить
profile-changeEmail-submit = Сохранить
profile-changeEmail-saveChanges = Сохранить изменения
profile-changeEmail-email = Email
profile-changeEmail-title = Email-адрес
profile-changeEmail-success = Ваш email-адрес был успешно обновлен

### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = تضمين التعليقات

general-moderate = مُعدَّل
general-archived = مؤَرشَف

general-userBoxUnauthenticated-joinTheConversation = انضمام إلى المناقشة
general-userBoxUnauthenticated-signIn = تسجيل الدخول
general-userBoxUnauthenticated-register = تسجيل

general-authenticationSection =
  .aria-label = توثيق

general-userBoxAuthenticated-signedIn =
  تسجيل الدخول عبر
general-userBoxAuthenticated-notYou =
  هذا ليس أنت؟ <button>تسجيل الخروج</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  تم تسجيل الخروج بنجاح

general-tabBar-commentsTab = التعليقات
general-tabBar-myProfileTab = ملفي
general-tabBar-discussionsTab = النقاشات
general-tabBar-reviewsTab = المراجعات
general-tabBar-configure = تهيئة

general-mainTablist =
  .aria-label = قائمة الجداول الرئيسية

general-secondaryTablist =
  .aria-label = قائمة الجداول الثانوية

## Comment Count

comment-count-text =
  { $count  ->
    [one] تعلق
    *[other] تعليق
  }

## Comments Tab

comments-allCommentsTab = جميع التعليقات
comments-featuredTab = المرشّحة
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count  ->
    [one] شخص واحد يتابع هذه المناقشة
    *[other] { SHORT_NUMBER($count) } أشخاص يتابعون هذه المناقشة
  }

comments-announcement-section =
  .aria-label = إعلان
comments-announcement-closeButton =
  .aria-label = إغلاق الإعلان

comments-accountStatus-section =
  .aria-label = حالة الحساب

comments-featuredCommentTooltip-how = كيف يتم ترشيح التعليق؟
comments-featuredCommentTooltip-handSelectedComments =
  تعليقات مُختارة من قبل فريقنا تستحق القراءة.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = عرض تلميح التعليقات المُرشّحة
  .title = عرض تلميح التعليقات المُرشّحة

comments-collapse-toggle =
  .aria-label = فتح التعليقات
comments-expand-toggle =
  .aria-label = توسيع التعليقات
comments-bannedInfo-bannedFromCommenting = تمّ حظر حسابك من التعليق.
comments-bannedInfo-violatedCommunityGuidelines =
  شخص ما يمتلك وصولاً لحسابك انتهك معايير مجتمعنا. نتيجة لذلك، تم حظر حسابك. لن تتمكن من التعليق، أو التفاعل مع التعليقات أو التبليغ عنها. إن كنت تعتقد بأن هذا مجرد خطأ، الرجاء التواصل مع فريقنا المختص.
comments-noCommentsAtAll = ليس هناك تعليقات على المقال.
comments-noCommentsYet = ليس هناك تعليقات على المقال. لمَ لا تبدأ بالتعليق؟

comments-streamQuery-storyNotFound = المقال غير موجود

comments-communityGuidelines-section =
  .aria-label = معايير المجتمع

comments-commentForm-cancel = إلغاء
comments-commentForm-saveChanges = حفظ  التغييرات
comments-commentForm-submit = تقديم

comments-postCommentForm-section =
  .aria-label = نشر تعليق
comments-postCommentForm-submit = تقديم
comments-replyList-showAll = إظهار الكل
comments-replyList-showMoreReplies = إظهار المزيد من الردود

comments-postComment-gifSearch = بحث عن صورة متحركة
comments-postComment-gifSearch-search =
  .aria-label = بحث
comments-postComment-gifSearch-loading = تحميل...
comments-postComment-gifSearch-no-results = لا نتائج عن {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = من قبل giphy

comments-postComment-pasteImage = لصق رابط الصورة
comments-postComment-insertImage = إدخال

comments-postComment-confirmMedia-youtube = إضافة فيديو يوتيوب في نهاية تعليقك؟
comments-postComment-confirmMedia-twitter = إضافة هذه التغريدة في نهاية تعليقك؟
comments-postComment-confirmMedia-cancel = إلغاء
comments-postComment-confirmMedia-add-tweet = إضافة تغريدة
comments-postComment-confirmMedia-add-video = إضافة فيديو
comments-postComment-confirmMedia-remove = حذف
comments-commentForm-gifPreview-remove = حذف
comments-viewNew =
  { $count ->
    [1] مشاهدة {$count} تعليق جديد
    *[other] مشاهدة {$count} تعليقات جديدة
  }
comments-loadMore = تحميل المزيد

comments-permalinkPopover =
  .description = مربع حوار يظهر اللينك الدائم للتعليق
comments-permalinkPopover-permalinkToComment =
  .aria-label = اللينك الدائم للتعليق
comments-permalinkButton-share = مشاركة
comments-permalinkButton =
  .aria-label = مشاركة تعليقك من قبل {$username}
comments-permalinkView-section =
  .aria-label = محادثة واحدة
comments-permalinkView-viewFullDiscussion = مشاهدة كامل المحادثة
comments-permalinkView-commentRemovedOrDoesNotExist = هذا التعليق محذوف أو غير موجود.

comments-rte-bold =
  .title = عريض

comments-rte-italic =
  .title = مائل

comments-rte-blockquote =
  .title = اقتباس

comments-rte-bulletedList =
  .title = لائحة الاقتباسات

comments-rte-strikethrough =
  .title = خط متوسط

comments-rte-spoiler = حرق

comments-rte-sarcasm = تهكم

comments-rte-externalImage =
  .title = صورة خارجية

comments-remainingCharacters = { $remaining } محرف متبقي

comments-postCommentFormFake-signInAndJoin = قم بتسجيل الدخول للمشاركة في النقاش

comments-postCommentForm-rteLabel = نشر تعليق

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = ردّ
comments-replyButton =
  .aria-label = ردّ على تعليق {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = تقديم
comments-replyCommentForm-cancel = إلغاء
comments-replyCommentForm-rteLabel = كتابة ردّ
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = مستوى الموضوع { $level }:
comments-commentContainer-highlightedLabel = مُشار إليه:
comments-commentContainer-ancestorLabel = الأصل:
comments-commentContainer-replyLabel =
  ردّ من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  سؤال من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  تعليق من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = تعديل

comments-editCommentForm-saveChanges = حفظ التغييرات
comments-editCommentForm-cancel = إلغاء
comments-editCommentForm-close = إغلاق
comments-editCommentForm-rteLabel = تعديل التعليق
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = تعديل: <time></time> متبقي
comments-editCommentForm-editTimeExpired = انتهى وقت التعديل. لم يعد بوسعك تعديل التعليق. لمَ لا تنشر تعليقاً آخر؟
comments-editedMarker-edited = تمّ التعديل
comments-showConversationLink-readMore = اقرأ المزيد من هذه المحادثة >
comments-conversationThread-showMoreOfThisConversation =
  إظهار المزيد من هذه المحادثة

comments-permalinkView-youAreCurrentlyViewing =
  أنت تشاهد حالياً محادثة واحدة
comments-inReplyTo = ردّ على <Username></Username>
comments-replyingTo = ردّ على <Username></Username>

comments-reportButton-report = تبليغ
comments-reportButton-reported = تمّ التبليغ
comments-reportButton-aria-report =
  .aria-label = تبليغ عن تعليق {$username}
comments-reportButton-aria-reported =
  .aria-label = تمّ التبليغ

comments-sortMenu-sortBy = ترتيب بحسب
comments-sortMenu-newest = الأحدث
comments-sortMenu-oldest = الأقدم
comments-sortMenu-mostReplies = عدد الردود

comments-userPopover =
  .description = نظرة سريعة مع المزيد من المعلومات
comments-userPopover-memberSince = عضو منذ { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = تجاهل

comments-userIgnorePopover-ignoreUser = تجاهل {$username}?
comments-userIgnorePopover-description =
  عند تجاهل معلق، فإن جميع التعليقات الصادرة عنه على الموقع سيتم إخفاؤها عنك. يمكنك تغيير ذلك لاحقاً من ملفك الشخصي.
comments-userIgnorePopover-ignore = تجاهل
comments-userIgnorePopover-cancel = إلغاء

comments-userBanPopover-title = حظر {$username}?
comments-userBanPopover-description =
  عند الحظر، لن يتمكن هذا المستخدم من التعليق، إبداء التفاعل أو التبليغ. هذا التعليق سيتم رفضه كذلك.
comments-userBanPopover-cancel = إلغاء
comments-userBanPopover-ban = حظر

comments-moderationDropdown-popover =
  .description = نظرة سريعة على القائمة لتعديل التعليق
comments-moderationDropdown-feature = مُرشّح
comments-moderationDropdown-unfeature = غير مُرشّح
comments-moderationDropdown-approve = موافقة
comments-moderationDropdown-approved = تمت الموافقة
comments-moderationDropdown-reject = رفض
comments-moderationDropdown-rejected = تم الرفض
comments-moderationDropdown-ban = حظر مستخدم
comments-moderationDropdown-banned = تم الحظر
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = عرض إشرافي
comments-moderationDropdown-moderateStory = إشراف على مقال
comments-moderationDropdown-caretButton =
  .aria-label = تحرير

comments-moderationRejectedTombstone-title = قمتَ برفض هذا التعليق.
comments-moderationRejectedTombstone-moderateLink =
  الانتقال إلى العرض الإشرافي لمراجعة هذا القرار

comments-featuredTag = مُرشَّح

# $reaction could be "Respect" as an example. Be careful when translating to other languages with different grammar cases.
comments-react =
  .aria-label = {$count ->
    [0] {$reaction} تعليق من قبل {$username}
    *[other] {$reaction} تعليق من قبل {$username} (Total: {$count})
  }

# $reaction could be "Respected" as an example. Be careful when translating to other languages with different grammar cases.
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} تعليق من قبل {$username}
    [one] {$reaction} تعليق من قبل {$username}
    *[other] {$reaction} تعليق من قبل {$username} (Total: {$count})
  }

comments-jumpToComment-title = تمّ نشر ردك في الأسفل
comments-jumpToComment-GoToReply = الانتقال إلى الردّ

comments-mobileToolbar-closeButton =
  .aria-label = إغلاق
comments-mobileToolbar-unmarkAll = إلغاء تحديد الكل
comments-mobileToolbar-nextUnread = التالي غير المقروء

comments-replyChangedWarning-theCommentHasJust =
  تمّ تعديل هذا التعليق. تمّ عرض آخر تحديث في الأعلى.

### Q&A

general-tabBar-qaTab = Q&A

qa-postCommentForm-section =
  .aria-label = نشر سؤال

qa-answeredTab = تمت الإجابة
qa-unansweredTab = من دون إجابة
qa-allCommentsTab = الكل

qa-answered-gotoConversation = الانتقال إلى المحادثة
qa-answered-replies = الردود

qa-noQuestionsAtAll =
  ليس هناك أسئلة على هذا المقال.
qa-noQuestionsYet =
  ليس هناك أسئلة بعد. لم لا تكون أول من يسأل؟
qa-viewNew =
  { $count ->
    [1] عرض {$count} سؤال جديد
    *[other] عرض {$count} أسئلة جديدة
  }

qa-postQuestionForm-rteLabel = نشر سؤال
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = الأكثر تصويتاً

qa-answered-tag = تمت الإجابة
qa-expert-tag = تصدير

qa-reaction-vote = تصويت
qa-reaction-voted = تم التصويت

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] تصويت على تعليق {$username}
    *[other] تصويت ({$count}) على تعليق {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] تم التصويت على تعليق {$username}
    [one] تم التصويت على تعليق {$username}
    *[other] تم التصويت ({$count}) على تعليق {$username}
  }

qa-unansweredTab-doneAnswering = تمّ

qa-expert-email = ({ $email })

qa-answeredTooltip-how = كيف تتم الإجابة على سؤال؟
qa-answeredTooltip-answeredComments =
  تتم الإجابة على الأسئلة من قبل خبير في الأسئلة والأجوبة.
qa-answeredTooltip-toggleButton =
  .aria-label = عرض تلميحات الأسئلة التي تمت الإجابة عليها
  .title = عرض تلميحات الأسئلة التي تمت الإجابة عليها

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  تم طلب حذف الحساب
comments-stream-deleteAccount-callOut-receivedDesc =
  تم تلقي طلب حذف حسابك في { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  إن أردت المواصلة وترك تعليق، ردود أو تفاعل، ربما تريد إعادة النظر في طلب حذف حسابك قبل { $date }.
comments-stream-deleteAccount-callOut-cancel =
  إلغاء طلب حذف الحسابcomments-stream-deleteAccount-callOut-cancelAccountDeletion =
  إلغاء طلب حذف الحساب

comments-permalink-copyLink = نسخ الرابط
comments-permalink-linkCopied = تم نسخ الرابط

### Embed Links

comments-embedLinks-showEmbeds = إظهار التضمين
comments-embedLinks-hideEmbeds = إخفاء التصمين

comments-embedLinks-show-giphy = إظهار الصورة المتحركة
comments-embedLinks-hide-giphy = إخفاء الصورة المتحركة

comments-embedLinks-show-youtube = إظهار الفيديو
comments-embedLinks-hide-youtube = إخفاء الفيديو

comments-embedLinks-show-twitter = إظهار التغريدة
comments-embedLinks-hide-twitter = إخفاء التغريدة

comments-embedLinks-show-external = إظهار الصورة
comments-embedLinks-hide-external = إخفاء الصورة


### Featured Comments
comments-featured-gotoConversation = الانتقال إلى المحادثة
comments-featured-replies = الردود

## Profile Tab

profile-myCommentsTab = تعليقاتي
profile-myCommentsTab-comments = تعليقاتي
profile-accountTab = الحساب
profile-preferencesTab = التفضيلات

### Bio
profile-bio-title = السيرة الذاتية
profile-bio-description =
  كتابة بعض المعلومات عنك لتظهر للعلن في ملفك الشخصي. يجب أن تكون أقل من 100 محرف.
profile-bio-remove = حذف
profile-bio-update = تحديث
profile-bio-success = تم تحديث معلوماتك بنجاح.
profile-bio-removed = تم حذف معلوماتك.


### Account Deletion

profile-accountDeletion-deletionDesc =
  تمت جدولة حسابك للحذف في { $date }.
profile-accountDeletion-cancelDeletion =
  إلغاء طلب حذف الحساب
profile-accountDeletion-cancelAccountDeletion =
  إلغاء حذف الحساب

### Comment History
profile-commentHistory-section =
  .aria-label = تاريخ التعليقات
profile-historyComment-commentLabel =
  التعليق <RelativeTime></RelativeTime> على { $storyTitle }
profile-historyComment-viewConversation = عرض المحادثة
profile-historyComment-replies = الردود {$replyCount}
profile-historyComment-commentHistory = تاريخ التعليق
profile-historyComment-story = المقال: {$title}
profile-historyComment-comment-on = تعليق على:
profile-profileQuery-errorLoadingProfile = خطأ في تحميل الملف الشخصي
profile-profileQuery-storyNotFound = مقال غير موجود
profile-commentHistory-loadMore = تحميل المزيد
profile-commentHistory-empty = لم تكتب أية تعليقات
profile-commentHistory-empty-subheading = تاريخ تعليقاتك سيظهر هنا

### Preferences

profile-preferences-mediaPreferences = تفضيلات الوسائط
profile-preferences-mediaPreferences-alwaysShow = دوماً إظهار الصور المتحركة، التغريدات، فيديو يوتيوب وغيرها
profile-preferences-mediaPreferences-thisMayMake = هذا قد يجعل تحميل التعليقات أبطأ
profile-preferences-mediaPreferences-update = تحديث
profile-preferences-mediaPreferences-preferencesUpdated =
  تم تحديث تفضيلات الوسائط

### Account
profile-account-ignoredCommenters = تعليقات تم تجاهلها
profile-account-ignoredCommenters-description =
  يمكنك تجاهل التعليقات عبر الضغط على اسم المستخدم واختيار تجاهل. عندما تتجاهل أحداً، فإن جميع تعليقاته سيتم إخفاؤها عنك. لكنه سيبقى قادراً على رؤية تعليقاتك.
profile-account-ignoredCommenters-empty = لم تتجاهل أحداً بعد
profile-account-ignoredCommenters-stopIgnoring = إيقاف التجاهل
profile-account-ignoredCommenters-youAreNoLonger =
  لم تعد تتجاهل
profile-account-ignoredCommenters-manage = إدارة
profile-account-ignoredCommenters-cancel = إلغاء
profile-account-ignoredCommenters-close = إغلاق

profile-account-changePassword-cancel = إلغاء
profile-account-changePassword = تغيير كلمة المرور
profile-account-changePassword-oldPassword = كلمة مرور قديمة
profile-account-changePassword-forgotPassword = هل نسيت كلمة المرور؟
profile-account-changePassword-newPassword = كلمة مرور جديدة
profile-account-changePassword-button = تغيير كلمة المرور
profile-account-changePassword-updated =
  تم تحديث كلمة المرور
profile-account-changePassword-password = كلمة المرور

profile-account-download-comments-title = تحميل تاريخ تعليقاتي
profile-account-download-comments-description =
  ستتلقى بريداً إلكترونياً مع رابط لتحميل تاريخ التعليقات.
  يمكنك طلب <strong>تحميل واحد كل 14 يوماً.</strong>
profile-account-download-comments-request =
  طلب تاريخ التعليقات
profile-account-download-comments-request-icon =
  .title = طلب تاريخ التعليقات
profile-account-download-comments-recentRequest =
  أحدث طلباتك: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  أحدث طلب لك كان خلال الـ 14 يوماً الماضية. يمكنك طلب تحميل تعليقاتك مجدداً في: { $timeStamp }
profile-account-download-comments-requested =
  تم تقديم الطلب. يمكن تقديم طلب آخر في { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  تم تقديم الطلب بنجاح. يمكنك طلب تحميل تعليقاتك مجدداً في { framework-timeago-time }.
profile-account-download-comments-error =
  لم نتمكن من إكمال طلب التحميل.
profile-account-download-comments-request-button = طلب

## Delete Account

profile-account-deleteAccount-title = حذف حسابي
profile-account-deleteAccount-deleteMyAccount = حذف حسابي
profile-account-deleteAccount-description =
  حذف الحساب سيمحي تماماً ملفك الشخصي وجميع تعليقاتك من الموقع.
profile-account-deleteAccount-requestDelete = طلب حذف الحساب

profile-account-deleteAccount-cancelDelete-description =
  قدمت بالفعل طلباً لحذف حسابك.
  سيتم حذف حسابك في { $date }.
  يمكنك إلغاء طلب حذف الحساب قبل ذلك الوقت.

profile-account-deleteAccount-cancelDelete = إلغاء طلب حذف الحساب

profile-account-deleteAccount-request = طلب
profile-account-deleteAccount-cancel = إلغاء
profile-account-deleteAccount-pages-deleteButton = حذف حسابي
profile-account-deleteAccount-pages-cancel = إلغاء
profile-account-deleteAccount-pages-proceed = متابعة
profile-account-deleteAccount-pages-done = تمّ
profile-account-deleteAccount-pages-phrase =
  .aria-label = جملة

profile-account-deleteAccount-pages-sharedHeader = حذف حسابي

profile-account-deleteAccount-pages-descriptionHeader = حذف حسابي؟
profile-account-deleteAccount-pages-descriptionText =
  أنت على وشك حذف حسابك. هذا يعني:
profile-account-deleteAccount-pages-allCommentsRemoved =
  تمّ حذف جميع تعليقاتك من الموقع
profile-account-deleteAccount-pages-allCommentsDeleted =
  تمّ حذف جميع تعليقاتك من قاعدة بياناتنا
profile-account-deleteAccount-pages-emailRemoved =
  تم حذف بريدك الإلكتروني من نظامنا

profile-account-deleteAccount-pages-whenHeader = حذف حسابي: متى؟
profile-account-deleteAccount-pages-whenSubHeader = متى؟
profile-account-deleteAccount-pages-whenSec1Header =
  متى يتم حذف حسابي؟
profile-account-deleteAccount-pages-whenSec1Content =
  سيتم حذف حسابك بعد 24 ساعة من تقديم الطلب.
profile-account-deleteAccount-pages-whenSec2Header =
  هل سيبقى بوسعي التعليق بعد حذف حسابي؟
profile-account-deleteAccount-pages-whenSec2Content =
  كلا. حالما يتم تقديم طلب حذف الحساب، لن يعود بوسعك التعليق، الرد على التعليقات أو التفاعل معها.

profile-account-deleteAccount-pages-downloadCommentHeader = تحميل تعليقاتي؟
profile-account-deleteAccount-pages-downloadSubHeader = تحميل تعلياتي
profile-account-deleteAccount-pages-downloadCommentsDesc =
  قبل حذف الحساب، نوصي بتحميل تعليقاتك. بعد حذف الحساب، لن تتمكن من طلب تاريخ تعليقاتك.
profile-account-deleteAccount-pages-downloadCommentsPath =
  ملفي الشخصي > تحميل تاريخ تعليقاتي

profile-account-deleteAccount-pages-confirmHeader = تأكيد حذف الحساب؟
profile-account-deleteAccount-pages-confirmSubHeader = هل أنت متأكد؟
profile-account-deleteAccount-pages-confirmDescHeader =
  هل أنت متأكد بأنك تريد حذف حسابك؟
profile-account-deleteAccount-confirmDescContent =
  لتأكيد رغبتك بحذف حسابك الرجاء كتابة الجملة التالية في صندوق النص بالأسفل:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  للتأكيد، اكتب الجملة في الأسفل:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  إدخال كلمة المرور:

profile-account-deleteAccount-pages-completeHeader = تم طلب حذف الحساب
profile-account-deleteAccount-pages-completeSubHeader = تم تقديم الطلب
profile-account-deleteAccount-pages-completeDescript =
  تم تقديم طلبك وإرسال تأكيد إلى بريدك الإلكتروني المرتبط بحسابك.
profile-account-deleteAccount-pages-completeTimeHeader =
  سيتم حذف حسابك في: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = غيرت رأيك؟
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  ببساطة قم بتسجيل الدخول لحسابك مجدداً قبل هذا الوقت وقم باختيار
  <strong>إلغاء طلب حذف الحساب</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = أخبرنا بالسبب.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  نريد أن نعلم سبب اختيارك حذف الحساب. الرجاء إرسال آرائك ضمن نظام التعليقات الخاص بنا عبر البريد الإلكتروني { $email }.
profile-account-changePassword-edit = تحرير
profile-account-changePassword-change = تغيير


## Notifications
profile-notificationsTab = التنبيهات
profile-account-notifications-emailNotifications = تنبيهات البريد الإلكتروني
profile-account-notifications-emailNotifications = تنبيهات البريد الإلكتروني
profile-account-notifications-receiveWhen = تلقي التنبيهات عند:
profile-account-notifications-onReply = الرد على تعليقاتي
profile-account-notifications-onFeatured = ترشيح تعليقي
profile-account-notifications-onStaffReplies = ردّ من قبل الفريق على تعليقي
profile-account-notifications-onModeration = مراجعة تعليقي في الانتظار
profile-account-notifications-sendNotifications = إرسال التنبيهات:
profile-account-notifications-sendNotifications-immediately = مباشرة
profile-account-notifications-sendNotifications-daily = بشكل يومي
profile-account-notifications-sendNotifications-hourly = كل ساعة
profile-account-notifications-updated = تم تحديث إعدادات التنبيهات
profile-account-notifications-button = تحديث إعدادات التنبيهات
profile-account-notifications-button-update = تحديث

## Report Comment Popover
comments-reportPopover =
  .description = حوار حول التعليقات المُبلّغ عنها
comments-reportPopover-reportThisComment = التبليغ عن هذا التعليق
comments-reportPopover-whyAreYouReporting = لماذا قمت بالتبليغ على هذا التعليق؟

comments-reportPopover-reasonOffensive = هذا التعليق مُهين
comments-reportPopover-reasonAbusive = هذا التعليق مؤذٍ
comments-reportPopover-reasonIDisagree = لا أتفق مع هذا التعليق
comments-reportPopover-reasonSpam = يبدو كأنه إعلان أو عمل تسويقي
comments-reportPopover-reasonOther = غير ذلك

comments-reportPopover-additionalInformation =
  معلومات إضافية <optional>اختيارية</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  الرجاء ترك أية معلومات إضافية قد تساعد المُشرفين.

comments-reportPopover-maxCharacters = { $maxCharacters } محرف كحد أقصى
comments-reportPopover-restrictToMaxCharacters = الرجاء اقتصار التبليغ على { $maxCharacters } محرفاً
comments-reportPopover-cancel = إلغاء
comments-reportPopover-submit = تقديم

comments-reportPopover-thankYou = شكراً لك!
comments-reportPopover-receivedMessage =
  لقد تلقينا رسالتك. المبلّغون مثلك يساعدون في الإبقاء على مجتمعنا آمناً.
comments-reportPopover-dismiss = إغلاق

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = تبليغ عن هذا التعليق
comments-archivedReportPopover-doesThisComment =
  هل ينتهك هذا التعليق معايير مجتمعنا؟ هل هو مهين أم دعائي؟
  أرسل بريداً إلكترونياً إلى فريق المشرفين <a>{ $orgName }</a> مع رابط التعليق وشرح بسيط.

comments-archivedReportPopover-needALink =
  تريد رابطاً لهذا التعليق؟
comments-archivedReportPopover-copyLink = نسخ الرابط

comments-archivedReportPopover-emailSubject = التبليغ عن التعليق
comments-archivedReportPopover-emailBody =
  أريد التبليغ عن التعليقات التالية:
  %0A
  { $permalinkURL }
  %0A
  %0A
  للأسباب التالية:

## Submit Status
comments-submitStatus-dismiss = إغلاق
comments-submitStatus-submittedAndWillBeReviewed =
  تم تقديم تعليقك وستتم مراجعته من قبل مشرف
comments-submitStatus-submittedAndRejected =
  تم رفض هذا التعليق لأنه ينتهك معاييرنا

# Configure
configure-configureQuery-errorLoadingProfile = خطأ في تحميل الإعدادات
configure-configureQuery-storyNotFound = المقال غير موجود

## Archive
configure-archived-title = تمت أرشفة سلسلة التعليقات هذه
configure-archived-onArchivedStream =
  في التعليقات المؤرشفة، لا يمكن إضافة تعليق جديد، تفاعل أو تبليغ. ولا يمكن العمل عليها من قبل الإشراف.
configure-archived-toAllowTheseActions =
  للسماح بهذا، يجب إخراجها من الأرشيف.
configure-archived-unarchiveStream = إخراج من الأرشيف

## Change username
profile-changeUsername-username = اسم المستخدم
profile-changeUsername-success = تم تحديث اسم المستخدم بنجاح
profile-changeUsername-edit = تحرير
profile-changeUsername-change = تغيير
profile-changeUsername-heading = تعديل اسم المستخدم
profile-changeUsername-heading-changeYourUsername = تغيير اسم المستخدم
profile-changeUsername-desc = تغيير اسم المستخدم الذي سيظهر في جميع تعليقاتك السابقة والقادمة. <strong>يمكن تغيير اسم المستخدم مرة كل { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = تغيير اسم المستخدم الذي سيظهر في جميع تعليقاتك السابقة والقادمة يمكن تغيير اسم المستخدم مرة كل { framework-timeago-time }.
profile-changeUsername-current = اسم المستخدم الحالي
profile-changeUsername-newUsername-label = اسم مستخدم جديد
profile-changeUsername-confirmNewUsername-label = تأكيد اسم المستخدم الجديد
profile-changeUsername-cancel = إلغاء
profile-changeUsername-save = حفظ
profile-changeUsername-saveChanges = حفظ التغييرات
profile-changeUsername-recentChange = تم تغيير اسم المستخدم منذ فترة قصيرة. يمكن تغييره مجدداً في { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  تم تغيير اسم المستخدم منذ { framework-timeago-time }. يمكن تغييره مجدداً في: { $nextUpdate }.
profile-changeUsername-close = إغلاق

## Discussions tab

discussions-mostActiveDiscussions = أكثر النقاشات تفاعلاً
discussions-mostActiveDiscussions-subhead = ترتيب بحسب أكبر عدد من التعليقات خلال آخر 24 ساعة في { $siteName }
discussions-mostActiveDiscussions-empty = لم تشارك في أي نقاش
discussions-myOngoingDiscussions = النقاشات التي شاركت بها
discussions-myOngoingDiscussions-subhead = مواضع التعليقات { $orgName }
discussions-viewFullHistory = مشاهدة كامل تاريخ التعليقات
discussions-discussionsQuery-errorLoadingProfile = خطأ في تحميل الملف الشخصي
discussions-discussionsQuery-storyNotFound = مقال غير موجود

## Comment Stream
configure-stream-title-configureThisStream =
  تعديل
configure-stream-update = تحديث
configure-stream-streamHasBeenUpdated =
  تم التعديل

configure-premod-premoderateAllComments = وضع كامل التعليقات في وضع قبل الإشراف
configure-premod-description =
  يجب أن يوافق المشرفون على أي تعليق قبل نشره على هذا المقال.
configure-premodLink-commentsContainingLinks =
  تعليقات ما قبل الإشراف تحتوي على روابط
configure-premodLink-description =
  يجب أن يوافق المشرفون على أي تعليق يضم روابط قبل نشره على هذا المقال.
configure-addMessage-title =
  إضافة رسالة أو سؤال
configure-addMessage-description =
  إضافة رسالة إلى صندوق التعليقات لقرائك. استعمال هذا لنشر موضوع أو طرح سؤال أو تقديم إعلان يتعلق بالمقال.
configure-addMessage-addMessage = إضافة رسالة
configure-addMessage-removed = تم حذف الرسالة
config-addMessage-messageHasBeenAdded =
  تمت إضافة هذه الرسالة إلى صندوق التعليق
configure-addMessage-remove = حذف
configure-addMessage-submitUpdate = تحديث
configure-addMessage-cancel = إلغاء
configure-addMessage-submitAdd = إضافة رسالة

configure-messageBox-preview = عرض
configure-messageBox-selectAnIcon = اختيار أيقونة
configure-messageBox-iconConversation = محادثة
configure-messageBox-iconDate = تاريخ
configure-messageBox-iconHelp = مساعدة
configure-messageBox-iconWarning = تحذير
configure-messageBox-iconChatBubble = صندوق الحوار
configure-messageBox-noIcon = لا أيقونة
configure-messageBox-writeAMessage = كتابة رسالة

configure-closeStream-closeCommentStream =
  إغلاق التعليقات
configure-closeStream-description =
  التعليقات حالياً مفتوحة. عبر إغلاقها، لن يعود بالإمكان إضافة تعليقات جديدة وسيتم الإبقاء على عرض كامل التعليقات المقدمة سابقاً.
configure-closeStream-closeStream = إغلاق السلسلة
configure-closeStream-theStreamIsNowOpen = السلسلة الآن مفتوحة

configure-openStream-title = سلسلة مفتوحة
configure-openStream-description =
  هذه السلسلة مغلقة حالياً. عند فتحها، يمكن تقديم وعرض التعليقات الجديدة
configure-openStream-openStream = فتح السلسلة
configure-openStream-theStreamIsNowClosed = هذه السلسلة مغلقة حالياً

qa-experimentalTag-tooltip-content =
  قسم الأسئلة والأجوبة قيد التطوير حالياً. الرجاء التواصل معنا حيال أي رأي أو طلب.

configure-enableQA-switchToQA =
  الانتقال إلى صيغة الأسئلة والأجوبة
configure-enableQA-description =
  صيغة الأسئلة والأجوبة تسمح لأعضاء المجتمع بطرح الأسئلة على خبيرٍ مختار للإجابة.
configure-enableQA-streamIsNowComments =
  السلسلة الآن في صيغة التعليقات
configure-disableQA-description =
  صيغة الأسئلة والأجوبة تسمح لأعضاء المجتمع بطرح الأسئلة على خبيرٍ مختار للإجابة.
configure-disableQA-disableQA = الانتقال إلى التعليقات
configure-disableQA-streamIsNowQA =
  السلسلة الآن في صيغة الأسئلة والأجوبة

configure-experts-title = إضافة خبير
configure-experts-filter-searchField =
  .placeholder = البحث عن طريق البريد الإلكتروني أو اسم المستخدم
  .aria-label = البحث عن طريق البريد الإلكتروني أو اسم المستخدم
configure-experts-filter-searchButton =
  .aria-label = بحث
configure-experts-filter-description =
  إضافة شارة خبير للتعليقات من قبل مستخدمين مسجلين، فقط في هذه الصفحة. على المستخدمين الجدد تسجيل الدخول وفتح التعليقات لإنشاء حساباتهم.
configure-experts-search-none-found = لم يتم إيجاد مستخدمين بهذا البريد الإلكتروني أو اسم المستخدم
configure-experts-remove-button = إزالة
configure-experts-load-more = تحميل المزيد
configure-experts-none-yet = لا يوجد حالياً أي خبراء في قسم الأسئلة والأجوبة هذا.
configure-experts-search-title = بحث عن خبير
configure-experts-assigned-title = خبراء
configure-experts-noLongerAnExpert = لم يعد خبيراً
comments-tombstone-ignore = هذا التعليق مخفي لأنك تجاهلت {$username}
comments-tombstone-showComment = إظهار التعليق
comments-tombstone-deleted =
  لم يعد هذا التعليق متاحاً. قام المُعلق بحذف حسابه.
comments-tombstone-rejected =
  تم حذف هذا المعلق من قبل المشرف لانتهاكه معايير مجتمعنا.

suspendInfo-heading-yourAccountHasBeen =
  تم إيقاف حسابك عن التعليق لفترة مؤقتة
suspendInfo-description-inAccordanceWith =
 وفقاً لمعايير مجتمع { $organization }تم حظر حسابك مؤقتاً. أثناء فترة الحظر لن تتمكن من التعليق، التفاعل أو إعادة فتح التعليقات.

suspendInfo-until-pleaseRejoinThe =
 الرجاء الانضمام مجدداً للمحادثة في { $until }

warning-heading = حسابك تلقى تنبيهاً
warning-explanation =
 وفقاً لمعايير مجتمعنا تلقى حسابك تنبيهاً.
warning-acknowledge = إقرار

warning-notice =تلقى حسابك تنبيهاً. لمواصلة المشاركة الرجاء <a>مراجعة رسالة التنبيه</a>.

modMessage-heading = تلقى حسابك رسالة من قبل مشرف
modMessage-acknowledge = إقرار

profile-changeEmail-unverified = (غير مثبت)
profile-changeEmail-current = (حالي)
profile-changeEmail-edit = تعديل
profile-changeEmail-change = تغيير
profile-changeEmail-please-verify = إثبات بريدك الإلكتروني
profile-changeEmail-please-verify-details =
  تم إرسال بريد إلكتروني إلى { $email } لتأكيد حسابك.
  لا بدّ من تأكيد العنوان الجديد للبريد الإلكتروني قبل استعماله لتسجيل الدخول إلى حسابك وتلقي الإشعارات.
profile-changeEmail-resend = إعادة إرسال التحقق
profile-changeEmail-heading =  تعديل البريد الإلكتروني
profile-changeEmail-changeYourEmailAddress =
  تغيير بريدك الإلكتروني
profile-changeEmail-desc = تغيير البريد الإلكتروني المستعمل لتسجيل الدخول وتلقي معلومات حيال حسابك.
profile-changeEmail-newEmail-label = بريد إلكتروني جديد
profile-changeEmail-password = كلمة مرور
profile-changeEmail-password-input =
  .placeholder = كلمة مرور
profile-changeEmail-cancel = إلغاء
profile-changeEmail-submit = حفظ
profile-changeEmail-saveChanges = حفظ التغييرات
profile-changeEmail-email = بريد إلكتروني
profile-changeEmail-title = عنوان البريد الإلكتروني
profile-changeEmail-success = تم تحديث بريدك الإلكتروني بنجاح

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = تقديم مراجعة أو طرح سؤال

ratingsAndReviews-reviewsTab = مراجعات
ratingsAndReviews-questionsTab = أسئلة
ratingsAndReviews-noReviewsAtAll = ليس هناك مراجعات.
ratingsAndReviews-noQuestionsAtAll = ليس هناك أسئلة.
ratingsAndReviews-noReviewsYet = لا توجد أية مراجعات بعد. لمَ لا تكتب واحدة؟
ratingsAndReviews-noQuestionsYet = لا توجد أية أسئلة بعد. لمَ لا تطرح سؤالاً؟
ratingsAndReviews-selectARating = اختيار التصنيف
ratingsAndReviews-youRatedThis = قمت بتقييم هذه
ratingsAndReviews-showReview = إظهار مراجعة
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = تقييم ومراجعة
ratingsAndReviews-askAQuestion = طرح سؤال
ratingsAndReviews-basedOnRatings = { $count ->
  [0] لا تقييمات بعد
  [1] بناء على تقييم واحد
  *[other] بناء على { SHORT_NUMBER($count) } تقييم
}

ratingsAndReviews-allReviewsFilter = جميع المراجعات
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] نجمة واحدة
  *[other] { $rating } نجمة
}

comments-addAReviewForm-rteLabel = إضافة مراجعة (اختياري)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = بداية المقال
  .title = انتقال إلى بداية المقال
stream-footer-links-top-of-comments =
  .title = انتقال إلى بداية التعليقات
stream-footer-links-profile = الملف الشخصي & الردود
  .title = انتقال إلى الملف الشخصي والردود
stream-footer-links-discussions = المزيد من النقاشات
  .title = انتقال إلى المزيد من النقاشات
stream-footer-navigation =
  .aria-label = تذييل التعليقات

### Localization for Embed Stream

## General

general-commentsEmbedSection =
  .aria-label = تضمين التعليقات

general-moderate = إشراف
general-archived = مؤرشف

general-userBoxUnauthenticated-joinTheConversation = انضم إلى المحادثة
general-userBoxUnauthenticated-signIn = تسجيل الدخول
general-userBoxUnauthenticated-register = إنشاء حساب

general-authenticationSection =
  .aria-label = المصادقة

general-userBoxAuthenticated-signedIn =
  تم تسجيل الدخول بصفة
general-userBoxAuthenticated-notYou =
  لست أنت؟ <button>تسجيل الخروج</button>

general-userBox-youHaveBeenSuccessfullySignedOut =
  تم تسجيل الخروج بنجاح

general-tabBar-commentsTab = التعليقات
general-tabBar-myProfileTab = ملفي الشخصي
general-tabBar-discussionsTab = النقاشات
general-tabBar-reviewsTab = المراجعات
general-tabBar-configure = الإعدادات
general-tabBar-notifications = الإشعارات
general-tabBar-notifications-hasNew = الإشعارات (يوجد جديد)

general-mainTablist =
  .aria-label = قائمة التبويبات الرئيسية

general-secondaryTablist =
  .aria-label = قائمة التبويبات الثانوية

## Comment Count

comment-count-text =
  { $count ->
    [one] تعليق
    *[other] تعليقات
  }

comment-count-text-ratings =
  { $count ->
    [one] تقييم
    *[other] تقييمات
  }

## Comments Tab
addACommentButton =
  .aria-label = أضف تعليقاً. سينتقل التركيز إلى أسفل التعليقات.

comments-allCommentsTab = جميع التعليقات
comments-featuredTab = المميزة
comments-counter-shortNum = { SHORT_NUMBER($count) }
comments-watchers =
  { $count ->
    [one] شخص واحد يشاهد هذا النقاش
    *[other] { SHORT_NUMBER($count) } أشخاص يشاهدون هذا النقاش
  }

comments-announcement-section =
  .aria-label = إعلان
comments-announcement-closeButton =
  .aria-label = إغلاق الإعلان

comments-accountStatus-section =
  .aria-label = حالة الحساب

comments-featuredCommentTooltip-how = كيف يتم تمييز التعليق؟
comments-featuredCommentTooltip-handSelectedComments =
  يختار فريقنا التعليقات التي تستحق القراءة.
comments-featuredCommentTooltip-toggleButton =
  .aria-label = تبديل تلميح التعليقات المميزة
  .title = تبديل تلميح التعليقات المميزة

comment-top-commenter-tooltip-header = <icon></icon> معلّق بارز
comment-top-commenter-tooltip-details = تم تمييز أحد تعليقاته خلال الأيام العشرة الأخيرة

comment-new-commenter-tooltip-details = معلّق جديد، قل مرحباً

comments-collapse-toggle-with-username =
  .aria-label = إخفاء تعليق { $username } والردود عليه
comments-collapse-toggle-without-username =
  .aria-label = إخفاء التعليق والردود عليه
comments-expand-toggle-with-username =
  .aria-label = إظهار تعليق { $username } والردود عليه
comments-expand-toggle-without-username =
  .aria-label = إظهار التعليق والردود عليه
comments-bannedInfo-bannedFromCommenting = تم حظر حسابك من التعليق.
comments-bannedInfo-violatedCommunityGuidelines =
  شخص لديه صلاحية الوصول إلى حسابك انتهك إرشادات
  مجتمعنا. نتيجة لذلك، تم حظر حسابك. لن يكون بإمكانك
  التعليق أو التفاعل أو الإبلاغ عن التعليقات. إذا كنت تعتقد
  أن هذا خطأ، يرجى التواصل مع فريق المجتمع.

comments-noCommentsAtAll = لا توجد تعليقات على هذا المقال.
comments-noCommentsYet = لا توجد تعليقات بعد. لمَ لا تكتب واحداً؟

comments-streamQuery-storyNotFound = المقال غير موجود

comments-communityGuidelines-section =
  .aria-label = إرشادات المجتمع

comments-commentForm-cancel = إلغاء
comments-commentForm-saveChanges = حفظ التغييرات
comments-commentForm-submit = إرسال

comments-postCommentForm-section =
  .aria-label = نشر تعليق
comments-postCommentForm-submit = إرسال
comments-replyList-showAll = إظهار الكل
comments-replyList-showMoreReplies = إظهار المزيد من الردود

comments-postComment-gifSearch = البحث عن صورة GIF
comments-postComment-gifSearch-search =
  .aria-label = بحث
comments-postComment-gifSearch-search-loadMore = تحميل المزيد
comments-postComment-gifSearch-loading = جارٍ التحميل...
comments-postComment-gifSearch-no-results = لا توجد نتائج لـ {$query}
comments-postComment-gifSearch-powered-by-giphy =
  .alt = مدعوم من giphy
comments-postComment-gifSearch-powered-by-tenor =
  .alt = مدعوم من tenor

comments-postComment-pasteImage = لصق رابط الصورة
comments-postComment-insertImage = إدراج

comments-postComment-confirmMedia-youtube = هل تريد إضافة فيديو يوتيوب في نهاية تعليقك؟
comments-postComment-confirmMedia-twitter = هل تريد إضافة هذا المنشور في نهاية تعليقك؟
comments-postComment-confirmMedia-bluesky = هل تريد إضافة هذا المنشور في نهاية تعليقك؟
comments-postComment-confirmMedia-cancel = إلغاء
comments-postComment-confirmMedia-add-tweet = إضافة منشور
comments-postComment-confirmMedia-add-bluesky = إضافة منشور
comments-postComment-confirmMedia-add-video = إضافة فيديو
comments-postComment-confirmMedia-remove = إزالة
comments-commentForm-gifPreview-remove = إزالة
comments-viewNew-loading = جارٍ التحميل...
comments-viewNew =
  { $count ->
    [1] عرض تعليق جديد ({$count})
    *[other] عرض تعليقات جديدة ({$count})
  }
comments-loadMore = تحميل المزيد
comments-loadAll = تحميل جميع التعليقات
comments-loadAll-loading = جارٍ التحميل...

comments-permalinkPopover =
  .description = نافذة تعرض الرابط الدائم للتعليق
comments-permalinkPopover-permalinkToComment =
  .aria-label = الرابط الدائم للتعليق
comments-permalinkButton-share = مشاركة
comments-permalinkButton =
  .aria-label = مشاركة تعليق {$username}
comments-permalinkButton-copyReportLink = رابط الإبلاغ
comments-permalinkView-section =
  .aria-label = محادثة واحدة
comments-permalinkView-viewFullDiscussion = عرض النقاش الكامل
comments-permalinkView-commentRemovedOrDoesNotExist = تم حذف هذا التعليق أو أنه غير موجود.

comments-permalinkView-reportIllegalContent-title = الإبلاغ عن محتوى يُحتمل أنه غير قانوني
comments-permalinkView-reportIllegalContent-description = يرجى ملء هذا النموذج بأفضل ما لديك حتى يتمكن فريق الإشراف من اتخاذ قرار والتشاور مع القسم القانوني إذا لزم الأمر.
comments-permalinkView-reportIllegalContent-reportingComment = أنت تبلّغ عن هذا التعليق
comments-permalinkView-reportIllegalContent-lawBrokenDescription-inputLabel = ما القانون الذي تعتقد أنه تم انتهاكه؟ (مطلوب)
comments-permalinkView-reportIllegalContent-additionalInformation-inputLabel = يرجى إضافة معلومات إضافية عن سبب كون هذا التعليق غير قانوني (مطلوب)
comments-permalinkView-reportIllegalContent-additionalInformation-helperText = أي تفاصيل تقدمها ستساعدنا في التحقيق أكثر
comments-permalinkView-reportIllegalContent-additionalComments-inputLabel = هل ترغب في الإبلاغ عن تعليقات أخرى تحتوي على محتوى يُحتمل أنه غير قانوني؟
comments-permalinkView-reportIllegalContent-bonafideBelief-checkbox = أعتقد أن المعلومات الواردة في هذا البلاغ دقيقة وكاملة
comments-permalinkView-reportIllegalContent-additionalComments-addCommentURLButton = <Button></Button>إضافة
comments-permalinkView-reportIllegalContent-additionalComment-commentURLButton = رابط التعليق
comments-permalinkView-reportIllegalContent-additionalComments-deleteButton = <icon></icon> حذف
comments-permalinkView-reportIllegalContent-submit = إرسال البلاغ
comments-permalinkView-reportIllegalContent-additionalComments-commentNotFoundError = التعليق غير موجود. يرجى إدخال رابط تعليق صالح
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError = هذا ليس رابطاً صالحاً. يرجى إدخال رابط تعليق صالح
comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError = لقد أضفت هذا التعليق بالفعل إلى هذا البلاغ. يرجى إضافة رابط تعليق فريد
comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLLengthError = طول رابط التعليق الإضافي يتجاوز الحد الأقصى.
comments-permalinkView-reportIllegalContent-additionalComments-previouslyReportedCommentError = لقد أبلغت سابقاً عن هذا التعليق. يمكنك الإبلاغ عن تعليق لهذا السبب مرة واحدة فقط.
comments-permalinkView-reportIllegalContent-confirmation-successHeader = لقد تلقينا بلاغك عن محتوى غير قانوني
comments-permalinkView-reportIllegalContent-confirmation-description = سيتم مراجعة بلاغك من قبل فريق الإشراف. ستتلقى إشعاراً عند اتخاذ القرار.
comments-permalinkView-reportIllegalContent-confirmation-errorHeader = شكراً لإرسال هذا البلاغ
comments-permalinkView-reportIllegalContent-confirmation-errorDescription = لم نتمكن من إرسال بلاغك للسبب (الأسباب) التالية:
comments-permalinkView-reportIllegalContent-confirmation-returnToComments = يمكنك الآن إغلاق هذا التبويب للعودة إلى التعليقات

comments-rte-bold =
  .title = عريض

comments-rte-italic =
  .title = مائل

comments-rte-blockquote =
  .title = اقتباس

comments-rte-bulletedList =
  .title = قائمة نقطية

comments-rte-strikethrough =
  .title = يتوسطه خط

comments-rte-spoiler = حرق أحداث

comments-rte-sarcasm = سخرية

comments-rte-externalImage =
  .title = صورة خارجية

comments-remainingCharacters = { $remaining } حرف متبقٍ

comments-postCommentFormFake-signInAndJoin = سجّل الدخول وانضم إلى المحادثة

comments-postCommentForm-rteLabel = أضف تعليقاً

comments-postCommentForm-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-postCommentFormFake-rte =
  .placeholder = { comments-postCommentForm-rteLabel }

comments-replyButton-reply = ردّ
comments-replyButton =
  .aria-label = الرد على تعليق {$username}

comments-permalinkViewQuery-storyNotFound = { comments-streamQuery-storyNotFound }

comments-replyCommentForm-submit = إرسال
comments-replyCommentForm-cancel = إلغاء
comments-replyCommentForm-rteLabel = اكتب رداً
comments-replyCommentForm-rte =
  .placeholder = { comments-replyCommentForm-rteLabel }

comments-commentContainer-threadLevelLabel = مستوى السلسلة { $level }:
comments-commentContainer-highlightedLabel = مميز:
comments-commentContainer-ancestorLabel = أصلي:
comments-commentContainer-replyLabel =
  ردّ من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-questionLabel =
  سؤال من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-commentLabel =
  تعليق من { $username } <RelativeTime></RelativeTime>
comments-commentContainer-editButton = تعديل

comments-commentContainer-avatar =
  .alt = الصورة الرمزية لـ { $username }

comments-editCommentForm-saveChanges = حفظ التغييرات
comments-editCommentForm-cancel = إلغاء
comments-editCommentForm-close = إغلاق
comments-editCommentForm-rteLabel = تعديل التعليق
comments-editCommentForm-rte =
  .placeholder = { comments-editCommentForm-rteLabel }
comments-editCommentForm-editRemainingTime = التعديل: <time></time> متبقٍ
comments-editCommentForm-editTimeExpired = انتهى وقت التعديل. لم يعد بإمكانك تعديل هذا التعليق. لمَ لا تنشر تعليقاً آخر؟
comments-editedMarker-edited = تم التعديل
comments-showConversationLink-readMore = اقرأ المزيد من هذه المحادثة >
comments-conversationThread-showMoreOfThisConversation =
  إظهار المزيد من هذه المحادثة

comments-permalinkView-currentViewing =
comments-permalinkView-singleConversation =
comments-permalinkView-youAreCurrentlyViewing =
  أنت تشاهد حالياً محادثة واحدة
comments-inReplyTo = رداً على <Username></Username>
comments-replyingTo = الرد على <Username></Username>

comments-reportButton-report = إبلاغ
comments-reportButton-reported = تم الإبلاغ
comments-reportButton-aria-report =
  .aria-label = الإبلاغ عن تعليق {$username}
comments-reportButton-aria-reported =
  .aria-label = تم الإبلاغ

comments-sortMenu-sortBy = ترتيب حسب
comments-sortMenu-newest = الأحدث
comments-sortMenu-oldest = الأقدم
comments-sortMenu-mostReplies = الأكثر رداً

comments-userPopover =
  .description = نافذة منبثقة بمزيد من معلومات المستخدم
comments-userPopover-memberSince = عضو منذ: { DATETIME($timestamp, year: "numeric", month: "long", day: "numeric") }
comments-userPopover-ignore = تجاهل

comments-userIgnorePopover-ignoreUser = تجاهل {$username}؟
comments-userIgnorePopover-description =
  عند تجاهل معلّق، ستُخفى جميع تعليقاته على الموقع
  عنك. يمكنك التراجع عن ذلك لاحقاً من ملفك الشخصي.
comments-userIgnorePopover-ignore = تجاهل
comments-userIgnorePopover-cancel = إلغاء

comments-userSpamBanPopover-title = حظر بسبب الإزعاج
comments-userSpamBanPopover-header-username = اسم المستخدم
comments-userSpamBanPopover-header-description = حظر الإزعاج سيؤدي إلى
comments-userSpamBanPopover-callout = للاستخدام فقط مع حسابات الإزعاج الواضحة
comments-userSpamBanPopover-description-list-banFromComments = حظر هذا الحساب من التعليقات
comments-userSpamBanPopover-description-list-rejectAllComments = رفض جميع التعليقات المكتوبة من هذا الحساب
comments-userSpamBanPopover-confirmation = اكتب "{$text}" للتأكيد

comments-userBanPopover-title = حظر {$username}؟
comments-userSiteBanPopover-title = حظر {$username} من هذا الموقع؟
comments-userBanPopover-description =
  بمجرد الحظر، لن يتمكن هذا المستخدم من التعليق
  أو التفاعل أو الإبلاغ عن التعليقات.
  سيتم رفض هذا التعليق أيضاً.
comments-userBanPopover-cancel = إلغاء
comments-userBanPopover-ban = حظر
comments-userBanPopover-moderator-ban-error = لا يمكن حظر حسابات تملك صلاحيات إشراف
comments-userBanPopover-moreContext = لمزيد من السياق، انتقل إلى
comments-userBanPopover-moderationView = عرض الإشراف

comments-userSiteBanPopover-confirm-title = تم حظر {$username}
comments-userSiteBanPopover-confirm-spam-banned = لم يعد بإمكان هذا الحساب التعليق أو التفاعل أو الإبلاغ عن التعليقات
comments-userSiteBanPopover-confirm-comments-rejected = تم رفض جميع تعليقات هذا الحساب
comments-userSiteBanPopover-confirm-closeButton = إغلاق
comments-userSiteBanPopover-confirm-reviewAccountHistory = لا يزال بإمكانك مراجعة سجل هذا الحساب بالبحث في
comments-userSiteBanPopover-confirm-communitySection = قسم المجتمع

comments-moderationDropdown-popover =
  .description = قائمة منبثقة لإدارة التعليق
comments-moderationDropdown-feature = تمييز
comments-moderationDropdown-unfeature = إلغاء التمييز
comments-moderationDropdown-approve = قبول
comments-moderationDropdown-approved = مقبول
comments-moderationDropdown-reject = رفض
comments-moderationDropdown-rejected = مرفوض
comments-moderationDropdown-spam-ban = حظر بسبب الإزعاج
comments-moderationDropdown-ban = حظر المستخدم
comments-moderationDropdown-siteBan = حظر من الموقع
comments-moderationDropdown-banned = محظور
comments-moderationDropdown-goToModerate =
comments-moderationDropdown-moderationView = عرض الإشراف
comments-moderationDropdown-moderateStory = إشراف على المقال
comments-moderationDropdown-caretButton =
  .aria-label = إشراف

comments-moderationDropdown-embedCode = كود التضمين
comments-moderationDropdown-embedCodeCopied = تم نسخ الكود

comments-moderationRejectedTombstone-title = لقد رفضت هذا التعليق.
comments-moderationRejectedTombstone-moderateLink =
  انتقل إلى الإشراف لمراجعة هذا القرار

comments-featuredTag = مميز
comments-featuredBy = تم تمييزه بواسطة <strong>{$username}</strong>

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} تعليق {$username}
    *[other] {$reaction} تعليق {$username} (الإجمالي: {$count})
  }

comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} تعليق {$username}
    [one] {$reaction} تعليق {$username}
    *[other] {$reaction} تعليق {$username} (الإجمالي: {$count})
  }

comments-jumpToComment-title = تم نشر ردك أدناه
comments-jumpToComment-GoToReply = الانتقال إلى الرد

comments-mobileToolbar-unmarkAll = تعليم الكل كمقروء
comments-mobileToolbar-nextUnread = التالي غير المقروء

comments-refreshComments-closeButton = إغلاق <icon></icon>
  .aria-label = إغلاق
comments-refreshComments-refreshButton = <icon></icon> تحديث التعليقات
  .aria-label = تحديث التعليقات
comments-refreshQuestions-refreshButton = <icon></icon> تحديث الأسئلة
  .aria-label = تحديث الأسئلة
comments-refreshReviews-refreshButton = <icon></icon> تحديث المراجعات
  .aria-label = تحديث المراجعات

comments-replyChangedWarning-theCommentHasJust =
  تم تعديل هذا التعليق للتو. يتم عرض أحدث نسخة أعلاه.

comments-mobileToolbar-notifications-closeButton =
  .aria-label = إغلاق الإشعارات

### Q&A

general-tabBar-qaTab = أسئلة وأجوبة

qa-postCommentForm-section =
  .aria-label = نشر سؤال

qa-answeredTab = تمت الإجابة
qa-unansweredTab = بدون إجابة
qa-allCommentsTab = الكل

qa-answered-answerLabel =
  إجابة من {$username} <RelativeTime></RelativeTime>
qa-answered-gotoConversation = الانتقال إلى المحادثة
qa-answered-replies = الردود

qa-noQuestionsAtAll =
  لا توجد أسئلة على هذا المقال.
qa-noQuestionsYet =
  لا توجد أسئلة بعد. لمَ لا تطرح سؤالاً؟
qa-viewNew-loading = جارٍ التحميل...
qa-viewNew =
  { $count ->
    [1] عرض سؤال جديد ({$count})
    *[other] عرض أسئلة جديدة ({$count})
  }

qa-postQuestionForm-rteLabel = اطرح سؤالاً
qa-postQuestionForm-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }
qa-postQuestionFormFake-rte =
  .placeholder = { qa-postQuestionForm-rteLabel }

qa-sortMenu-mostVoted = الأكثر تصويتاً

qa-answered-tag = تمت الإجابة
qa-expert-tag = خبير

qa-reaction-vote = تصويت
qa-reaction-voted = تم التصويت

qa-reaction-aria-vote =
  .aria-label = {$count ->
    [0] التصويت لتعليق {$username}
    *[other] التصويت ({$count}) لتعليق {$username}
  }
qa-reaction-aria-voted =
  .aria-label = {$count ->
    [0] تم التصويت لتعليق {$username}
    [one] تم التصويت لتعليق {$username}
    *[other] تم التصويت ({$count}) لتعليق {$username}
  }

qa-unansweredTab-doneAnswering = تم

qa-expert-email = ({ $email })

qa-answeredTooltip-how = كيف تتم الإجابة على الأسئلة؟
qa-answeredTooltip-answeredComments =
  تتم الإجابة على الأسئلة من قبل خبير في الأسئلة والأجوبة.
qa-answeredTooltip-toggleButton =
  .aria-label = تبديل تلميح الأسئلة المجابة
  .title = تبديل تلميح الأسئلة المجابة

### Account Deletion Stream

comments-stream-deleteAccount-callOut-title =
  تم طلب حذف الحساب
comments-stream-deleteAccount-callOut-receivedDesc =
  تم تلقي طلب حذف حسابك في { $date }.
comments-stream-deleteAccount-callOut-cancelDesc =
  إذا كنت ترغب في متابعة التعليق والرد والتفاعل،
  يمكنك إلغاء طلب حذف حسابك قبل { $date }.
comments-stream-deleteAccount-callOut-cancel =
  إلغاء طلب حذف الحساب
comments-stream-deleteAccount-callOut-cancelAccountDeletion =
  إلغاء حذف الحساب

comments-permalink-copyLink = نسخ الرابط
comments-permalink-linkCopied = تم نسخ الرابط

### Embed Links

comments-embedLinks-showEmbeds = إظهار التضمينات
comments-embedLinks-hideEmbeds = إخفاء التضمينات
comments-embedLinks-show-gif = إظهار GIF
comments-embedLinks-hide-gif = إخفاء GIF
comments-embedLinks-show-youtube = إظهار الفيديو
comments-embedLinks-hide-youtube = إخفاء الفيديو
comments-embedLinks-show-twitter = إظهار المنشور
comments-embedLinks-hide-twitter = إخفاء المنشور
comments-embedLinks-show-bluesky = إظهار المنشور
comments-embedLinks-hide-bluesky = إخفاء المنشور
comments-embedLinks-show-external = إظهار الصورة
comments-embedLinks-hide-external = إخفاء الصورة
comments-embedLinks-expand = توسيع

### Featured Comments
comments-featured-label =
  تعليق مميز من {$username} <RelativeTime></RelativeTime>
comments-featured-gotoConversation = الانتقال إلى المحادثة
comments-featured-gotoConversation-label-with-username =
  .aria-label = الانتقال إلى محادثة هذا التعليق المميز من { $username }
comments-featured-gotoConversation-label-without-username =
  .aria-label = الانتقال إلى محادثة هذا التعليق المميز
comments-featured-replies = الردود

## Profile Tab

profile-myCommentsTab = تعليقاتي
profile-myCommentsTab-comments = تعليقاتي
profile-accountTab = الحساب
profile-preferencesTab = التفضيلات

### Bio
profile-bio-title = النبذة التعريفية
profile-bio-description =
  اكتب نبذة تعريفية تظهر في ملفك الشخصي. يجب أن تكون
  أقل من 100 حرف.
profile-bio-remove = إزالة
profile-bio-update = تحديث
profile-bio-success = تم تحديث نبذتك التعريفية بنجاح.
profile-bio-removed = تم إزالة نبذتك التعريفية.

### Account Deletion

profile-accountDeletion-deletionDesc =
  تمت جدولة حذف حسابك في { $date }.
profile-accountDeletion-cancelDeletion =
  إلغاء طلب حذف الحساب
profile-accountDeletion-cancelAccountDeletion =
  إلغاء حذف الحساب

### Comment History
profile-commentHistory-section =
  .aria-label = سجل التعليقات
profile-historyComment-commentLabel =
  تعليق <RelativeTime></RelativeTime> على { $storyTitle }
profile-historyComment-viewConversation = عرض المحادثة
profile-historyComment-replies = الردود {$replyCount}
profile-historyComment-commentHistory = سجل التعليقات
profile-historyComment-story = المقال: {$title}
profile-historyComment-comment-on = تعليق على:
profile-profileQuery-errorLoadingProfile = خطأ في تحميل الملف الشخصي
profile-profileQuery-storyNotFound = المقال غير موجود
profile-commentHistory-loadMore = تحميل المزيد
profile-commentHistory-empty = لم تكتب أي تعليقات
profile-commentHistory-empty-subheading = سيظهر سجل تعليقاتك هنا

profile-commentHistory-archived-thisIsAllYourComments =
  هذه جميع تعليقاتك خلال آخر { $value } { $unit ->
    [second] { $value ->
      [1] ثانية
      *[other] ثوانٍ
    }
    [minute] { $value ->
      [1] دقيقة
      *[other] دقائق
    }
    [hour] { $value ->
      [1] ساعة
      *[other] ساعات
    }
    [day] { $value ->
      [1] يوم
      *[other] أيام
    }
    [week] { $value ->
      [1] أسبوع
      *[other] أسابيع
    }
    [month] { $value ->
      [1] شهر
      *[other] أشهر
    }
    [year] { $value ->
      [1] سنة
      *[other] سنوات
    }
    *[other] وحدة غير معروفة
  }. لعرض بقية تعليقاتك، يرجى التواصل معنا.

### Preferences

profile-preferences-mediaPreferences = تفضيلات الوسائط
profile-preferences-mediaPreferences-alwaysShow = إظهار صور GIF ومنشورات X وفيديوهات YouTube دائماً
profile-preferences-mediaPreferences-thisMayMake = قد يجعل هذا تحميل التعليقات أبطأ
profile-preferences-mediaPreferences-update = تحديث
profile-preferences-mediaPreferences-preferencesUpdated =
  تم تحديث تفضيلات الوسائط

### Account
profile-account-ignoredCommenters = المعلّقون المتجاهَلون
profile-account-ignoredCommenters-description =
  يمكنك تجاهل المعلّقين بالنقر على اسم المستخدم واختيار تجاهل.
  عند تجاهل شخص ما، تُخفى جميع تعليقاته عنك.
  لكنه سيظل قادراً على رؤية تعليقاتك.
profile-account-ignoredCommenters-empty = أنت لا تتجاهل أحداً حالياً
profile-account-ignoredCommenters-stopIgnoring = إلغاء التجاهل
profile-account-ignoredCommenters-youAreNoLonger =
  لم تعد تتجاهل
profile-account-ignoredCommenters-manage = إدارة
  .aria-label = إدارة المعلّقين المتجاهَلين
profile-account-ignoredCommenters-cancel = إلغاء
profile-account-ignoredCommenters-close = إغلاق

profile-account-changePassword-cancel = إلغاء
profile-account-changePassword = تغيير كلمة المرور
profile-account-changePassword-oldPassword = كلمة المرور القديمة
profile-account-changePassword-forgotPassword = هل نسيت كلمة المرور؟
profile-account-changePassword-newPassword = كلمة المرور الجديدة
profile-account-changePassword-button = تغيير كلمة المرور
profile-account-changePassword-updated =
  تم تحديث كلمة المرور
profile-account-changePassword-password = كلمة المرور

profile-account-download-comments-title = تحميل سجل تعليقاتي
profile-account-download-comments-description =
  ستتلقى بريداً إلكترونياً يتضمن رابطاً لتحميل سجل تعليقاتك.
  يمكنك تقديم <strong>طلب تحميل واحد كل 14 يوماً.</strong>
profile-account-download-comments-request =
  طلب سجل التعليقات
profile-account-download-comments-request-icon =
  .title = طلب سجل التعليقات
profile-account-download-comments-recentRequest =
  أحدث طلب لك: { $timeStamp }
profile-account-download-comments-yourMostRecentRequest =
  كان آخر طلب لك خلال آخر 14 يوماً. يمكنك طلب تحميل تعليقاتك مجدداً في: { $timeStamp }
profile-account-download-comments-requested =
  تم تقديم الطلب. يمكنك تقديم طلب آخر خلال { framework-timeago-time }.
profile-account-download-comments-requestSubmitted =
  تم تقديم طلبك بنجاح. يمكنك طلب تحميل سجل تعليقاتك مجدداً خلال { framework-timeago-time }.
profile-account-download-comments-error =
  لم نتمكن من إكمال طلب التحميل.
profile-account-download-comments-request-button = طلب

## Delete Account

profile-account-deleteAccount-title = حذف حسابي
profile-account-deleteAccount-deleteMyAccount = حذف حسابي
profile-account-deleteAccount-description =
  سيؤدي حذف حسابك إلى محو ملفك الشخصي نهائياً وإزالة
  جميع تعليقاتك من هذا الموقع.
profile-account-deleteAccount-requestDelete = طلب حذف الحساب

profile-account-deleteAccount-cancelDelete-description =
  لقد قدمت بالفعل طلباً لحذف حسابك.
  سيتم حذف حسابك في { $date }.
  يمكنك إلغاء الطلب قبل ذلك الوقت.
profile-account-deleteAccount-cancelDelete = إلغاء طلب حذف الحساب

profile-account-deleteAccount-request = طلب
profile-account-deleteAccount-cancel = إلغاء
profile-account-deleteAccount-pages-deleteButton = حذف حسابي
profile-account-deleteAccount-pages-cancel = إلغاء
profile-account-deleteAccount-pages-proceed = متابعة
profile-account-deleteAccount-pages-done = تم
profile-account-deleteAccount-pages-phrase =
  .aria-label = عبارة

profile-account-deleteAccount-pages-sharedHeader = حذف حسابي

profile-account-deleteAccount-pages-descriptionHeader = حذف حسابي؟
profile-account-deleteAccount-pages-descriptionText =
  أنت على وشك حذف حسابك. هذا يعني:
profile-account-deleteAccount-pages-allCommentsRemoved =
  ستتم إزالة جميع تعليقاتك من هذا الموقع
profile-account-deleteAccount-pages-allCommentsDeleted =
  سيتم حذف جميع تعليقاتك من قاعدة بياناتنا
profile-account-deleteAccount-pages-emailRemoved =
  ستتم إزالة عنوان بريدك الإلكتروني من نظامنا

profile-account-deleteAccount-pages-whenHeader = حذف حسابي: متى؟
profile-account-deleteAccount-pages-whenSubHeader = متى؟
profile-account-deleteAccount-pages-whenSec1Header =
  متى سيتم حذف حسابي؟
profile-account-deleteAccount-pages-whenSec1Content =
  سيتم حذف حسابك بعد 24 ساعة من تقديم الطلب.
profile-account-deleteAccount-pages-whenSec2Header =
  هل يمكنني الاستمرار في التعليق حتى يتم حذف حسابي؟
profile-account-deleteAccount-pages-whenSec2Content =
  لا. بمجرد طلب حذف الحساب، لن يكون بإمكانك التعليق
  أو الرد على التعليقات أو التفاعل.

profile-account-deleteAccount-pages-downloadCommentHeader = تحميل تعليقاتي؟
profile-account-deleteAccount-pages-downloadSubHeader = تحميل تعليقاتي
profile-account-deleteAccount-pages-downloadCommentsDesc =
  قبل حذف حسابك، ننصحك بتحميل سجل تعليقاتك.
  بعد حذف الحساب، لن تتمكن من طلب سجل تعليقاتك.
profile-account-deleteAccount-pages-downloadCommentsPath =
  ملفي الشخصي > تحميل سجل تعليقاتي

profile-account-deleteAccount-pages-confirmHeader = تأكيد حذف الحساب؟
profile-account-deleteAccount-pages-confirmSubHeader = هل أنت متأكد؟
profile-account-deleteAccount-pages-confirmDescHeader =
  هل أنت متأكد أنك تريد حذف حسابك؟
profile-account-deleteAccount-confirmDescContent =
  لتأكيد رغبتك في حذف حسابك، يرجى كتابة العبارة التالية
  في مربع النص أدناه:
profile-account-deleteAccount-pages-confirmPhraseLabel =
  للتأكيد، اكتب العبارة أدناه:
profile-account-deleteAccount-pages-confirmPasswordLabel =
  أدخل كلمة المرور:

profile-account-deleteAccount-pages-completeHeader = تم طلب حذف الحساب
profile-account-deleteAccount-pages-completeSubHeader = تم تقديم الطلب
profile-account-deleteAccount-pages-completeDescript =
  تم تقديم طلبك وإرسال تأكيد إلى البريد الإلكتروني المرتبط بحسابك.
profile-account-deleteAccount-pages-completeTimeHeader =
  سيتم حذف حسابك في: { $date }
profile-account-deleteAccount-pages-completeChangeYourMindHeader = غيرت رأيك؟
profile-account-deleteAccount-pages-completeSignIntoYourAccount =
  ببساطة سجّل الدخول إلى حسابك مجدداً قبل هذا الوقت واختر
  <strong>إلغاء طلب حذف الحساب</strong>.
profile-account-deleteAccount-pages-completeTellUsWhy = أخبرنا بالسبب.
profile-account-deleteAccount-pages-completeWhyDeleteAccount =
  نودّ معرفة سبب اختيارك حذف حسابك. أرسل لنا ملاحظاتك حول
  نظام التعليقات عبر البريد الإلكتروني { $email }.
profile-account-changePassword-edit = تعديل
profile-account-changePassword-change = تغيير
  .aria-label = تغيير كلمة المرور

## Notifications
profile-notificationsTab = الإشعارات
profile-account-notifications-emailNotifications = إشعارات البريد الإلكتروني
profile-account-notifications-receiveWhen = تلقي الإشعارات عند:
profile-account-notifications-onReply = تلقي تعليقي رداً
profile-account-notifications-onFeatured = تمييز تعليقي
profile-account-notifications-onStaffReplies = رد أحد أعضاء الفريق على تعليقي
profile-account-notifications-onModeration = مراجعة تعليقي المعلّق
profile-account-notifications-sendNotifications = إرسال الإشعارات:
profile-account-notifications-sendNotifications-immediately = فوراً
profile-account-notifications-sendNotifications-daily = يومياً
profile-account-notifications-sendNotifications-hourly = كل ساعة
profile-account-notifications-updated = تم تحديث إعدادات الإشعارات
profile-account-notifications-button = تحديث إعدادات الإشعارات
profile-account-notifications-button-update = تحديث

profile-account-notifications-inPageNotifications = الإشعارات
profile-account-notifications-includeInPageWhen = تنبيهي عند

profile-account-notifications-inPageNotifications-on = الشارات مفعّلة
profile-account-notifications-inPageNotifications-off = الشارات معطّلة

profile-account-notifications-showReplies-fromAnyone = من أي شخص
profile-account-notifications-showReplies-fromStaff = من أحد أعضاء الفريق
profile-account-notifications-showReplies =
  .aria-label = إظهار الردود من

## Report Comment Popover
comments-reportPopover =
  .description = نافذة للإبلاغ عن التعليقات
comments-reportPopover-reportThisComment = الإبلاغ عن هذا التعليق
comments-reportPopover-whyAreYouReporting = لماذا تبلّغ عن هذا التعليق؟

comments-reportPopover-reasonOffensive = هذا التعليق مسيء
comments-reportPopover-reasonAbusive = هذا المعلّق مؤذٍ
comments-reportPopover-reasonIDisagree = لا أتفق مع هذا التعليق
comments-reportPopover-reasonSpam = يبدو كإعلان أو تسويق
comments-reportPopover-reasonOther = أخرى

comments-reportPopover-additionalInformation =
  معلومات إضافية <optional>اختياري</optional>
comments-reportPopover-pleaseLeaveAdditionalInformation =
  يرجى ترك أي معلومات إضافية قد تساعد المشرفين.

comments-reportPopover-maxCharacters = { $maxCharacters } حرف كحد أقصى
comments-reportPopover-restrictToMaxCharacters = يرجى عدم تجاوز { $maxCharacters } حرفاً في بلاغك
comments-reportPopover-cancel = إلغاء
comments-reportPopover-submit = إرسال

comments-reportPopover-thankYou = شكراً لك!
comments-reportPopover-receivedMessage =
  لقد تلقينا رسالتك. البلاغات من أعضاء مثلك تساعد في الحفاظ على أمان المجتمع.

comments-reportPopover-dismiss = إغلاق

comments-reportForm-reportIllegalContent-button = يحتوي هذا التعليق على محتوى يُحتمل أنه غير قانوني
comments-reportForm-signInToReport = يجب تسجيل الدخول للإبلاغ عن تعليق ينتهك إرشاداتنا

## Archived Report Comment Popover

comments-archivedReportPopover-reportThisComment = الإبلاغ عن هذا التعليق
comments-archivedReportPopover-doesThisComment =
  هل ينتهك هذا التعليق إرشادات مجتمعنا؟ هل هو مسيء أو مزعج؟
  أرسل بريداً إلكترونياً إلى فريق الإشراف على <a>{ $orgName }</a> مع رابط
  هذا التعليق وشرح موجز.
comments-archivedReportPopover-needALink =
  هل تحتاج رابطاً لهذا التعليق؟
comments-archivedReportPopover-copyLink = نسخ الرابط

comments-archivedReportPopover-emailSubject = الإبلاغ عن تعليق
comments-archivedReportPopover-emailBody =
  أود الإبلاغ عن التعليق التالي:
  %0A
  { $permalinkURL }
  %0A
  %0A
  للأسباب المذكورة أدناه:

## Submit Status
comments-submitStatus-dismiss = إغلاق
comments-submitStatus-submittedAndWillBeReviewed =
  تم إرسال تعليقك وسيتم مراجعته من قبل مشرف
comments-submitStatus-submittedAndRejected =
  تم رفض هذا التعليق لمخالفته إرشاداتنا

# Configure
configure-configureQuery-errorLoadingProfile = خطأ في تحميل الإعدادات
configure-configureQuery-storyNotFound = المقال غير موجود

## Archive
configure-archived-title = تمت أرشفة سلسلة التعليقات هذه
configure-archived-onArchivedStream =
  في السلاسل المؤرشفة، لا يمكن إضافة تعليقات أو تفاعلات أو بلاغات
  جديدة. كما لا يمكن إدارة التعليقات.
configure-archived-toAllowTheseActions =
  للسماح بهذه الإجراءات، قم بإلغاء أرشفة السلسلة.
configure-archived-unarchiveStream = إلغاء أرشفة السلسلة

## Change username
profile-changeUsername-username = اسم المستخدم
profile-changeUsername-success = تم تحديث اسم المستخدم بنجاح
profile-changeUsername-edit = تعديل
profile-changeUsername-change = تغيير
  .aria-label = تغيير اسم المستخدم
profile-changeUsername-heading = تعديل اسم المستخدم
profile-changeUsername-heading-changeYourUsername = تغيير اسم المستخدم
profile-changeUsername-desc = تغيير اسم المستخدم الذي سيظهر في جميع تعليقاتك السابقة والمستقبلية. <strong>يمكن تغيير اسم المستخدم مرة كل { framework-timeago-time }.</strong>
profile-changeUsername-desc-text = تغيير اسم المستخدم الذي سيظهر في جميع تعليقاتك السابقة والمستقبلية. يمكن تغيير اسم المستخدم مرة كل { framework-timeago-time }.
profile-changeUsername-current = اسم المستخدم الحالي
profile-changeUsername-newUsername-label = اسم مستخدم جديد
profile-changeUsername-confirmNewUsername-label = تأكيد اسم المستخدم الجديد
profile-changeUsername-cancel = إلغاء
profile-changeUsername-save = حفظ
profile-changeUsername-saveChanges = حفظ التغييرات
profile-changeUsername-recentChange = تم تغيير اسم المستخدم مؤخراً. يمكنك تغييره مجدداً في { $nextUpdate }.
profile-changeUsername-youChangedYourUsernameWithin =
  لقد غيرت اسم المستخدم خلال آخر { framework-timeago-time }. يمكنك تغييره مجدداً في: { $nextUpdate }.
profile-changeUsername-close = إغلاق

## Discussions tab

discussions-mostActiveDiscussions = أكثر النقاشات نشاطاً
discussions-mostActiveDiscussions-subhead = مرتبة حسب أكبر عدد من التعليقات خلال آخر 24 ساعة في { $siteName }
discussions-mostActiveDiscussions-empty = لم تشارك في أي نقاش
discussions-myOngoingDiscussions = نقاشاتي الجارية
discussions-myOngoingDiscussions-subhead = حيث علّقت عبر { $orgName }
discussions-viewFullHistory = عرض سجل التعليقات الكامل
discussions-discussionsQuery-errorLoadingProfile = خطأ في تحميل الملف الشخصي
discussions-discussionsQuery-storyNotFound = المقال غير موجود

## Comment Stream
configure-stream-title =
configure-stream-title-configureThisStream =
  إعداد هذه السلسلة
configure-stream-apply =
configure-stream-update = تحديث
configure-stream-streamHasBeenUpdated =
  تم تحديث هذه السلسلة

configure-premod-title =
configure-premod-premoderateAllComments = إشراف مسبق على جميع التعليقات
configure-premod-description =
  يجب أن يوافق المشرفون على أي تعليق قبل نشره على هذا المقال.

configure-premodLink-title =
configure-premodLink-commentsContainingLinks =
  إشراف مسبق على التعليقات التي تحتوي روابط
configure-premodLink-description =
  يجب أن يوافق المشرفون على أي تعليق يحتوي رابطاً قبل نشره على هذا المقال.

configure-messageBox-title =
configure-addMessage-title =
  إضافة رسالة أو سؤال
configure-messageBox-description =
configure-addMessage-description =
  أضف رسالة أعلى صندوق التعليقات للقراء. استخدمها
  لطرح موضوع أو سؤال أو تقديم إعلان متعلق بهذا المقال.
configure-addMessage-addMessage = إضافة رسالة
configure-addMessage-removed = تم إزالة الرسالة
config-addMessage-messageHasBeenAdded =
  تمت إضافة الرسالة إلى صندوق التعليقات
configure-addMessage-remove = إزالة
configure-addMessage-submitUpdate = تحديث
configure-addMessage-cancel = إلغاء
configure-addMessage-submitAdd = إضافة رسالة

configure-messageBox-preview = معاينة
configure-messageBox-selectAnIcon = اختر أيقونة
configure-messageBox-iconConversation = محادثة
configure-messageBox-iconDate = تاريخ
configure-messageBox-iconHelp = مساعدة
configure-messageBox-iconWarning = تحذير
configure-messageBox-iconChatBubble = فقاعة حوار
configure-messageBox-noIcon = بدون أيقونة
configure-messageBox-writeAMessage = اكتب رسالة

configure-closeStream-title =
configure-closeStream-closeCommentStream =
  إغلاق سلسلة التعليقات
configure-closeStream-description =
  سلسلة التعليقات مفتوحة حالياً. بإغلاقها، لن يمكن إرسال تعليقات
  جديدة وستظل جميع التعليقات السابقة معروضة.
configure-closeStream-closeStream = إغلاق السلسلة
configure-closeStream-theStreamIsNowOpen = السلسلة مفتوحة الآن

configure-openStream-title = فتح السلسلة
configure-openStream-description =
  سلسلة التعليقات مغلقة حالياً. بفتحها، يمكن إرسال
  تعليقات جديدة وعرضها.
configure-openStream-openStream = فتح السلسلة
configure-openStream-theStreamIsNowClosed = السلسلة مغلقة الآن

configure-moderateThisStream =

qa-experimentalTag-tooltip-content =
  صيغة الأسئلة والأجوبة قيد التطوير حالياً. يرجى التواصل
  معنا لأي ملاحظات أو طلبات.

configure-enableQA-title =
configure-enableQA-switchToQA =
  التبديل إلى صيغة الأسئلة والأجوبة
configure-enableQA-description =
  تتيح صيغة الأسئلة والأجوبة لأعضاء المجتمع طرح أسئلة
  على خبراء مختارين للإجابة عليها.
configure-enableQA-enableQA = التبديل إلى الأسئلة والأجوبة
configure-enableQA-streamIsNowComments =
  هذه السلسلة الآن في صيغة التعليقات

configure-disableQA-title = إعداد الأسئلة والأجوبة
configure-disableQA-description =
  تتيح صيغة الأسئلة والأجوبة لأعضاء المجتمع طرح أسئلة
  على خبراء مختارين للإجابة عليها.
configure-disableQA-disableQA = التبديل إلى التعليقات
configure-disableQA-streamIsNowQA =
  هذه السلسلة الآن في صيغة الأسئلة والأجوبة

configure-experts-title = إضافة خبير
configure-experts-filter-searchField =
  .placeholder = البحث بالبريد الإلكتروني أو اسم المستخدم
  .aria-label = البحث بالبريد الإلكتروني أو اسم المستخدم
configure-experts-filter-searchButton =
  .aria-label = بحث
configure-experts-filter-description =
  إضافة شارة خبير لتعليقات المستخدمين المسجلين في هذه الصفحة فقط.
configure-experts-search-none-found = لم يتم العثور على مستخدمين بهذا البحث
configure-experts-remove-button = إزالة
configure-experts-load-more = تحميل المزيد
configure-experts-none-yet = لا يوجد خبراء حالياً في هذه الأسئلة والأجوبة.
configure-experts-search-title = البحث عن خبير
configure-experts-assigned-title = الخبراء
configure-experts-noLongerAnExpert = لم يعد خبيراً
comments-tombstone-ignore-user = هذا التعليق مخفي لأنك تجاهلت هذا المستخدم.
comments-tombstone-showComment = إظهار التعليق
comments-tombstone-deleted =
  لم يعد هذا التعليق متاحاً. قام المعلّق بحذف حسابه.
comments-tombstone-rejected =
  تم إزالة هذا التعليق من قبل مشرف لانتهاكه إرشادات مجتمعنا.

suspendInfo-heading =
suspendInfo-heading-yourAccountHasBeen =
  تم تعليق حسابك مؤقتاً عن التعليق
suspendInfo-info =
suspendInfo-description-inAccordanceWith =
  وفقاً لإرشادات مجتمع { $organization }، تم تعليق حسابك
  مؤقتاً. أثناء فترة التعليق لن تتمكن من التعليق
  أو التفاعل أو الإبلاغ عن التعليقات.
suspendInfo-until-pleaseRejoinThe =
  يرجى العودة إلى المحادثة في { $until }

warning-heading = حسابك تلقى تحذيراً
warning-explanation =
  وفقاً لإرشادات مجتمعنا، تلقى حسابك تحذيراً.
warning-instructions =
  لمتابعة المشاركة في النقاشات، يرجى الضغط على زر "إقرار" أدناه.
warning-acknowledge = إقرار

warning-notice = حسابك تلقى تحذيراً. لمتابعة المشاركة يرجى <a>مراجعة رسالة التحذير</a>.

modMessage-heading = تلقى حسابك رسالة من مشرف
modMessage-acknowledge = إقرار

profile-changeEmail-unverified = (غير موثّق)
profile-changeEmail-current = (حالي)
profile-changeEmail-edit = تعديل
profile-changeEmail-change = تغيير
  .aria-label = تغيير البريد الإلكتروني
profile-changeEmail-please-verify = تحقق من عنوان بريدك الإلكتروني
profile-changeEmail-please-verify-details =
  تم إرسال بريد إلكتروني إلى { $email } للتحقق من حسابك.
  يجب التحقق من عنوان بريدك الإلكتروني الجديد قبل استخدامه
  لتسجيل الدخول أو تلقي الإشعارات.
profile-changeEmail-resend = إعادة إرسال التحقق
profile-changeEmail-heading = تعديل عنوان بريدك الإلكتروني
profile-changeEmail-changeYourEmailAddress =
  تغيير عنوان بريدك الإلكتروني
profile-changeEmail-desc = تغيير عنوان البريد الإلكتروني المستخدم لتسجيل الدخول وتلقي المعلومات حول حسابك.
profile-changeEmail-newEmail-label = عنوان بريد إلكتروني جديد
profile-changeEmail-password = كلمة المرور
profile-changeEmail-password-input =
  .placeholder = كلمة المرور
profile-changeEmail-cancel = إلغاء
profile-changeEmail-submit = حفظ
profile-changeEmail-saveChanges = حفظ التغييرات
profile-changeEmail-email = البريد الإلكتروني
profile-changeEmail-title = عنوان البريد الإلكتروني
profile-changeEmail-success = تم تحديث بريدك الإلكتروني بنجاح

## Ratings and Reviews

ratingsAndReviews-postCommentForm-section =
  .aria-label = إرسال مراجعة أو طرح سؤال

ratingsAndReviews-reviewsTab = المراجعات
ratingsAndReviews-questionsTab = الأسئلة
ratingsAndReviews-noReviewsAtAll = لا توجد مراجعات.
ratingsAndReviews-noQuestionsAtAll = لا توجد أسئلة.
ratingsAndReviews-noReviewsYet = لا توجد مراجعات بعد. لمَ لا تكتب واحدة؟
ratingsAndReviews-noQuestionsYet = لا توجد أسئلة بعد. لمَ لا تطرح سؤالاً؟
ratingsAndReviews-selectARating = اختر تقييماً
ratingsAndReviews-youRatedThis = لقد قيّمت هذا
ratingsAndReviews-showReview = إظهار المراجعة
  .title = { ratingsAndReviews-showReview }
ratingsAndReviews-rateAndReview = تقييم ومراجعة
ratingsAndReviews-askAQuestion = طرح سؤال
ratingsAndReviews-basedOnRatings = { $count ->
  [0] لا تقييمات بعد
  [1] بناءً على تقييم واحد
  *[other] بناءً على { SHORT_NUMBER($count) } تقييم
}

ratingsAndReviews-allReviewsFilter = جميع المراجعات
ratingsAndReviews-starReviewsFilter = { $rating ->
  [1] نجمة واحدة
  *[other] { $rating } نجوم
}

comments-addAReviewForm-rteLabel = إضافة مراجعة (اختياري)

comments-addAReviewForm-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

comments-addAReviewFormFake-rte =
  .placeholder = { comments-addAReviewForm-rteLabel }

stream-footer-links-top-of-article = أعلى الصفحة
  .title = الانتقال إلى أعلى الصفحة
stream-footer-links-top-of-comments = أعلى التعليقات
  .title = الانتقال إلى أعلى التعليقات
stream-footer-links-profile = الملف الشخصي والردود
  .title = الانتقال إلى الملف الشخصي والردود
stream-footer-links-discussions = المزيد من النقاشات
  .title = الانتقال إلى المزيد من النقاشات
stream-footer-navigation =
  .aria-label = تذييل التعليقات

## Notifications

notifications-title = الإشعارات
notifications-loadMore = تحميل المزيد
notifications-loadNew = تحميل الجديد

notifications-adjustPreferences = ضبط إعدادات الإشعارات في ملفي الشخصي &gt;<button>التفضيلات.</button>

notification-comment-toggle-default-open = - التعليق
notification-comment-toggle-default-closed = + التعليق

notifications-comment-showRemovedComment = + إظهار التعليق المحذوف
notifications-comment-hideRemovedComment = - إخفاء التعليق المحذوف

notification-comment-description-featured = تم تمييز تعليقك على "{ $title }" من قبل أحد أعضاء فريقنا.
notification-comment-description-default = على "{ $title }"
notification-comment-media-image = صورة
notification-comment-media-embed = تضمين
notification-comment-media-gif = Gif

notifications-yourIllegalContentReportHasBeenReviewed =
  تمت مراجعة بلاغك عن محتوى غير قانوني
notifications-yourCommentHasBeenRejected =
  تم رفض تعليقك
notifications-yourCommentHasBeenApproved =
  تم قبول تعليقك
notifications-yourPreviouslyRejectedCommentHasBeenApproved =
  تم رفض تعليقك سابقاً. وقد تم قبوله الآن.
notifications-yourCommentHasBeenFeatured =
  تم تمييز تعليقك
notifications-yourCommentHasReceivedAReply =
  رد جديد من { $author }
notifications-defaultTitle = إشعار

notifications-rejectedComment-body =
  محتوى تعليقك مخالف لإرشادات مجتمعنا. تم إزالة التعليق.
notifications-rejectedComment-wasPending-body =
  محتوى تعليقك مخالف لإرشادات مجتمعنا.
notifications-reasonForRemoval = سبب الإزالة
notifications-legalGrounds = الأسس القانونية
notifications-additionalExplanation = توضيح إضافي

notifications-repliedComment-hideReply = - إخفاء الرد
notifications-repliedComment-showReply = + إظهار الرد
notifications-repliedComment-hideOriginalComment = - إخفاء تعليقي الأصلي
notifications-repliedComment-showOriginalComment = + إظهار تعليقي الأصلي

notifications-dsaReportLegality-legal = محتوى قانوني
notifications-dsaReportLegality-illegal = محتوى يُحتمل أنه غير قانوني
notifications-dsaReportLegality-unknown = غير معروف

notifications-rejectionReason-offensive = يحتوي هذا التعليق على لغة مسيئة
notifications-rejectionReason-abusive = يحتوي هذا التعليق على لغة مؤذية
notifications-rejectionReason-spam = هذا التعليق محتوى مزعج
notifications-rejectionReason-bannedWord = كلمة محظورة
notifications-rejectionReason-ad = هذا التعليق إعلان
notifications-rejectionReason-illegalContent = يحتوي هذا التعليق على محتوى يُحتمل أنه غير قانوني
notifications-rejectionReason-harassmentBullying = يحتوي هذا التعليق على تحرش أو تنمر
notifications-rejectionReason-misinformation = يحتوي هذا التعليق على معلومات مضللة
notifications-rejectionReason-hateSpeech = يحتوي هذا التعليق على خطاب كراهية
notifications-rejectionReason-irrelevant = هذا التعليق غير ذي صلة بالنقاش
notifications-rejectionReason-other = أخرى
notifications-rejectionReason-other-customReason = أخرى - { $customReason }
notifications-rejectionReason-unknown = غير معروف

notifications-reportDecisionMade-legal =
  في <strong>{ $date }</strong> أبلغت عن تعليق كتبه <strong>{ $author }</strong> لاحتوائه على محتوى يُحتمل أنه غير قانوني. بعد مراجعة بلاغك، قرر فريق الإشراف أن هذا التعليق <strong>لا يبدو أنه يحتوي على محتوى غير قانوني.</strong> شكراً لمساعدتك في الحفاظ على أمان مجتمعنا.
notifications-reportDecisionMade-illegal =
  في <strong>{ $date }</strong> أبلغت عن تعليق كتبه <strong>{ $author }</strong> لاحتوائه على محتوى يُحتمل أنه غير قانوني. بعد مراجعة بلاغك، قرر فريق الإشراف أن هذا التعليق <strong>يحتوي على محتوى غير قانوني</strong> وتم إزالته. شكراً لمساعدتك في الحفاظ على أمان مجتمعنا.

notifications-methodOfRedress-none =
  جميع قرارات الإشراف نهائية ولا يمكن الطعن فيها
notifications-methodOfRedress-email =
  للطعن في قرار يظهر هنا، يرجى التواصل مع <a>{ $email }</a>
notifications-methodOfRedress-url =
  للطعن في قرار يظهر هنا، يرجى زيارة <a>{ $url }</a>

notifications-youDoNotCurrentlyHaveAny = لا توجد لديك إشعارات حالياً

notifications-floatingIcon-close = إغلاق

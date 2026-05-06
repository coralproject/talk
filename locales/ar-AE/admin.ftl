### Localization for Admin

## General
general-notAvailable = غير متاح
general-none = لا شيء
general-noTextContent = لا يوجد محتوى نصي
general-archived = مؤرشف

## Story Status
storyStatus-open = مفتوح
storyStatus-closed = مغلق
storyStatus-archiving = جارٍ الأرشفة
storyStatus-archived = مؤرشف
storyStatus-unarchiving = جارٍ إلغاء الأرشفة

## Roles
role-admin = مدير
role-moderator = مشرف
role-siteModerator = مشرف موقع
role-organizationModerator = مشرف مؤسسة
role-staff = فريق العمل
role-member = عضو
role-commenter = معلّق

role-plural-admin = مديرون
role-plural-moderator = مشرفون
role-plural-staff = فريق العمل
role-plural-member = أعضاء
role-plural-commenter = معلّقون

comments-react =
  .aria-label = {$count ->
    [0] {$reaction} تعليق {$username}
    *[other] {$reaction} ({$count}) تعليق {$username}
  }
comments-reacted =
  .aria-label = {$count ->
    [0] {$reaction} تعليق {$username}
    [one] {$reaction} تعليق {$username}
    *[other] {$reaction} ({$count}) تعليق {$username}
  }

## components
admin-paginatedSelect-filter =
  .aria-label = تصفية النتائج

## User Statuses
userStatus-active = نشط
userStatus-banned = محظور
userStatus-siteBanned = محظور من الموقع
userStatus-banned-all = محظور (الكل)
userStatus-banned-count = محظور ({$count})
userStatus-suspended = معلّق
userStatus-premod = إشراف مسبق دائم
userStatus-warned = تم تحذيره

# Queue Sort
queue-sortMenu-newest = الأحدث
queue-sortMenu-oldest = الأقدم

## Navigation
navigation-moderate = الإشراف
navigation-community = المجتمع
navigation-stories = المقالات
navigation-configure = الإعدادات
navigation-dashboard = لوحة المعلومات
navigation-reports = تقارير DSA

## User Menu
userMenu-signOut = تسجيل الخروج
userMenu-viewLatestRelease = عرض آخر إصدار
userMenu-reportBug = الإبلاغ عن خطأ أو إرسال ملاحظات
userMenu-popover =
  .description = نافذة قائمة المستخدم مع الروابط والإجراءات ذات الصلة

## Restricted
restricted-currentlySignedInTo = مسجّل الدخول حالياً إلى
restricted-noPermissionInfo = ليس لديك صلاحية الوصول إلى هذه الصفحة.
restricted-signedInAs = أنت مسجّل الدخول بصفة: <strong>{ $username }</strong>
restricted-signInWithADifferentAccount = تسجيل الدخول بحساب مختلف
restricted-contactAdmin = إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول للمساعدة.

## Login

login-signInTo = تسجيل الدخول إلى
login-signIn-enterAccountDetailsBelow = أدخل تفاصيل حسابك أدناه

login-emailAddressLabel = عنوان البريد الإلكتروني
login-emailAddressTextField =
  .placeholder = عنوان البريد الإلكتروني

login-signIn-passwordLabel = كلمة المرور
login-signIn-passwordTextField =
  .placeholder = كلمة المرور

login-signIn-signInWithEmail = تسجيل الدخول بالبريد الإلكتروني
login-orSeparator = أو
login-signIn-forgot-password = هل نسيت كلمة المرور؟

login-signInWithFacebook = تسجيل الدخول بفيسبوك
login-signInWithGoogle = تسجيل الدخول بجوجل
login-signInWithOIDC = تسجيل الدخول بـ { $name }

createUsername-createUsernameHeader = إنشاء اسم مستخدم
createUsername-whatItIs =
  اسم المستخدم هو المعرّف الذي سيظهر في جميع تعليقاتك.
createUsername-createUsernameButton = إنشاء اسم مستخدم
createUsername-usernameLabel = اسم المستخدم
createUsername-usernameDescription = يمكنك استخدام "_" و "." المسافات غير مسموح بها.
createUsername-usernameTextField =
  .placeholder = اسم المستخدم

addEmailAddress-addEmailAddressHeader = إضافة عنوان بريد إلكتروني
addEmailAddress-emailAddressLabel = عنوان البريد الإلكتروني
addEmailAddress-emailAddressTextField =
  .placeholder = عنوان البريد الإلكتروني
addEmailAddress-confirmEmailAddressLabel = تأكيد عنوان البريد الإلكتروني
addEmailAddress-confirmEmailAddressTextField =
  .placeholder = تأكيد عنوان البريد الإلكتروني
addEmailAddress-whatItIs =
  لمزيد من الأمان، نطلب من المستخدمين إضافة عنوان بريد إلكتروني إلى حساباتهم.
addEmailAddress-addEmailAddressButton =
  إضافة عنوان بريد إلكتروني

createPassword-createPasswordHeader = إنشاء كلمة مرور
createPassword-whatItIs =
  لحماية حسابك من التغييرات غير المصرح بها، نطلب من المستخدمين إنشاء كلمة مرور.
createPassword-createPasswordButton =
  إنشاء كلمة مرور
createPassword-passwordLabel = كلمة المرور
createPassword-passwordDescription = يجب أن تكون {$minLength} حرفاً على الأقل
createPassword-passwordTextField =
  .placeholder = كلمة المرور

forgotPassword-forgotPasswordHeader = هل نسيت كلمة المرور؟
forgotPassword-checkEmailHeader = تحقق من بريدك الإلكتروني
forgotPassword-gotBackToSignIn = العودة إلى صفحة تسجيل الدخول
forgotPassword-checkEmail-receiveEmail =
  إذا كان هناك حساب مرتبط بـ <strong>{ $email }</strong>،
  فستتلقى بريداً إلكترونياً يتضمن رابطاً لإنشاء كلمة مرور جديدة.
forgotPassword-enterEmailAndGetALink =
  أدخل عنوان بريدك الإلكتروني أدناه وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
forgotPassword-emailAddressLabel = عنوان البريد الإلكتروني
forgotPassword-emailAddressTextField =
  .placeholder = عنوان البريد الإلكتروني
forgotPassword-sendEmailButton = إرسال بريد إلكتروني

linkAccount-linkAccountHeader = ربط الحساب
linkAccount-alreadyAssociated =
  البريد الإلكتروني <strong>{ $email }</strong>
  مرتبط بالفعل بحساب آخر. إذا كنت ترغب في ربط الحسابين، أدخل كلمة المرور.
linkAccount-passwordLabel = كلمة المرور
linkAccount-passwordTextField =
  .label = كلمة المرور
linkAccount-linkAccountButton = ربط الحساب
linkAccount-useDifferentEmail = استخدام عنوان بريد إلكتروني مختلف

## Configure

configure-experimentalFeature = ميزة تجريبية

configure-unsavedInputWarning =
  لديك تغييرات غير محفوظة. هل أنت متأكد أنك تريد المتابعة؟

configure-sideBarNavigation-general = عام
configure-sideBarNavigation-authentication = المصادقة
configure-sideBarNavigation-moderation = الإشراف
configure-sideBarNavigation-moderation-comments = التعليقات
configure-sideBarNavigation-moderation-users = المستخدمون
configure-sideBarNavigation-organization = المؤسسة
configure-sideBarNavigation-moderationPhases = مراحل الإشراف
configure-sideBarNavigation-advanced = متقدم
configure-sideBarNavigation-email = البريد الإلكتروني
configure-sideBarNavigation-bannedAndSuspectWords = الكلمات المحظورة والمشتبه بها
configure-sideBarNavigation-slack = Slack
configure-sideBarNavigation-webhooks = Webhooks

configure-sideBar-saveChanges = حفظ التغييرات
configure-configurationSubHeader = الإعدادات
configure-onOffField-on = مفعّل
configure-onOffField-off = معطّل
configure-radioButton-allow = السماح
configure-radioButton-dontAllow = عدم السماح

### Moderation Phases

configure-moderationPhases-generatedAt = تم إنشاء المفتاح في:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-moderationPhases-phaseNotFound = مرحلة الإشراف الخارجية غير موجودة
configure-moderationPhases-experimentalFeature =
  ميزة مراحل الإشراف المخصصة قيد التطوير حالياً.
  يرجى <ContactUsLink>التواصل معنا لأي ملاحظات أو طلبات</ContactUsLink>.
configure-moderationPhases-header-title = مراحل الإشراف
configure-moderationPhases-description =
  إعداد مرحلة إشراف خارجية لأتمتة بعض إجراءات الإشراف.
  ستكون طلبات الإشراف بصيغة JSON وموقّعة. لمعرفة المزيد
  عن طلبات الإشراف، زر <externalLink>الوثائق</externalLink>.
configure-moderationPhases-addExternalModerationPhaseButton =
  إضافة مرحلة إشراف خارجية
configure-moderationPhases-moderationPhases = مراحل الإشراف
configure-moderationPhases-name = الاسم
configure-moderationPhases-status = الحالة
configure-moderationPhases-noExternalModerationPhases =
  لا توجد مراحل إشراف خارجية معدّة، أضف واحدة أعلاه.
configure-moderationPhases-enabledModerationPhase = مفعّل
configure-moderationPhases-disableModerationPhase = معطّل
configure-moderationPhases-detailsButton = التفاصيل <icon></icon>
configure-moderationPhases-addExternalModerationPhase = إضافة مرحلة إشراف خارجية
configure-moderationPhases-updateExternalModerationPhaseButton = تحديث التفاصيل
configure-moderationPhases-cancelButton = إلغاء
configure-moderationPhases-format = صيغة نص التعليق
configure-moderationPhases-endpointURL = رابط الاستدعاء
configure-moderationPhases-timeout = المهلة
configure-moderationPhases-timeout-details =
  المدة التي سينتظرها كورال للحصول على استجابة الإشراف بالمللي ثانية.
configure-moderationPhases-format-details =
  الصيغة التي سيرسل بها كورال نص التعليق. افتراضياً، يرسل كورال
  التعليق بصيغة HTML المشفرة الأصلية. إذا تم اختيار "نص عادي"،
  سيتم إرسال النسخة المجردة من HTML بدلاً من ذلك.
configure-moderationPhases-format-html = HTML
configure-moderationPhases-format-plain = نص عادي
configure-moderationPhases-endpointURL-details =
  الرابط الذي سيتم إرسال طلبات إشراف كورال إليه عبر POST.
  يجب أن يستجيب الرابط المقدم خلال المهلة المحددة وإلا سيتم تخطي قرار الإشراف.
configure-moderationPhases-configureExternalModerationPhase =
  إعداد مرحلة الإشراف الخارجية
configure-moderationPhases-phaseDetails = تفاصيل المرحلة
configure-moderationPhases-phaseStatus = حالة المرحلة
configure-moderationPhases-signingSecret = مفتاح التوقيع
configure-moderationPhases-signingSecretDescription =
  يُستخدم مفتاح التوقيع التالي لتوقيع حمولات الطلبات المرسلة
  إلى الرابط. لمعرفة المزيد عن توقيع Webhook، زر <externalLink>الوثائق</externalLink>.
configure-moderationPhases-dangerZone = منطقة خطرة
configure-moderationPhases-rotateSigningSecret = تدوير مفتاح التوقيع
configure-moderationPhases-rotateSigningSecretDescription =
  سيسمح لك تدوير مفتاح التوقيع باستبدال مفتاح التوقيع المستخدم في الإنتاج بأمان مع تأخير.
configure-moderationPhases-rotateSigningSecretButton = تدوير مفتاح التوقيع

configure-moderationPhases-disableExternalModerationPhase = تعطيل مرحلة الإشراف الخارجية
configure-moderationPhases-disableExternalModerationPhaseDescription =
  مرحلة الإشراف الخارجية هذه مفعّلة حالياً. بتعطيلها، لن يتم إرسال استعلامات إشراف جديدة إلى الرابط المقدم.
configure-moderationPhases-disableExternalModerationPhaseButton = تعطيل المرحلة
configure-moderationPhases-enableExternalModerationPhase = تفعيل مرحلة الإشراف الخارجية
configure-moderationPhases-enableExternalModerationPhaseDescription =
  مرحلة الإشراف الخارجية هذه معطّلة حالياً. بتفعيلها، سيتم إرسال استعلامات إشراف جديدة إلى الرابط المقدم.
configure-moderationPhases-enableExternalModerationPhaseButton = تفعيل المرحلة
configure-moderationPhases-deleteExternalModerationPhase = حذف مرحلة الإشراف الخارجية
configure-moderationPhases-deleteExternalModerationPhaseDescription =
  سيؤدي حذف مرحلة الإشراف الخارجية هذه إلى إيقاف إرسال استعلامات إشراف جديدة إلى هذا الرابط وإزالة جميع الإعدادات المرتبطة.
configure-moderationPhases-deleteExternalModerationPhaseButton = حذف المرحلة
configure-moderationPhases-rotateSigningSecretHelper =
  بعد انتهاء صلاحيته، لن يتم إنشاء توقيعات بالمفتاح القديم.
configure-moderationPhases-expiresOldSecret = انتهاء صلاحية المفتاح القديم
configure-moderationPhases-expiresOldSecretImmediately = فوراً
configure-moderationPhases-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] ساعة واحدة
    *[other] { $hours } ساعات
  } من الآن
configure-moderationPhases-rotateSigningSecretSuccessUseNewSecret =
  تم تدوير مفتاح توقيع مرحلة الإشراف الخارجية. يرجى تحديث تكاملاتك لاستخدام المفتاح الجديد أدناه.
configure-moderationPhases-confirmDisable =
  سيؤدي تعطيل مرحلة الإشراف الخارجية هذه إلى إيقاف إرسال استعلامات إشراف جديدة إلى هذا الرابط. هل أنت متأكد أنك تريد المتابعة؟
configure-moderationPhases-confirmEnable =
  سيبدأ تفعيل مرحلة الإشراف الخارجية بإرسال استعلامات إشراف إلى هذا الرابط. هل أنت متأكد أنك تريد المتابعة؟
configure-moderationPhases-confirmDelete =
  سيؤدي حذف مرحلة الإشراف الخارجية هذه إلى إيقاف إرسال استعلامات إشراف جديدة إلى هذا الرابط وإزالة جميع الإعدادات المرتبطة. هل أنت متأكد أنك تريد المتابعة؟

### Webhooks

configure-webhooks-generatedAt = تم إنشاء المفتاح في:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-webhooks-experimentalFeature =
  ميزة Webhook قيد التطوير حالياً. قد يتم إضافة أو إزالة أحداث.
  يرجى <ContactUsLink>التواصل معنا لأي ملاحظات أو طلبات</ContactUsLink>.
configure-webhooks-webhookEndpointNotFound = نقطة نهاية Webhook غير موجودة
configure-webhooks-header-title = إعداد نقطة نهاية Webhook
configure-webhooks-description =
  إعداد نقطة نهاية لإرسال الأحداث إليها عند حدوثها في كورال.
  ستكون هذه الأحداث بصيغة JSON وموقّعة. لمعرفة المزيد عن توقيع
  Webhook، زر <externalLink>دليل Webhook</externalLink>.
configure-webhooks-addEndpoint = إضافة نقطة نهاية Webhook
configure-webhooks-addEndpointButton = إضافة نقطة نهاية Webhook
configure-webhooks-endpoints = نقاط النهاية
configure-webhooks-url = الرابط
configure-webhooks-status = الحالة
configure-webhooks-noEndpoints = لا توجد نقاط نهاية Webhook معدّة، أضف واحدة أعلاه.
configure-webhooks-enabledWebhookEndpoint = مفعّل
configure-webhooks-disabledWebhookEndpoint = معطّل
configure-webhooks-endpointURL = رابط نقطة النهاية
configure-webhooks-cancelButton = إلغاء
configure-webhooks-updateWebhookEndpointButton = تحديث نقطة نهاية Webhook
configure-webhooks-eventsToSend = الأحداث المرسلة
configure-webhooks-clearEventsToSend = مسح
configure-webhooks-eventsToSendDescription =
  هذه هي الأحداث المسجلة لنقطة النهاية هذه. زر
  <externalLink>دليل Webhook</externalLink> لمخطط هذه الأحداث.
  سيتم إرسال أي حدث يطابق ما يلي إلى نقطة النهاية إذا كانت مفعّلة:
configure-webhooks-allEvents =
  ستتلقى نقطة النهاية جميع الأحداث، بما فيها المضافة مستقبلاً.
configure-webhooks-selectedEvents =
  { $count } { $count ->
    [1] حدث
    *[other] أحداث
  } محدد.
configure-webhooks-selectAnEvent =
  حدد الأحداث أعلاه أو <button>استقبل جميع الأحداث</button>.
configure-webhooks-configureWebhookEndpoint = إعداد نقطة نهاية Webhook
configure-webhooks-confirmEnable =
  سيبدأ تفعيل نقطة نهاية Webhook بإرسال الأحداث إلى هذا الرابط. هل أنت متأكد أنك تريد المتابعة؟
configure-webhooks-confirmDisable =
  سيؤدي تعطيل نقطة النهاية هذه إلى إيقاف إرسال أحداث جديدة إلى هذا الرابط. هل أنت متأكد أنك تريد المتابعة؟
configure-webhooks-confirmDelete =
  سيؤدي حذف نقطة النهاية هذه إلى إيقاف إرسال أحداث جديدة إلى هذا الرابط وإزالة جميع الإعدادات المرتبطة. هل أنت متأكد أنك تريد المتابعة؟
configure-webhooks-dangerZone = منطقة خطرة
configure-webhooks-rotateSigningSecret = تدوير مفتاح التوقيع
configure-webhooks-rotateSigningSecretDescription =
  سيسمح لك تدوير مفتاح التوقيع باستبدال مفتاح التوقيع المستخدم في الإنتاج بأمان مع تأخير.
configure-webhooks-rotateSigningSecretButton = تدوير مفتاح التوقيع
configure-webhooks-rotateSigningSecretHelper =
  بعد انتهاء صلاحيته، لن يتم إنشاء توقيعات بالمفتاح القديم.
configure-webhooks-rotateSigningSecretSuccessUseNewSecret =
  تم تدوير مفتاح توقيع نقطة نهاية Webhook. يرجى تحديث تكاملاتك لاستخدام المفتاح الجديد أدناه.
configure-webhooks-disableEndpoint = تعطيل نقطة النهاية
configure-webhooks-disableEndpointDescription =
  نقطة النهاية هذه مفعّلة حالياً. بتعطيلها لن يتم إرسال أحداث جديدة إلى الرابط المقدم.
configure-webhooks-disableEndpointButton = تعطيل نقطة النهاية
configure-webhooks-enableEndpoint = تفعيل نقطة النهاية
configure-webhooks-enableEndpointDescription =
  نقطة النهاية هذه معطّلة حالياً. بتفعيلها سيتم إرسال أحداث جديدة إلى الرابط المقدم.
configure-webhooks-enableEndpointButton = تفعيل نقطة النهاية
configure-webhooks-deleteEndpoint = حذف نقطة النهاية
configure-webhooks-deleteEndpointDescription =
  سيؤدي حذف نقطة النهاية إلى منع إرسال أحداث جديدة إلى الرابط المقدم.
configure-webhooks-deleteEndpointButton = حذف نقطة النهاية
configure-webhooks-endpointStatus = حالة نقطة النهاية
configure-webhooks-signingSecret = مفتاح التوقيع
configure-webhooks-signingSecretDescription =
  يُستخدم مفتاح التوقيع التالي لتوقيع حمولات الطلبات المرسلة
  إلى الرابط. لمعرفة المزيد عن توقيع Webhook، زر
  <externalLink>دليل Webhook</externalLink>.
configure-webhooks-expiresOldSecret = انتهاء صلاحية المفتاح القديم
configure-webhooks-expiresOldSecretImmediately = فوراً
configure-webhooks-expiresOldSecretHoursFromNow =
  { $hours ->
    [1] ساعة واحدة
    *[other] { $hours } ساعات
  } من الآن
configure-webhooks-detailsButton = التفاصيل <icon></icon>

### General
configure-general-guidelines-title = ملخص إرشادات المجتمع
configure-general-guidelines-explanation =
  سيظهر هذا فوق التعليقات على مستوى الموقع.
  يمكنك تنسيق النص باستخدام Markdown.
  مزيد من المعلومات حول استخدام Markdown هنا: <externalLink>https://www.markdownguide.org/cheat-sheet/</externalLink>
configure-general-guidelines-showCommunityGuidelines = إظهار ملخص إرشادات المجتمع

configure-general-memberBio-title = نبذة المعلّقين
configure-general-memberBio-explanation = السماح للمعلّقين بإضافة نبذة تعريفية إلى ملفهم الشخصي.
configure-general-memberBio-label = السماح بنبذات المعلّقين

configure-general-locale-language = اللغة
configure-general-locale-chooseLanguage = اختر لغة مجتمع كورال الخاص بك.
configure-general-locale-invalidLanguage = اللغة المختارة سابقاً <lang></lang> لم تعد موجودة. يرجى اختيار لغة مختلفة.

configure-general-sitewideCommenting-title = التعليق على مستوى الموقع
configure-general-sitewideCommenting-explanation =
  فتح أو إغلاق سلاسل التعليقات للتعليقات الجديدة على مستوى الموقع.
configure-general-sitewideCommenting-enableNewCommentsSitewide = تفعيل التعليقات الجديدة على مستوى الموقع
configure-general-sitewideCommenting-onCommentStreamsOpened = مفعّل - سلاسل التعليقات مفتوحة للتعليقات الجديدة
configure-general-sitewideCommenting-offCommentStreamsClosed = معطّل - سلاسل التعليقات مغلقة للتعليقات الجديدة
configure-general-sitewideCommenting-message = رسالة إغلاق التعليقات على مستوى الموقع
configure-general-sitewideCommenting-messageExplanation = اكتب رسالة تُعرض عند إغلاق سلاسل التعليقات على مستوى الموقع

configure-general-embedLinks-title = الوسائط المضمّنة
configure-general-embedLinks-desc =
configure-general-embedLinks-description =
configure-general-embedLinks-description-addASinglePiece = السماح للمعلّقين بإضافة وسائط مضمّنة واحدة في نهاية التعليق
configure-general-embedLinks-enableTwitterEmbeds = السماح بتضمين منشورات X
configure-general-embedLinks-enableBlueskyEmbeds = السماح بتضمين منشورات Bluesky
configure-general-embedLinks-enableYouTubeEmbeds = السماح بتضمين YouTube
configure-general-embedLinks-enableGifs = السماح بصور GIF
configure-general-embedLinks-enableExternalEmbeds = تفعيل الوسائط الخارجية
configure-general-embedLinks-On = نعم
configure-general-embedLinks-Off = لا

configure-general-embedLinks-giphyMaxRating = تصنيف محتوى GIF
configure-general-embedLinks-giphyMaxRating-desc = حدد أقصى تصنيف محتوى لصور GIF
configure-general-embedLinks-giphyMaxRating-g = G
configure-general-embedLinks-giphyMaxRating-g-desc = محتوى مناسب لجميع الأعمار
configure-general-embedLinks-giphyMaxRating-pg = PG
configure-general-embedLinks-giphyMaxRating-pg-desc = محتوى آمن بشكل عام للجميع
configure-general-embedLinks-giphyMaxRating-pg13 = PG-13
configure-general-embedLinks-giphyMaxRating-pg13-desc = تلميحات جنسية خفيفة، ألفاظ خفيفة، أو صور تهديدية
configure-general-embedLinks-giphyMaxRating-r = R
configure-general-embedLinks-giphyMaxRating-r-desc = لغة قوية، تلميحات جنسية قوية؛ غير مناسب للمراهقين
configure-general-embedLinks-configuration = الإعدادات
configure-general-embedLinks-gifProvider = مزوّد GIF
configure-general-embedLinks-gifProvider-desc = يحدد المزوّد الذي سيبحث منه المعلّقون عن صور GIF
configure-general-embedLinks-gifs-provider-Giphy = Giphy
configure-general-embedLinks-gifs-provider-Tenor = Tenor
configure-general-embedLinks-configuration-desc =
configure-general-embedLinks-configuration-giphy-desc = لمزيد من المعلومات عن واجهة GIPHY البرمجية زر: <externalLink>https://developers.giphy.com/docs/api</externalLink>
configure-general-embedLinks-giphyAPIKey = مفتاح GIPHY API
configure-general-embedLinks-configuration-tenor-desc = لمزيد من المعلومات عن واجهة TENOR البرمجية زر: <externalLink>https://developers.google.com/tenor/guides/endpoints</externalLink>
configure-general-embedLinks-tenorAPIKey = مفتاح TENOR API

configure-general-announcements-title = إعلان المجتمع
configure-general-announcements-description = أضف إعلاناً مؤقتاً يظهر أعلى جميع سلاسل تعليقات مؤسستك لفترة محددة.
configure-general-announcements-delete = إزالة الإعلان
configure-general-announcements-add = إضافة إعلان
configure-general-announcements-start = بدء الإعلان
configure-general-announcements-cancel = إلغاء
configure-general-announcements-current-label = الإعلان الحالي
configure-general-announcements-current-duration = سينتهي هذا الإعلان تلقائياً في: { $timestamp }
configure-general-announcements-duration = إظهار هذا الإعلان لمدة

configure-general-closingCommentStreams-title = إغلاق سلاسل التعليقات
configure-general-closingCommentStreams-explanation = تعيين سلاسل التعليقات للإغلاق بعد فترة محددة من نشر المقال
configure-general-closingCommentStreams-closeCommentsAutomatically = إغلاق التعليقات تلقائياً
configure-general-closingCommentStreams-closeCommentsAfter = إغلاق التعليقات بعد

configure-general-commentLength-title = طول التعليق
configure-general-commentLength-maxCommentLength = الحد الأقصى لطول التعليق
configure-general-commentLength-setLimit = تعيين حد أدنى وأقصى لطول التعليق.
configure-general-commentLength-limitCommentLength = تحديد طول التعليق
configure-general-commentLength-minCommentLength = الحد الأدنى لطول التعليق
configure-general-commentLength-characters = حرف
configure-general-commentLength-textField =
  .placeholder = بلا حد
configure-general-commentLength-validateLongerThanMin = يرجى إدخال رقم أكبر من الحد الأدنى

configure-general-commentEditing-title = تعديل التعليقات
configure-general-commentEditing-explanation = تعيين حد زمني لتعديل المعلّقين لتعليقاتهم على مستوى الموقع.
configure-general-commentEditing-commentEditTimeFrame = الإطار الزمني لتعديل التعليق
configure-general-commentEditing-seconds = ثوانٍ

configure-general-flattenReplies-title = تسطيح الردود
configure-general-flattenReplies-enabled = تفعيل تسطيح الردود
configure-general-flattenReplies-explanation = تغيير طريقة عرض مستويات الردود.

configure-general-collapseReplies-title = طي الردود
configure-general-collapseReplies-enabled = تفعيل طي الردود
configure-general-collapseReplies-explanation = عند التفعيل، يتم طي ردود المستوى الأول افتراضياً.

configure-general-featuredBy-title = مميز بواسطة
configure-general-featuredBy-enabled = تفعيل مميز بواسطة
configure-general-featuredBy-explanation = إضافة اسم المشرف لعرض التعليقات المميزة

configure-general-topCommenter-title = شارة المعلّق البارز
configure-general-topCommenter-explanation = إضافة شارة المعلّق البارز للمعلّقين الذين تم تمييز تعليقاتهم خلال آخر 10 أيام
configure-general-topCommenter-enabled = تفعيل شارات المعلّق البارز

configure-general-flairBadge-header = شارات مخصصة
configure-general-flairBadge-description = شجّع تفاعل المستخدمين بإضافة شارات مخصصة لموقعك.
configure-general-flairBadge-enable-label = تفعيل الشارات المخصصة
configure-general-flairBadge-add = رابط الشارة
configure-general-flairBadge-add-helperText = الصق رابط الشارة المخصصة. أنواع الملفات المدعومة: png, jpeg, jpg, gif
configure-general-flairBadge-url-error = الرابط غير صالح أو نوع الملف غير مدعوم.
configure-general-flairBadge-add-name = اسم الشارة
configure-general-flairBadge-add-name-helperText = سمّ الشارة بمعرّف وصفي
configure-general-flairBadge-name-permittedCharacters = يُسمح فقط بالأحرف والأرقام والرموز الخاصة - .
configure-general-flairBadge-add-button = إضافة
configure-general-flairBadge-table-flairName = الاسم
configure-general-flairBadge-table-flairURL = الرابط
configure-general-flairBadge-table-preview = معاينة
configure-general-flairBadge-table-deleteButton = <icon></icon> حذف
configure-general-flairBadge-table-empty = لا توجد شارات مخصصة لهذا الموقع

configure-general-inPageNotifications-title = الإشعارات داخل الصفحة
configure-general-inPageNotifications-explanation = إضافة إشعارات إلى كورال.
configure-general-inPageNotifications-enabled = تفعيل الإشعارات داخل الصفحة
configure-general-inPageNotifications-floatingBellIndicator = مؤشر الجرس العائم

configure-general-closedStreamMessage-title = رسالة سلسلة التعليقات المغلقة
configure-general-closedStreamMessage-explanation = اكتب رسالة تظهر عند إغلاق مقال للتعليق.

### Organization
configure-organization-name = اسم المؤسسة
configure-organization-sites = المواقع
configure-organization-nameExplanation = سيظهر اسم مؤسستك في رسائل البريد الإلكتروني المرسلة من { -product-name } إلى أعضاء مجتمعك ومؤسستك.
configure-organization-sites-explanation = أضف موقعاً جديداً لمؤسستك أو عدّل تفاصيل موقع موجود.
configure-organization-sites-add-site = <icon></icon> إضافة موقع
configure-organization-email = البريد الإلكتروني للمؤسسة
configure-organization-emailExplanation = سيُستخدم هذا البريد الإلكتروني في الرسائل وعبر المنصة ليتمكن أعضاء المجتمع من التواصل مع المؤسسة.
configure-organization-url = رابط المؤسسة
configure-organization-urlExplanation = سيظهر رابط مؤسستك في رسائل البريد الإلكتروني المرسلة من { -product-name } إلى أعضاء مجتمعك ومؤسستك.

### Sites
configure-sites-site-details = التفاصيل <icon></icon>
configure-sites-add-new-site = إضافة موقع جديد إلى { $site }
configure-sites-add-success = تمت إضافة { $site } إلى { $org }
configure-sites-edit-success = تم حفظ التغييرات على { $site }.
configure-sites-site-form-name = اسم الموقع
configure-sites-site-form-name-explanation = سيظهر اسم الموقع في رسائل البريد الإلكتروني المرسلة من كورال.
configure-sites-site-form-url = رابط الموقع
configure-sites-site-form-url-explanation = سيظهر هذا الرابط في رسائل البريد الإلكتروني المرسلة من كورال.
configure-sites-site-form-email = عنوان البريد الإلكتروني للموقع
configure-sites-site-form-domains = النطاقات المسموح بها للموقع
configure-sites-site-form-domains-explanation = النطاقات التي يُسمح بتضمين سلاسل تعليقات كورال فيها.
configure-sites-site-form-submit = <icon></icon> إضافة موقع
configure-sites-site-form-cancel = إلغاء
configure-sites-site-form-save = حفظ التغييرات
configure-sites-site-edit = تعديل تفاصيل { $site }
configure-sites-site-form-embed-code = كود التضمين
sites-emptyMessage = لم نتمكن من العثور على أي مواقع تطابق معاييرك.
sites-selector-allSites = جميع المواقع
site-filter-option-allSites = جميع المواقع
site-selector-all-sites = جميع المواقع
stories-filter-sites-allSites = جميع المواقع
stories-filter-statuses = الحالة
stories-column-site = الموقع
site-table-siteName = اسم الموقع
stories-filter-sites = الموقع
site-search-searchButton =
  .aria-label = بحث
site-search-textField =
  .aria-label = البحث باسم الموقع
  .placeholder = البحث باسم الموقع
site-search-none-found = لم يتم العثور على مواقع بهذا البحث
specificSitesSelect-validation = يجب اختيار موقع واحد على الأقل.

stories-column-actions = الإجراءات
stories-column-rescrape = إعادة الاستخراج
stories-openInfoDrawer =
  .aria-label = فتح لوحة المعلومات
stories-actions-popover =
  .description = قائمة منسدلة لاختيار إجراءات المقال
stories-actions-rescrape = إعادة الاستخراج
stories-actions-close = إغلاق المقال
stories-actions-open = فتح المقال
stories-actions-archive = أرشفة المقال
stories-actions-unarchive = إلغاء أرشفة المقال
stories-actions-isUnarchiving = جارٍ إلغاء الأرشفة

moderate-section-selector-allSections = جميع الأقسام
moderate-section-selector-uncategorized = غير مصنف
moderate-section-uncategorized = غير مصنف

### Email
configure-email = إعدادات البريد الإلكتروني
configure-email-configBoxEnabled = مفعّل
configure-email-fromNameLabel = اسم المرسل
configure-email-fromNameDescription = الاسم كما سيظهر في جميع رسائل البريد الإلكتروني الصادرة
configure-email-fromEmailLabel = عنوان البريد الإلكتروني للمرسل
configure-email-fromEmailDescription = عنوان البريد الإلكتروني الذي سيُستخدم لإرسال الرسائل
configure-email-smtpHostLabel = مضيف SMTP
configure-email-smtpHostDescription = (مثال: smtp.sendgrid.net)
configure-email-smtpPortLabel = منفذ SMTP
configure-email-smtpPortDescription = (مثال: 25)
configure-email-smtpTLSLabel = TLS
configure-email-smtpAuthenticationLabel = مصادقة SMTP
configure-email-smtpCredentialsHeader = بيانات اعتماد البريد الإلكتروني
configure-email-smtpUsernameLabel = اسم المستخدم
configure-email-smtpPasswordLabel = كلمة المرور
configure-email-send-test = إرسال بريد تجريبي

### Authentication
configure-auth-clientID = معرّف العميل
configure-auth-clientSecret = مفتاح العميل السري
configure-auth-configBoxEnabled = مفعّل
configure-auth-targetFilterCoralAdmin = إدارة { -product-name }
configure-auth-targetFilterCommentStream = سلسلة التعليقات
configure-auth-redirectURI = رابط إعادة التوجيه
configure-auth-registration = التسجيل
configure-auth-registrationDescription = السماح للمستخدمين الذين لم يسجلوا سابقاً بإنشاء حساب جديد.
configure-auth-registrationCheckBox = السماح بالتسجيل
configure-auth-pleaseEnableAuthForAdmin = يرجى تفعيل تكامل مصادقة واحد على الأقل لإدارة { -product-name }
configure-auth-confirmNoAuthForCommentStream = لم يتم تفعيل أي تكامل مصادقة لسلسلة التعليقات. هل تريد المتابعة فعلاً؟

configure-auth-facebook-loginWith = تسجيل الدخول بفيسبوك
configure-auth-facebook-toEnableIntegration = لتفعيل التكامل مع مصادقة فيسبوك، تحتاج إلى إنشاء وإعداد تطبيق ويب. لمزيد من المعلومات زر: <Link></Link>.
configure-auth-facebook-useLoginOn = استخدام تسجيل دخول فيسبوك في

configure-auth-google-loginWith = تسجيل الدخول بجوجل
configure-auth-google-toEnableIntegration = لتفعيل التكامل مع مصادقة جوجل تحتاج إلى إنشاء وإعداد تطبيق ويب. لمزيد من المعلومات زر: <Link></Link>.
configure-auth-google-useLoginOn = استخدام تسجيل دخول جوجل في

configure-auth-sso-loginWith = تسجيل الدخول بالدخول الموحد
configure-auth-sso-useLoginOn = استخدام تسجيل الدخول الموحد في
configure-auth-sso-key = المفتاح
configure-auth-sso-regenerate = إعادة التوليد
configure-auth-sso-regenerateAt = تم توليد المفتاح في:
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-regenerateHonoredWarning = عند إعادة توليد مفتاح، سيتم قبول الرموز الموقّعة بالمفتاح السابق لمدة 30 يوماً.
configure-auth-sso-description = لتفعيل التكامل مع نظام المصادقة الحالي، ستحتاج إلى إنشاء رمز JWT للاتصال. راجع <DocLink>وثائقنا</DocLink> لمزيد من المعلومات عن الدخول الموحد.

configure-auth-sso-rotate-keys = المفاتيح
configure-auth-sso-rotate-keyID = معرّف المفتاح
configure-auth-sso-rotate-secret = المفتاح السري
configure-auth-sso-rotate-copySecret =
  .aria-label = نسخ المفتاح السري
configure-auth-sso-rotate-date =
  { DATETIME($date, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric") }
configure-auth-sso-rotate-activeSince = نشط منذ
configure-auth-sso-rotate-inactiveAt = غير نشط في
configure-auth-sso-rotate-inactiveSince = غير نشط منذ
configure-auth-sso-rotate-status = الحالة
configure-auth-sso-rotate-statusActive = نشط
configure-auth-sso-rotate-statusExpiring = ينتهي قريباً
configure-auth-sso-rotate-statusExpired = منتهي الصلاحية
configure-auth-sso-rotate-statusUnknown = غير معروف
configure-auth-sso-rotate-expiringTooltip = مفتاح SSO ينتهي قريباً عندما يكون مجدولاً للتدوير.
configure-auth-sso-rotate-expiringTooltip-toggleButton =
  .aria-label = تبديل ظهور تلميح انتهاء الصلاحية
configure-auth-sso-rotate-expiredTooltip = مفتاح SSO منتهي الصلاحية عندما يتم تدويره خارج الاستخدام.
configure-auth-sso-rotate-expiredTooltip-toggleButton = تبديل ظهور تلميح انتهاء الصلاحية
configure-auth-sso-rotate-rotate = تدوير
configure-auth-sso-rotate-deactivateNow = إلغاء التفعيل الآن
configure-auth-sso-rotate-delete = حذف
configure-auth-sso-rotate-now = الآن
configure-auth-sso-rotate-10seconds = 10 ثوانٍ من الآن
configure-auth-sso-rotate-1day = يوم واحد من الآن
configure-auth-sso-rotate-1week = أسبوع واحد من الآن
configure-auth-sso-rotate-30days = 30 يوماً من الآن
configure-auth-sso-rotate-dropdown-description =
  .description = قائمة منسدلة لتدوير مفتاح SSO

configure-auth-local-loginWith = تسجيل الدخول بالبريد الإلكتروني
configure-auth-local-useLoginOn = استخدام تسجيل الدخول بالبريد الإلكتروني في
configure-auth-local-forceAdminLocalAuth = تم تفعيل المصادقة المحلية للإدارة بشكل دائم.

configure-auth-oidc-loginWith = تسجيل الدخول بـ OpenID Connect
configure-auth-oidc-toLearnMore = لمعرفة المزيد: <Link></Link>
configure-auth-oidc-providerName = اسم المزوّد
configure-auth-oidc-providerNameDescription = مزوّد تكامل OpenID Connect.
configure-auth-oidc-issuer = المُصدِر
configure-auth-oidc-issuerDescription = بعد إدخال معلومات المُصدِر، انقر على زر الاكتشاف ليُكمل { -product-name } الحقول المتبقية.
configure-auth-oidc-authorizationURL = رابط التفويض
configure-auth-oidc-tokenURL = رابط الرمز
configure-auth-oidc-jwksURI = JWKS URI
configure-auth-oidc-useLoginOn = استخدام تسجيل دخول OpenID Connect في

configure-auth-settings = إعدادات الجلسة
configure-auth-settings-session-duration-label = مدة الجلسة

### Moderation

configure-moderation-recentCommentHistory-title = السجل الحديث
configure-moderation-recentCommentHistory-timeFrame = فترة سجل التعليقات الحديثة
configure-moderation-recentCommentHistory-timeFrame-description = المدة المستخدمة لحساب معدل رفض المعلّق.
configure-moderation-recentCommentHistory-enabled = فلتر السجل الحديث
configure-moderation-recentCommentHistory-enabled-description =
  يمنع المخالفين المتكررين من نشر التعليقات بدون موافقة.
  عندما يتجاوز معدل رفض المعلّق الحد المعيّن، تُرسل تعليقاته إلى قائمة المعلّقة لموافقة المشرف.
configure-moderation-recentCommentHistory-triggerRejectionRate = حد معدل الرفض
configure-moderation-recentCommentHistory-triggerRejectionRate-description =
  التعليقات المرفوضة ÷ (التعليقات المرفوضة + التعليقات المنشورة) خلال الفترة أعلاه، كنسبة مئوية.

configure-moderation-externalLinks-title = الروابط الخارجية للمشرفين
configure-moderation-externalLinks-profile-explanation = عند تضمين نمط رابط أدناه، تُضاف روابط ملفات شخصية خارجية في لوحة المستخدم داخل واجهة الإشراف.
configure-moderation-externalLinks-profile-label = نمط رابط الملف الشخصي الخارجي
configure-moderation-externalLinks-profile-input =
  .placeholder = https://example.com/users/$USER_NAME

configure-moderation-preModeration-title = الإشراف المسبق
configure-moderation-preModeration-explanation = عند تفعيل الإشراف المسبق، لن تُنشر التعليقات إلا بعد موافقة المشرف.
configure-moderation-preModeration-moderation = إشراف مسبق على جميع التعليقات
configure-moderation-preModeration-premodLinksEnable = إشراف مسبق على جميع التعليقات التي تحتوي روابط

configure-moderation-specificSites = مواقع محددة
configure-moderation-allSites = جميع المواقع
configure-moderation-apiKey = مفتاح API

configure-moderation-akismet-title = فلتر كشف المحتوى المزعج
configure-moderation-akismet-explanation =
  يُنبّه فلتر Akismet API المستخدمين عندما يُحتمل أن يكون التعليق مزعجاً.
  لن تُنشر التعليقات التي يعتبرها Akismet مزعجة وتُوضع في قائمة المعلّقة لمراجعة المشرف.
configure-moderation-premModeration-premodSuspectWordsEnable = إشراف مسبق على جميع التعليقات التي تحتوي كلمات مشتبه بها
configure-moderation-premModeration-premodSuspectWordsDescription = يمكنك عرض وتعديل قائمة الكلمات المشتبه بها <wordListLink>هنا</wordListLink>

configure-moderation-akismet-filter = فلتر كشف المحتوى المزعج
configure-moderation-akismet-ipBased = كشف المحتوى المزعج حسب IP
configure-moderation-akismet-accountNote = ملاحظة: يجب إضافة نطاقاتك النشطة في حساب Akismet: <externalLink>https://akismet.com/account/</externalLink>
configure-moderation-akismet-siteURL = رابط الموقع

configure-moderation-perspective-title = فلتر التعليقات السامة
configure-moderation-perspective-explanation =
  باستخدام Perspective API، يُنبّه فلتر التعليقات السامة المستخدمين عندما تتجاوز التعليقات حد السمية المحدد.
  التعليقات ذات درجة سمية أعلى من الحد <strong>لن تُنشر</strong> وتُوضع في <strong>قائمة المعلّقة لمراجعة المشرف</strong>.
configure-moderation-perspective-filter = فلتر التعليقات السامة
configure-moderation-perspective-toxicityThreshold = حد السمية
configure-moderation-perspective-toxicityThresholdDescription =
  يمكن تعيين هذه القيمة كنسبة مئوية بين 0 و 100. افتراضياً يتم تعيين الحد عند { $default }.
configure-moderation-perspective-toxicityModel = نموذج السمية
configure-moderation-perspective-toxicityModelDescription = اختر نموذج Perspective الخاص بك. الافتراضي هو { $default }. يمكنك معرفة المزيد <externalLink>هنا</externalLink>.
configure-moderation-perspective-allowStoreCommentData = السماح لجوجل بتخزين بيانات التعليقات
configure-moderation-perspective-allowStoreCommentDataDescription = ستُستخدم التعليقات المخزنة لأبحاث مستقبلية وبناء نماذج مجتمعية لتحسين واجهة API.
configure-moderation-perspective-allowSendFeedback = السماح لكورال بإرسال إجراءات الإشراف إلى جوجل
configure-moderation-perspective-allowSendFeedbackDescription = ستُستخدم إجراءات الإشراف المرسلة لأبحاث مستقبلية وبناء نماذج مجتمعية لتحسين واجهة API.
configure-moderation-perspective-customEndpoint = نقطة نهاية مخصصة
configure-moderation-perspective-defaultEndpoint = افتراضياً نقطة النهاية هي { $default }. يمكنك تجاوزها هنا.
configure-moderation-perspective-accountNote = لمزيد من المعلومات حول إعداد فلتر Perspective زر: <externalLink>https://github.com/conversationai/perspectiveapi#readme</externalLink>

configure-moderation-newCommenters-title = موافقة المعلّقين الجدد
configure-moderation-newCommenters-enable = تفعيل موافقة المعلّقين الجدد
configure-moderation-newCommenters-description = عند التفعيل، تُرسل التعليقات الأولى للمعلّق الجديد إلى قائمة المعلّقة لموافقة المشرف قبل النشر.
configure-moderation-newCommenters-enable-description = تفعيل الإشراف المسبق للمعلّقين الجدد
configure-moderation-newCommenters-approvedCommentsThreshold = عدد التعليقات التي يجب الموافقة عليها
configure-moderation-newCommenters-approvedCommentsThreshold-description = عدد التعليقات التي يجب أن يحصل المستخدم على موافقة عليها قبل أن لا يحتاج للإشراف المسبق
configure-moderation-newCommenters-comments = تعليقات

configure-moderation-unmoderatedCounts-title = أعداد غير المُشرف عليها
configure-moderation-unmoderatedCounts-enabled = إظهار عدد التعليقات غير المُشرف عليها في القائمة

configure-moderation-emailDomains-header = نطاق البريد الإلكتروني
configure-moderation-emailDomains-description = أنشئ قواعد لاتخاذ إجراءات على الحسابات أو التعليقات بناءً على نطاق البريد الإلكتروني.
configure-moderation-emailDomains-add = إضافة نطاق بريد إلكتروني
configure-moderation-emailDomains-edit = تعديل نطاق البريد الإلكتروني
configure-moderation-emailDomains-addDomain = <icon></icon> إضافة نطاق
configure-moderation-emailDomains-table-domain = النطاق
configure-moderation-emailDomains-table-action = الإجراء
configure-moderation-emailDomains-table-edit = <icon></icon> تعديل
configure-moderation-emailDomains-table-delete = <icon></icon> حذف
configure-moderation-emailDomains-form-label-domain = النطاق
configure-moderation-emailDomains-form-label-moderationAction = إجراء الإشراف
configure-moderation-emailDomains-banAllUsers = حظر جميع حسابات المعلّقين الجدد
configure-moderation-emailDomains-alwaysPremod = إشراف مسبق دائم على التعليقات
configure-moderation-emailDomains-form-cancel = إلغاء
configure-moderation-emailDomains-form-addDomain = إضافة نطاق
configure-moderation-emailDomains-form-editDomain = تحديث
configure-moderation-emailDomains-confirmDelete = سيؤدي حذف نطاق البريد الإلكتروني هذا إلى إيقاف حظر أو إشراف مسبق على الحسابات الجديدة. هل تريد المتابعة؟
configure-moderation-emailDomains-form-description-add = أضف نطاقاً وحدد الإجراء المطلوب لكل حساب جديد.
configure-moderation-emailDomains-form-description-edit = حدّث النطاق أو الإجراء لكل حساب جديد يستخدم النطاق المحدد.
configure-moderation-emailDomains-exceptions-header = الاستثناءات
configure-moderation-emailDomains-exceptions-helperText = هذه النطاقات لا يمكن حظرها. يجب كتابة النطاقات بدون www، مثال "gmail.com".
configure-moderation-emailDomains-exceptions-ban-premod-helperText = هذه النطاقات لا يمكن حظرها أو إشراف مسبق عليها.
configure-moderation-emailDomains-showCurrent = إظهار قائمة النطاقات الحالية
configure-moderation-emailDomains-hideCurrent = إخفاء قائمة النطاقات الحالية
configure-moderation-emailDomains-filterByStatus =
  .aria-label = التصفية حسب حالة نطاق البريد الإلكتروني
configuration-moderation-emailDomains-empty = لا توجد نطاقات بريد إلكتروني معدّة.
configure-moderation-emailDomains-allDomains = جميع النطاقات
configure-moderation-emailDomains-preMod = إشراف مسبق
configure-moderation-emailDomains-banned = محظور

configure-moderation-emailDomains-disposableEmailDomains-enabled = نطاقات البريد الإلكتروني المؤقتة
configure-moderation-emailDomains-disposableEmailDomains-helper-text = إذا سجّل مستخدم جديد ببريد إلكتروني مؤقت، يتم تعيين حالته إلى 'إشراف مسبق دائم'.
configure-moderation-emailDomains-disposableEmailDomains-updating = جارٍ التحديث
configure-moderation-emailDomains-disposableEmailDomains-update-button = تحديث النطاقات المؤقتة
configure-moderation-emailDomains-disposableEmailDomains-list-linkText = disposable-email-domains
configure-moderation-emailDomains-disposableEmailDomains-update-button-helper-text = تأتي نطاقات البريد الإلكتروني من قائمة <link></link> المحدّثة بانتظام.

configure-moderation-premoderateEmailAddress-title = عنوان البريد الإلكتروني
configure-moderation-premoderateEmailAddress-enabled = إشراف مسبق على رسائل البريد ذات النقاط الكثيرة
configure-moderation-premoderateEmailAddress-enabled-description = إذا كان لدى المستخدم ثلاث نقاط أو أكثر في الجزء الأول من بريده الإلكتروني، يتم تعيين حالته إلى إشراف مسبق.
configure-moderation-premoderateEmailAliases-enabled = إشراف مسبق على أسماء البريد المستعارة
configure-moderation-premoderateEmailAliases-enabled-description =
configure-moderation-premoderateEmailAliases-enabled-description-ifThePreviousAccountWas =
  إذا سجّل مستخدم بحساب جديد ببريد إلكتروني مستعار (باستخدام علامة +) لحساب موجود، يتم تعيين حالته إلى إشراف مسبق.

configure-wordList-banned-bannedWordsAndPhrases = الكلمات والعبارات المحظورة
configure-wordList-banned-explanation = التعليقات التي تحتوي كلمة أو عبارة من قائمة الكلمات المحظورة <strong>تُرفض تلقائياً ولا تُنشر</strong>.
configure-wordList-banned-wordList = قائمة الكلمات المحظورة
configure-wordList-banned-wordListDetailInstructions = افصل بين الكلمات أو العبارات المحظورة بسطر جديد. الكلمات/العبارات غير حساسة لحالة الأحرف.

configure-wordList-suspect-bannedWordsAndPhrases = الكلمات والعبارات المشتبه بها
configure-wordList-suspect-explanation = التعليقات التي تحتوي كلمة أو عبارة من قائمة الكلمات المشتبه بها <strong>تُوضع في قائمة المُبلَّغ عنها لمراجعة المشرف</strong>.
configure-wordList-suspect-explanationSuspectWordsList = التعليقات التي تحتوي كلمة أو عبارة من قائمة الكلمات المشتبه بها <strong>تُوضع في قائمة المعلّقة لمراجعة المشرف</strong>.
configure-wordList-suspect-wordList = قائمة الكلمات المشتبه بها
configure-wordList-suspect-wordListDetailInstructions = افصل بين الكلمات أو العبارات المشتبه بها بسطر جديد.

### Advanced
configure-advanced-customCSS = CSS مخصص
configure-advanced-customCSS-override = رابط ملف CSS سيتجاوز أنماط سلسلة التضمين الافتراضية.
configure-advanced-customCSS-stylesheetURL = رابط ملف CSS مخصص
configure-advanced-customCSS-fontsStylesheetURL = رابط ملف CSS مخصص لأنماط الخطوط
configure-advanced-customCSS-containsFontFace = رابط ملف CSS مخصص يحتوي جميع تعريفات @font-face

configure-advanced-embeddedComments = التعليقات المضمّنة
configure-advanced-embeddedComments-subheader = للمواقع التي تستخدم oEmbed
configure-advanced-embeddedCommentReplies-explanation = عند التفعيل، سيظهر زر رد مع كل تعليق مضمّن.
configure-advanced-embeddedCommentReplies-label = السماح بالردود على التعليقات المضمّنة

configure-advanced-oembedAllowedOrigins-header = النطاقات المسموح بها لـ oEmbed
configure-advanced-oembedAllowedOrigins-description = النطاقات المسموح لها بإجراء اتصالات بواجهة oEmbed API.
configure-advanced-oembedAllowedOrigins-label = النطاقات المسموح بها لـ oEmbed

configure-advanced-permittedDomains = النطاقات المسموح بها
configure-advanced-permittedDomains-description = النطاقات التي يُسمح بتضمين نسخة { -product-name } فيها.

configure-advanced-liveUpdates = التحديثات المباشرة لسلسلة التعليقات
configure-advanced-liveUpdates-explanation = عند التفعيل، سيتم تحميل وتحديث التعليقات فورياً.

configure-advanced-embedCode-title = كود التضمين
configure-advanced-embedCode-explanation = انسخ والصق الكود أدناه في نظام إدارة المحتوى لتضمين سلاسل تعليقات كورال.
configure-advanced-embedCode-comment = ألغِ تعليق هذه الأسطر واستبدلها بمعرّف المقال ورابطه من نظام إدارة المحتوى.

configure-advanced-amp = صفحات الجوال المسرّعة
configure-advanced-amp-explanation = تفعيل دعم <LinkToAMP>AMP</LinkToAMP> في سلسلة التعليقات.

configure-advanced-for-review-queue = مراجعة جميع بلاغات المستخدمين
configure-advanced-for-review-queue-explanation = بمجرد الموافقة على تعليق، لن يظهر مجدداً في قائمة المُبلَّغ عنها حتى لو أبلغ عنه مستخدمون إضافيون.
configure-advanced-for-review-queue-label = إظهار قائمة "للمراجعة"

## Decision History
decisionHistory-popover =
  .description = نافذة تعرض سجل القرارات
decisionHistory-youWillSeeAList = ستظهر لك قائمة بإجراءات الإشراف التي اتخذتها هنا.
decisionHistory-showMoreButton = إظهار المزيد
decisionHistory-yourDecisionHistory = سجل قراراتك
decisionHistory-rejectedCommentBy = تم رفض تعليق <Username></Username>
decisionHistory-approvedCommentBy = تم قبول تعليق <Username></Username>
decisionHistory-goToComment = الانتقال إلى التعليق

### Slack
configure-slack-header-title = تكاملات Slack
configure-slack-description = إرسال التعليقات تلقائياً من قوائم إشراف كورال إلى قنوات Slack.
configure-slack-notRecommended = غير مُوصى به للمواقع التي تتجاوز 10 آلاف تعليق شهرياً.
configure-slack-addChannel = إضافة قناة
configure-slack-channel-defaultName = قناة جديدة
configure-slack-channel-enabled = مفعّل
configure-slack-channel-remove = إزالة القناة
configure-slack-channel-name-label = الاسم
configure-slack-channel-name-description = هذا لمعلوماتك فقط لتعريف كل اتصال Slack بسهولة.
configure-slack-channel-hookURL-label = رابط Webhook
configure-slack-channel-hookURL-description = يوفر Slack رابطاً خاصاً بالقناة لتفعيل اتصالات Webhook. للعثور على الرابط اتبع التعليمات <externalLink>هنا</externalLink>.
configure-slack-channel-triggers-label = تلقي الإشعارات في قناة Slack هذه عن
configure-slack-channel-triggers-reportedComments = التعليقات المُبلَّغ عنها
configure-slack-channel-triggers-pendingComments = التعليقات المعلّقة
configure-slack-channel-triggers-featuredComments = التعليقات المميزة
configure-slack-channel-triggers-allComments = جميع التعليقات
configure-slack-channel-triggers-staffComments = تعليقات فريق العمل

## Moderate
moderate-navigation-reported = مُبلَّغ عنها
moderate-navigation-pending = معلّقة
moderate-navigation-unmoderated = غير مُشرف عليها
moderate-navigation-rejected = مرفوضة
moderate-navigation-approved = مقبولة
moderate-navigation-comment-count = { SHORT_NUMBER($count) }
moderate-navigation-forReview = للمراجعة

moderate-marker-preMod = إشراف مسبق
moderate-marker-link = رابط
moderate-marker-bannedWord = كلمة محظورة
moderate-marker-bio = النبذة
moderate-marker-illegal = محتوى يُحتمل أنه غير قانوني
moderate-marker-possibleBannedWord = كلمة محظورة محتملة
moderate-marker-suspectWord = كلمة مشتبه بها
moderate-marker-possibleSuspectWord = كلمة مشتبه بها محتملة
moderate-marker-spam = محتوى مزعج
moderate-marker-spamDetected = تم كشف محتوى مزعج
moderate-marker-toxic = سام
moderate-marker-recentHistory = سجل حديث
moderate-marker-bodyCount = عدد النص
moderate-marker-offensive = مسيء
moderate-marker-abusive = مؤذٍ
moderate-marker-newCommenter = معلّق جديد
moderate-marker-repeatPost = تعليق مكرر
moderate-marker-other = أخرى
moderate-marker-preMod-userEmail = بريد المستخدم

moderate-markers-details = التفاصيل
moderate-flagDetails-latestReports = آخر البلاغات
moderate-flagDetails-offensive = مسيء
moderate-flagDetails-abusive = مؤذٍ
moderate-flagDetails-spam = محتوى مزعج
moderate-flagDetails-bio = النبذة
moderate-flagDetails-other = أخرى
moderate-flagDetails-illegalContent = محتوى يُحتمل أنه غير قانوني
moderate-flagDetails-viewDSAReport = عرض تقرير DSA

moderate-card-flag-details-anonymousUser = مستخدم مجهول

moderate-flagDetails-toxicityScore = درجة السمية
moderate-toxicityLabel-likely = مرجّح <score></score>
moderate-toxicityLabel-unlikely = غير مرجّح <score></score>
moderate-toxicityLabel-maybe = ربما <score></score>

moderate-linkDetails-label = نسخ رابط هذا التعليق
moderate-in-stream-link-copy = في السلسلة
moderate-in-moderation-link-copy = في الإشراف

moderate-decisionDetails-decisionLabel = القرار
moderate-decisionDetails-rejected = مرفوض
moderate-decisionDetails-reasonLabel = السبب
moderate-decisionDetails-lawBrokenLabel = القانون المخالَف
moderate-decisionDetails-customReasonLabel = سبب مخصص
moderate-decisionDetails-detailedExplanationLabel = توضيح مفصّل

moderate-emptyQueue-pending = أحسنت! لا توجد تعليقات معلّقة أخرى للإشراف.
moderate-emptyQueue-reported = أحسنت! لا توجد تعليقات مُبلَّغ عنها أخرى للإشراف.
moderate-emptyQueue-unmoderated = أحسنت! تم الإشراف على جميع التعليقات.
moderate-emptyQueue-rejected = لا توجد تعليقات مرفوضة.
moderate-emptyQueue-approved = لا توجد تعليقات مقبولة.

moderate-comment-edited = (تم التعديل)
moderate-comment-inReplyTo = رد على <Username></Username>
moderate-comment-viewContext = عرض السياق
moderate-comment-viewConversation = عرض المحادثة
moderate-comment-rejectButton =
  .aria-label = رفض
moderate-comment-approveButton =
  .aria-label = قبول
moderate-comment-decision = القرار
moderate-comment-story = المقال
moderate-comment-storyLabel = تعليق على
moderate-comment-moderateStory = إشراف على المقال
moderate-comment-featureText = تمييز
moderate-comment-featuredText = مميز
moderate-comment-moderatedBy = أشرف عليه
moderate-comment-moderatedBySystem = النظام
moderate-comment-play-gif = تشغيل GIF
moderate-comment-load-video = تحميل فيديو

moderate-single-goToModerationQueues = الانتقال إلى قوائم الإشراف
moderate-single-singleCommentView = عرض تعليق واحد

moderate-queue-viewNew =
  { $count ->
    [1] عرض تعليق جديد ({$count})
    *[other] عرض تعليقات جديدة ({$count})
  }

moderate-comment-deleted-body = لم يعد هذا التعليق متاحاً. قام المعلّق بحذف حسابه.

### Search Bar
moderate-searchBar-allStories = جميع المقالات
  .title = جميع المقالات
moderate-searchBar-noStories = لم نتمكن من العثور على مقالات تطابق معاييرك
moderate-searchBar-stories = المقالات:
moderate-searchBar-searchButton = بحث
moderate-searchBar-titleNotAvailable =
  .title = العنوان غير متاح
moderate-searchBar-comboBox =
  .aria-label = البحث أو الانتقال إلى مقال
moderate-searchBar-searchForm =
  .aria-label = المقالات
moderate-searchBar-currentlyModerating =
  .title = الإشراف حالياً
moderate-searchBar-searchResults = نتائج البحث
moderate-searchBar-searchResultsMostRecentFirst = نتائج البحث (الأحدث أولاً)
moderate-searchBar-searchResultsMostRelevantFirst = نتائج البحث (الأكثر صلة أولاً)
moderate-searchBar-moderateAllStories = الإشراف على جميع المقالات
moderate-searchBar-comboBoxTextField =
  .aria-label = البحث أو الانتقال إلى مقال...
  .placeholder = البحث بعنوان المقال، الكاتب، الرابط، المعرّف
moderate-searchBar-goTo = الانتقال إلى
moderate-searchBar-seeAllResults = عرض جميع النتائج

moderateCardDetails-tab-info = معلومات
moderateCardDetails-tab-decision = القرار
moderateCardDetails-tab-edits = سجل التعديلات
moderateCardDetails-tab-automatedActions = الإجراءات التلقائية
moderateCardDetails-tab-reactions = التفاعلات
moderateCardDetails-tab-reactions-loadMore = تحميل المزيد
moderateCardDetails-tab-noIssuesFound = لم يتم العثور على مشكلات
moderateCardDetails-tab-missingPhase = لم يتم التشغيل
moderateCardDetails-tab-externalMod-status = الحالة
moderateCardDetails-tab-externalMod-flags = العلامات
moderateCardDetails-tab-externalMod-tags = الوسوم
moderateCardDetails-tab-externalMod-none = لا شيء
moderateCardDetails-tab-externalMod-approved = مقبول
moderateCardDetails-tab-externalMod-rejected = مرفوض
moderateCardDetails-tab-externalMod-premod = إشراف مسبق
moderateCardDetails-tab-externalMod-systemWithheld = محتجز من النظام

### User History Drawer
moderate-user-drawer-email =
  .title = عنوان البريد الإلكتروني
moderate-user-drawer-created-at =
  .title = تاريخ إنشاء الحساب
moderate-user-drawer-member-id =
  .title = معرّف العضو
moderate-user-drawer-external-profile-URL =
  .title = رابط الملف الشخصي الخارجي
moderate-user-drawer-external-profile-URL-link = رابط الملف الشخصي الخارجي
moderate-user-drawer-tab-all-comments = جميع التعليقات
moderate-user-drawer-tab-rejected-comments = المرفوضة
moderate-user-drawer-tab-account-history = سجل الحساب
moderate-user-drawer-tab-notes = الملاحظات
moderate-user-drawer-load-more = تحميل المزيد
moderate-user-drawer-all-no-comments = لم يرسل {$username} أي تعليقات.
moderate-user-drawer-rejected-no-comments = ليس لدى {$username} أي تعليقات مرفوضة.
moderate-user-drawer-user-not-found = المستخدم غير موجود.
moderate-user-drawer-status-label = الحالة:
moderate-user-drawer-bio-title = نبذة العضو
moderate-user-drawer-username-not-available = اسم المستخدم غير متاح
moderate-user-drawer-username-not-available-tooltip-title = اسم المستخدم غير متاح
moderate-user-drawer-username-not-available-tooltip-body = لم يكمل المستخدم عملية إعداد الحساب

moderate-user-drawer-account-history-system = <icon></icon> النظام
moderate-user-drawer-account-history-suspension-ended = انتهى التعليق
moderate-user-drawer-account-history-suspension-removed = تمت إزالة التعليق
moderate-user-drawer-account-history-banned = محظور
moderate-user-drawer-account-history-account-domain-banned =
moderate-user-drawer-account-history-account-domain-or-alias-banned = تم حظر نطاق الحساب أو الاسم المستعار
moderate-user-drawer-account-history-ban-removed = تمت إزالة الحظر
moderate-user-drawer-account-history-site-banned = محظور من الموقع
moderate-user-drawer-account-history-site-ban-removed = تمت إزالة الحظر من الموقع
moderate-user-drawer-account-history-no-history = لم يتم اتخاذ أي إجراءات على هذا الحساب
moderate-user-drawer-username-change = تغيير اسم المستخدم
moderate-user-drawer-username-change-new = جديد:
moderate-user-drawer-username-change-old = قديم:
moderate-user-drawer-account-history-premod-set = إشراف مسبق دائم
moderate-user-drawer-account-history-premod-removed = تمت إزالة الإشراف المسبق
moderate-user-drawer-account-history-modMessage-sent = تم إرسال رسالة للمستخدم
moderate-user-drawer-account-history-modMessage-acknowledged = تم الإقرار بالرسالة في { $acknowledgedAt }
moderate-user-drawer-newCommenter = معلّق جديد

moderate-user-drawer-suspension =
  تعليق، { $value } { $unit ->
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
  }

moderate-user-drawer-deleteAccount-popover =
  .description = قائمة منبثقة لحذف حساب المستخدم
moderate-user-drawer-deleteAccount-button =
  .aria-label = حذف الحساب
moderate-user-drawer-deleteAccount-popover-confirm = اكتب "{ $text }" للتأكيد
moderate-user-drawer-deleteAccount-popover-title = حذف الحساب
moderate-user-drawer-deleteAccount-popover-username = اسم المستخدم
moderate-user-drawer-deleteAccount-popover-header-description = حذف الحساب سيؤدي إلى
moderate-user-drawer-deleteAccount-popover-description-list-removeComments = إزالة جميع التعليقات المكتوبة من هذا المستخدم من قاعدة البيانات.
moderate-user-drawer-deleteAccount-popover-description-list-deleteAll = حذف جميع سجلات هذا الحساب.
moderate-user-drawer-deleteAccount-popover-callout = هذا يزيل جميع سجلات هذا المستخدم
moderate-user-drawer-deleteAccount-popover-timeframe = سيدخل حيز التنفيذ خلال 24 ساعة.
moderate-user-drawer-deleteAccount-popover-cancelButton = إلغاء
moderate-user-drawer-deleteAccount-popover-deleteButton = حذف

moderate-user-drawer-deleteAccount-scheduled-callout = تم تفعيل حذف المستخدم
moderate-user-drawer-deleteAccount-scheduled-timeframe = سيحدث في { $deletionDate }.
moderate-user-drawer-deleteAccount-scheduled-cancelDeletion = إلغاء حذف المستخدم

moderate-user-drawer-user-scheduled-deletion = المستخدم مجدول للحذف
moderate-user-drawer-user-deletion-canceled = تم إلغاء طلب حذف المستخدم

moderate-user-drawer-account-history-deletion-scheduled = تم جدولة الحذف في { $createdAt }
moderate-user-drawer-account-history-canceled-at = تم الإلغاء في { $createdAt }
moderate-user-drawer-account-history-updated-at = تم التحديث في { $createdAt }

moderate-user-drawer-recent-history-title = سجل التعليقات الحديثة
moderate-user-drawer-recent-history-calculated = محسوب خلال آخر { framework-timeago-time }
moderate-user-drawer-recent-history-rejected = مرفوض
moderate-user-drawer-recent-history-tooltip-title = كيف يتم الحساب؟
moderate-user-drawer-recent-history-tooltip-body = التعليقات المرفوضة ÷ (التعليقات المرفوضة + التعليقات المنشورة).
moderate-user-drawer-recent-history-tooltip-button =
  .aria-label = تبديل تلميح سجل التعليقات الحديثة
moderate-user-drawer-recent-history-tooltip-submitted = مُرسل

moderate-user-drawer-notes-field =
  .placeholder = اترك ملاحظة...
moderate-user-drawer-notes-button = إضافة ملاحظة
moderatorNote-left-by = من
moderatorNote-delete = حذف

moderate-user-drawer-all-comments-archiveThreshold-allOfThisUsers =
  جميع تعليقات هذا المستخدم من الفترة السابقة { $value } { $unit ->
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
  }.

moderate-forReview-reviewedButton =
  .aria-label = تمت المراجعة
moderate-forReview-markAsReviewedButton =
  .aria-label = تعليم كتمت المراجعة
moderate-forReview-time = الوقت
moderate-forReview-comment = التعليق
moderate-forReview-reportedBy = أبلغ عنه
moderate-forReview-reason = السبب
moderate-forReview-description = الوصف
moderate-forReview-reviewed = تمت المراجعة

moderate-forReview-detectedBannedWord = كلمة محظورة
moderate-forReview-detectedLinks = روابط
moderate-forReview-detectedNewCommenter = معلّق جديد
moderate-forReview-detectedPreModUser = مستخدم في إشراف مسبق
moderate-forReview-detectedRecentHistory = سجل حديث
moderate-forReview-detectedRepeatPost = منشور مكرر
moderate-forReview-detectedSpam = محتوى مزعج
moderate-forReview-detectedSuspectWord = كلمة مشتبه بها
moderate-forReview-detectedToxic = لغة سامة
moderate-forReview-reportedAbusive = مؤذٍ
moderate-forReview-reportedBio = نبذة المستخدم
moderate-forReview-reportedOffensive = مسيء
moderate-forReview-reportedOther = أخرى
moderate-forReview-reportedSpam = محتوى مزعج

moderate-archived-queue-title = تمت أرشفة هذا المقال
moderate-archived-queue-noModerationActions = لا يمكن اتخاذ إجراءات إشراف على التعليقات عند أرشفة المقال.
moderate-archived-queue-toPerformTheseActions = لتنفيذ هذه الإجراءات، ألغِ أرشفة المقال.

## Community
community-emptyMessage = لم نتمكن من العثور على أي شخص في مجتمعك يطابق معاييرك.

community-filter-searchField =
  .placeholder = البحث باسم المستخدم أو البريد الإلكتروني...
  .aria-label = البحث باسم المستخدم أو البريد الإلكتروني
community-filter-searchButton =
  .aria-label = بحث
community-filter-roleSelectField =
  .aria-label = البحث حسب الدور
community-filter-statusSelectField =
  .aria-label = البحث حسب حالة المستخدم

community-changeRoleButton =
  .aria-label = تغيير الدور

community-assignMySitesToModerator = تعيين مشرف لمواقعي
community-removeMySitesFromModerator = إزالة مشرف من مواقعي
community-assignMySitesToMember = تعيين عضو لمواقعي
community-removeMySitesFromMember = إزالة عضو من مواقعي
community-stillHaveSiteModeratorPrivileges = سيظل يملك صلاحيات مشرف الموقع في:
community-stillHaveMemberPrivileges = سيظل يملك صلاحيات العضو في:
community-userNoLongerPermitted = لن يُسمح للمستخدم باتخاذ قرارات إشراف في:
community-memberNoLongerPermitted = لن يحصل المستخدم على صلاحيات العضو في:
community-assignThisUser = تعيين هذا المستخدم في
community-assignYourSitesTo = تعيين مواقعك لـ <strong>{ $username }</strong>
community-siteModeratorsArePermitted = يُسمح لمشرفي الموقع باتخاذ قرارات إشراف في المواقع المعيّنين لها.
community-membersArePermitted = يُسمح للأعضاء بالحصول على شارة في المواقع المعيّنين لها.
community-removeSiteModeratorPermissions = إزالة صلاحيات مشرف الموقع
community-removeMemberPermissions = إزالة صلاحيات العضو

community-filter-optGroupAudience =
  .label = الجمهور
community-filter-optGroupOrganization =
  .label = المؤسسة
community-filter-search = بحث
community-filter-showMe = إظهار
community-filter-allRoles = جميع الأدوار
community-filter-allStatuses = جميع الحالات

community-column-username = اسم المستخدم
community-column-username-not-available = اسم المستخدم غير متاح
community-column-email-not-available = البريد الإلكتروني غير متاح
community-column-username-deleted = محذوف
community-column-email = البريد الإلكتروني
community-column-memberSince = عضو منذ
community-column-role = الدور
community-column-status = الحالة

community-role-popover =
  .description = قائمة منسدلة لتغيير دور المستخدم
community-siteRoleActions-popover =
  .description = قائمة منسدلة لترقية/تخفيض مستخدم
community-userStatus-popover =
  .description = قائمة منسدلة لتغيير حالة المستخدم

community-userStatus-manageBan = إدارة الحظر
community-userStatus-suspendUser = تعليق المستخدم
community-userStatus-suspend = تعليق
community-userStatus-suspendEverywhere = تعليق في كل مكان
community-userStatus-removeSuspension = إزالة التعليق
community-userStatus-removeUserSuspension = إزالة التعليق
community-userStatus-unknown = غير معروف
community-userStatus-changeButton =
  .aria-label = تغيير حالة المستخدم
community-userStatus-premodUser = إشراف مسبق دائم
community-userStatus-removePremod = إزالة الإشراف المسبق

community-banModal-allSites-title = هل أنت متأكد أنك تريد حظر <username></username>؟
community-banModal-banEmailDomain-title = حظر نطاق البريد الإلكتروني
community-banModal-banEmailDomain = حظر جميع حسابات المعلّقين من { $domain }
community-banModal-banEmailDomain-callOut = سيمنع هذا أي معلّق من استخدام نطاق البريد الإلكتروني هذا
community-banModal-banEmailDomain-confirmationText = اكتب "{ $text }" للتأكيد
community-banModal-specificSites-title = هل أنت متأكد أنك تريد إدارة حالة حظر <username></username>؟
community-banModal-noSites-title = هل أنت متأكد أنك تريد إلغاء حظر <username></username>؟
community-banModal-allSites-consequence = بمجرد الحظر، لن يتمكن هذا المستخدم من التعليق أو التفاعل أو الإبلاغ.
community-banModal-noSites-consequence = بمجرد إلغاء الحظر، سيتمكن هذا المستخدم من التعليق والتفاعل والإبلاغ.
community-banModal-specificSites-consequence = سيؤثر هذا الإجراء على المواقع التي يمكن للمستخدم التعليق فيها.
community-banModal-cancel = إلغاء
community-banModal-updateBan = حفظ
community-banModal-ban = حظر
community-banModal-unban = إلغاء الحظر
community-banModal-customize = تخصيص رسالة بريد الحظر
community-banModal-reject-existing = رفض جميع تعليقات هذا المستخدم
community-banModal-reject-existing-specificSites = رفض جميع التعليقات على هذه المواقع
community-banModal-reject-existing-singleSite = رفض جميع التعليقات على هذا الموقع
community-banModal-noSites = لا مواقع
community-banModal-banFrom = الحظر من
community-banModal-allSites = جميع المواقع
community-banModal-specificSites = مواقع محددة

community-suspendModal-areYouSure = تعليق <strong>{ $username }</strong>؟
community-suspendModal-consequence = بمجرد التعليق، لن يتمكن هذا المستخدم من التعليق أو التفاعل أو الإبلاغ.
community-suspendModal-duration-3600 = ساعة واحدة
community-suspendModal-duration-10800 = 3 ساعات
community-suspendModal-duration-86400 = 24 ساعة
community-suspendModal-duration-604800 = 7 أيام
community-suspendModal-cancel = إلغاء
community-suspendModal-suspendUser = تعليق المستخدم
community-suspendModal-emailTemplate =
  مرحباً { $username },

  وفقاً لإرشادات مجتمع { $organizationName }، تم تعليق حسابك مؤقتاً. خلال فترة التعليق لن تتمكن من التعليق أو الإبلاغ أو التفاعل. يرجى العودة إلى المحادثة خلال { framework-timeago-time }.

community-suspendModal-customize = تخصيص رسالة بريد التعليق
community-suspendModal-success = تم تعليق <strong>{ $username }</strong> لمدة <strong>{ $duration }</strong>
community-suspendModal-success-close = إغلاق
community-suspendModal-selectDuration = اختر مدة التعليق

community-premodModal-areYouSure = هل أنت متأكد أنك تريد تطبيق إشراف مسبق دائم على <strong>{ $username }</strong>؟
community-premodModal-consequence = ستُرسل جميع تعليقاته إلى قائمة المعلّقة حتى تزيل هذه الحالة.
community-premodModal-cancel = إلغاء
community-premodModal-premodUser = نعم، إشراف مسبق دائم

community-siteRoleModal-assignSites = تعيين مواقع لـ <strong>{ $username }</strong>
community-siteRoleModal-assignSitesDescription-siteModerator = يُسمح لمشرفي الموقع باتخاذ قرارات إشراف في المواقع المعيّنين لها.
community-siteRoleModal-cancel = إلغاء
community-siteRoleModal-update = تحديث
community-siteRoleModal-selectSites-siteModerator = اختر مواقع للإشراف
community-siteRoleModal-selectSites-member = اختر مواقع ليكون المستخدم عضواً فيها
community-siteRoleModal-noSites = لا مواقع

community-invite-inviteMember = دعوة أعضاء إلى مؤسستك
community-invite-emailAddressLabel = عنوان البريد الإلكتروني:
community-invite-inviteMore = دعوة المزيد
community-invite-inviteAsLabel = دعوة بصفة:
community-invite-sendInvitations = إرسال الدعوات
community-invite-role-staff = <strong>دور فريق العمل:</strong> يحصل على شارة "فريق العمل"، ويتم قبول التعليقات تلقائياً.
community-invite-role-moderator = <strong>دور المشرف:</strong> يحصل على شارة "فريق العمل"، ويملك صلاحيات إشراف كاملة.
community-invite-role-admin = <strong>دور المدير:</strong> يحصل على شارة "فريق العمل"، ويملك صلاحيات إشراف وإعداد كاملة.
community-invite-invitationsSent = تم إرسال دعواتك!
community-invite-close = إغلاق
community-invite-invite = دعوة

community-warnModal-success = تم إرسال تحذير إلى <strong>{ $username }</strong>.
community-warnModal-success-close = حسناً
community-warnModal-areYouSure = تحذير <strong>{ $username }</strong>؟
community-warnModal-consequence = يمكن للتحذير تحسين سلوك المعلّق بدون تعليق أو حظر.
community-warnModal-message-label = الرسالة
community-warnModal-message-required = مطلوب
community-warnModal-message-description = اشرح لهذا المستخدم كيف يجب أن يغير سلوكه على موقعك.
community-warnModal-cancel = إلغاء
community-warnModal-warnUser = تحذير المستخدم
community-userStatus-warn = تحذير
community-userStatus-warnEverywhere = تحذير في كل مكان
community-userStatus-message = رسالة

community-modMessageModal-success = تم إرسال رسالة إلى <strong>{ $username }</strong>.
community-modMessageModal-success-close = حسناً
community-modMessageModal-areYouSure = مراسلة <strong>{ $username }</strong>؟
community-modMessageModal-consequence = إرسال رسالة إلى المعلّق تكون مرئية له فقط.
community-modMessageModal-message-label = الرسالة
community-modMessageModal-message-required = مطلوب
community-modMessageModal-cancel = إلغاء
community-modMessageModal-messageUser = مراسلة المستخدم

## Stories
stories-emptyMessage = لا توجد مقالات منشورة حالياً.
stories-noMatchMessage = لم نتمكن من العثور على مقالات تطابق معاييرك.
stories-filter-searchField =
  .placeholder = البحث بعنوان المقال أو الكاتب...
  .aria-label = البحث بعنوان المقال أو الكاتب
stories-filter-searchButton =
  .aria-label = بحث
stories-filter-statusSelectField =
  .aria-label = البحث حسب الحالة
stories-changeStatusButton =
  .aria-label = تغيير الحالة
stories-filter-search = بحث
stories-filter-showMe = إظهار
stories-filter-allStories = جميع المقالات
stories-filter-openStories = المقالات المفتوحة
stories-filter-closedStories = المقالات المغلقة
stories-column-title = العنوان
stories-column-author = الكاتب
stories-column-publishDate = تاريخ النشر
stories-column-status = الحالة
stories-column-clickToModerate = انقر على العنوان للإشراف على المقال
stories-column-reportedCount = مُبلَّغ عنها
stories-column-pendingCount = معلّقة
stories-column-publishedCount = منشورة
stories-status-popover =
  .description = قائمة منسدلة لتغيير حالة المقال

storyInfoDrawer-rescrapeTriggered = تم التشغيل
storyInfoDrawer-triggerRescrape = إعادة استخراج البيانات الوصفية
storyInfoDrawer-title = تفاصيل المقال
storyInfoDrawer-titleNotAvailable = عنوان المقال غير متاح
storyInfoDrawer-authorNotAvailable = الكاتب غير متاح
storyInfoDrawer-publishDateNotAvailable = تاريخ النشر غير متاح
storyInfoDrawer-scrapedMetaData = البيانات الوصفية المستخرجة
storyInfoDrawer-configure = الإعدادات
storyInfoDrawer-storyStatus-open = مفتوح
storyInfoDrawer-storyStatus-closed = مغلق
storyInfoDrawer-moderateStory = إشراف
storyInfoDrawerSettings-premodLinksEnable = إشراف مسبق على التعليقات التي تحتوي روابط
storyInfoDrawerSettings-premodCommentsEnable = إشراف مسبق على جميع التعليقات
storyInfoDrawerSettings-moderation = الإشراف
storyInfoDrawerSettings-moderationMode-pre = مسبق
storyInfoDrawerSettings-moderationMode-post = لاحق
storyInfoDrawerSettings-update = تحديث
storyInfoDrawer-storyStatus-archiving = جارٍ الأرشفة
storyInfoDrawer-storyStatus-archived = مؤرشف
storyInfoDrawer-cacheStory-recache = إعادة تخزين المقال
storyInfoDrawer-cacheStory-recaching = جارٍ إعادة التخزين
storyInfoDrawer-cacheStory-cached = مخزّن
storyInfoDrawer-cacheStory-uncacheStory = إلغاء تخزين المقال
storyInfoDrawer-cacheStory-uncaching = جارٍ إلغاء التخزين

## Invite
invite-youHaveBeenInvited = لقد تمت دعوتك للانضمام إلى { $organizationName }
invite-finishSettingUpAccount = أكمل إعداد الحساب لـ:
invite-createAccount = إنشاء حساب
invite-passwordLabel = كلمة المرور
invite-passwordDescription = يجب أن تكون { $minLength } حرفاً على الأقل
invite-passwordTextField =
  .placeholder = كلمة المرور
invite-usernameLabel = اسم المستخدم
invite-usernameDescription = يمكنك استخدام "_" و "."
invite-usernameTextField =
  .placeholder = اسم المستخدم
invite-oopsSorry = عذراً!
invite-successful = تم إنشاء حسابك
invite-youMayNowSignIn = يمكنك الآن تسجيل الدخول إلى { -product-name } باستخدام:
invite-goToAdmin = الانتقال إلى إدارة { -product-name }
invite-goToOrganization = الانتقال إلى { $organizationName }
invite-tokenNotFound = الرابط المحدد غير صالح، تحقق من نسخه بشكل صحيح.

userDetails-banned-on = <strong>تم الحظر في</strong> { $timestamp }
userDetails-banned-by = <strong>بواسطة</strong> { $username }
userDetails-suspended-by = <strong>تم التعليق بواسطة</strong> { $username }
userDetails-suspension-start = <strong>البداية:</strong> { $timestamp }
userDetails-suspension-end = <strong>النهاية:</strong> { $timestamp }
userDetails-warned-on = <strong>تم التحذير في</strong> { $timestamp }
userDetails-warned-by = <strong>بواسطة</strong> { $username }
userDetails-warned-explanation = المستخدم لم يُقرّ بالتحذير بعد.

configure-general-reactions-title = التفاعلات
configure-general-reactions-explanation = اسمح لمجتمعك بالتفاعل والتعبير عن أنفسهم بتفاعلات بنقرة واحدة.
configure-general-reactions-label = تسمية التفاعل
configure-general-reactions-input =
  .placeholder = مثال: احترام
configure-general-reactions-active-label = تسمية التفاعل النشط
configure-general-reactions-active-input =
  .placeholder = مثال: تم الاحترام
configure-general-reactions-sort-label = تسمية الترتيب
configure-general-reactions-sort-input =
  .placeholder = مثال: الأكثر احتراماً
configure-general-reactions-preview = معاينة
configure-general-reaction-sortMenu-sortBy = ترتيب حسب

configure-general-newCommenter-title = شارة المعلّق الجديد
configure-general-newCommenter-explanation = إضافة شارة <icon></icon> للمعلّقين الذين أنشأوا حساباتهم خلال آخر سبعة أيام.
configure-general-newCommenter-enabled = تفعيل شارات المعلّق الجديد

configure-general-badges-title = شارات الأعضاء
configure-general-badges-explanation = إظهار شارة مخصصة للمستخدمين ذوي أدوار محددة.
configure-general-badges-label = نص الشارة
configure-general-badges-staff-member-input =
  .placeholder = مثال: فريق العمل
configure-general-badges-moderator-input =
  .placeholder = مثال: مشرف
configure-general-badges-admin-input =
  .placeholder = مثال: مدير
configure-general-badges-member-input =
  .placeholder = مثال: عضو
configure-general-badges-preview = معاينة
configure-general-badges-staff-member-label = نص شارة فريق العمل
configure-general-badges-admin-label = نص شارة المدير
configure-general-badges-moderator-label = نص شارة المشرف
configure-general-badges-member-label = نص شارة العضو

configure-general-rte-title = تعليقات بنص منسّق
configure-general-rte-express = امنح مجتمعك طرقاً أكثر للتعبير عن أنفسهم بتنسيق نص منسّق.
configure-general-rte-richTextComments = تعليقات بنص منسّق
configure-general-rte-onBasicFeatures = مفعّل - عريض، مائل، اقتباسات، وقوائم نقطية
configure-general-rte-additional = خيارات إضافية للنص المنسّق
configure-general-rte-strikethrough = يتوسطه خط
configure-general-rte-spoiler = حرق أحداث
configure-general-rte-spoilerDesc = الكلمات والعبارات المنسقة كحرق أحداث تُخفى خلف خلفية داكنة حتى يختار القارئ الكشف عن النص.

configure-general-dsaConfig-title = مجموعة ميزات قانون الخدمات الرقمية
configure-general-dsaConfig-description =
  يتطلب قانون الخدمات الرقمية للاتحاد الأوروبي (DSA) من الناشرين توفير ميزات معينة للمعلّقين والمشرفين.
configure-general-dsaConfig-reportingAndModerationExperience = تجربة الإبلاغ والإشراف وفق DSA
configure-general-dsaConfig-methodOfRedress = اختر وسيلة الطعن
configure-general-dsaConfig-methodOfRedress-explanation = أبلغ المستخدمين بما إذا كان بإمكانهم الطعن في قرار إشراف وكيفية ذلك
configure-general-dsaConfig-methodOfRedress-none = لا شيء
configure-general-dsaConfig-methodOfRedress-email = بريد إلكتروني
configure-general-dsaConfig-methodOfRedress-email-placeholder = moderation@example.com
configure-general-dsaConfig-methodOfRedress-url = رابط
configure-general-dsaConfig-methodOfRedress-url-placeholder = https://moderation.example.com

configure-account-features-title = ميزات إدارة حساب المعلّق
configure-account-features-explanation = يمكنك تفعيل وتعطيل ميزات معينة ليستخدمها المعلّقون في ملفهم الشخصي.
configure-account-features-allow = السماح للمستخدمين بـ:
configure-account-features-change-usernames = تغيير أسماء المستخدمين
configure-account-features-change-usernames-details = يمكن تغيير أسماء المستخدمين مرة كل 14 يوماً.
configure-account-features-yes = نعم
configure-account-features-no = لا
configure-account-features-download-comments = تحميل تعليقاتهم
configure-account-features-download-comments-details = يمكن للمعلّقين تحميل ملف csv لسجل تعليقاتهم.
configure-account-features-delete-account = حذف حسابهم
configure-account-features-delete-account-details = إزالة جميع بيانات التعليقات واسم المستخدم والبريد الإلكتروني من الموقع وقاعدة البيانات.
configure-account-features-delete-account-fieldDescriptions = إزالة جميع بيانات التعليقات واسم المستخدم والبريد الإلكتروني من الموقع وقاعدة البيانات.

configure-advanced-stories = إنشاء المقالات
configure-advanced-stories-explanation = إعدادات متقدمة لكيفية إنشاء المقالات في كورال.
configure-advanced-stories-lazy = الإنشاء الكسول للمقالات
configure-advanced-stories-lazy-detail = تفعيل إنشاء المقالات تلقائياً عند نشرها من نظام إدارة المحتوى.
configure-advanced-stories-scraping = استخراج بيانات المقالات
configure-advanced-stories-scraping-detail = تفعيل استخراج البيانات الوصفية للمقالات تلقائياً.
configure-advanced-stories-proxy = رابط وكيل المستخرج
configure-advanced-stories-proxy-detail = عند التحديد، يسمح لطلبات الاستخراج باستخدام الوكيل المقدم.
configure-advanced-stories-custom-user-agent = ترويسة User Agent مخصصة للمستخرج
configure-advanced-stories-custom-user-agent-detail = عند التحديد، تتجاوز ترويسة <code>User-Agent</code> المرسلة مع كل طلب استخراج.
configure-advanced-stories-authentication = المصادقة
configure-advanced-stories-scrapingCredentialsHeader = بيانات اعتماد الاستخراج
configure-advanced-stories-scraping-usernameLabel = اسم المستخدم
configure-advanced-stories-scraping-passwordLabel = كلمة المرور

commentAuthor-status-banned = محظور
commentAuthor-status-premod = إشراف مسبق
commentAuthor-status-suspended = معلّق

hotkeysModal-title = اختصارات لوحة المفاتيح
hotkeysModal-navigation-shortcuts = اختصارات التنقل
hotkeysModal-shortcuts-next = التعليق التالي
hotkeysModal-shortcuts-prev = التعليق السابق
hotkeysModal-shortcuts-search = فتح البحث
hotkeysModal-shortcuts-jump = الانتقال إلى قائمة محددة
hotkeysModal-shortcuts-switch = تبديل القوائم
hotkeysModal-shortcuts-toggle = تبديل مساعدة الاختصارات
hotkeysModal-shortcuts-single-view = عرض تعليق واحد
hotkeysModal-moderation-decisions = قرارات الإشراف
hotkeysModal-shortcuts-approve = قبول
hotkeysModal-shortcuts-reject = رفض
hotkeysModal-shortcuts-ban = حظر كاتب التعليق
hotkeysModal-shortcuts-zen = تبديل عرض التعليق الواحد

authcheck-network-error = حدث خطأ في الشبكة. يرجى تحديث الصفحة.

## Dashboard
dashboard-heading-last-updated = آخر تحديث:
dashboard-today-heading = نشاط اليوم
dashboard-today-new-comments = تعليقات جديدة
dashboard-alltime-new-comments = إجمالي كل الأوقات
dashboard-alltime-new-comments-archiveEnabled = { $value } { $unit ->
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
  } إجمالي
dashboard-today-rejections = معدل الرفض
dashboard-alltime-rejections = متوسط كل الأوقات
dashboard-alltime-rejections-archiveEnabled = { $value } { $unit ->
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
  } متوسط
dashboard-today-staffPlus-comments = تعليقات فريق العمل+
dashboard-alltime-staff-comments = إجمالي كل الأوقات
dashboard-alltime-staff-comments-archiveEnabled = { $value } { $unit ->
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
  } إجمالي
dashboard-today-signups = أعضاء مجتمع جدد
dashboard-alltime-signups = إجمالي الأعضاء
dashboard-today-bans = أعضاء محظورون
dashboard-alltime-bans = إجمالي الأعضاء المحظورين

dashboard-top-stories-today-heading = المقالات الأكثر تعليقاً اليوم
dashboard-top-stories-table-header-story = المقال
dashboard-top-stories-table-header-comments = التعليقات
dashboard-top-stories-no-comments = لا توجد تعليقات اليوم

dashboard-commenters-activity-heading = أعضاء المجتمع الجدد هذا الأسبوع
dashboard-comment-activity-heading = نشاط التعليقات بالساعة
dashboard-comment-activity-tooltip-comments = التعليقات
dashboard-comment-activity-legend = متوسط آخر 3 أيام

conversation-modal-conversationOn = المحادثة على:
conversation-modal-moderateStory = إشراف على المقال
conversation-modal-showMoreParents = إظهار المزيد من هذه المحادثة
conversation-modal-showReplies = إظهار الردود
conversation-modal-commentNotFound = التعليق غير موجود.
conversation-modal-showMoreReplies = إظهار المزيد من الردود
conversation-modal-header-title = المحادثة على:
conversation-modal-header-moderate-link = إشراف على المقال
conversation-modal-rejectButton = <icon></icon>رفض
  .aria-label = رفض
conversation-modal-rejectButton-rejected = <icon></icon>مرفوض
  .aria-label = مرفوض

## DSA Reports
reportsTable-column-created = تاريخ الإنشاء
reportsTable-column-lastUpdated = آخر تحديث
reportsTable-column-reportedBy = أبلغ عنه
reportsTable-column-reference = المرجع
reportsTable-column-lawBroken = القانون المخالَف
reportsTable-column-commentAuthor = كاتب التعليق
reportsTable-column-status = الحالة
reportsTable-emptyReports = لا توجد تقارير DSA للعرض.

reports-sortMenu-newest = الأحدث
reports-sortMenu-oldest = الأقدم
reports-sortMenu-sortBy = ترتيب حسب

reports-table-showClosedReports = إظهار التقارير المغلقة
reports-table-showOpenReports = إظهار التقارير المفتوحة

reports-singleReport-reportsLinkButton = <icon></icon> جميع تقارير DSA
reports-singleReport-reportID = معرّف التقرير
reports-singleReport-shareButton = <icon></icon> CSV
reports-singleReport-reporter = المُبلِّغ
reports-singleReport-reporterNameNotAvailable = اسم المُبلِّغ غير متاح
reports-singleReport-reportDate = تاريخ البلاغ
reports-singleReport-lawBroken = ما القانون الذي تم انتهاكه؟
reports-singleReport-explanation = التوضيح
reports-singleReport-comment = التعليق
reports-singleReport-comment-notAvailable = هذا التعليق غير متاح.
reports-singleReport-comment-deleted = لم يعد هذا التعليق متاحاً. قام المعلّق بحذف حسابه.
reports-singleReport-comment-edited = (تم التعديل)
reports-singleReport-comment-viewCommentStream = عرض التعليق في السلسلة
reports-singleReport-comment-viewCommentModeration = عرض التعليق في الإشراف
reports-singleReport-comment-rejected = مرفوض
reports-singleReport-comment-unavailableInStream = غير متاح في السلسلة
reports-singleReport-commentOn = تعليق على
reports-singleReport-history = السجل
reports-singleReport-history-reportSubmitted = تم تقديم بلاغ عن محتوى غير قانوني
reports-singleReport-history-addedNote = { $username } أضاف ملاحظة
reports-singleReport-history-deleteNoteButton = <icon></icon> حذف
reports-singleReport-history-madeDecision-illegal = { $username } اتخذ قراراً بأن هذا التقرير يحتوي محتوى يُحتمل أنه غير قانوني
reports-singleReport-history-madeDecision-legal = { $username } اتخذ قراراً بأن هذا التقرير لا يحتوي محتوى غير قانوني
reports-singleReport-history-legalGrounds = الأسس القانونية: { $legalGrounds }
reports-singleReport-history-explanation = التوضيح: { $explanation }
reports-singleReport-history-changedStatus = { $username } غيّر الحالة إلى { $status }
reports-singleReport-reportVoid = حذف المستخدم حسابه. التقرير لاغٍ.
reports-singleReport-history-sharedReport = { $username } حمّل هذا التقرير
reports-singleReport-note-field =
  .placeholder = أضف ملاحظتك...
reports-singleReport-addUpdateButton = <icon></icon> إضافة تحديث
reports-singleReport-decisionLabel = القرار
reports-singleReport-decision-legalGrounds = الأسس القانونية
reports-singleReport-decision-explanation = توضيح مفصّل
reports-singleReport-makeDecisionButton = <icon></icon> قرار
reports-singleReport-decision-doesItContain = هل يحتوي هذا التعليق على محتوى يُحتمل أنه غير قانوني؟
reports-singleReport-decision-doesItContain-yes = نعم
reports-singleReport-decision-doesItContain-no = لا

reports-status-awaitingReview = بانتظار المراجعة
reports-status-inReview = قيد المراجعة
reports-status-completed = مكتمل
reports-status-void = لاغٍ
reports-status-unknown = حالة غير معروفة

reports-changeStatusModal-prompt-addNote = لقد أضفت ملاحظة. هل ترغب في تحديث الحالة إلى قيد المراجعة.
reports-changeStatusModal-prompt-downloadReport = لقد حمّلت التقرير. هل ترغب في تحديث الحالة إلى قيد المراجعة.
reports-changeStatusModal-prompt-madeDecision = لقد اتخذت قراراً. هل ترغب في تحديث الحالة إلى مكتمل.
reports-changeStatusModal-updateButton = نعم، تحديث
reports-changeStatusModal-dontUpdateButton = لا
reports-changeStatusModal-header = تحديث الحالة؟

reports-decisionModal-header = قرار التقرير
reports-decisionModal-prompt = هل يبدو أن هذا التعليق يحتوي على محتوى يُحتمل أنه غير قانوني؟
reports-decisionModal-yes = نعم
reports-decisionModal-no = لا
reports-decisionModal-submit = إرسال
reports-decisionModal-lawBrokenLabel = القانون المخالَف
reports-decisionModal-lawBrokenTextfield =
  .placeholder = أضف القانون...
reports-decisionModal-detailedExplanationLabel = توضيح مفصّل
reports-decisionModal-detailedExplanationTextarea =
  .placeholder = أضف التوضيح...

reports-relatedReports-label = التقارير ذات الصلة
reports-relatedReports-reportIDLabel = معرّف التقرير
reports-anonymousUser = مستخدم مجهول
reports-username-not-available = اسم المستخدم غير متاح

## Control panel
controlPanel-redis-redis = Redis
controlPanel-redis-flushRedis = مسح Redis
controlPanel-redis-flush = مسح

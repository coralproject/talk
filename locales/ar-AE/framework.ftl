### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0.0k
framework-shortNumber-10000 = 00k
framework-shortNumber-100000 = 000k
framework-shortNumber-1000000 = 0.0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0.0B

## Validation

framework-validation-required = هذا الحقل مطلوب.
framework-validation-tooShort = يرجى إدخال {$minLength} حرفاً على الأقل.
framework-validation-tooLong = يرجى إدخال {$maxLength} حرفاً كحد أقصى.
framework-validation-usernameTooShort = يجب أن يحتوي اسم المستخدم على {$minLength} حرفاً على الأقل.
framework-validation-usernameTooLong = لا يمكن أن يتجاوز اسم المستخدم {$maxLength} حرفاً.
framework-validation-invalidCharacters = أحرف غير صالحة. حاول مجدداً.
framework-validation-invalidEmail = يرجى إدخال عنوان بريد إلكتروني صالح.
framework-validation-passwordTooShort = يجب أن تحتوي كلمة المرور على {$minLength} حرفاً على الأقل.
framework-validation-passwordsDoNotMatch = كلمتا المرور غير متطابقتين. حاول مجدداً.
framework-validation-invalidURL = رابط غير صالح
framework-validation-emailsDoNotMatch = عنوانا البريد الإلكتروني غير متطابقين. حاول مجدداً.
framework-validation-notAWholeNumberBetween = يرجى إدخال عدد صحيح بين { $min } و { $max }.
framework-validation-notAWholeNumberGreaterThan = يرجى إدخال عدد صحيح أكبر من { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = يرجى إدخال عدد صحيح أكبر من أو يساوي { $x }
framework-validation-usernamesDoNotMatch = اسما المستخدم غير متطابقين. حاول مجدداً.
framework-validation-deleteConfirmationInvalid = تأكيد غير صحيح. حاول مجدداً.
framework-validation-invalidWebhookEndpointEventSelection = يرجى اختيار حدث واحد على الأقل لتلقيه.
framework-validation-media-url-invalid = يرجى إدخال رابط صورة صالح (.png أو .jpg أو .gif)
framework-validation-invalidEmailDomain = صيغة نطاق البريد الإلكتروني غير صالحة. يرجى استخدام "email.com"
framework-validation-invalidExternalProfileURL = يجب أن تحتوي جميع أنماط روابط الملفات الشخصية الخارجية على $USER_NAME أو $USER_ID.

framework-timeago-just-now = الآن

framework-timeago-time =
  { $value } { $unit ->
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

framework-timeago =
  { $suffix ->
    [ago] منذ {framework-timeago-time}
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = نسخ
framework-copyButton-copied = تم النسخ

### Password Field
framework-passwordField =
  .showPasswordTitle = إظهار كلمة المرور
  .hidePasswordTitle = إخفاء كلمة المرور

### Markdown Editor
framework-markdownEditor-bold = عريض
framework-markdownEditor-italic = مائل
framework-markdownEditor-titleSubtitleHeading = العنوان، العنوان الفرعي، الترويسة
framework-markdownEditor-quote = اقتباس
framework-markdownEditor-genericList = قائمة عامة
framework-markdownEditor-numberedList = قائمة مرقمة
framework-markdownEditor-createLink = إنشاء رابط
framework-markdownEditor-insertImage = إدراج صورة
framework-markdownEditor-togglePreview = تبديل المعاينة
framework-markdownEditor-toggleSideBySide = تبديل العرض الجانبي
framework-markdownEditor-toggleFullscreen = تبديل ملء الشاشة
framework-markdownEditor-markdownGuide = دليل Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
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
    *[other] وحدة غير معروفة
  }

framework-starRating =
  .aria-label = { $value ->
    [1] نجمة واحدة
    *[other] {$value} نجوم
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  حدث خطأ غير متوقع في الشبكة، يرجى المحاولة لاحقاً.
framework-error-relayNetworkRequestError-code = الرمز

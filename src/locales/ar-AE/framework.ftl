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
framework-validation-tooShort = الرجاء إدخال {$minLength} محرفاً على الأقل.
framework-validation-tooLong = الرجاء إدخال {$maxLength} محرفاً كحد أقصى.
framework-validation-usernameTooShort = اسم المستخدم يجب أن يضم {$minLength} محرفاً على الأقل.
framework-validation-usernameTooLong = لا يمكن أن يكون اسم المستخدم أطول من {$maxLength} محرفاً.
framework-validation-invalidCharacters = محارف غير صالحة. الرجاء المحاولة مجدداً.
framework-validation-invalidEmail = الرجاء إدخال عنوان بريد إلكتروني صالح.
framework-validation-passwordTooShort = يجب أن تحتوي كلمة المرور {$minLength} محرفاً على الأقل.
framework-validation-passwordsDoNotMatch = كلمتا المرور غير متطابقتان. الرجاء المحاولة مجدداً.
framework-validation-invalidURL = رابط غير صالح
framework-validation-emailsDoNotMatch = عناوين البريد الإلكتروني غير متطابقة. الرجاء المحاولة مجدداً.
framework-validation-notAWholeNumberBetween = الرجاء إدخال رقم صحيح بين { $min } و { $max }.
framework-validation-notAWholeNumberGreaterThan = الرجاء إدخال رقم صحيح أكبر من { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = الرجاء إدخال رقم صحيح أكبر أو يساوي { $x }
framework-validation-usernamesDoNotMatch = اسم المستخدم غير متطابق. الرجاء المحاولة مجدداً.
framework-validation-deleteConfirmationInvalid = تأكيد غير صحيح. الرجاء المحاولة مجدداً.
framework-validation-invalidWebhookEndpointEventSelection = الرجاء اختيار حدث واحد للتلقي.
framework-validation-media-url-invalid = الرجاء اختيار رابط صالح للصورة (.png, .jpg, or .gif)

framework-timeago-just-now = الآن فقط

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] ثانية
      *[other] ثانية
    }
    [minute] { $value ->
      [1] دقيقة
      *[other] دقيقة
    }
    [hour] { $value ->
      [1] ساعة
      *[other] ساعة
    }
    [day] { $value ->
      [1] يوم
      *[other] يوم
    }
    [week] { $value ->
      [1] أسبوع
      *[other] أسبوع
    }
    [month] { $value ->
      [1] شهر
      *[other] شهر
    }
    [year] { $value ->
      [1] عام
      *[other] عام
    }
    *[other] وحدة غير معروفة
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
framework-markdownEditor-titleSubtitleHeading = العنوان, العنوان الفرعي, الترويسة
framework-markdownEditor-quote = اقتباس
framework-markdownEditor-genericList = قائمة عامة
framework-markdownEditor-numberedList = قائمة مرقمة
framework-markdownEditor-createLink = إنشاء رابط
framework-markdownEditor-insertImage = إدخال صورة
framework-markdownEditor-togglePreview = تبديل لعرض المصغرات
framework-markdownEditor-toggleSideBySide = تبديل للعرض جانبي
framework-markdownEditor-toggleFullscreen = تبديل لعرض ملء الشاشة
framework-markdownEditor-markdownGuide = دليل التخفيضات

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] ثانية
      *[other] ثانية
    }
    [minute] { $value ->
      [1] دقيقة
      *[other] دقيقة
    }
    [hour] { $value ->
      [1] ساعة
      *[other] ساعة
    }
    [day] { $value ->
      [1] يوم
      *[other] يوم
    }
    [week] { $value ->
      [1] أسبوع
      *[other] أسبوع
    }
    *[other] وحدة غير معروفة
  }

framework-starRating =
  .aria-label = { $value ->
    [1] نجمة واحدة
    *[other] {$value} نجمة
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  حصل خطأ غير متوقع في الشبكة، الرجاء المحاولة لاحقاً.
framework-error-relayNetworkRequestError-code = رمز

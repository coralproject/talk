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

framework-validation-required = Bu alan gereklidir.
framework-validation-tooShort = Lütfen en az {$minLength} karakter girin.
framework-validation-tooLong = Lütfen maksimum {$maxLength} karakter girin.
framework-validation-usernameTooShort = Kullanıcı adından en az {$minLength} karakter olmalı.
framework-validation-usernameTooLong = Kullanıcı adında maksimum {$maxLength} karakter olabilir.
framework-validation-invalidCharacters = Geçersiz karakterler. Lütfen tekrar deneyin.
framework-validation-invalidEmail = Lütfen geçerli bir e-posta adresi girin.
framework-validation-passwordTooShort = Şifreniz en az {$minLength} karakter olmalı.
framework-validation-passwordsDoNotMatch = Girmiş olduğunuz şifreler eşleşmiyor. Lütfen yeniden deneyin.
framework-validation-invalidURL = Geçersiz URL
framework-validation-emailsDoNotMatch = E-posta adresleri eşleşmiyor. Lütfen tekrar deneyin.
framework-validation-notAWholeNumberBetween = Lütfen { $min } ile { $max } arasında bir tam sayı girin.
framework-validation-notAWholeNumberGreaterThan = Lütfen { $x } değerinden büyük bir tam sayı girin
framework-validation-notAWholeNumberGreaterThanOrEqual = Lütfen { $x } değerinden büyük veya buna eşit bir tam sayı girin
framework-validation-usernamesDoNotMatch = Kullanıcı adları eşleşmiyor. Lütfen yeniden deneyin.
framework-validation-deleteConfirmationInvalid = Hatalı doğrulama. Lütfen yeniden deneyin.
framework-validation-invalidWebhookEndpointEventSelection = Almak için en az bir etkinlik seçin.
framework-validation-media-url-invalid = Lütfen geçerli bir resim linki (.png, .jpg, or .gif) girin.

framework-timeago-just-now = Şimdi

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] saniye
      *[other] saniye
    }
    [minute] { $value ->
      [1] dakika
      *[other] dakika
    }
    [hour] { $value ->
      [1] saat
      *[other] saat
    }
    [day] { $value ->
      [1] gün
      *[other] gün
    }
    [week] { $value ->
      [1] hafta
      *[other] hafta
    }
    [month] { $value ->
      [1] ay
      *[other] ay
    }
    [year] { $value ->
      [1] yıl
      *[other] yıl
    }
    *[other] bilinmeyen değer
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} önce
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopyala
framework-copyButton-copied = Kopyalandı

### Password Field
framework-passwordField =
  .showPasswordTitle = Şifreyi göster
  .hidePasswordTitle = Şifreyi gizle

### Markdown Editor
framework-markdownEditor-bold = Koyu
framework-markdownEditor-italic = İtalik
framework-markdownEditor-titleSubtitleHeading = Başlık, Altyazı, Başlık
framework-markdownEditor-quote = Alıntı
framework-markdownEditor-genericList = Genel liste
framework-markdownEditor-numberedList = Numaralandırılmış liste
framework-markdownEditor-createLink = Link oluştur
framework-markdownEditor-insertImage = Resim ekle
framework-markdownEditor-togglePreview = Önizlemeyi Aç/Kapat
framework-markdownEditor-toggleSideBySide = Yan Yana önizleme
framework-markdownEditor-toggleFullscreen = Tam Ekran önizleme
framework-markdownEditor-markdownGuide = İşaretleme Kılavuzu

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Saniye
      *[other] Saniye
    }
    [minute] { $value ->
      [1] Dakika
      *[other] Dakika
    }
    [hour] { $value ->
      [1] Saat
      *[other] Saat
    }
    [day] { $value ->
      [1] Gün
      *[other] Gün
    }
    [week] { $value ->
      [1] Hafta
      *[other] Hafta
    }
    *[other] bilinmeyen
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Yıldız
    *[other] {$value} Yıldız
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError = Beklenmeyen bir ağ hatası oluştu, lütfen daha sonra tekrar deneyin.
framework-error-relayNetworkRequestError-code = Kod

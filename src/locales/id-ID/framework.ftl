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

framework-validation-required = Bagian ini diperlukan.
framework-validation-tooShort = Silakan masukkan minimum {$minLength} karakter.
framework-validation-tooLong = Silakan masukkan maksimum {$maxLength} karakter.
framework-validation-usernameTooShort = Nama pengguna harus terdiri dari setidaknya {$minLength} karakter.
framework-validation-usernameTooLong = Nama pengguna tidak bisa lebih dari {$maxLength} karakter.
framework-validation-invalidCharacters = Karakter tidak valid. Coba lagi.
framework-validation-invalidEmail = Silakan masukkan alamat email valid.
framework-validation-passwordTooShort = Kata kunci harus terdiri dari setidaknya {$minLength} karakter.
framework-validation-passwordsDoNotMatch = Kata kunci tidak cocok. Coba lagi.
framework-validation-invalidURL = URL tidak valid
framework-validation-emailsDoNotMatch = Email tidak cocok. Coba lagi.
framework-validation-notAWholeNumberBetween = Silakan masukkan bilangan bulat antara { $min } dan { $max }.
framework-validation-notAWholeNumberGreaterThan = Silakan masukkan bilangan bulat lebih besar daripada { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Silakan masukkan bilangan bulat lebih besar dari atau sama dengan { $x }
framework-validation-usernamesDoNotMatch = Name pengguna tidak cocok. Coba lagi.
framework-validation-deleteConfirmationInvalid = Konfirmasi tidak cocok. Coba lagi.
framework-validation-invalidWebhookEndpointEventSelection = Pilih setidaknya satu event untuk diterima.
framework-validation-media-url-invalid = Silakan masukkan URL (.png, .jpg, or .gif) gambar valid

framework-timeago-just-now = Saat ini

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] second
      *[other] detik
    }
    [minute] { $value ->
      [1] minute
      *[other] menit
    }
    [hour] { $value ->
      [1] hour
      *[other] jam
    }
    [day] { $value ->
      [1] day
      *[other] hari
    }
    [week] { $value ->
      [1] week
      *[other] pekan
    }
    [month] { $value ->
      [1] month
      *[other] bulan
    }
    [year] { $value ->
      [1] year
      *[other] tahun
    }
    *[other] unit tak diketahui
  }

## Components

### Copy Button
framework-copyButton-copy = Salin
framework-copyButton-copied = Disalin

### Password Field
framework-passwordField =
  .showPasswordTitle = Tunjukkan kata kunci
  .hidePasswordTitle = Sembunyikan kata kunci

### Markdown Editor
framework-markdownEditor-bold = Tebal
framework-markdownEditor-italic = Miring
framework-markdownEditor-titleSubtitleHeading = Judul, Subjudul, Tajuk
framework-markdownEditor-quote = Kutip
framework-markdownEditor-genericList = Daftar Generik
framework-markdownEditor-numberedList = Daftar Angka
framework-markdownEditor-createLink = Buat Tautan
framework-markdownEditor-insertImage = Sisipkan Gambar
framework-markdownEditor-togglePreview = Pratinjau Dwiarah
framework-markdownEditor-toggleSideBySide = Berdampingan Dwiarah
framework-markdownEditor-toggleFullscreen = Layar penuh Dwiarah
framework-markdownEditor-markdownGuide = Panduan Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Second
      *[other] Detik
    }
    [minute] { $value ->
      [1] Minute
      *[other] Menit
    }
    [hour] { $value ->
      [1] Hour
      *[other] Jam
    }
    [day] { $value ->
      [1] Day
      *[other] Hari
    }
    [week] { $value ->
      [1] Minggu
      *[other] Minggu
    }
    *[other] unit tidak diketahui
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Bintang
    *[other] {$value} Bintang
  }

### Kesalahan Permintaan Jaringan Relay

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Terjadi kesalahan jaringan yang tidak terduga, coba lagi nanti.
framework-error-relayNetworkRequestError-code = Kode

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

framework-validation-required = Ovo polje je obavezno.
framework-validation-tooShort = Molimo unesite barem {$minLength} znakova.
framework-validation-tooLong = Molimo unesite najviše {$maxLength} znakova.
framework-validation-usernameTooShort = Korisničko ime mora sadržavati najmanje {$minLength} znakova.
framework-validation-usernameTooLong = Korisničko ime ne može biti duže od {$maxLength} znakova.
framework-validation-invalidCharacters = Neispravni znakovi. Molimo pokušajte ponovo.
framework-validation-invalidEmail = Molimo uneiste ispravnu email adresu.
framework-validation-passwordTooShort = Lozinka mora sadržavati najmanje {$minLength} znakova.
framework-validation-passwordsDoNotMatch = Lozinke se ne podudaraju. Molimo pokušajte ponovo.
framework-validation-invalidURL = Nepostojeći URL
framework-validation-emailsDoNotMatch = Emailovi se ne podudaraju. Molimo pokušajte ponovo.
framework-validation-notAWholeNumberBetween = Molimo unesite cijeli broj između { $min } i { $max }.
framework-validation-notAWholeNumberGreaterThan = Molimo unseti cijeli broj veći od { $x }.
framework-validation-notAWholeNumberGreaterThanOrEqual = Molimo unesite cijeli broj veći ili jednak { $x }.
framework-validation-usernamesDoNotMatch = Korisnička imena se ne podudaraju. Molimo pokušajte ponovo.
framework-validation-deleteConfirmationInvalid = Neispravna potvrda. Molimo pokušajte ponovo.
framework-validation-invalidWebhookEndpointEventSelection = Odaberite barem jedan događaj za primanje.
framework-validation-media-url-invalid = Molimo unesite ispravan URL slike (.png, .jpg, ili .gif)
framework-validation-invalidEmailDomain = Neispravan format email domene. Molimo koristite "email.com"
framework-validation-invalidExternalProfileURL = Svi vanjski URL profila moraju sadržavati $USER_NAME ili $USER_ID.

framework-timeago-just-now = Upravo

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      [few] sekunde
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      [few] minute
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      [few] sata
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      [few] tjedna
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      [few] mjeseca
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      [few] godine
      *[other] godina
    }
    *[other] nepoznata jedinica
  }

framework-timeago =
  { $suffix ->
    [ago] prije {framework-timeago-time}
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopiraj
framework-copyButton-copied = Kopirano

### Password Field
framework-passwordField =
  .showPasswordTitle = Prikaži lozinku
  .hidePasswordTitle = Sakrij lozinku

### Markdown Editor
framework-markdownEditor-bold = Bold
framework-markdownEditor-italic = Italic
framework-markdownEditor-titleSubtitleHeading = Naslov, Podnaslov, Međunaslov
framework-markdownEditor-quote = Citat
framework-markdownEditor-genericList = Generična lista
framework-markdownEditor-numberedList = Brojčana lista
framework-markdownEditor-createLink = Kreiraj link
framework-markdownEditor-insertImage = Umetni sliku
framework-markdownEditor-togglePreview = Prebaci na pregled
framework-markdownEditor-toggleSideBySide = Prebaci na usporedni prikaz
framework-markdownEditor-toggleFullscreen = Prebaci na cijeli ekran
framework-markdownEditor-markdownGuide = Uputstvo za Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Sekunda
      [few] Sekunde
      *[other] Sekundi
    }
    [minute] { $value ->
      [1] Minuta
      [few] Minute
      *[other] Minuta
    }
    [hour] { $value ->
      [1] Sat
      [few] Sata
      *[other] Sati
    }
    [day] { $value ->
      [1] Dan
      *[other] Dana
    }
    [week] { $value ->
      [1] Tjedan
      [few] Tjedna
      *[other] Tjedana
    }
    *[other] nepoznata jedinica
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Zvjezdica
    [few] {$value} Zvjezdice
    *[other] {$value} Zvjezdica
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Neočekivana greška mreže, molimo pokušajte ponovo kasnije.
framework-error-relayNetworkRequestError-code = Kod

### Lokalizacije za okvir.
### Svi ključevi moraju početi s `framework` jer se ova datoteka dijeli
### među različitim ciljevima.

## Kratki Broj

# Implementacija temeljena na unicode Short Number uzorcima
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0,0k
framework-shortNumber-10000 = 00k
framework-shortNumber-100000 = 000k
framework-shortNumber-1000000 = 0,0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0,0B

## Validacija

framework-validation-required = Ovo polje je obavezno.
framework-validation-tooShort = Unesite najmanje {$minLength} znakova.
framework-validation-tooLong = Unesite najviše {$maxLength} znakova.
framework-validation-usernameTooShort = Korisničko ime mora sadržavati najmanje {$minLength} znakova.
framework-validation-usernameTooLong = Korisnička imena ne mogu biti duža od {$maxLength} znakova.
framework-validation-invalidCharacters = Nevažeći znakovi. Pokušajte ponovno.
framework-validation-invalidEmail = Unesite valjanu e-mail adresu.
framework-validation-notAWholeNumberGreaterThan = Unesite cijeli broj veći od { $x }
framework-validation-passwordTooShort = Lozinka mora sadržavati najmanje {$minLength} znakova.
framework-validation-passwordsDoNotMatch = Lozinke se ne podudaraju. Pokušajte ponovno.
framework-validation-invalidURL = Nevažeći URL
framework-validation-emailsDoNotMatch = E-mail adrese se ne podudaraju. Pokušajte ponovno.
framework-validation-notAWholeNumberBetween = Unesite cijeli broj između { $min } i { $max }.
framework-validation-notAWholeNumberGreaterThanOrEqual = Unesite cijeli broj veći ili jednak { $x }
framework-validation-usernamesDoNotMatch = Korisnička imena se ne podudaraju. Pokušajte ponovno.
framework-validation-deleteConfirmationInvalid = Neispravna potvrda. Pokušajte ponovno.
framework-validation-invalidWebhookEndpointEventSelection = Odaberite barem jedan događaj za primanje.
framework-validation-media-url-invalid = Unesite valjani URL slike (.png, .jpg ili .gif)
framework-validation-invalidEmailDomain = Nevažeći format domene e-pošte. Koristite "email.com"
framework-validation-invalidExternalProfileURL = Svi vanjski uzorci URL profila moraju sadržavati ili $USER_NAME ili $USER_ID.

framework-timeago-just-now = Upravo sada

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekundi
    }
    [minute] { $value ->
      [1] minuta
      *[other] minuta
    }
    [hour] { $value ->
      [1] sat
      *[other] sati
    }
    [day] { $value ->
      [1] dan
      *[other] dana
    }
    [week] { $value ->
      [1] tjedan
      *[other] tjedana
    }
    [month] { $value ->
      [1] mjesec
      *[other] mjeseci
    }
    [year] { $value ->
      [1] godina
      *[other] godina
    }
    *[other] nepoznata jedinica
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} prije
    *[noSuffix] {framework-timeago-time}
  }

## Komponente

### Gumb za Kopiranje
framework-copyButton-copy = Kopiraj
framework-copyButton-copied = Kopirano

### Polje za Lozinku
framework-passwordField =
  .showPasswordTitle = Prikaži lozinku
  .hidePasswordTitle = Sakrij lozinku

### Markdown Uređivač
framework-markdownEditor-bold = Podebljano
framework-markdownEditor-italic = Kurziv
framework-markdownEditor-titleSubtitleHeading = Naslov, Podnaslov, Naslov
framework-markdownEditor-quote = Citat
framework-markdownEditor-genericList = Generički Popis
framework-markdownEditor-numberedList = Numerirani Popis
framework-markdownEditor-createLink = Kreiraj Poveznicu
framework-markdownEditor-insertImage = Umetni Sliku
framework-markdownEditor-togglePreview = Uključi Pregled
framework-markdownEditor-toggleSideBySide = Uključi Usporedno
framework-markdownEditor-toggleFullscreen = Uključi Cijeli Zaslon
framework-markdownEditor-markdownGuide = Vodič za Markdown

### Polje za Trajanje

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Sekunda
      *[other] Sekundi
    }
    [minute] { $value ->
      [1] Minuta
      *[other] Minuta
    }
    [hour] { $value ->
      [1] Sat
      *[other] Sati
    }
    [day] { $value ->
      [1] Dan
      *[other] Dana
    }
    [week] { $value ->
      [1] Tjedan
      *[other] Tjedana
    }
    *[other] nepoznata jedinica
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Zvjezdica
    *[other] {$value} Zvjezdica
  }

### Pogreška Mrežnog Zahtjeva za Relay

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Došlo je do neočekivane mrežne pogreške, pokušajte ponovno kasnije.
framework-error-relayNetworkRequestError-code = Kod

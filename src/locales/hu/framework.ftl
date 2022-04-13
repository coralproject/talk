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

framework-validation-required = Kötelező mező.
framework-validation-tooShort = Kérjük írj legalább {$minLength} karaktert.
framework-validation-tooLong = Kérjük maximum {$maxLength} karaktert írj.
framework-validation-usernameTooShort = A felhasználónév legalább {$minLength} karaktert.
framework-validation-usernameTooLong = A felhasználónév nem lehet hosszabb {$maxLength} karakternél.
framework-validation-invalidCharacters = Helytelen karakterek. Próbálja újra..
framework-validation-invalidEmail = Kérjük adj meg egy létező e-mail címet.
framework-validation-passwordTooShort = A jelszó legalább {$minLength} karaktert tartalmazzon..
framework-validation-passwordsDoNotMatch = A jelszavak nem egyeznek. Próbálja újra.
framework-validation-invalidURL = Helytelen URL
framework-validation-emailsDoNotMatch = Az e-mail címek nem egyeznek. Próbálja újra..
framework-validation-notAWholeNumberBetween = Kérjük adj meg egy számot { $min } és { $max } között.
framework-validation-notAWholeNumberGreaterThan = Kérjük adj meg egy számot, ami nagyobb, mint { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Kérjük adj meg egy számot, ami nagyobb, vagy egyenlő { $x } - al
framework-validation-usernamesDoNotMatch = A felhasználónevek nem egyeznek. Próbálja újra.
framework-validation-deleteConfirmationInvalid = Helytelen megerősítés. Próbálja újra.
framework-validation-invalidWebhookEndpointEventSelection =Válasszon ki legalább egy eseményt, amelyet fogadni szeretne.
framework-validation-media-url-invalid = Kérjük adj meg egy valós URL-t a képhez (.png, .jpg, or .gif)

framework-timeago-just-now = Épp most

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] másodperccel
      *[other] másodperccel
    }
    [minute] { $value ->
      [1] perccel
      *[other] perccel
    }
    [hour] { $value ->
      [1] órával
      *[other] órával
    }
    [day] { $value ->
      [1] nappal
      *[other] nappal
    }
    [week] { $value ->
      [1] héttel
      *[other] héttel
    }
    [month] { $value ->
      [1] hónappal
      *[other] hónappal
    }
    [year] { $value ->
      [1] évvel
      *[other] évvel
    }
    *[other] ismeretlen idővel
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} ezelőtt
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Másolás
framework-copyButton-copied = Másolva

### Password Field
framework-passwordField =
  .showPasswordTitle = Jelszó mutatása
  .hidePasswordTitle = Jelszó elrejtése

### Markdown Editor
framework-markdownEditor-bold = Félkövér
framework-markdownEditor-italic = Dőlt
framework-markdownEditor-titleSubtitleHeading = Cím, alcím, fejezetcím
framework-markdownEditor-quote = Idézet
framework-markdownEditor-genericList = Egyszerű lista
framework-markdownEditor-numberedList = Számlista
framework-markdownEditor-createLink = Link létrehozása
framework-markdownEditor-insertImage = Kép beszúrása
framework-markdownEditor-togglePreview = Előnézet
framework-markdownEditor-toggleSideBySide = Oldaltól-oldalig
framework-markdownEditor-toggleFullscreen = Teljes képernyő
framework-markdownEditor-markdownGuide = Útmutató

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] másodperc
      *[other] másodperc
    }
    [minute] { $value ->
      [1] Perc
      *[other] Perc
    }
    [hour] { $value ->
      [1] Óra
      *[other] Óra
    }
    [day] { $value ->
      [1] Nap
      *[other] Nap
    }
    [week] { $value ->
      [1] Hét
      *[other] Hét
    }
    *[other] ismeretlen idő
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 csillag
    *[other] {$value} Csillag
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
   Váratlan hálózati hiba történt, kérjük, próbálja meg később újra.
framework-error-relayNetworkRequestError-code = Kód

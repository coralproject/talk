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

framework-validation-required = Tämä kenttä on pakollinen.
framework-validation-tooShort = Anna vähintään {$minLength} merkkiä.
framework-validation-tooLong = Anna korkeintaan {$maxLength} merkkiä.
framework-validation-usernameTooShort = Käyttäjänimessä on oltava vähintään {$minLength} merkkiä.
framework-validation-usernameTooLong = Käyttäjänimessä voi olla enintään {$maxLength} characters.
framework-validation-invalidCharacters = Virheellinen merkki. Yritä uudelleen.
framework-validation-invalidEmail = Anna toimiva sähköpostiosoite.
framework-validation-passwordTooShort = Salasanassa on oltava vähintään {$minLength} merkkiä.
framework-validation-passwordsDoNotMatch = Salasanat eivät täsmää. Yritä uudelleen.
framework-validation-invalidURL = Virheellinen osoite
framework-validation-emailsDoNotMatch = Sähköpostiosoitteet eivät täsmää. Yritä uudelleen.
framework-validation-notAWholeNumberBetween = Anna numero väliltä { $min } ja { $max }.
framework-validation-notAWholeNumberGreaterThan = Anna suurempi numero kuin { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Anna numero joka on suurempi tai yhtä suuri kuin { $x }
framework-validation-usernamesDoNotMatch = Käyttäjänimet eivät täsmää. Yritä uudelleen.
framework-validation-deleteConfirmationInvalid = Vahvistus ei täsmää. Yritä uudelleen.
framework-validation-invalidWebhookEndpointEventSelection = Valitse vähintään yksi tapahtuma vastaanotettavaksi.
framework-validation-media-url-invalid = Ole hyvä ja anna toimiva kuvan osoite (.png, .jpg, tai .gif)

framework-timeago-just-now = Juuri nyt

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekunti
      *[other] sekuntia
    }
    [minute] { $value ->
      [1] minuutti
      *[other] minuuttia
    }
    [hour] { $value ->
      [1] tunti
      *[other] tuntia
    }
    [day] { $value ->
      [1] päivä
      *[other] päivää
    }
    [week] { $value ->
      [1] viikko
      *[other] viikkoa
    }
    [month] { $value ->
      [1] kuukausi
      *[other] kuukautta
    }
    [year] { $value ->
      [1] vuosi
      *[other] vuotta
    }
    *[other] tuntematon yksikkö
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} sitten
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopioi
framework-copyButton-copied = Kopioitu

### Password Field
framework-passwordField =
  .showPasswordTitle = Näytä salasana
  .hidePasswordTitle = Piilota salasana

### Markdown Editor
framework-markdownEditor-bold = Lihavoi
framework-markdownEditor-italic = Kursivoi
framework-markdownEditor-titleSubtitleHeading = Otsikko, alaotsikko
framework-markdownEditor-quote = Lainaus
framework-markdownEditor-genericList = Lista
framework-markdownEditor-numberedList = Numeroitu lista
framework-markdownEditor-createLink = Lisää linkki
framework-markdownEditor-insertImage = Lisää kuva
framework-markdownEditor-togglePreview = Esikatselu
framework-markdownEditor-toggleSideBySide = Esikatselu vierekkäin
framework-markdownEditor-toggleFullscreen = Koko ruudun tila
framework-markdownEditor-markdownGuide = Tekstin muotoilun ohje

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] sekunti
      *[other] sekuntia
    }
    [minute] { $value ->
      [1] minuutti
      *[other] minuuttia
    }
    [hour] { $value ->
      [1] tunti
      *[other] tuntia
    }
    [day] { $value ->
      [1] päivä
      *[other] päivää
    }
    [week] { $value ->
      [1] viikko
      *[other] viikkoa
    }
    *[other] tuntematon yksikkö
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Tähti
    *[other] {$value} Tähteä
  }  
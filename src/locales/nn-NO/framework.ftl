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

framework-validation-required = Dette feltet er påkrevd.
framework-validation-tooShort = Feltet må inneholde minst {$minLength} tegn.
framework-validation-tooLong = Feltet kan ikke inneholde mer enn {$maxLength} tegn.
framework-validation-usernameTooShort = Brukernavnet må inneholde minst {$minLength} tegn.
framework-validation-usernameTooLong = Brukernavnet kan ikke være lengre enn {$maxLength} tegn.
framework-validation-invalidCharacters = Ugyldige tegn. Prøv på nytt.
framework-validation-invalidEmail = Vennligst angi en gyldig e-postadresse.
framework-validation-passwordTooShort = Passordet må inneholde minst {$minLength} tegn.
framework-validation-passwordsDoNotMatch = Passordene stemmer ikke overens. Prøv igjen.
framework-validation-invalidURL = Ugyldig URL
framework-validation-emailsDoNotMatch = E-postadressene stemmer ikke overens. Prøv igjen.
framework-validation-notAWholeNumberBetween = Vennligst fyll inn et tall mellom {Â $min } og { $max }.
framework-validation-notAWholeNumberGreaterThan = Vennligst fyll inn et tall større enn { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Vennligst fyll inn et tall større eller like stort som { $x }
framework-validation-usernamesDoNotMatch = Brukernavnene stemmer ikke overens. Prøv igjen.
framework-validation-deleteConfirmationInvalid = Ugyldig bekreftelse. Prøv igjen.
framework-validation-invalidWebhookEndpointEventSelection = Velg minst én.
framework-validation-media-url-invalid = Vennligst velg en gyldig bildefil (.png, .jpg, eller .gif)

framework-timeago-just-now = Akkurat nå

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minutt
      *[other] minutter
    }
    [hour] { $value ->
      [1] time
      *[other] timer
    }
    [day] { $value ->
      [1] dag
      *[other] dager
    }
    [week] { $value ->
      [1] uke
      *[other] uker
    }
    [month] { $value ->
      [1] måned
      *[other] måneder
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] ukjent enhet
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} siden
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopier
framework-copyButton-copied = Kopiert

### Password Field
framework-passwordField =
  .showPasswordTitle = Vis passord
  .hidePasswordTitle = Skjul passord

### Markdown Editor
framework-markdownEditor-bold = Fet
framework-markdownEditor-italic = Kursiv
framework-markdownEditor-titleSubtitleHeading = Tittel, undertittel, overskrift
framework-markdownEditor-quote = Sitat
framework-markdownEditor-genericList = Unummerert liste
framework-markdownEditor-numberedList = Nummerert liste
framework-markdownEditor-createLink = Opprett lenke
framework-markdownEditor-insertImage = Sett inn bilde
framework-markdownEditor-togglePreview = Forhåndsvis
framework-markdownEditor-toggleSideBySide = Vis side ved side
framework-markdownEditor-toggleFullscreen = Vis fullskjerm
framework-markdownEditor-markdownGuide = Syntaks-guide

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minutt
      *[other] minutter
    }
    [hour] { $value ->
      [1] time
      *[other] timer
    }
    [day] { $value ->
      [1] dag
      *[other] dager
    }
    [week] { $value ->
      [1] uke
      *[other] uker
    }
    *[other] ukjent enhet
  }

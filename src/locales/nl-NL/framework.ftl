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

framework-validation-required = Dit veld is verplicht.
framework-validation-tooShort = Minimaal {$minLength} tekens.
framework-validation-tooLong = Maximaal {$maxLength} tekens.
framework-validation-usernameTooShort = Gebruikersnaam moet uit minimaal {$minLength} tekens bestaan.
framework-validation-usernameTooLong = Gebruikersnamen mogen niet langer zijn dan {$maxLength} tekens.
framework-validation-invalidCharacters = Ongeldige tekens. Probeer opnieuw.
framework-validation-invalidEmail = Vul een geldig e-mailadres in.
framework-validation-passwordTooShort = Wachtwoord moet uit minimaal {$minLength} tekens bestaan.
framework-validation-passwordsDoNotMatch = Wachtwoorden komen niet overeen. Probeer opnieuw.
framework-validation-invalidURL = Ongeldige URL
framework-validation-emailsDoNotMatch = E-mailadressen komen niet overeen. Probeer opnieuw.
framework-validation-notAWholeNumberBetween = Vul een rond getal in tussen { $min } en { $max }.
framework-validation-notAWholeNumberGreaterThan = Vul een rond getal in groter dan { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Vul een rond getal in gelijk aan of groter dan { $x }
framework-validation-usernamesDoNotMatch = Gebruikersnamen komen niet overeen. Probeer opnieuw.
framework-validation-deleteConfirmationInvalid = Incorrecte bevestiging. Probeer opnieuw.
framework-validation-invalidWebhookEndpointEventSelection = Selecteer minimaal een optie.
framework-validation-media-url-invalid = Vul een geldig bestandstype in (.png, .jpg, of .gif)

framework-timeago-just-now = Nu

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] seconden
    }
    [minute] { $value ->
      [1] minuut
      *[other] minuten
    }
    [hour] { $value ->
      [1] uur
      *[other] uren
    }
    [day] { $value ->
      [1] dag
      *[other] dagen
    }
    [week] { $value ->
      [1] week
      *[other] weken
    }
    [month] { $value ->
      [1] maand
      *[other] maanden
    }
    [year] { $value ->
      [1] jaar
      *[other] jaren
    }
    *[other] Onbekende eenheid
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} geleden
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopieer
framework-copyButton-copied = Gekopieerd

### Password Field
framework-passwordField =
  .showPasswordTitle = Toon wachtwoord
  .hidePasswordTitle = Verberg wachtwoord

### Markdown Editor
framework-markdownEditor-bold = Vet
framework-markdownEditor-italic = Cursief
framework-markdownEditor-titleSubtitleHeading = Titel, Ondertitel, kopje
framework-markdownEditor-quote = Quote
framework-markdownEditor-genericList = Opsommingstekens
framework-markdownEditor-numberedList = Nummering
framework-markdownEditor-createLink = Maak link aan
framework-markdownEditor-insertImage = Voeg afbeelding toe
framework-markdownEditor-togglePreview = Toon preview
framework-markdownEditor-toggleSideBySide = Toon naast elkaar
framework-markdownEditor-toggleFullscreen = Toon Fullscreen
framework-markdownEditor-markdownGuide = Markdown-gids

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Seconde
      *[other] Seconden
    }
    [minute] { $value ->
      [1] Minuut
      *[other] Minuten
    }
    [hour] { $value ->
      [1] Uur
      *[other] Uren
    }
    [day] { $value ->
      [1] Dag
      *[other] Dagen
    }
    [week] { $value ->
      [1] Week
      *[other] Weken
    }
    *[other] onbekend eenheid
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Ster
    *[other] {$value} Sterren
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Er heeft zich een onverwachte netwerkfout voorgedaan. Probeer het later nogmaals.
framework-error-relayNetworkRequestError-code = Code

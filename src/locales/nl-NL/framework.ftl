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

framework-validation-required = Verplicht veld.
framework-validation-tooShort = Gebruik minimaal {$minLength} karakaters.
framework-validation-tooLong = Gebruik maximaal {$maxLength} karakters.
framework-validation-usernameTooShort = Gebruikersnaam moet minimaal {$minLength} karakters bevatten.
framework-validation-usernameTooLong = Gebruikersnaam kan niet meer dan {$maxLength} karakters bevatten.
framework-validation-invalidCharacters = Ongeldige karkaters. Probeer opnieuw.
framework-validation-invalidEmail = Gebruik een geldig e-mailadres.
framework-validation-passwordTooShort = Wachtwoord moet tenminste {$minLength} karakters bevatten.
framework-validation-passwordsDoNotMatch = Wachtwoorden komen niet overeen. Probeer opnieuw.
framework-validation-invalidURL = Ongeldige URL
framework-validation-emailsDoNotMatch = E-mailadressen komen niet overeen. Probeer opnieuw.
framework-validation-notAWholeNumberBetween = Gebruik een heel getal tussen { $min } en { $max }.
framework-validation-notAWholeNumberGreaterThan = Gebruik een heel getal groter dan { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Gebruik een heel getal groter of gelijk aan { $x }


framework-timeago-just-now = Zojuist

framework-timeago-time =
  { $value }
  { $unit ->
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
    *[other] onbekende eenheid
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
framework-markdownEditor-italic = Schuin
framework-markdownEditor-titleSubtitleHeading = Titel, Sub-titel, Kop
framework-markdownEditor-quote = Quote
framework-markdownEditor-genericList = Generieke lijst
framework-markdownEditor-numberedList = Genummerde lijst
framework-markdownEditor-createLink = Creëer link
framework-markdownEditor-insertImage = Afbeelding invoegen
framework-markdownEditor-togglePreview = Toon voorbeeld
framework-markdownEditor-toggleSideBySide = Toon naast elkaar
framework-markdownEditor-toggleFullscreen = Toon volledig scherm
framework-markdownEditor-markdownGuide = Markdown Guide

### Duration Field
framework-durationField-seconds = { $value ->
   [1]      Seconde
  *[others] Seconden
}
framework-durationField-minutes = { $value ->
   [1]      Minuut
  *[others] Minuten
}
framework-durationField-hours = { $value ->
   [1]      Uur
  *[others] Uren
}
framework-durationField-days = { $value ->
   [1]      Dag
  *[others] Dagen
}
framework-durationField-weeks = { $value ->
   [1]      Week
  *[others] Weken
}

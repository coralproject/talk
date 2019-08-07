### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0,0K
framework-shortNumber-10000 = 00K
framework-shortNumber-100000 = 000K
framework-shortNumber-1000000 = 0,0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0,0B

## Validation

framework-validation-required = Dette felt er påkrævet.
framework-validation-tooShort = Indtast mindst {$minLength} tegn.
framework-validation-tooLong = Indtast maks. {$maxLength} tegn.
framework-validation-usernameTooShort = Brugernavn skal indeholde mindst {$minLength} tegn.
framework-validation-usernameTooLong = Brugernavne kan ikke være længere end {$maxLength} tegn.
framework-validation-invalidCharacters = Ugyldige tegn. Prøv igen.
framework-validation-invalidEmail = Indtast venligst en gyldig e-mailadresse.
framework-validation-passwordTooShort = Adgangskode skal indeholde mindst {$minLength} tegn.
framework-validation-passwordsDoNotMatch = Adgangskoderne stemmer ikke overens. Prøv igen.
framework-validation-invalidURL = Ugyldig URL
framework-validation-emailsDoNotMatch = E-mails stemmer ikke overens. Prøv igen.
framework-validation-notAWholeNumberBetween = Indtast et helt tal mellem { $min } og { $max }.
framework-validation-notAWholeNumberGreaterThan = Indtast et helt tal større end { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Indtast et helt tal større end eller lig med { $x }


framework-timeago-just-now = Lige nu

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minutter
    }
    [hour] { $value ->
      [1] time
      *[other] timer
    }
    [day] { $value ->
      [1] dag
      *[other] dage
    }
    [week] { $value ->
      [1] uge
      *[other] uger
    }
    [month] { $value ->
      [1] måned
      *[other] måneder
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] unknown unit
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} siden
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopi
framework-copyButton-copied = Kopieret

### Password Field
framework-passwordField =
  .showPasswordTitle = Vis adgangskode
  .hidePasswordTitle = Skjul adgangskode

### Markdown Editor
framework-markdownEditor-bold = Fed
framework-markdownEditor-italic = Kursiv
framework-markdownEditor-titleSubtitleHeading = Titel, Undertitel, Overskrift
framework-markdownEditor-quote = Citat
framework-markdownEditor-genericList = Generisk liste
framework-markdownEditor-numberedList = Nummereret liste
framework-markdownEditor-createLink = Opret link
framework-markdownEditor-insertImage = Indsæt billede
framework-markdownEditor-togglePreview = Skift preview
framework-markdownEditor-toggleSideBySide = Skift side om side
framework-markdownEditor-toggleFullscreen = Skift fuldskærm
framework-markdownEditor-markdownGuide = Markdown-guide

### Duration Field
framework-durationField-seconds = { $value ->
   [1]      Sekund
  *[others] Sekunder
}
framework-durationField-minutes = { $value ->
   [1]      Minut
  *[others] Minutter
}
framework-durationField-hours = { $value ->
   [1]      Time
  *[others] Timer
}
framework-durationField-days = { $value ->
   [1]      Dag
  *[others] Dage
}
framework-durationField-weeks = { $value ->
   [1]      Uge
  *[others] Uger
}

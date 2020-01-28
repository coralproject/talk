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

framework-validation-required = Var god fyll i fältet.
framework-validation-tooShort = Fältet måste bestå av minst {$minLength} tecken.
framework-validation-tooLong = Fältet får inte bestå av mer än {$maxLength} tecken.
framework-validation-usernameTooShort = Användarnamnet måste bestå av minst {$minLength} tecken.
framework-validation-usernameTooLong = Användarnamnet får inte vara längre än {$maxLength} tecken.
framework-validation-invalidCharacters = Ogiltiga tecken. Försök igen.
framework-validation-invalidEmail = Var god ange en korrekt epostadress.
framework-validation-passwordTooShort = Lösenordet måste bestå av minst {$minLength} tecken.
framework-validation-passwordsDoNotMatch = Lösenorden stämmer inte överrens. Försök igen.
framework-validation-invalidURL = Ogiltig URL
framework-validation-emailsDoNotMatch = Epostadresserna stämmer inte överrens. Försök igen.
framework-validation-notAWholeNumberBetween = Var god fyll i ett heltal mellan { $min } och { $max }.
framework-validation-notAWholeNumberGreaterThan = Var god fyll i ett heltal större än { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Var god fyll i ett heltal större eller lika stort som { $x }
framework-validation-usernamesDoNotMatch = Användarnamnen matchar inte. Försök igen.
framework-validation-deleteConfirmationInvalid = Ogiltig bekräftelse. Försök igen.

framework-timeago-just-now = Just nu

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    [month] { $value ->
      [1] månad
      *[other] månader
    }
    [year] { $value ->
      [1] år
      *[other] år
    }
    *[other] okänd enhet
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} sedan
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Kopiera
framework-copyButton-copied = Kopierad

### Password Field
framework-passwordField =
  .showPasswordTitle = Visa lösenord
  .hidePasswordTitle = Dölj lösenord

### Markdown Editor
framework-markdownEditor-bold = Fet
framework-markdownEditor-italic = Kursiv
framework-markdownEditor-titleSubtitleHeading = Titel, Mellanrubrik, Rubrik
framework-markdownEditor-quote = Citat
framework-markdownEditor-genericList = generisk lista
framework-markdownEditor-numberedList = Numrerad lista
framework-markdownEditor-createLink = Skapa länk
framework-markdownEditor-insertImage = Infoga bild
framework-markdownEditor-togglePreview = Toggla förhandsgranskning
framework-markdownEditor-toggleSideBySide = Toggla sida vid sida
framework-markdownEditor-toggleFullscreen = Toggle helskärm
framework-markdownEditor-markdownGuide = Guide för Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] sekund
      *[other] sekunder
    }
    [minute] { $value ->
      [1] minut
      *[other] minuter
    }
    [hour] { $value ->
      [1] timme
      *[other] timmar
    }
    [day] { $value ->
      [1] dag
      *[other] dagar
    }
    [week] { $value ->
      [1] vecka
      *[other] veckor
    }
    *[other] okänd enhet
  }

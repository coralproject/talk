### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0,0tys
framework-shortNumber-10000 = 00tys
framework-shortNumber-100000 = 000tys
framework-shortNumber-1000000 = 0,0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0,0mld

## Validation

framework-validation-required = To pole jest wymagane.
framework-validation-tooShort = Wprowadź przynajmniej {$minLength} znaków.
framework-validation-tooLong = Wprowadź nie więcej znaków niż {$maxLength}.
framework-validation-usernameTooShort = Login musi mieć przynajmniej {$minLength} znaków.
framework-validation-usernameTooLong = Login może mieć nie więcej znaków niż {$maxLength}.
framework-validation-invalidCharacters = Niedozwolone znaki.
framework-validation-invalidEmail = Podaj prawidłowy adres email.
framework-validation-passwordTooShort = Hasło musi mieć przynajmniej {$minLength} znaków.
framework-validation-passwordsDoNotMatch = Hasła się nie zgadzają.
framework-validation-invalidURL = Nieprawidłowy adres URL.
framework-validation-emailsDoNotMatch = Adresy email nie zgadzają się. Spróbuj jeszcze raz.
framework-validation-notAWholeNumberBetween = Prosimy wprowadź liczbę między { $min } a { $max }.
framework-validation-notAWholeNumberGreaterThan = Prosimy wprowadź liczbę większą niż { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Prosimy wprowadź liczbę większą lub równą { $x }
framework-validation-usernamesDoNotMatch = Loginy się nie zgadzają. Spróbuj jeszcze raz.
framework-validation-deleteConfirmationInvalid = Niewłaściwe potwierdzenie. Spróbuj jeszcze raz.
framework-validation-invalidWebhookEndpointEventSelection = Wybierz przynajmniej jeden rodzaj.
framework-validation-media-url-invalid = Prosimy o podanie prawidłowego adresu URL obrazka (.png, .jpg, lub .gif)

framework-timeago-just-now = teraz

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [one] sekundę
      [few] sekundy
      *[many] sekund
    }
    [minute] { $value ->
      [one] minutę
      [few] minuty
      *[many] minut
    }
    [hour] { $value ->
      [one] godzinę
      [few] godziny
      *[many] godzin
    }
    [day] { $value ->
      [one] dzień
      *[other] dni
    }
    [week] { $value ->
      [one] tydzień
      [few] tygodnie
      *[many] tygodni
    }
    [month] { $value ->
      [one] miesiąc
      [few] miesiące
      *[many] miesięcy
    }
    [year] { $value ->
      [one] rok
      [few] lata
      *[many] lat
    }
    *[other] nieznana jednostka
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} temu
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Skopiuj
framework-copyButton-copied = Skopiowane

### Password Field
framework-passwordField =
  .showPasswordTitle = Pokaż hasło
  .hidePasswordTitle = Ukryj hasło

### Markdown Editor
framework-markdownEditor-bold = Pogrubienie
framework-markdownEditor-italic = Kursywa
framework-markdownEditor-titleSubtitleHeading = Tytuł, Podtytuł, Nagłówek
framework-markdownEditor-quote = Cytat
framework-markdownEditor-genericList = Lista
framework-markdownEditor-numberedList = Lista numerowana
framework-markdownEditor-createLink = Stwórz link
framework-markdownEditor-insertImage = Wstaw zdjęcie
framework-markdownEditor-togglePreview = Przełącz podgląd
framework-markdownEditor-toggleSideBySide = Przełącz obok siebie
framework-markdownEditor-toggleFullscreen = Przełącz pełen ekran
framework-markdownEditor-markdownGuide = Przewodnik po Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] sekunda
      [few] sekundy
      *[many] sekund
    }
    [minute] { $value ->
      [one] minuta
      [few] minuty
      *[many] minut
    }
    [hour] { $value ->
      [one] godzina
      [few] godziny
      *[many] godzin
    }
    [day] { $value ->
      [one] dzień
      *[other] dni
    }
    [week] { $value ->
      [one] tydzień
      [few] tygodnie
      *[many] tygodni
    }
    *[other] nieznana jednostka
  }

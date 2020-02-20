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

framework-validation-required = To pole jest wymagane.
framework-validation-tooShort = Wprowadź przynajmniej {$minLength} znaków.
framework-validation-tooLong = Wprowadź nie więcej niż {$maxLength} znaków.
framework-validation-usernameTooShort = Login musi mieć przynajmniej {$minLength} znaków.
framework-validation-usernameTooLong = Login może mieć nie więcej niż {$maxLength} znaków.
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

framework-timeago-just-now = Teraz

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[other] sekund
    }
    [minute] { $value ->
      [1] minuta
      *[other] minut
    }
    [hour] { $value ->
      [1] godzina
      *[other] godzin
    }
    [day] { $value ->
      [1] dzień
      *[other] dni
    }
    [week] { $value ->
      [1] tydzień
      *[other] tygodni
    }
    [month] { $value ->
      [1] miesiąc
      *[other] miesięcy
    }
    [year] { $value ->
      [1] rok
      *[other] lat
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
      [1] Sekunda
      *[other] Sekund
    }
    [minute] { $value ->
      [1] Minuta
      *[other] Minut
    }
    [hour] { $value ->
      [1] Godzina
      *[other] Godzin
    }
    [day] { $value ->
      [1] Dzień
      *[other] Dni
    }
    [week] { $value ->
      [1] Tydzień
      *[other] Tygodni
    }
    *[other] nieznana jednostka
  }

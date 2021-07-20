### Localizations for framework.
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

framework-validation-required = Dies ist ein Pflichtpfeld.
framework-validation-tooShort = Bitte mindestens {$minLength} Zeichen eingeben.
framework-validation-tooLong = Bitte maximal {$maxLength} Zeichen eingeben.
framework-validation-usernameTooShort = Der Benutzername muss mindestens {$minLength} Zeichen enthalten.
framework-validation-usernameTooLong = Der Benutzername darf maximal {$maxLength} Zeichen lang sein.
framework-validation-invalidCharacters = Nicht zulässige Zeichen. Bitte nochmals versuchen.
framework-validation-invalidEmail = Bitte gib eine gültige E-Mail ein.
framework-validation-passwordTooShort = Das Passwort muss mindestens {$minLength} Zeichen enthalten.
framework-validation-passwordsDoNotMatch = Passwörter stimmen nicht überein. Bitte noch einmal probieren.
framework-validation-invalidURL = Ungültige URL
framework-validation-emailsDoNotMatch = Die Email Addressen stimmen nicht überein. Bitte noch einmal probieren.
framework-validation-notAWholeNumberBetween = Bitte gib eine ganze Zahl zwischen { $min } und { $max } ein.
framework-validation-notAWholeNumberGreaterThan = Bitte gib eine ganze Zahl ein, welche grösser ist als { $x }.
framework-validation-notAWholeNumberGreaterThanOrEqual = Bitte gib eine ganze Zahl ein, welche grösser ist als oder gleich { $x } ist.
framework-validation-usernamesDoNotMatch = Benutzernamen stimmen nicht überein. Bitte noch einmal probieren.
framework-validation-deleteConfirmationInvalid = Falsche Bestätigung. Bitte noch einmal probieren.
framework-validation-invalidWebhookEndpointEventSelection = Bitte wähle mindestens ein Event aus, welches du erhalten möchtest.
framework-validation-media-url-invalid = Bitte gib eine gültige Bild URL ein (.png, .jpg, or .gif).

framework-timeago-just-now = Gerade eben

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] Sekunde
      *[other] Sekunden
    }
    [minute] { $value ->
      [1] Minute
      *[other] Minuten
    }
    [hour] { $value ->
      [1] Stunde
      *[other] Stunden
    }
    [day] { $value ->
      [1] Tag
      *[other] Tage
    }
    [week] { $value ->
      [1] Woche
      *[other] Wochen
    }
    [month] { $value ->
      [1] monat
      *[other] Monate
    }
    [year] { $value ->
      [1] Jahr
      *[other] Jahre
    }
    *[other] Unbekannte Einheit
  }

framework-timeago =
  { $suffix ->
     [ago] vor
    *[unknown] unbekannt
  }
  { $value }
  { $unit ->
    [second] { $value ->
       [1] Sekunde
      *[other] Sekunden
    }
    [minute] { $value ->
       [1] Minute
      *[other] Minuten
    }
    [hour] { $value ->
       [1] Stunde
      *[other] Stunden
    }
    [day] { $value ->
       [1] Tag
      *[other] Tage
    }
    [week] { $value ->
       [1] Woche
      *[other] Wochen
    }
    [month] { $value ->
      [1] Monat
      *[other] Monaten
    }
    [year] { $value ->
       [1] Jahr
      *[other] Jahren
    }
    *[other] unbekannte Einheit
  }
  
## Components

### Copy Button

framework-copyButton-copy = Kopieren
framework-copyButton-copied = Kopiert

### Password Field
framework-passwordField =
  .showPasswordTitle = Passwort anzeigen
  .hidePasswordTitle = Passwort verbergen

### Markdown Editor
framework-markdownEditor-bold = Fett
framework-markdownEditor-italic = Kursiv
framework-markdownEditor-titleSubtitleHeading = Titel, Untertitel, Überschrift
framework-markdownEditor-quote = Zitat
framework-markdownEditor-genericList = Generische Liste
framework-markdownEditor-numberedList = Numerische Liste
framework-markdownEditor-createLink = Link erstellen
framework-markdownEditor-insertImage = Bild einfügen
framework-markdownEditor-togglePreview = Vorschau ein-/ ausblenden
framework-markdownEditor-toggleSideBySide = Seite an Seite ein-/ ausblenden
framework-markdownEditor-toggleFullscreen = Vollbild ein-/ ausblenden
framework-markdownEditor-markdownGuide = Markdown Guide

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Sekunde
      *[other] Sekunden
    }
    [minute] { $value ->
      [1] Minute
      *[other] Minuten
    }
    [hour] { $value ->
      [1] Stunde
      *[other] Stunden
    }
    [day] { $value ->
      [1] Tag
      *[other] Tage
    }
    [week] { $value ->
      [1] Woche
      *[other] Wochen
    }
    *[other] unknown unit
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Stern
    *[other] {$value} Sterne
  }

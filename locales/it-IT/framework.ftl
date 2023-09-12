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

framework-validation-required = Questo campo è richiesto.
framework-validation-tooShort = Inserisci minimo {$minLength} caratteri.
framework-validation-tooLong = Inserisci al massimo {$maxLength} caratteri.
framework-validation-usernameTooShort = L’username deve contenere almeno {$minLength} caratteri.
framework-validation-usernameTooLong = Gli usernames non possono essere più lunghi di {$maxLength} caratteri.
framework-validation-invalidCharacters = Caratteri non validi. Provare di nuovo.
framework-validation-invalidEmail = Inserisci un indirizzo e-mail valido.
framework-validation-passwordTooShort = La password deve contenere almeno {$minLength} caratteri.
framework-validation-passwordsDoNotMatch = La password non corrispondono. Prova di nuovo.
framework-validation-invalidURL = URL non valido.
framework-validation-emailsDoNotMatch = Le e-mail non corrispondono. Prova di nuovo.
framework-validation-notAWholeNumberBetween = Si prega di inserire un numero intero tra { $min } e { $max }.
framework-validation-notAWholeNumberGreaterThan = Si prega di inserire un numero intero maggiore di { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Si prega di inserire un numero intero maggiore o uguale a { $x }
framework-validation-usernamesDoNotMatch = Gli username non corrispondono. Prova di nuovo.
framework-validation-deleteConfirmationInvalid = Conferma errata. Prova di nuovo.
framework-validation-invalidWebhookEndpointEventSelection = Seleziona almeno un evento da ricevere.
framework-validation-media-url-invalid = Per favore inserisci un URL valido dell'immagine (.png, .jpg, or .gif)

framework-timeago-just-now = Proprio ora

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] secondo
      *[other] seconds
    }
    [minute] { $value ->
      [1] minuto
      *[other] minuti
    }
    [hour] { $value ->
      [1] ora
      *[other] ore
    }
    [day] { $value ->
      [1] day
      *[other] giorni
    }
    [week] { $value ->
      [1] settimana
      *[other] settimane
    }
    [month] { $value ->
      [1] mese
      *[other] mesi
    }
    [year] { $value ->
      [1] anno
      *[other] anni
    }
    *[other] unità sconosciuta
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} fa
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Copia
framework-copyButton-copied = Copiato

### Password Field
framework-passwordField =
  .showPasswordTitle = Mostra password
  .hidePasswordTitle = Nascondi password

### Markdown Editor
framework-markdownEditor-bold = Grassetto
framework-markdownEditor-italic = Corsivo
framework-markdownEditor-titleSubtitleHeading = Titolo, sottotitolo, intestazione
framework-markdownEditor-quote = Citazione
framework-markdownEditor-genericList = Lista Generica
framework-markdownEditor-numberedList = List Numerata
framework-markdownEditor-createLink = Crea link
framework-markdownEditor-insertImage = Inserisci immagine
framework-markdownEditor-togglePreview = Toggle Preview
framework-markdownEditor-toggleSideBySide = Toggle Side by Side
framework-markdownEditor-toggleFullscreen = Toggle Fullscreen
framework-markdownEditor-markdownGuide = Markdown Guide

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Secondo
      *[other] Secondi
    }
    [minute] { $value ->
      [1] Minuto
      *[other] Minuti
    }
    [hour] { $value ->
      [1] Ora
      *[other] Ore
    }
    [day] { $value ->
      [1] Giorno
      *[other] Giorni
    }
    [week] { $value ->
      [1] Settimana
      *[other] Settimane
    }
    *[other] unità sconosciuta
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 stella
    *[other] {$value} stelle
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError = 
  Si è verificato un errore di rete inaspettato, riprova più tardi.
framework-error-relayNetworkRequestError-code = Codice
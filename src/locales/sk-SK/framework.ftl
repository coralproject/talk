### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0,0k
framework-shortNumber-10000 = 00k
framework-shortNumber-100000 = 000k
framework-shortNumber-1000000 = 0,0M
framework-shortNumber-10000000 = 00M
framework-shortNumber-100000000 = 000M
framework-shortNumber-1000000000 = 0,0B

## Validation

framework-validation-required = Toto pole je povinné.
framework-validation-tooShort = Zadajte aspoň {$minLength} znakov.
framework-validation-tooLong = Zadajte maximálne {$maxLength} znakov.
framework-validation-usernameTooShort = Používateľské meno musí obsahovať aspoň {$minLength} znakov.
framework-validation-usernameTooLong = Používateľské meno nemôže byť dlhšie ako {$maxLength} znakov.
framework-validation-invalidCharacters = Neplatné znaky.
framework-validation-invalidEmail = Prosím zadajte platnú e-mailovú adresu.
framework-validation-passwordTooShort = Heslo musí obsahovať aspoň {$minLength} znakov.
framework-validation-passwordsDoNotMatch = Heslá sa nezhodujú.
framework-validation-invalidURL = Neplatná URL
framework-validation-emailsDoNotMatch = Heslá sa nezhodujú.
framework-validation-notAWholeNumberBetween = Zadajte celé číslo medzi { $min } a { $max }.
framework-validation-notAWholeNumberGreaterThan = Zadajte celé číslo väčšie ako { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Zadajte celé číslo väčšie alebo rovné { $x }
framework-validation-usernamesDoNotMatch = Používateľské mená sa nezhodujú.
framework-validation-deleteConfirmationInvalid = Nesprávne potvrdenie. Skúste to znova.
framework-validation-invalidWebhookEndpointEventSelection = Vyberte aspoň jednu udalosť, ktorú chcete prijať.
framework-validation-media-url-invalid = Zadajte platnú webovú adresu obrázka (.png, .jpg alebo .gif)
framework-validation-invalidEmailDomain = Neplatný formát e-mailovej domény.
framework-validation-invalidExternalProfileURL = Všetky URL adresy externých profilov musia vo vzore obsahovať $USER_NAME alebo $USER_ID.

framework-timeago-just-now = Práve teraz

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekunda
      *[few] sekundy
      *[many] sekúnd
    }
    [minute] { $value ->
      [1] minúta
      [few] minúty
      *[many] minút
    }
    [hour] { $value ->
      [1] hodina
      [few] hodiny
      *[many] hodín
    }
    [day] { $value ->
      [1] deň
      [few] dni
      *[many] dní
    }
    [week] { $value ->
      [1] týždeň
      [few] týždne
      *[many] týždňov
    }
    [month] { $value ->
      [1] mesiac
      [few] mesiace
      *[many] mesiacov
    }
    [year] { $value ->
      [1] rok
      [few] roky
      *[many] rokov
    }
    *[other] neznáma jednotka
  }

framework-timeago-time-prefix =
  { $value } { $unit ->
    [second] { $value ->
      [1] sekundou
      *[other] sekundami
    }
    [minute] { $value ->
      [1] minútou
      *[other] minútami
    }
    [hour] { $value ->
      [1] hodinou
      *[other] hodinami
    }
    [day] { $value ->
      [1] dňom
      *[other] dňami
    }
    [week] { $value ->
      [1] týždňom
      *[other] týždňami
    }
    [month] { $value ->
      [1] mesiac
      *[other] mesiacmi
    }
    [year] { $value ->
      [1] rokom
      *[other] rokmi
    }
    *[other] neznáma jednotka
  }

framework-timeago =
  { $suffix ->
    [ago] pred {framework-timeago-time-prefix}
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Skopírovať
framework-copyButton-copied = Skopírované

### Password Field
framework-passwordField =
  .showPasswordTitle = Skryť heslo
  .hidePasswordTitle = Heslo skryté

### Markdown Editor
framework-markdownEditor-bold = Tučné
framework-markdownEditor-italic = Šikmé
framework-markdownEditor-titleSubtitleHeading = Titulok, Podtitulok, Hlavička
framework-markdownEditor-quote = Citát
framework-markdownEditor-genericList = Zoznam
framework-markdownEditor-numberedList = Číslovaný zoznam
framework-markdownEditor-createLink = Vytvoriť odkaz
framework-markdownEditor-insertImage = Vložiť obrázok
framework-markdownEditor-togglePreview = Zapnúť náhlaď
framework-markdownEditor-toggleSideBySide = Náhľad bok po boku
framework-markdownEditor-toggleFullscreen = Zapnúť celoobrazovkový mód
framework-markdownEditor-markdownGuide = Markdown návod

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] sekunda
      [2] sekundy
      [3] sekundy
      [4] sekundy
      *[other] sekúnd
    }
    [minute] { $value ->
      [1] minúta
      [2] minúty
      [3] minúty
      [4] minúty
      *[other] minút
    }
    [hour] { $value ->
      [1] hodina
      [2] hodiny
      [3] hodiny
      [4] hodiny
      *[other] hodín
    }
    [day] { $value ->
      [1] deň
      [2] dni
      [3] dni
      [4] dni
      *[other] dní
    }
    [week] { $value ->
      [1] týždeň
      [2] týždne
      [3] týždne
      [4] týždne
      *[other] týždňov
    }
    *[other] neznáma jednotka
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 hviezda
    [2] 2 hviezdy
    [3] 3 hviezdy
    [4] 4 hviezdy
    *[other] {$value} hviezd
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Neočakávaná chyba siete, skúste to prosím neskôr.
framework-error-relayNetworkRequestError-code = Kód

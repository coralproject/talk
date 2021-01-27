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

framework-validation-required = Ce champ est requis.
framework-validation-tooShort = Veuillez entrer au moins {$minLength} caractères.
framework-validation-tooLong = Veuillez entrer au maximum {$maxLength} caractères.
framework-validation-usernameTooShort = Le pseudo doit contenir au minimum {$minLength} caractères.
framework-validation-usernameTooLong = Le pseudo ne peut pas posséder plus de {$maxLength} caractères.
framework-validation-invalidCharacters = Caractères invalides. Veuillez réessayer.
framework-validation-invalidEmail = Veuillez entrer une adresse email valide.
framework-validation-passwordTooShort = Le mot de passe doit contenir au moins {$minLength} caractères.
framework-validation-passwordsDoNotMatch = Les mots de passe ne correspondent pas. Veuillez réessayer.
framework-validation-invalidURL = URL invalide.
framework-validation-emailsDoNotMatch = Les emails ne correspondent pas. Veuillez réessayer.
framework-validation-notAWholeNumberBetween = Veuillez entrer un nombre entre { $min } et { $max }.
framework-validation-notAWholeNumberGreaterThan = Veuillez entrer un nombre entier supérieur à { $x }.
framework-validation-notAWholeNumberGreaterThanOrEqual = Veuillez entrer un nombre entier supérieur ou égal à { $x }.
framework-validation-usernamesDoNotMatch = Les pseudos ne correspondent pas. Veuillez réessayer.
framework-validation-deleteConfirmationInvalid = Confirmation incorrecte. Veuillez réessayer.
framework-validation-invalidWebhookEndpointEventSelection = Sélectionnez au moins un événement à recevoir.
framework-validation-media-url-invalid = Entrez une URL d'image valide (.png, .jpg, ou .gif)

framework-timeago-just-now = A l'instant

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [1] seconde
      *[other] secondes
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] heure
      *[other] heures
    }
    [day] { $value ->
      [1] jour
      *[other] jours
    }
    [week] { $value ->
      [1] semaine
      *[other] semaines
    }
    [month] { $value ->
      [1] mois
      *[other] mois
    }
    [year] { $value ->
      [1] année
      *[other] années
    }
    *[other] unité inconnue
  }

framework-timeago =
  { $suffix ->
    [ago] Il y a {framework-timeago-time}
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Copier
framework-copyButton-copied = Copié

### Password Field
framework-passwordField =
  .showPasswordTitle = Montrer le mot de passe
  .hidePasswordTitle = Cacher le mot de passe

### Markdown Editor
framework-markdownEditor-bold = Gras
framework-markdownEditor-italic = Italique
framework-markdownEditor-titleSubtitleHeading = Titre, sous-titre, intertitre
framework-markdownEditor-quote = Citation
framework-markdownEditor-genericList = Liste générique
framework-markdownEditor-numberedList = Liste numérotée
framework-markdownEditor-createLink = Créer un lien
framework-markdownEditor-insertImage = Insérer une image
framework-markdownEditor-togglePreview = Basculer vers l'aperçu
framework-markdownEditor-toggleSideBySide = Basculer côte-à-côte
framework-markdownEditor-toggleFullscreen = Basculer vers le plein écran
framework-markdownEditor-markdownGuide = Guide pour Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Seconde
      *[other] Secondes
    }
    [minute] { $value ->
      [1] Minute
      *[other] Minutes
    }
    [hour] { $value ->
      [1] Heure
      *[other] Heures
    }
    [day] { $value ->
      [1] Jour
      *[other] Jours
    }
    [week] { $value ->
      [1] Semaine
      *[other] Semaines
    }
    *[other] unité inconnue
  }

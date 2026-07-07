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

framework-validation-required = Este campo é obrigatório.
framework-validation-tooShort = Por favor, introduza pelo menos {$minLength} caracteres.
framework-validation-tooLong = Por favor, introduza no máximo {$maxLength} caracteres.
framework-validation-usernameTooShort = O nome de utilizador deve conter pelo menos {$minLength} caracteres.
framework-validation-usernameTooLong = Os nomes de utilizador não podem ter mais de {$maxLength} caracteres.
framework-validation-invalidCharacters = Caracteres inválidos. Tente novamente.
framework-validation-invalidEmail = Por favor introduza um endereço de e-mail válido.
framework-validation-passwordTooShort = A palavra-passe deve conter pelo menos {$minLength} caracteres.
framework-validation-passwordsDoNotMatch = As palavras-passe não coincidem. Tente novamente.
framework-validation-invalidURL = URL inválido
framework-validation-emailsDoNotMatch = Os e-mails não coincidem. Tente novamente.
framework-validation-notAWholeNumberBetween = Por favor, introduza um número inteiro entre { $min } e { $max }.
framework-validation-notAWholeNumberGreaterThan = Por favor, introduza um número inteiro maior que { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Por favor introduza um número inteiro maior ou igual a { $x }
framework-validation-usernamesDoNotMatch = Os nomes de utilizador não coincidem. Tente novamente.
framework-validation-deleteConfirmationInvalid = Confirmação incorreta. Tente novamente.
framework-validation-invalidWebhookEndpointEventSelection = Selecione pelo menos um evento para receber.
framework-validation-media-url-invalid = Por favor, introduza um URL de imagem válido (.png, .jpg, ou .gif)
framework-validation-invalidEmailDomain = Formato de domínio de e-mail inválido. Por favor use "email.com"
framework-validation-invalidExternalProfileURL = Todos os padrões de URL de perfil externo devem conter $USER_NAME ou $USER_ID.

framework-timeago-just-now = Agora mesmo

framework-timeago-time =
  { $value }
  { $unit ->
    [second] { $value ->
      [1] segundo
      *[other] segundos
    }
    [minute] { $value ->
      [1] minuto
      *[other] minutos
    }
    [hour] { $value ->
      [1] hora
      *[other] horas
    }
    [day] { $value ->
      [1] dia
      *[other] dias
    }
    [week] { $value ->
      [1] semana
      *[other] semanas
    }
    [month] { $value ->
      [1] mês
      *[other] meses
    }
    [year] { $value ->
      [1] ano
      *[other] anos
    }
    *[other] unidade desconhecida
  }

framework-timeago =
  { $suffix ->
    [ago] há {framework-timeago-time}
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Copiar
framework-copyButton-copied = Copiado

### Password Field
framework-passwordField =
  .showPasswordTitle = Mostrar palavra-passe
  .hidePasswordTitle = Ocultar palavra-passe

### Markdown Editor
framework-markdownEditor-bold = Negrito
framework-markdownEditor-italic = Itálico
framework-markdownEditor-titleSubtitleHeading = Título, Subtítulo, Cabeçalho
framework-markdownEditor-quote = Citação
framework-markdownEditor-genericList = Lista Genérica
framework-markdownEditor-numberedList = Lista numerada
framework-markdownEditor-createLink = Criar Ligação
framework-markdownEditor-insertImage = Inserir Imagem
framework-markdownEditor-togglePreview = Alternar pré-visualização
framework-markdownEditor-toggleSideBySide = Alternar Lado a Lado
framework-markdownEditor-toggleFullscreen = Alternar Ecrã Completo
framework-markdownEditor-markdownGuide = Guia de Markdown

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Segundo
      *[other] Segundos
    }
    [minute] { $value ->
      [1] Minuto
      *[other] Minutos
    }
    [hour] { $value ->
      [1] Hora
      *[other] Horas
    }
    [day] { $value ->
      [1] Dia
      *[other] Dias
    }
    [week] { $value ->
      [1] Semana
      *[other] Semanas
    }
    *[other] unidade desconhecida
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Estrela
    *[other] {$value} Estrelas
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  Ocorreu um erro de rede inesperado. Por favor, tente novamente mais tarde.
framework-error-relayNetworkRequestError-code = Código

### Localizations for the framework.
### All keys must start with `framework` because this file is shared
### among different targets.

## Short Number

# Implementation based on unicode Short Number patterns
# http://cldr.unicode.org/translation/number-patterns#TOC-Short-Numbers

framework-shortNumber-1000 = 0.0 тыс
framework-shortNumber-10000 = 00 тыс
framework-shortNumber-100000 = 000 тыс
framework-shortNumber-1000000 = 0.0 млн
framework-shortNumber-10000000 = 00 млн
framework-shortNumber-100000000 = 000 млн
framework-shortNumber-1000000000 = 0.0 млрд

## Validation

framework-validation-required = Это поле обязательно к заполнению.
framework-validation-tooShort = Пожалуйста, введите не менее {$minLength} символов.
framework-validation-tooLong = Пожалуйста, введите не более {$maxLength} символов.
framework-validation-usernameTooShort = Имя пользователя должно содержать не менее {$minLength} символов.
framework-validation-usernameTooLong = Имя пользователя не может быть длиннее {$maxLength} символов.
framework-validation-invalidCharacters = Недопустимые символы. Попробуй еще раз.
framework-validation-invalidEmail = Пожалуйста, введите действительный адрес электронной почты.
framework-validation-passwordTooShort = Пароль должен содержать не менее {$minLength} символов.
framework-validation-passwordsDoNotMatch = Пароли не соответствуют. Попробуй еще раз.
framework-validation-invalidURL = Неверная ссылка
framework-validation-emailsDoNotMatch = Адреса электронной почты не совпадают. Попробуй еще раз.
framework-validation-notAWholeNumberBetween = Пожалуйста, введите целое число от {$min} до {$max}.
framework-validation-notAWholeNumberGreaterThan = Пожалуйста, введите целое число, больше чем { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Пожалуйста, введите целое число, большее или равное { $x }
framework-validation-usernamesDoNotMatch = Имя пользователя не совпадает. Попробуйте еще раз.
framework-validation-deleteConfirmationInvalid = Неверное подтверждение. Попробуйте еще раз.
framework-validation-invalidWebhookEndpointEventSelection = Выберите хотя бы одно событие для получения.

framework-timeago-just-now = Прямо сейчас

framework-timeago-time =
  { $value } { $unit ->
    [second] { $value ->
      [one] секунду
      [few] секунды
      *[many] секунд
    }
    [minute] { $value ->
      [one] минуту
      [few] минуты
      *[many] минут
    }
    [hour] { $value ->
      [one] час
      [few] часа
      *[many] часов
    }
    [day] { $value ->
      [one] день
      [few] дня
      *[many] дней
    }
    [week] { $value ->
      [one] неделю
      [few] недели
      *[many] недель
    }
    [month] { $value ->
      [one] месяц
      [few] месяца
      *[many] месяцев
    }
    [year] { $value ->
      [one] год
      [few] года
      *[many] лет
    }
    *[other] неизвестная единица времени
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} назад
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Копировать
framework-copyButton-copied = Скопировано

### Password Field
framework-passwordField =
  .showPasswordTitle = Показать пароль
  .hidePasswordTitle = Скрыть пароль

### Markdown Editor
framework-markdownEditor-bold = Жирный
framework-markdownEditor-italic = Курсив
framework-markdownEditor-titleSubtitleHeading = Заголовок, Подзаголовок, Название
framework-markdownEditor-quote = Цитата
framework-markdownEditor-genericList = Ненумерованный список
framework-markdownEditor-numberedList = Нумерованный список
framework-markdownEditor-createLink = Создать ссылку
framework-markdownEditor-insertImage = Вставить изображение
framework-markdownEditor-togglePreview = Предпросмотр
framework-markdownEditor-toggleSideBySide = Двойной режим
framework-markdownEditor-toggleFullscreen = Развернуть
framework-markdownEditor-markdownGuide = Markdown-руководство

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [one] Секунда
      [few] Секунды
      *[many] Секунд
    }
    [minute] { $value ->
      [one] Минута
      [few] Минуты
      *[many] Минут
    }
    [hour] { $value ->
      [one] Час
      [few] Часа
      *[many] Часов
    }
    [day] { $value ->
      [one] День
      [few] Дня
      *[many] Дней
    }
    [week] { $value ->
      [one] Неделя
      [few] Недели
      *[many] Недель
    }
    *[other] неизвестное значение
  }

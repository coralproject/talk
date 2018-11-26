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

framework-validation-required = This field is required.
framework-validation-tooShort = The field must contain at least {$minLength} characters.
framework-validation-usernameTooShort = Username must contain at least {$minLength} characters.
framework-validation-usernameTooLong = Usernames cannot be longer than {$maxLength} characters.
framework-validation-invalidCharacters = Invalid characters. Try again.
framework-validation-invalidEmail = Please enter a valid email address.
framework-validation-passwordTooShort = Password must contain at least {$minLength} characters.
framework-validation-passwordsDoNotMatch = Passwords do not match. Try again.
framework-validation-invalidURL = Invalid URL

framework-timeago-just-now = Just now

framework-timeago-time =
  { $value }
  { $unit ->
    [second] { $value ->
      [1] second
      *[other] seconds
    }
    [minute] { $value ->
      [1] minute
      *[other] minutes
    }
    [hour] { $value ->
      [1] hour
      *[other] hours
    }
    [day] { $value ->
      [1] day
      *[other] days
    }
    [week] { $value ->
      [1] week
      *[other] weeks
    }
    [month] { $value ->
      [1] month
      *[other] months
    }
    [year] { $value ->
      [1] year
      *[other] years
    }
    *[other] unknown unit
  }

framework-timeago =
  { $suffix ->
    [ago] {framework-timeago-time} ago
    [noSuffix] {framework-timeago-time}
  }

## Components

framework-copyButton-copy = Copy
framework-copyButton-copied = Copied
framework-passwordField =
  .showPasswordTitle = Show password
  .hidePasswordTitle = Hide password

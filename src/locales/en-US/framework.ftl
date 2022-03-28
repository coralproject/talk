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
framework-validation-tooShort = Please enter at least {$minLength} characters.
framework-validation-tooLong = Please enter at max {$maxLength} characters.
framework-validation-usernameTooShort = Username must contain at least {$minLength} characters.
framework-validation-usernameTooLong = Usernames cannot be longer than {$maxLength} characters.
framework-validation-invalidCharacters = Invalid characters. Try again.
framework-validation-invalidEmail = Please enter a valid email address.
framework-validation-passwordTooShort = Password must contain at least {$minLength} characters.
framework-validation-passwordsDoNotMatch = Passwords do not match. Try again.
framework-validation-invalidURL = Invalid URL
framework-validation-emailsDoNotMatch = Emails do not match. Try again.
framework-validation-notAWholeNumberBetween = Please enter a whole number between { $min } and { $max }.
framework-validation-notAWholeNumberGreaterThan = Please enter a whole number greater than { $x }
framework-validation-notAWholeNumberGreaterThanOrEqual = Please enter a whole number greater than or equal to { $x }
framework-validation-usernamesDoNotMatch = Usernames do not match. Try again.
framework-validation-deleteConfirmationInvalid = Incorrect confirmation. Try again.
framework-validation-invalidWebhookEndpointEventSelection = Select at least one event to receive.
framework-validation-media-url-invalid = Please enter a valid image URL (.png, .jpg, or .gif)
framework-validation-invalidEmailDomain = Invalid email domain format. Please use "email.com"
framework-validation-invalidExternalProfileURL = All external profile URL patterns must contain either $USER_NAME or $USER_ID.

framework-timeago-just-now = Just now

framework-timeago-time =
  { $value } { $unit ->
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
    *[noSuffix] {framework-timeago-time}
  }

## Components

### Copy Button
framework-copyButton-copy = Copy
framework-copyButton-copied = Copied

### Password Field
framework-passwordField =
  .showPasswordTitle = Show password
  .hidePasswordTitle = Hide password

### Markdown Editor
framework-markdownEditor-bold = Bold
framework-markdownEditor-italic = Italic
framework-markdownEditor-titleSubtitleHeading = Title, Subtitle, Heading
framework-markdownEditor-quote = Quote
framework-markdownEditor-genericList = Generic List
framework-markdownEditor-numberedList = Numbered List
framework-markdownEditor-createLink = Create Link
framework-markdownEditor-insertImage = Insert Image
framework-markdownEditor-togglePreview = Toggle Preview
framework-markdownEditor-toggleSideBySide = Toggle Side by Side
framework-markdownEditor-toggleFullscreen = Toggle Fullscreen
framework-markdownEditor-markdownGuide = Markdown Guide

### Duration Field

framework-durationField-unit =
  { $unit ->
    [second] { $value ->
      [1] Second
      *[other] Seconds
    }
    [minute] { $value ->
      [1] Minute
      *[other] Minutes
    }
    [hour] { $value ->
      [1] Hour
      *[other] Hours
    }
    [day] { $value ->
      [1] Day
      *[other] Days
    }
    [week] { $value ->
      [1] Week
      *[other] Weeks
    }
    *[other] unknown unit
  }

framework-starRating =
  .aria-label = { $value ->
    [1] 1 Star
    *[other] {$value} Stars
  }

### Relay Network Request Error

framework-error-relayNetworkRequestError-anUnexpectedNetworkError =
  An unexpected network error occurred, please try again later.
framework-error-relayNetworkRequestError-code = Code

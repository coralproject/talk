error-commentingDisabled = Keskustelu on poistettu käytöstä.
error-storyClosed = Keskustelu tästä jutusta on poistettu käytöstä.
error-commentBodyTooShort = Kommentissa on oltava vähintään {$min} merkkiä.
error-commentBodyExceedsMaxLength =
  Kommenttisi on liian pitkä. Se voi olla korkeintaan {$max} merkkiä.
error-storyURLNotPermitted =
  The specified story URL does not exist in the permitted domains list.
error-urlNotPermitted = The specified URL ({$url}) is not permitted.
error-duplicateStoryURL =  The specified story URL already exists.
error-tenantNotFound = Tenant hostname ({$hostname}) not found.
error-userNotFound = Käyttäjää ({$userID}) ei löydy.
error-notFound = Unrecognized request URL ({$method} {$path}).
error-tokenInvalid = Invalid API Token provided.

error-tokenNotFound = Specified token does not exist.
error-emailAlreadySet = Sähköpostiosoite on jo käytössä.
error-emailNotSet = Sähköpostiosoite puuttuu.
error-duplicateUser =
  Specified user already exists with a different login method.
error-duplicateEmail = Sähköpostiosoite on jo käytössä.
error-localProfileAlreadySet =
  Specified account already has a password set.
error-localProfileNotSet =
  Specified account does not have a password set.
error-usernameAlreadySet = Specified account already has their username set.
error-usernameContainsInvalidCharacters =
  Provided username contains invalid characters.
error-usernameExceedsMaxLength =
  Username exceeds maximum length of {$max} characters.
error-usernameTooShort =
  Username must have at least {$min} characters.
error-passwordTooShort =
  Password must have at least {$min} characters.
error-emailInvalidFormat =
  Provided email address does not appear to be a valid email.
error-emailExceedsMaxLength =
  Email address exceeds maximum length of {$max} characters.
error-internalError = Järjestelmävirhe
error-tenantInstalledAlready = Tenant has already been installed.
error-userNotEntitled = Sinulla ei ole oikeutta käyttää tätä.
error-storyNotFound = Keskustelua ({$storyID}) ei löytynyt.
error-commentNotFound = Kommenttia ({$commentID}) ei löytynyt.
error-invalidCredentials = Virheellinen sähköposti ja/tai salasana.
error-toxicComment = Oletko varma, että haluat lähettää? Kommenttisi sisältää kieltä, joka saattaa rikkoa sääntöjämme. Voit vielä muokata kommenttiasi ennen tarkastusta.
error-spamComment = Kommenttisi vaikuttaa mainokselta tai muuten häiritsevältä viestiltä. Voit vielä muokata kommenttiasi ennen tarkastusta.
error-userAlreadySuspended = Kirjoittajalla on jo kirjoituskielto {$until} asti.
error-userAlreadyBanned = Kirjoittaja on jo kirjoituskiellossa.
error-userBanned = Sinut on asetettu kirjoituskieltoon.
error-userSuspended = Sinut on asetettu kirjoituskieltoon {$until} asti.
error-integrationDisabled = Specified integration is disabled.
error-passwordResetTokenExpired = Password reset link expired.
error-emailConfirmTokenExpired = Email confirmation link expired.
error-rateLimitExceeded = Olet yrittänyt liian monta kertaa, ja siksi uudet yritykset on hetkeksi estetty. Odota vähän aikaa ja yritä sitten uudelleen.
error-inviteTokenExpired = Invite link has expired.
error-inviteRequiresEmailAddresses = Please add an email address to send invitations.
error-passwordIncorrect = Incorrect password. Please try again.
error-usernameAlreadyUpdated = You may only change your username once every { framework-timeago-time }.
error-persistedQueryNotFound = The persisted query with ID { $id } was not found.
error-rawQueryNotAuthorized = You are not authorized to execute this query.
error-inviteIncludesExistingUser = A user with the email address { $email } already exists.
error-repeatPost = Oletko varma, että haluat lähettää? Kirjoittamasi kommentti näyttää hyvin samanlaiselta kuin aiempi kommenttisi.
error-installationForbidden = { -product-name } is already installed. To install another Tenant on this domain ({ $domain }) you need to generate an installation token.
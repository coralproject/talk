error-commentingDisabled = Commenting has been disabled tenant wide.
error-storyClosed = Story is currently closed for commenting.
error-commentBodyTooShort = Comment body must have at least {$min} characters.
error-commentBodyExceedsMaxLength =
  Comment body exceeds maximum length of {$max} characters.
error-storyURLNotPermitted =
  The specified story URL does not exist in the permitted domains list.
error-duplicateStoryURL =  The specified story URL already exists.
error-tenantNotFound = Tenant hostname ({$hostname}) not found.
error-userNotFound = User ({$userID}) not found.
error-notFound = Unrecognized request URL ({$method} {$path}).
error-tokenInvalid = Invalid API Token provided.
error-tokenNotFound = Specified token does not exist.
error-emailAlreadySet = Email address has already been set.
error-emailNotSet = Email address has not been set yet.
error-duplicateUser =
  Specified user already exists with a different login method.
error-duplicateEmail = Specified email address is already in use.
error-localProfileAlreadySet =
  Specified account already has a password set.
error-localProfileNotSet =
  Specified account does not have a password set.
error-SSOProfileNotSet = Specified user does not have an SSO profile.
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
error-scrapeFailed = Could not scrape the URL { $url }.
error-internalError = Internal Error
error-tenantInstalledAlready = Tenant has already been installed.
error-userNotEntitled = You are not authorized to access that resource.
error-storyNotFound = Story ({$storyID}) not found.
error-commentNotFound = Comment ({$commentID}) not found.
error-commentRevisionNotFound = Comment ({ $commentID }) with revision ({ $commentRevisionID }) not found.
error-invalidCredentials = Email and/or password combination incorrect.
error-toxicComment = Are you sure? The language in this comment might violate our community guidelines. You can edit the comment or submit it for moderator review.
error-spamComment = The language in this comment looks like spam. You can edit the comment or submit it anyway for moderator review.
error-userAlreadySuspended = The user already has an active suspension until {$until}.
error-userAlreadyBanned = The user is already banned.
error-userBanned = Your account is currently banned.
error-userSiteBanned = Your account is currently banned on { $siteName }.
error-userSuspended = Your account is currently suspended until {$until}.
error-userWarned = Your account has been issued a warning, to continue participating please review the warning message above.
error-integrationDisabled = Specified integration is disabled.
error-passwordResetTokenExpired = Password reset link expired.
error-emailConfirmTokenExpired = Email confirmation link expired.
error-rateLimitExceeded = You're trying to do that too many times. Please wait and try again.
error-inviteTokenExpired = Invite link has expired.
error-inviteRequiresEmailAddresses = Please add an email address to send invitations.
error-passwordIncorrect = Incorrect password. Please try again.
error-usernameAlreadyUpdated = You may only change your username once every { framework-timeago-time }.
error-persistedQueryNotFound = The persisted query with ID { $id } was not found.
error-rawQueryNotAuthorized = You are not authorized to execute this query.
error-inviteIncludesExistingUser = A user with the email address { $email } already exists.
error-repeatPost = Are you sure? This comment is very similar to your previous comment.
error-installationForbidden = { -product-name } is already installed. To install another Tenant on this domain ({ $domain }) you need to generate an installation token.
error-duplicateSiteOrigin = Allowed domains may only be associated with a single site.
error-validation = A validation error occurred.
error-userBioTooLong = Bio exceeds maximum length.
error-commentEditWindowExpired = Edit time has expired. You can no longer edit this comment. Why not post another one?
error-authorAlreadyHasRatedStory = You’ve already submitted a rating on this page.
error-cannotCreateCommentOnArchivedStory = Cannot create a comment on an archived story without unarchiving.
error-cannotOpenAnArchivedStory = Cannot open an archived story. The story must be unarchived first.
error-cannotMergeAnArchivedStory = Cannot merge an archived story. The story must be unarchived first.

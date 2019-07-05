import { ERROR_CODES } from "coral-common/errors";

export const ERROR_TRANSLATIONS: Record<ERROR_CODES, string> = {
  COMMENT_BODY_EXCEEDS_MAX_LENGTH: "error-commentBodyExceedsMaxLength",
  COMMENT_BODY_TOO_SHORT: "error-commentBodyTooShort",
  COMMENT_NOT_FOUND: "error-commentNotFound",
  COMMENTING_DISABLED: "error-commentingDisabled",
  DUPLICATE_EMAIL: "error-duplicateEmail",
  DUPLICATE_STORY_URL: "error-duplicateStoryURL",
  DUPLICATE_USER: "error-duplicateUser",
  EMAIL_ALREADY_SET: "error-emailAlreadySet",
  EMAIL_EXCEEDS_MAX_LENGTH: "error-emailExceedsMaxLength",
  EMAIL_INVALID_FORMAT: "error-emailInvalidFormat",
  EMAIL_NOT_SET: "error-emailNotSet",
  INTERNAL_ERROR: "error-internalError",
  LOCAL_PROFILE_ALREADY_SET: "error-localProfileAlreadySet",
  LOCAL_PROFILE_NOT_SET: "error-localProfileNotSet",
  NOT_FOUND: "error-notFound",
  PASSWORD_TOO_SHORT: "error-passwordTooShort",
  STORY_CLOSED: "error-storyClosed",
  STORY_NOT_FOUND: "error-storyNotFound",
  STORY_URL_NOT_PERMITTED: "error-storyURLNotPermitted",
  URL_NOT_PERMITTED: "error-urlNotPermitted",
  TENANT_INSTALLED_ALREADY: "error-tenantInstalledAlready",
  TENANT_NOT_FOUND: "error-tenantNotFound",
  TOKEN_INVALID: "error-tokenInvalid",
  TOKEN_NOT_FOUND: "error-tokenNotFound",
  USER_NOT_ENTITLED: "error-userNotEntitled",
  USER_NOT_FOUND: "error-userNotFound",
  USER_CANNOT_BE_IGNORED: "error-userCannotBeIgnored",
  USERNAME_ALREADY_SET: "error-usernameAlreadySet",
  USERNAME_CONTAINS_INVALID_CHARACTERS:
    "error-usernameContainsInvalidCharacters",
  USERNAME_EXCEEDS_MAX_LENGTH: "error-usernameExceedsMaxLength",
  USERNAME_TOO_SHORT: "error-usernameTooShort",
  AUTHENTICATION_ERROR: "error-authenticationError",
  INVALID_CREDENTIALS: "error-invalidCredentials",
  TOXIC_COMMENT: "error-toxicComment",
  SPAM_COMMENT: "error-spamComment",
  USER_ALREADY_SUSPENDED: "error-userAlreadySuspended",
  USER_ALREADY_BANNED: "error-userAlreadyBanned",
  USER_BANNED: "error-userBanned",
  USER_SUSPENDED: "error-userSuspended",
  INTEGRATION_DISABLED: "error-integrationDisabled",
  PASSWORD_RESET_TOKEN_EXPIRED: "error-passwordResetTokenExpired",
  EMAIL_CONFIRM_TOKEN_EXPIRED: "error-emailConfirmTokenExpired",
  RATE_LIMIT_EXCEEDED: "error-rateLimitExceeded",
  JWT_REVOKED: "error-jwtRevoked",
  INVITE_TOKEN_EXPIRED: "error-inviteTokenExpired",
  INVITE_REQUIRES_EMAIL_ADDRESSES: "error-inviteRequiresEmailAddresses",
  LIVE_UPDATES_DISABLED: "error-liveUpdatesDisabled",
};

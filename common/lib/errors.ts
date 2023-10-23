export enum ERROR_TYPES {
  INVALID_REQUEST_ERROR = "INVALID_REQUEST_ERROR",
  MODERATION_NUDGE_ERROR = "MODERATION_NUDGE_ERROR",
}

export enum ERROR_CODES {
  /**
   * STORY_CLOSED is used when submitting a comment on a closed story.
   */
  STORY_CLOSED = "STORY_CLOSED",

  /**
   * COMMENTING_DISABLED is used when submitting a comment while commenting has
   * been disabled.
   */
  COMMENTING_DISABLED = "COMMENTING_DISABLED",

  /**
   * COMMENT_BODY_TOO_SHORT is used when a submitted comment body is too short.
   */
  COMMENT_BODY_TOO_SHORT = "COMMENT_BODY_TOO_SHORT",

  /**
   * COMMENT_BODY_EXCEEDS_MAX_LENGTH is used when a submitted comment body
   * exceeds the maximum length.
   */
  COMMENT_BODY_EXCEEDS_MAX_LENGTH = "COMMENT_BODY_EXCEEDS_MAX_LENGTH",

  /**
   * STORY_URL_NOT_PERMITTED is used when the given Story being created or
   * updated does not have a URL that is permitted by the Tenant.
   */
  STORY_URL_NOT_PERMITTED = "STORY_URL_NOT_PERMITTED",

  /**
   * TOKEN_NOT_FOUND is used when a Token is referenced by ID but can not be
   * found to be associated with the given User.
   */
  TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",

  /**
   * DUPLICATE_STORY_ID is used when trying to create a Story with the same ID
   * as another Story.
   */
  DUPLICATE_STORY_ID = "DUPLICATE_STORY_ID",

  /**
   * DUPLICATE_STORY_URL is used when trying to create a Story with the same URL
   * as another Story.
   */
  DUPLICATE_STORY_URL = "DUPLICATE_STORY_URL",

  /**
   * DUPLICATE_DSA_REPORT is used when trying to create a DSA report for a user who has already
   * reported a comment for illegal content.
   */
  DUPLICATE_DSA_REPORT = "DUPLICATE_DSA_REPORT",

  /**
   * DUPLICATE_FLAIR_BADGE is used when trying to create a flair badge for a
   * tenant that already includes that flair badge.
   */
  DUPLICATE_FLAIR_BADGE = "DUPLICATE_FLAIR_BADGE",

  /**
   * EMAIL_ALREADY_SET is used when trying to set the email address on a User
   * when the User already has an email address associated with their account.
   */
  EMAIL_ALREADY_SET = "EMAIL_ALREADY_SET",

  /**
   * EMAIL_DOMAIN_PROTECTED is used when trying to ban an email domain that is
   * so common that it is most likely being done in error.
   */
  EMAIL_DOMAIN_PROTECTED = "EMAIL_DOMAIN_PROTECTED",

  /**
   * EMAIL_NOT_SET is used when performing an operation that requires that the
   * email address be set on the User, and it is not.
   */
  EMAIL_NOT_SET = "EMAIL_NOT_SET",

  /**
   * TENANT_NOT_FOUND is used when the domain being queried does not correspond
   * to a Tenant.
   */
  TENANT_NOT_FOUND = "TENANT_NOT_FOUND",

  /**
   * INTERNAL_ERROR is returned when a situation occurs that is not user facing,
   * such as an unexpected index violation, or a database connection error.
   */
  INTERNAL_ERROR = "INTERNAL_ERROR",

  /**
   * DUPLICATE_USER is returned when a user was attempted to be created twice.
   * This can occur when a User creates an account with one method, then
   * attempts to create another user account with another method yielding the
   * same email address.
   */
  DUPLICATE_USER = "DUPLICATE_USER",

  /**
   * TOKEN_INVALID is returned when the provided token has an invalid format.
   */
  TOKEN_INVALID = "TOKEN_INVALID",

  /**
   * DUPLICATE_EMAIL is returned when a user attempts to create an account
   * with the same email address as another user.
   */
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",

  /**
   * DUPLICATE_EMAIL_DOMAIN is returned when a user attempts to add configuration
   * for an email domain already configured on the tenant.
   */
  DUPLICATE_EMAIL_DOMAIN = "DUPLICATE_EMAIL_DOMAIN",

  /**
   * LOCAL_PROFILE_ALREADY_SET is returned when the user attempts to associate a
   * local profile when the user already has one.
   */
  LOCAL_PROFILE_ALREADY_SET = "LOCAL_PROFILE_ALREADY_SET",

  /**
   * LOCAL_PROFILE_NOT_SET is returned when the user attempts to perform an
   * action which requires a local profile to be associated with the user.
   */
  LOCAL_PROFILE_NOT_SET = "LOCAL_PROFILE_NOT_SET",

  /**
   * SSO_PROFILE_NOT_SET is returned when the user attempts to perform an
   * action which requires an SSO profile to be associated with the user.
   */
  SSO_PROFILE_NOT_SET = "SSO_PROFILE_NOT_SET",

  /**
   * USERNAME_ALREADY_SET is returned when the user attempts to set a username
   * via the set operations when they already have a username associated with
   * their account.
   */
  USERNAME_ALREADY_SET = "USERNAME_ALREADY_SET",

  /**
   * USERNAME_CONTAINS_INVALID_CHARACTERS is returned when the user attempts to
   * associate a new username that contains invalid characters.
   */
  USERNAME_CONTAINS_INVALID_CHARACTERS = "USERNAME_CONTAINS_INVALID_CHARACTERS",

  /**
   * USERNAME_EXCEEDS_MAX_LENGTH is returned when the user attempts to associate
   * a new username that exceeds the maximum length.
   */
  USERNAME_EXCEEDS_MAX_LENGTH = "USERNAME_EXCEEDS_MAX_LENGTH",

  /**
   * USERNAME_UPDATED_WITHIN_WINDOW is returned when the user attempts to associate
   * a new username when they have previously changed their username within ALLOWED_USERNAME_CHANGE_FREQUENCY
   */
  USERNAME_UPDATED_WITHIN_WINDOW = "USERNAME_UPDATED_WITHIN_WINDOW",

  /**
   * USERNAME_TOO_SHORT is returned when the user attempts to associate a new
   * username that is too short.
   */
  USERNAME_TOO_SHORT = "USERNAME_TOO_SHORT",

  /**
   * PASSWORD_TOO_SHORT is returned when the user attempts to associate a new
   * password but it is too short.
   */
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",

  /**
   * PASSWORD_INCORRECT is returned when a logged in operation that requires the
   * password returns the wrong password.
   */
  PASSWORD_INCORRECT = "PASSWORD_INCORRECT",

  /**
   * EMAIL_INVALID_FORMAT is returned when when the user attempts to associate a
   * new email address that is not a valid email address.
   */
  EMAIL_INVALID_FORMAT = "EMAIL_INVALID_FORMAT",

  /**
   * EMAIL_EXCEEDS_MAX_LENGTH is returned when when the user attempts to
   * associate a new email address and it exceeds the maximum length.
   */
  EMAIL_EXCEEDS_MAX_LENGTH = "EMAIL_EXCEEDS_MAX_LENGTH",

  /**
   * USER_NOT_FOUND is returned when the user being looked up via an ID does not
   * exist in the database.
   */
  USER_NOT_FOUND = "USER_NOT_FOUND",

  /**
   * NOT_FOUND is returned when attempting to access a resource that does not
   * exist.
   */
  NOT_FOUND = "NOT_FOUND",

  /**
   * TENANT_INSTALLED_ALREADY is returned when attempting to install a Tenant
   * when the Tenant is already setup when in single-tenant mode.
   */
  TENANT_INSTALLED_ALREADY = "TENANT_INSTALLED_ALREADY",

  /**
   * USER_NOT_ENTITLED is returned when a user attempts to perform an action
   * that they are not entitled to.
   */
  USER_NOT_ENTITLED = "USER_NOT_ENTITLED",

  /**
   * STORY_NOT_FOUND is returned when a Story can not be found with the given
   * ID.
   */
  STORY_NOT_FOUND = "STORY_NOT_FOUND",

  /**
   * COMMENT_NOT_FOUND is returned when a Comment can not be found with the
   * given ID.
   */
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",

  /**
   * COMMENT_REVISION_NOT_FOUND is returned when a Comment was found but the
   * targeted revision was not found.
   */
  COMMENT_REVISION_NOT_FOUND = "COMMENT_REVISION_NOT_FOUND",

  /**
   * PARENT_COMMENT_REJECTED is returned when a Comment's parent
   * comment has been rejected.
   */
  PARENT_COMMENT_REJECTED = "PARENT_COMMENT_REJECTED",

  /**
   * ANCESTOR_REJECTED is returned when a Comment's ancestor
   * has been rejected.
   */
  ANCESTOR_REJECTED = "ANCESTOR_REJECTED",

  /**
   * AUTHENTICATION_ERROR is returned when a general authentication error has
   * occurred and the request can not be processed.
   */
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",

  /**
   * INVALID_CREDENTIALS is returned when the passed credentials are invalid.
   */
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  /**
   * TOXIC_COMMENT is returned when a comment is detected as Toxic and nudging
   * is enabled.
   */
  TOXIC_COMMENT = "TOXIC_COMMENT",

  /**
   * SPAM_COMMENT is returned when a comment is detected as spam and nudging is
   * enabled.
   */
  SPAM_COMMENT = "SPAM_COMMENT",

  /**
   * USER_ALREADY_SUSPENDED is returned when a moderator or administrator
   * attempts to suspend a user that already has an active suspension.
   */
  USER_ALREADY_SUSPENDED = "USER_ALREADY_SUSPENDED",

  /**
   * USER_ALREADY_BANNED is returned when a moderator or administrator attempts
   * to ban a user that is already banned.
   */
  USER_ALREADY_BANNED = "USER_ALREADY_BANNED",

  /**
   * USER_SUSPENDED is returned when the user attempts to perform an action that
   * is not permitted if they are suspended.
   */
  USER_SUSPENDED = "USER_SUSPENDED",

  /**
   * USER_WARNED is returned when the user attempts to perform an action that
   * is not permitted if they are warned and have not acknowledged the warning.
   */
  USER_WARNED = "USER_WARNED",

  /**
   * USER_BANNED is returned when the user attempts to perform an action that
   * is not permitted if they are banned.
   */
  USER_BANNED = "USER_BANNED",

  /**
   * USER_SITE_BANNED is returned when the user attempts to perform an action
   * that is not permitted if they are banned on that site.
   */
  USER_SITE_BANNED = "USER_SITE_BANNED",

  /**
   * MODERATOR_CANNOT_BE_BANNED_ON_SITE is returned when one or more of the sites
   * that a user is being banned on is included in the user's moderation scopes.
   */
  MODERATOR_CANNOT_BE_BANNED_ON_SITE = "MODERATOR_CANNOT_BE_BANNED_ON_SITE",

  /**
   * USER_CANNOT_BE_IGNORED is returned when the user attempts to ignore
   * a user that is not allowed to be ignored. This is usually because the
   * user is staff member.
   */
  USER_CANNOT_BE_IGNORED = "USER_CANNOT_BE_IGNORED",

  /**
   * INTEGRATION_DISABLED is returned when an operation is attempted against an
   * integration that has been disabled.
   */
  INTEGRATION_DISABLED = "INTEGRATION_DISABLED",

  /**
   * PASSWORD_RESET_TOKEN_EXPIRED is returned when a given password reset token has
   * expired.
   */
  PASSWORD_RESET_TOKEN_EXPIRED = "PASSWORD_RESET_TOKEN_EXPIRED",

  /**
   * EMAIL_CONFIRM_TOKEN_EXPIRED is returned when a given email confirmation
   * token has expired.
   */
  EMAIL_CONFIRM_TOKEN_EXPIRED = "EMAIL_CONFIRM_TOKEN_EXPIRED",

  /**
   * INVITE_TOKEN_EXPIRED is returned when a given invite token has expired.
   */
  INVITE_TOKEN_EXPIRED = "INVITE_TOKEN_EXPIRED",

  /**
   * RATE_LIMIT_EXCEEDED is returned when an operation is performed too many
   * times by the same user.
   */
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  /**
   * SCRAPE_FAILED is returned when a scrape operation has failed.
   */
  SCRAPE_FAILED = "SCRAPE_FAILED",

  /**
   * JWT_REVOKED is returned when the token referenced has been revoked.
   */
  JWT_REVOKED = "JWT_REVOKED",

  /*
   * INVITE_REQUIRES_EMAIL_ADDRESSES is returned when an invite is requested
   * without any email addresses specified.
   */
  INVITE_REQUIRES_EMAIL_ADDRESSES = "INVITE_REQUIRES_EMAIL_ADDRESSES",

  /**
   * LIVE_UPDATES_DISABLED is returned when a websocket request is attempted by
   * someone now allowed when it is disabled on the tenant level.
   */
  LIVE_UPDATES_DISABLED = "LIVE_UPDATES_DISABLED",

  /**
   * PERSISTED_QUERY_NOT_FOUND is returned when a query is executed specifying a
   * persisted query that can not be found.
   */
  PERSISTED_QUERY_NOT_FOUND = "PERSISTED_QUERY_NOT_FOUND",

  /**
   * RAW_QUERY_NOT_AUTHORIZED is returned when a query is executed that is not a
   * persisted query when the server has configured such queries are required by
   * all non-admin users.
   */
  RAW_QUERY_NOT_AUTHORIZED = "RAW_QUERY_NOT_AUTHORIZED",

  USER_ALREADY_PREMOD = "USER_ALREADY_PREMOD",

  /**
   * INVITE_INCLUDES_EXISTING_USER is returned when attempting to invite a user who already exists
   */
  INVITE_INCLUDES_EXISTING_USER = "INVITE_INCLUDES_EXISTING_USER",

  /**
   * REPEAT_POST is returned if a user attempts to post the same comment more than once
   * in a row within a given time frame
   */
  REPEAT_POST = "REPEAT_POST",

  /**
   * INSTALLATION_FORBIDDEN is returned when an installation is attempted
   * when it is not authorized to do so.
   */
  INSTALLATION_FORBIDDEN = "INSTALLATION_FORBIDDEN",

  DUPLICATE_SITE_ORIGIN = "DUPLICATE_SITE_ORIGIN",

  VALIDATION = "VALIDATION",

  USER_BIO_TOO_LONG = "USER_BIO_TOO_LONG",

  COMMENT_EDIT_WINDOW_EXPIRED = "COMMENT_EDIT_WINDOW_EXPIRED",

  /**
   * AUTHOR_ALREADY_HAS_RATED_STORY is returned when the author has already
   * rated a story and attempts to do so again.
   */
  AUTHOR_ALREADY_HAS_RATED_STORY = "AUTHOR_ALREADY_HAS_RATED_STORY",

  /**
   * CANNOT_CREATE_COMMENT_ON_ARCHIVED_STORY is thrown when a user attempts to
   * publish a comment on an archived story. We do not allow creating comments
   * or replies on archived comment data.
   */
  CANNOT_CREATE_COMMENT_ON_ARCHIVED_STORY = "CANNOT_CREATE_COMMENT_ON_ARCHIVED_STORY",

  /**
   * CANNOT_OPEN_AN_ARCHIVED_STORY is thrown when a user attempts to open a
   * story that is archived or actively being archived.
   */
  CANNOT_OPEN_AN_ARCHIVED_STORY = "CANNOT_OPEN_AN_ARCHIVED_STORY",

  /**
   * CANNOT_MERGE_AN_ARCHIVED_STORY is thrown when a user attempts to merge a
   * story that is archived or actively being archived.
   */
  CANNOT_MERGE_AN_ARCHIVED_STORY = "CANNOT_MERGE_AN_ARCHIVED_STORY",

  /**
   * USERNAME_ALREADY_EXISTS is thrown when a user is signing up or changing
   * their username and the provided username has already been taken.
   */
  USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS",

  /**
   * UNABLE_TO_UPDATE_STORY_URL is thrown when a story already exists for
   * a storyID and we were unable to update the url for that story ID.
   */
  UNABLE_TO_UPDATE_STORY_URL = "UNABLE_TO_UPDATE_STORY_URL",

  /**
   * DATA_CACHING_NOT_AVAILABLE is thrown when someone tries to enact a data
   * caching action when it is not available for that tenant.
   */
  DATA_CACHING_NOT_AVAILABLE = "DATA_CACHING_NOT_AVAILABLE",

  /**
   * INVALID_FLAIR_BADGE_NAME is thrown when someone tries to create a custom
   * flair badge with a name that includes invalid characters.
   */
  INVALID_FLAIR_BADGE_NAME = "INVALID_FLAIR_BADGE_NAME",
}

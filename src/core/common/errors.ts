export enum ERROR_CODES {
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
   * DUPLICATE_STORY_URL is used when trying to create a Story with the same URL
   * as another Story.
   */
  DUPLICATE_STORY_URL = "DUPLICATE_STORY_URL",

  /**
   * EMAIL_ALREADY_SET is used when trying to set the email address on a User
   * when the User already has an email address associated with their account.
   */
  EMAIL_ALREADY_SET = "EMAIL_ALREADY_SET",

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
   * DUPLICATE_USERNAME is returned when a user attempts to create an account
   * with the same username as another user.
   */
  DUPLICATE_USERNAME = "DUPLICATE_USERNAME",

  /**
   * DUPLICATE_EMAIL is returned when a user attempts to create an account
   * with the same email address as another user.
   */
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",

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
   * DISPLAY_NAME_EXCEEDS_MAX_LENGTH is returned when the user attempts to
   * associate a new display name that exceeds the maximum length.
   */
  DISPLAY_NAME_EXCEEDS_MAX_LENGTH = "DISPLAY_NAME_EXCEEDS_MAX_LENGTH",

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
   * USER_FORBIDDEN is returned when a user attempts to perform an action that
   * they are not entitled to.
   */
  USER_FORBIDDEN = "USER_FORBIDDEN",
}

export const USERNAME_REGEX = new RegExp(/^[a-zA-Z0-9_.]+$/);
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 3;

export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_REGEX = new RegExp(/^\S+@\S+.\S+$/);

export const URL_REGEX = new RegExp(
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
);

/**
 * ADDITIONAL_DETAILS_MAX_LENGTH defines the maximum length for the
 * additionalDetails field on a flag.
 */
export const ADDITIONAL_DETAILS_MAX_LENGTH = 500;

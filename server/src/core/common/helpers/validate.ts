import url from "url-regex-safe";

export const USERNAME_REGEX = new RegExp(/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9_.]+$/);
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 3;

export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_REGEX = new RegExp(/^\S+@\S+.\S+$/);

export const EMAIL_DOMAIN_REGEX = new RegExp(/^[^@]\S+\.\S+$/);

export const URL_REGEX = url({ exact: true, strict: true });

/**
 * ADDITIONAL_DETAILS_MAX_LENGTH defines the maximum length for the
 * additionalDetails field on a flag.
 */
export const ADDITIONAL_DETAILS_MAX_LENGTH = 500;

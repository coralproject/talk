import { ReactNode } from "react";

import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  URL_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "talk-common/helpers/validate";

import {
  EMAILS_DO_NOT_MATCH,
  INVALID_CHARACTERS,
  INVALID_EMAIL,
  INVALID_URL,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DO_NOT_MATCH,
  USERNAME_TOO_LONG,
  USERNAME_TOO_SHORT,
  VALIDATION_REQUIRED,
  VALIDATION_TOO_LONG,
  VALIDATION_TOO_SHORT,
} from "./messages";

export type Validator<T = any, V = any> = (v: T, values: V) => ReactNode;

/**
 * createValidator returns a Validator that returns given `error` when `condition` is falsey.
 */
export function createValidator<T = any, V = any>(
  condition: (v: T, values: V) => boolean,
  error: ReactNode
): Validator<T, V> {
  return (v, values) => (condition(v, values) ? undefined : error);
}

/**
 * composeValidators returns a Validator that chains the given validators
 * and runs them in sequence until one validator fails and returns an error.
 */
export function composeValidators<T = any, V = any>(
  ...validators: Array<Validator<T, V>>
) {
  return (v: T, values: V) =>
    validators.reduce(
      (error, validator) => error || validator(v, values),
      undefined
    );
}

/**
 * required is a Validator that checks that the value is truthy.
 */
export const required = createValidator(v => !!v, VALIDATION_REQUIRED());

/**
 * validateEmail is a Validator that checks that the value is an email.
 */
export const validateEmail = createValidator(
  v => EMAIL_REGEX.test(v),
  INVALID_EMAIL()
);

/**
 * validateUsernameCharacters is a Validator that checks that the username only contains valid characters.
 */
export const validateUsernameCharacters = createValidator(
  v => USERNAME_REGEX.test(v),
  INVALID_CHARACTERS()
);

/**
 * validateURL is a Validator that checks that the URL only contains valid characters.
 */
export const validateURL = createValidator(
  v => URL_REGEX.test(v),
  INVALID_URL()
);

/**
 * validateMinLength is a Validator that checks that the field has a min length of characters
 */
export const validateMinLength = (minLength: number) =>
  createValidator(
    v => !v || v.length >= minLength,
    VALIDATION_TOO_SHORT(minLength)
  );

/**
 * validateMaxLength is a Validator that checks that the field has max length of characters
 */
export const validateMaxLength = (maxLength: number) =>
  createValidator(
    v => !v || v.length <= maxLength,
    VALIDATION_TOO_LONG(maxLength)
  );

/**
 * validateUsernameMinLength is a Validator that checks that the username has a min length of characters
 */
export const validateUsernameMinLength = createValidator(
  v => v.length >= USERNAME_MIN_LENGTH,
  USERNAME_TOO_SHORT(USERNAME_MIN_LENGTH)
);

/**
 * validateUsernameMaxLength is a Validator that checks that the username has a max length of characters
 */
export const validateUsernameMaxLength = createValidator(
  v => v.length <= USERNAME_MAX_LENGTH,
  USERNAME_TOO_LONG(USERNAME_MAX_LENGTH)
);

/**
 * validateUsername is a Validator that checks that the username is valid.
 */
export const validateUsername = composeValidators(
  validateUsernameCharacters,
  validateUsernameMinLength,
  validateUsernameMaxLength
);

/**
 * validateUsername is a Validator that checks that the value is a valid username.
 */
export const validatePassword = createValidator(
  v => v.length >= PASSWORD_MIN_LENGTH,
  PASSWORD_TOO_SHORT(PASSWORD_MIN_LENGTH)
);

/**
 * validateEqualPasswords is a Validator that checks for correct password confirmation.
 */
export const validateEqualPasswords = createValidator(
  (v, values) => v === values.password,
  PASSWORDS_DO_NOT_MATCH()
);

/**
 * validateEqualEmails is a Validator that checks for correct email confirmation.
 */
export const validateEqualEmails = createValidator(
  (v, values) => v === values.email,
  EMAILS_DO_NOT_MATCH()
);

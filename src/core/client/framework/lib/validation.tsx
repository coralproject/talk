import { ReactNode } from "react";
import {
  INVALID_CHARACTERS,
  INVALID_EMAIL,
  INVALID_URL,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DO_NOT_MATCH,
  USERNAME_TOO_LONG,
  USERNAME_TOO_SHORT,
  VALIDATION_REQUIRED,
} from "./messages";

type Validator<T, V> = (v: T, values: V) => ReactNode;

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
  v => /^.+@.+\..+$/.test(v),
  INVALID_EMAIL()
);

/**
 * validateUsernameCharacters is a Validator that checks that the username only contains valid characters.
 */
export const validateUsernameCharacters = createValidator(
  v => /^[a-zA-Z0-9_.]+$/.test(v),
  INVALID_CHARACTERS()
);

/**
 * validateURL is a Validator that checks that the URL only contains valid characters.
 */
export const validateURL = createValidator(
  v =>
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      v
    ),
  INVALID_URL()
);

/**
 * validateUsernameMinLength is a Validator that checks that the username has a min length of characters
 */
export const validateUsernameMinLength = createValidator(
  v => v.length >= 3,
  USERNAME_TOO_SHORT(3)
);

/**
 * validateUsernameMaxLength is a Validator that checks that the username has a max length of characters
 */
export const validateUsernameMaxLength = createValidator(
  v => v.length <= 20,
  USERNAME_TOO_LONG(20)
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
  v => v.length >= 8,
  PASSWORD_TOO_SHORT(8)
);

/**s
 * validateUsername is a Validator that checks that the value is a valid username.
 */
export const validateEqualPasswords = createValidator(
  (v, values) => v === values.password,
  PASSWORDS_DO_NOT_MATCH()
);

import { ReactNode } from "react";
import {
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_USERNAME,
  PASSWORDS_DO_NOT_MATCH,
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
 * validateUsername is a Validator that checks that the value is a valid username.
 */
export const validateUsername = createValidator(
  v => /^[a-zA-Z0-9_.]+$/.test(v),
  INVALID_USERNAME()
);

/**
 * validateUsername is a Validator that checks that the value is a valid username.
 */
export const validatePassword = createValidator(
  v => /^(?=.{8,}).*$/.test(v),
  INVALID_PASSWORD()
);

/**s
 * validateUsername is a Validator that checks that the value is a valid username.
 */
export const validateEqualPasswords = createValidator(
  (v, values) => v === values.password,
  PASSWORDS_DO_NOT_MATCH()
);

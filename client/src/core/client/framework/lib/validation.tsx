import { ReactNode } from "react";

import {
  EMAIL_DOMAIN_REGEX,
  EMAIL_REGEX,
  ID_REGEX,
  PASSWORD_MIN_LENGTH,
  URL_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "coral-common/common/lib/helpers/validate";
import validateImagePathname from "coral-common/common/lib/helpers/validateImagePathname";
import startsWith from "coral-common/common/lib/utils/startsWith";
import { parseURL } from "coral-framework/utils";

import {
  DELETE_CONFIRMATION_INVALID,
  EMAILS_DO_NOT_MATCH,
  INVALID_CHARACTERS,
  INVALID_EMAIL,
  INVALID_EMAIL_DOMAIN,
  INVALID_EXTERNAL_PROFILE_URL,
  INVALID_MEDIA_URL,
  INVALID_URL,
  INVALID_WEBHOOK_ENDPOINT_EVENT_SELECTION,
  NOT_A_WHOLE_NUMBER,
  NOT_A_WHOLE_NUMBER_BETWEEN,
  NOT_A_WHOLE_NUMBER_GREATER_THAN,
  NOT_A_WHOLE_NUMBER_GREATER_THAN_OR_EQUAL,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DO_NOT_MATCH,
  USERNAME_TOO_LONG,
  USERNAME_TOO_SHORT,
  USERNAMES_DO_NOT_MATCH,
  VALIDATION_REQUIRED,
  VALIDATION_TOO_LONG,
  VALIDATION_TOO_SHORT,
} from "./messages";

export type Validator<T = any, V = any> = (v: T, values: V) => ReactNode;

/**
 * createValidator returns a Validator that returns given `error` when `condition` is falsy.
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
export const required = createValidator(
  (v) =>
    Array.isArray(v) ? v.length > 0 : v !== "" && v !== null && v !== undefined,
  VALIDATION_REQUIRED()
);

/**
 * requiredTrue is a Validator that checks that the value is truthy and not equal to false.
 */
export const requiredTrue = createValidator(
  (v) =>
    Array.isArray(v)
      ? v.length > 0
      : v !== "" && v !== null && v !== undefined && v !== false,
  VALIDATION_REQUIRED()
);

/**
 * validateEmail is a Validator that checks that the value is an email.
 */
export const validateEmail = createValidator(
  (v) => !v || !(typeof v === "string") || EMAIL_REGEX.test(v),
  INVALID_EMAIL()
);

/**
 * validateEmailDomain is a Validator that checks that the value is an email domain without the @
 * at the beginning and including at least one dot.
 */
export const validateEmailDomain = createValidator(
  (v) => !v || !(typeof v === "string") || EMAIL_DOMAIN_REGEX.test(v),
  INVALID_EMAIL_DOMAIN()
);

/**
 * validateUsernameCharacters is a Validator that checks that the username only contains valid characters.
 */
export const validateUsernameCharacters = createValidator(
  (v) => !v || !(typeof v === "string") || USERNAME_REGEX.test(v),
  INVALID_CHARACTERS()
);

export const validateImageURLFunc = (v: any) => {
  if (!v || typeof v !== "string" || !URL_REGEX.test(v)) {
    return false;
  }

  try {
    const { pathname } = parseURL(v);
    return validateImagePathname(pathname);
  } catch (err) {
    return false;
  }
};

export const validateImageURL = createValidator(
  validateImageURLFunc,
  INVALID_MEDIA_URL()
);

/**
 * validateShareURL checks that a URL is valid and includes a valid commentID query param
 */
export const validateShareURL = (v: any) => {
  if (!v || !(typeof v === "string")) {
    return false;
  }
  const shareURLArr = v.split("?commentID=");
  if (!(shareURLArr.length === 2)) {
    return false;
  }
  const isValidUrl = URL_REGEX.test(shareURLArr[0]);
  const isValidCommentID = ID_REGEX.test(shareURLArr[1]);
  return isValidUrl && isValidCommentID;
};

/**
 * validateURL is a Validator that checks that the URL only contains valid characters.
 */
export const validateURL = createValidator(
  (v) => !v || !(typeof v === "string") || URL_REGEX.test(v),
  INVALID_URL()
);

/**
 * validateExternalProfileURL is a Validator that checks that the external profile URL,
 * if it exists, contains either $USER_NAME or $USER_ID
 */
export const validateExternalProfileURL = createValidator((v) => {
  if (v === null) {
    return true;
  }
  const includesUserName = v.includes("$USER_NAME");
  const includesUserId = v.includes("$USER_ID");
  if (
    v &&
    ((includesUserName && !includesUserId) ||
      (includesUserId && !includesUserName))
  ) {
    return true;
  }
  return false;
}, INVALID_EXTERNAL_PROFILE_URL());

/**
 * validateMinLength is a Validator that checks that the field has a min length of characters
 */
export const validateMinLength = (
  minLength: number,
  getLength: (v: any) => number = (v) => v.length
) =>
  createValidator(
    (v) => !v || getLength(v) >= minLength,
    VALIDATION_TOO_SHORT(minLength)
  );

/**
 * validateMaxLength is a Validator that checks that the field has max length of characters
 */
export const validateMaxLength = (
  maxLength: number,
  getLength: (v: any) => number = (v) => v.length
) =>
  createValidator(
    (v) => !v || getLength(v) <= maxLength,
    VALIDATION_TOO_LONG(maxLength)
  );

/**
 * validateUsernameMinLength is a Validator that checks that the username has a min length of characters
 */
export const validateUsernameMinLength = createValidator(
  (v) => v.length >= USERNAME_MIN_LENGTH,
  USERNAME_TOO_SHORT(USERNAME_MIN_LENGTH)
);

/**
 * validateUsernameMaxLength is a Validator that checks that the username has a max length of characters
 */
export const validateUsernameMaxLength = createValidator(
  (v) => v.length <= USERNAME_MAX_LENGTH,
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
  (v) => v.length >= PASSWORD_MIN_LENGTH,
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
 * validateWebhookEventSelection is a Validator that checks for a valid
 * combination of event selections for webhook endpoints.
 */
export const validateWebhookEventSelection = createValidator(
  (v, values) => values.all || (values.events && values.events.length > 0),
  INVALID_WEBHOOK_ENDPOINT_EVENT_SELECTION()
);

/**
 * validateEqualEmails is a Validator that checks for correct email confirmation.
 */
export const validateEqualEmails = createValidator(
  (v, values) => v === values.email,
  EMAILS_DO_NOT_MATCH()
);

/**
 * validateUsernameEquals is a Validator that checks for correct username confirmation.
 */
export const validateUsernameEquals = createValidator(
  (v, values) => v === values.username,
  USERNAMES_DO_NOT_MATCH()
);

/**
 * validateWholeNumber is a Validator that checks for a valid whole number.
 */
export const validateWholeNumber = createValidator(
  (v) =>
    !v ||
    v === 0 ||
    !(typeof v === "string") ||
    Number.isInteger(parseFloat(v)),
  NOT_A_WHOLE_NUMBER()
);

/**
 * validateWholeNumberGreaterThan is a Validator that checks for a valid whole number > 0.
 */
export const validateWholeNumberGreaterThan = (x: number) =>
  createValidator(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    (v) => v === null || (Number.isInteger(parseFloat(v)) && v > x),
    NOT_A_WHOLE_NUMBER_GREATER_THAN(x)
  );

/**
 * validateWholeNumberGreaterThanEquals is a Validator that checks for a valid whole number > 0.
 */
export const validateWholeNumberGreaterThanOrEqual = (x: number) =>
  createValidator(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    (v) => v === null || (Number.isInteger(parseFloat(v)) && v >= x),
    NOT_A_WHOLE_NUMBER_GREATER_THAN_OR_EQUAL(x)
  );

/**
 * validateWholeNumberBetween is a Validator that checks for a valid whole number.
 */
export const validateWholeNumberBetween = (min: number, max: number) =>
  createValidator(
    (v) =>
      !v ||
      v === 0 ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      (Number.isInteger(parseFloat(v)) && v >= min && v <= max),
    NOT_A_WHOLE_NUMBER_BETWEEN(min, max)
  );

/**
 * validateWholeNumberBetween is a Validator that checks for a valid whole number.
 */
export const validatePercentage = (min: number, max: number) =>
  createValidator(
    (v) =>
      v === null ||
      (typeof v === "number" && !Number.isNaN(v) && v >= min && v <= max),

    NOT_A_WHOLE_NUMBER_BETWEEN(min * 100, max * 100)
  );

export const validateDeleteConfirmation = (phrase: string) =>
  createValidator((v) => v === phrase, DELETE_CONFIRMATION_INVALID());

export const validateStrictURLList = createValidator((v) => {
  if (!Array.isArray(v)) {
    return false;
  }

  for (const url of v) {
    if (typeof url !== "string") {
      return false;
    }

    if (!URL_REGEX.test(url)) {
      return false;
    }

    if (!startsWith(url, "http")) {
      return false;
    }
  }

  return true;
}, INVALID_URL());

/**
 * Condition represents a given check that can be performed for the purpose of
 * filtering a validation operation.
 */
export type Condition<T = any, V = any> = (value: T, values: V) => boolean;

/**
 * composeSomeConditions will return true when some of the conditions return
 * true, false if all return false.
 * @param conditions conditions to use
 */
export function composeSomeConditions<T = any, V = any>(
  ...conditions: Array<Condition<T, V>>
): Condition<T, V> {
  return (value, values) =>
    conditions.some((condition) => condition(value, values));
}

/**
 * composeValidatorsWhen is the same as composeValidators except it will only
 * apply the validators if the condition is true.
 */
export function composeValidatorsWhen<T = any, V = any>(
  condition: Condition<T, V>,
  ...validators: Array<Validator<T, V>>
): Validator<T, V> {
  return validateWhen(condition, composeValidators(...validators));
}

/**
 * validate will simply wrap a single validator with a condition check first.
 */
export function validateWhen<T = any, V = any>(
  condition: Condition<T, V>,
  validator: Validator<T, V>
): Validator<T, V> {
  return (value, values) => {
    if (condition(value, values)) {
      return validator(value, values);
    }

    return null;
  };
}

export function validateWhenOtherwise<T = any, V = any>(
  condition: Condition<T, V>,
  truthy: Validator<T, V>,
  falsy: Validator<T, V>
): Validator<T, V> {
  return (value, values) => {
    return condition(value, values)
      ? truthy(value, values)
      : falsy(value, values);
  };
}

/**
 * Use custom message for validator.
 */
export const customMessage = <T, V>(
  validator: Validator<T, V>,
  msg: ReactNode
): Validator<T, V> => {
  return (v: T, values: V) => (validator(v, values) ? msg : undefined);
};

import {
  composeSomeConditions,
  composeValidators,
  Condition,
  required,
  validateMaxLength,
  validateMinLength,
  validateWhenOtherwise,
  Validator,
} from "coral-framework/lib/validation";

import getHTMLCharacterLength from "./getHTMLCharacterLength";

const hasMediaAttached: Condition = (value, values) =>
  !!values.media &&
  (values.media.type === "giphy" || values.media.type === "external") &&
  !!values.media.url;

const hasRatingAttached: Condition = (value, values) => !!values.rating;

function getLengthValidators(min: number | null, max: number | null) {
  const validators: Validator[] = [];
  if (min) {
    validators.push(required, validateMinLength(min, getHTMLCharacterLength));
  }

  if (max) {
    validators.push(validateMaxLength(max, getHTMLCharacterLength));
  }

  return composeValidators(...validators);
}

/**
 * getCommentBodyValidators will return validators based on given min & max parameters.
 *
 * @param min minimum length or null
 * @param max maximum length or null
 */
export default function getCommentBodyValidators(
  min: number | null,
  max: number | null
) {
  return validateWhenOtherwise(
    composeSomeConditions(hasMediaAttached, hasRatingAttached),
    getLengthValidators(null, max),
    getLengthValidators(min || 1, max)
  );
}

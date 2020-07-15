import {
  composeValidators,
  Condition,
  required,
  validateMaxLength,
  validateMinLength,
  validateWhenOtherwise,
  Validator,
} from "coral-framework/lib/validation";

import getHTMLCharacterLength from "./getHTMLCharacterLength";

const hasGIFAttached: Condition = (value, values) =>
  !!values.media && values.media.type === "giphy" && !!values.media.url;

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
 * getBodyValidators will return validators based on given min & max parameters.
 *
 * @param min minimum length or null
 * @param max maximum length or null
 */
export default function getCommentBodyValdiators(
  min: number | null,
  max: number | null
) {
  return validateWhenOtherwise(
    hasGIFAttached,
    getLengthValidators(null, max),
    getLengthValidators(min || 1, max)
  );
}

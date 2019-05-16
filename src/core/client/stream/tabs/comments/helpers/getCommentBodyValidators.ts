import {
  composeValidators,
  required,
  validateMaxLength,
  validateMinLength,
} from "coral-framework/lib/validation";

import getHTMLCharacterLength from "./getHTMLCharacterLength";

/**
 * getBodyValidators will return validators based on given min & max parameters.
 * @param min minimum length or null
 * @param max maximum length or null
 */
export default function getBodyValidators(
  min: number | null,
  max: number | null
) {
  const validators = [required];
  if (min) {
    validators.push(validateMinLength(min, getHTMLCharacterLength));
  }
  if (max) {
    validators.push(validateMaxLength(max, getHTMLCharacterLength));
  }
  return composeValidators(...validators);
}

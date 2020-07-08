import { VALIDATION_REQUIRED } from "coral-framework/lib/messages";
import {
  composeValidators,
  createValidator,
  required,
  validateMaxLength,
  validateMinLength,
} from "coral-framework/lib/validation";

import getHTMLCharacterLength from "./getHTMLCharacterLength";

export const validateRequiredIfNoEmbed = createValidator((v, values) => {
  if (values.embed && values.embed.url && values.embed.url.length > 0) {
    return false;
  }
  return v !== "" && v !== null && v !== undefined;
}, VALIDATION_REQUIRED());

/**
 * getBodyValidators will return validators based on given min & max parameters.
 *
 * @param min minimum length or null
 * @param max maximum length or null
 */
export default function getCommentBodyValdiators(
  min: number | null,
  max: number | null,
  validateRequired: boolean
) {
  if (!validateRequired) {
    return () => {};
  }
  const validators = [required];
  if (min) {
    validators.push(validateMinLength(min, getHTMLCharacterLength));
  } else {
    validators.push(validateMinLength(1, getHTMLCharacterLength));
  }
  if (max) {
    validators.push(validateMaxLength(max, getHTMLCharacterLength));
  }
  return composeValidators(...validators);
}

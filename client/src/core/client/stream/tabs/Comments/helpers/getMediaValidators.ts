import {
  composeValidators,
  Condition,
  validateImageURL,
  validateURL,
  validateWhen,
} from "coral-framework/lib/validation";

const hasExternalMediaAttached: Condition = (value, values) => {
  return !!values.media && values.media.type === "external";
};

// TODO: this is more a const variable.
export function getImageValidators() {
  return composeValidators(
    (v, values) => validateURL(v, values),
    (v, values) => validateImageURL(v, values)
  );
}

// TODO: this is more a const variable.
export default function getMediaFieldValidators() {
  return validateWhen(
    hasExternalMediaAttached,
    composeValidators(
      (v, values) => validateURL(v.url, values),
      (v, values) => validateImageURL(v.url, values)
    )
  );
}

import {
  composeValidators,
  Condition,
  validateMediaURL,
  validateURL,
  validateWhen,
} from "coral-framework/lib/validation";

const hasExternalmediaAttached: Condition = (value, values) => {
  return (
    !!values.media && values.media.type === "external" && !!values.media.url
  );
};

export default function getMediaFieldValidators() {
  return validateWhen(
    hasExternalmediaAttached,
    composeValidators(
      (v, values) => validateURL(v.url, values),
      (v, values) => validateMediaURL(v.url, values)
    )
  );
}

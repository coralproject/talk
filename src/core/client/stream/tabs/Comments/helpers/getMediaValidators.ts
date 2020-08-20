import {
  Condition,
  validateMediaURL,
  validateWhen,
} from "coral-framework/lib/validation";

const hasExternalmediaAttached: Condition = (value, values) => {
  return (
    !!values.media && values.media.type === "external" && !!values.media.url
  );
};

export default function getMediaFieldValidators() {
  return validateWhen(hasExternalmediaAttached, validateMediaURL);
}

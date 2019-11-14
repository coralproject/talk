import { parseQuery } from "coral-common/utils";

export default function getParamsFromHash() {
  try {
    return window.location.hash
      ? parseQuery(window.location.hash.substr(1))
      : null;
  } catch (err) {
    window.console.error(err);
    return null;
  }
}

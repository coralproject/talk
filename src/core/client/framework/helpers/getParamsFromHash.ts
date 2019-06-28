import { parseQuery } from "coral-common/utils";

export default function getParamsFromHash() {
  try {
    const params = window.location.hash
      ? parseQuery(window.location.hash.substr(1))
      : {};

    return params;
  } catch (err) {
    window.console.error(err);
    return {};
  }
}

import clearHash from "./clearHash";
import getParamsFromHash from "./getParamsFromHash";

export default function getParamsFromHashAndClearIt() {
  try {
    const params = getParamsFromHash();

    // Clear the hash contents.
    clearHash();

    return params;
  } catch (err) {
    window.console.error(err);
    return {};
  }
}

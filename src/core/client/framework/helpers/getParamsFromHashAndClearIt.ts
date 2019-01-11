import { parseQuery } from "talk-common/utils";

export default function getParamsFromHashAndClearIt() {
  try {
    const params = window.location.hash
      ? parseQuery(window.location.hash.substr(1))
      : {};

    // Remove hash with token.
    if (window.location.hash) {
      window.history.replaceState(null, document.title, location.pathname);
    }

    return params;
  } catch (err) {
    window.console.error(err);
    return {};
  }
}

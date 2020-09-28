import { Decorator } from "./types";

/**
 * Listen to `getRefreshAccessToken` requests, calls the
 * refreshAccessToken callback from config and sends a `refreshAccessToken`
 * response.
 */
const withRefreshAccessToken = (
  refreshAccessToken: (() => Promise<string> | string) | null = null
): Decorator => (pym) => {
  pym.onMessage("getRefreshAccessToken", () => {
    if (!refreshAccessToken) {
      // Answer with an empty token.
      pym.sendMessage("refreshAccessToken", "");
      return;
    }
    const result = refreshAccessToken();
    const tokenPromise =
      typeof result === "string" ? Promise.resolve(result) : result;
    tokenPromise
      .then((token) => {
        pym.sendMessage("refreshAccessToken", token);
      })
      .catch(() => {
        // Answer with an empty token.
        pym.sendMessage("refreshAccessToken", "");
      });
  });
};

export default withRefreshAccessToken;

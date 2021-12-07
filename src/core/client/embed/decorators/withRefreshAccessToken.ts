import { RefreshAccessTokenCallback } from "../Coral";
import { DecoratorLegacy } from "./types";

/**
 * Listen to `getRefreshAccessToken` requests, calls the
 * refreshAccessToken callback from config and sends a `refreshAccessToken`
 * response.
 */
const withRefreshAccessToken = (
  refreshAccessToken: RefreshAccessTokenCallback | null = null
): DecoratorLegacy => (pym) => {
  pym.onMessage("getRefreshAccessToken", () => {
    if (!refreshAccessToken) {
      // Answer with an empty token.
      pym.sendMessage("refreshAccessToken", "");
      return;
    }
    let called = false;
    refreshAccessToken((token: string) => {
      if (called) {
        throw new Error("next access token has been already provided");
      }
      called = true;
      pym.sendMessage("refreshAccessToken", token);
    });
  });
};

export default withRefreshAccessToken;

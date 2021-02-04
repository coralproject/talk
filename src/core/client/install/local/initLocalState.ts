import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { storeAccessTokenInLocalStorage } from "coral-framework/lib/auth";
import { InitLocalState } from "coral-framework/lib/bootstrap/createManaged";
import { initLocalBaseState } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
const initLocalState: InitLocalState = async ({
  context,
  auth = null,
  ...rest
}) => {
  // Get all the parameters from the hash.
  const params = getParamsFromHash(context.window);
  if (params && params.accessToken) {
    // As there's an access token in the hash, let's clear it.
    clearHash(context.window);

    // Save the token in storage.
    auth = await storeAccessTokenInLocalStorage(
      context.localStorage,
      params.accessToken
    );
  }

  await initLocalBaseState({
    context,
    auth,
    ...rest,
  });
};
export default initLocalState;

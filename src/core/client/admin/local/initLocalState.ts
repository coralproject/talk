import { commitLocalUpdate, Environment } from "relay-runtime";

import { REDIRECT_PATH_KEY } from "coral-admin/constants";
import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { AuthState, storeAccessToken } from "coral-framework/lib/auth";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext,
  auth?: AuthState
) {
  // Initialize the redirect path in case we don't need to redirect somewhere.
  let redirectPath: string | null = null;
  let error: string | null = null;

  // Get all the parameters from the hash.
  const params = getParamsFromHash();
  if (params && (params.accessToken || params.error)) {
    // If there were params in the hash, then clear them!
    clearHash();

    // If there was an error, add it.
    if (params.error) {
      error = params.error;
    }

    // If there was an access token, store it.
    if (params.accessToken) {
      auth = storeAccessToken(params.accessToken);
    }

    // As we are in the middle of an auth flow (given that there was something
    // in the hash) we should now grab the redirect path.
    redirectPath =
      (await context.localStorage.getItem(REDIRECT_PATH_KEY)) || null;
  } else {
    // There was no auth flow in progress (given that we're now loading without
    // a hash), so clear the redirect path just in case.
    await context.localStorage.setItem(REDIRECT_PATH_KEY, "");
  }

  initLocalBaseState(environment, context, auth);

  commitLocalUpdate(environment, (s) => {
    const localRecord = s.get(LOCAL_ID)!;

    localRecord.setValue(redirectPath, "redirectPath");
    localRecord.setValue("SIGN_IN", "authView");
    localRecord.setValue(error, "authError");
  });
}

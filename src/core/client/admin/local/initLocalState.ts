import { commitLocalUpdate, Environment } from "relay-runtime";

import { ACCESS_TOKEN_KEY, REDIRECT_PATH_KEY } from "coral-admin/constants";
import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { parseJWT } from "coral-framework/lib/jwt";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";

/**
 * Initializes the local state, before we start the App.
 */
export default async function initLocalState(
  environment: Environment,
  context: CoralContext
) {
  // Get the access token from the session storage.
  let accessToken = await context.sessionStorage.getItem(ACCESS_TOKEN_KEY);

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

    // If there was an access token, store it and replace the one that was in
    // the session storage before.
    if (params.accessToken) {
      accessToken = params.accessToken;
      await context.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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

  if (accessToken) {
    // As there's a token on the request, decode it, and check to see if it's
    // expired already. If it is, this will send them back to the error page.
    const { payload } = parseJWT(accessToken);
    if (payload && payload.exp) {
      if (payload.exp - Date.now() / 1000 <= 0) {
        accessToken = null;
        await context.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  }

  await initLocalBaseState(environment, context, accessToken);

  commitLocalUpdate(environment, s => {
    const localRecord = s.get(LOCAL_ID)!;

    localRecord.setValue(redirectPath, "redirectPath");
    localRecord.setValue("SIGN_IN", "authView");
    localRecord.setValue(error, "authError");
  });
}

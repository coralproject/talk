import { commitLocalUpdate } from "relay-runtime";

import {
  ADMIN_REDIRECT_PATH_KEY,
  MOD_QUEUE_SORT_ORDER,
} from "coral-admin/constants";
import { clearHash, getParamsFromHash } from "coral-framework/helpers";
import { parseAccessToken } from "coral-framework/lib/auth";
import { InitLocalState } from "coral-framework/lib/bootstrap/createManaged";
import { initLocalBaseState, LOCAL_ID } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";

/**
 * Initializes the local state, before we start the App.
 */
const initLocalState: InitLocalState = async ({
  environment,
  context,
  auth = null,
  ...rest
}) => {
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

    // If there was an access token, parse it.
    // `AccountCompletionContainer` will take care of storing it.
    if (params.accessToken) {
      auth = parseAccessToken(params.accessToken);
    }

    // As we are in the middle of an auth flow (given that there was something
    // in the hash) we should now grab the redirect path.
    redirectPath =
      (await context.localStorage.getItem(ADMIN_REDIRECT_PATH_KEY)) || null;
  } else {
    // There was no auth flow in progress (given that we're now loading without
    // a hash), so clear the redirect path just in case.
    await context.localStorage.removeItem(ADMIN_REDIRECT_PATH_KEY);
  }

  await initLocalBaseState({ environment, context, auth, ...rest });

  const modQueueSortOrder = await context.localStorage.getItem(
    MOD_QUEUE_SORT_ORDER
  );

  commitLocalUpdate(environment, (s) => {
    const localRecord = s.get(LOCAL_ID)!;

    localRecord.setValue(redirectPath, "redirectPath");
    localRecord.setValue("SIGN_IN", "authView");
    localRecord.setValue(error, "authError");
    localRecord.setValue(
      modQueueSortOrder ? modQueueSortOrder : GQLCOMMENT_SORT.CREATED_AT_DESC,
      "moderationQueueSort"
    );
  });
};

export default initLocalState;

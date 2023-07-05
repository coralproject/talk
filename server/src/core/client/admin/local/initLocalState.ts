import { commitLocalUpdate } from "relay-runtime";

import {
  ADMIN_REDIRECT_PATH_KEY,
  MOD_QUEUE_SORT_ORDER,
} from "coral-admin/constants";
import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
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
  staticConfig,
  ...rest
}) => {
  let redirectPath = await context.localStorage.getItem(
    ADMIN_REDIRECT_PATH_KEY
  );
  // This will prevent redirects to different origins.
  if (redirectPath && /^(\/\/|http:\/\/)/.test(redirectPath)) {
    redirectPath = null;
  }

  let error: string | null = null;

  // Get all the parameters from the hash.
  const params = getParamsFromHash(context.window);
  if (params && (params.accessToken || params.error)) {
    // If there were params in the hash, then clear them!
    clearHash(context.window);

    // If there was an error, add it.
    if (params.error) {
      error = params.error;
    }

    // If there was an access token, parse it.
    // `AccountCompletionContainer` will take care of storing it.
    if (params.accessToken) {
      auth = parseAccessToken(params.accessToken);
    }
  }

  await initLocalBaseState({
    environment,
    context,
    auth,
    staticConfig,
    ...rest,
  });

  const modQueueSortOrder = await context.localStorage.getItem(
    MOD_QUEUE_SORT_ORDER
  );

  const archivingEnabled = staticConfig?.archivingEnabled || false;
  const autoArchiveOlderThanMs =
    staticConfig?.autoArchiveOlderThanMs ?? DEFAULT_AUTO_ARCHIVE_OLDER_THAN;

  commitLocalUpdate(environment, (s) => {
    const localRecord = s.get(LOCAL_ID)!;

    localRecord.setValue(redirectPath || null, "redirectPath");
    localRecord.setValue("SIGN_IN", "authView");
    localRecord.setValue(error, "authError");
    localRecord.setValue(
      modQueueSortOrder ? modQueueSortOrder : GQLCOMMENT_SORT.CREATED_AT_DESC,
      "moderationQueueSort"
    );
    localRecord.setValue(
      staticConfig?.forceAdminLocalAuth ?? false,
      "forceAdminLocalAuth"
    );

    localRecord.setValue(archivingEnabled, "archivingEnabled");
    localRecord.setValue(autoArchiveOlderThanMs, "autoArchiveOlderThanMs");
  });
};

export default initLocalState;

/* eslint-disable */
import { commitLocalUpdate, Environment, graphql } from "relay-runtime";

import { StaticConfig } from "coral-common/config";
import { parseQuery } from "coral-common/utils";
import { isStoryMode } from "coral-framework/helpers";
import { parseAccessToken } from "coral-framework/lib/auth";
import { InitLocalState } from "coral-framework/lib/bootstrap/createManaged";
import { getExternalConfig } from "coral-framework/lib/externalConfig";
import {
  createAndRetain,
  fetchQuery,
  initLocalBaseState,
} from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { initLocalStateQuery } from "coral-stream/__generated__/initLocalStateQuery.graphql";

import { COMMENTS_ORDER_BY } from "../constants";
import { AUTH_POPUP_ID, AUTH_POPUP_TYPE } from "./constants";
import { FEATURE_FLAG } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";

type ResolvedConfig = {
  readonly featureFlags: FEATURE_FLAG[];
  readonly flattenReplies?: boolean | null;
}

async function resolveConfig(
  environment: Environment,
  staticConfig?: StaticConfig | null
): Promise<ResolvedConfig> {
  if (staticConfig) {
    return staticConfig as ResolvedConfig;
  }
  if (process.env.NODE_ENV === "development") {
    // Send a graphql query to server during development to get the feature flags.
    // The reason is that we don't have static config during development.
    const data = await fetchQuery<initLocalStateQuery>(
      environment,
      graphql`
        query initLocalStateQuery {
          settings {
            flattenReplies
            featureFlags
          }
        }
      `,
      {}
    );

    return data.settings as ResolvedConfig;
  }
  return { featureFlags: [] } as { featureFlags: FEATURE_FLAG[], flattenReplies?: boolean };
}

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
  const config = await getExternalConfig(context.window, context.pym);
  if (config) {
    if (config.accessToken) {
      // Access tokens passed via the config should not be persisted.
      auth = parseAccessToken(config.accessToken);
    }
    // append body class name if set in config.
    if (config.bodyClassName) {
      context.window.document.body.classList.add(config.bodyClassName);
    }
  }

  await initLocalBaseState({
    environment,
    context,
    auth,
    staticConfig,
    ...rest,
  });

  /* eslint-disable */
  console.log('INITTING LOCAL STATE', {
    environment,
    context,
    auth,
    staticConfig,
    rest
  })

  const { featureFlags, ...settings } = await resolveConfig(environment, staticConfig);

  const commentsOrderBy =
    (await context.localStorage.getItem(COMMENTS_ORDER_BY)) ||
    "CREATED_AT_DESC";

  commitLocalUpdate(environment, (s) => {
    const root = s.getRoot();
    const localRecord = root.getLinkedRecord("local")!;

    // Parse query params
    const query = parseQuery(location.search);

    if (query.storyID) {
      localRecord.setValue(query.storyID, "storyID");
    }

    if (query.storyURL) {
      localRecord.setValue(query.storyURL, "storyURL");
    }

    if (query.storyMode && isStoryMode(query.storyMode)) {
      localRecord.setValue(query.storyMode, "storyMode");
    }

    // This will trigger single comment view.
    if (query.commentID) {
      localRecord.setValue(query.commentID, "commentID");
    }

    // Set sort
    localRecord.setValue(commentsOrderBy, "commentsOrderBy");

    // Create authPopup Record
    const authPopupRecord = createAndRetain(
      environment,
      s,
      AUTH_POPUP_ID,
      AUTH_POPUP_TYPE
    );
    authPopupRecord.setValue(false, "open");
    authPopupRecord.setValue(false, "focus");
    authPopupRecord.setValue("", "href");
    localRecord.setLinkedRecord(authPopupRecord, "authPopup");

    // Set active tabs
    localRecord.setValue("COMMENTS", "activeTab");
    localRecord.setValue("MY_COMMENTS", "profileTab");

    // Initialize the comments tab to NONE for now, it will be initialized to an
    // actual tab when we find out how many feature comments there are.
    localRecord.setValue("NONE", "commentsTab");

    // Enable comment seen
    localRecord.setValue(
      featureFlags.includes(GQLFEATURE_FLAG.COMMENT_SEEN),
      "enableCommentSeen"
    );

    // Enable flatten replies
    localRecord.setValue(
      !!settings.flattenReplies,
      "flattenReplies"
    )

    // Enable z-key comment seen
    localRecord.setValue(
      featureFlags.includes(GQLFEATURE_FLAG.Z_KEY),
      "enableZKey"
    );

    // Version as reported by the embed.js
    localRecord.setValue(config?.version, "embedVersion");

    localRecord.setValue(Boolean(config?.amp), "amp");
  });
};

export default initLocalState;

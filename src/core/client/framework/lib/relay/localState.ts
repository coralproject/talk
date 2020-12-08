import { commitLocalUpdate, Environment, graphql } from "relay-runtime";

import { StaticConfig } from "coral-common/config";
import { createAndRetain } from "coral-framework/lib/relay";

import { localStateQuery } from "coral-framework/__generated__/localStateQuery.graphql";

import { setAuthStateInLocalRecord } from "../auth";
import { InitLocalState } from "../bootstrap/createManaged";
import { fetchQuery } from "./fetch";

/**
 * The Root Record of Client-Side Schema Extension must be of this type.
 */
export const LOCAL_TYPE = "Local";

/**
 * The Root Record of Client-Side Schema Extension must have this id.
 */
export const LOCAL_ID = "client:root.local";

/**
 * The type for Static Configuration in the local record.
 */
export const STATIC_CONFIG_TYPE = "StaticConfig";

/**
 * The id for Static Configuration in the local record.
 */
export const STATIC_CONFIG_ID = "client:root.local.staticConfig";

async function determineFeatureFlags(
  environment: Environment,
  staticConfig?: StaticConfig | null
) {
  const featureFlags = staticConfig?.featureFlags;
  if (featureFlags) {
    return featureFlags;
  }
  if (process.env.NODE_ENV === "development") {
    // Send a graphql query to server during development to get the feature flags.
    // The reason is that we don't have static config during development.
    const data = await fetchQuery<localStateQuery>(
      environment,
      graphql`
        query localStateQuery {
          settings {
            featureFlags
          }
        }
      `,
      {}
    );
    return data.settings.featureFlags as string[];
  }
  return [];
}

/**
 * initLocalBaseState will initialize the local base relay state. If as a part
 * of your target you need to change the auth state, you can do so by passing a
 * new auth state object into this function when committing.
 *
 * @param environment the initialized relay environment
 * @param context application context
 * @param auth application auth state
 */
export const initLocalBaseState: InitLocalState = async ({
  environment,
  context,
  auth = null,
  staticConfig,
}) => {
  const featureFlags = await determineFeatureFlags(environment, staticConfig);

  commitLocalUpdate(environment, (source) => {
    const root = source.getRoot();

    // Create the Local Record which is the Root for the client states.
    const local = createAndRetain(environment, source, LOCAL_ID, LOCAL_TYPE);

    root.setLinkedRecord(local, "local");

    // Create and set the static configuration.
    const staticRecord = createAndRetain(
      environment,
      source,
      STATIC_CONFIG_ID,
      STATIC_CONFIG_TYPE
    );
    staticRecord.setValue(featureFlags, "featureFlags");
    local.setLinkedRecord(staticRecord, "staticConfig");

    setAuthStateInLocalRecord(local, auth);
  });
};

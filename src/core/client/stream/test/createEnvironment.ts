import { IResolvers } from "graphql-tools";
import { createFetch } from "relay-local-schema";
import {
  commitLocalUpdate,
  Environment,
  FetchFunction,
  Network,
  RecordProxy,
  RecordSource,
  Store,
} from "relay-runtime";

import { loadSchema } from "talk-common/graphql";
import {
  createAndRetain,
  LOCAL_ID,
  LOCAL_TYPE,
  wrapFetchWithLogger,
} from "talk-framework/lib/relay";

export interface CreateEnvironmentParams {
  /** graphql resolvers */
  resolvers: IResolvers<any, any>;
  /** Allows to set initial state for Local state */
  initLocalState?: (local: RecordProxy) => void;
  /** If enabled, graphql responses will be logged to the console */
  logNetwork?: boolean;
}

/**
 * create Relay environment for integration tests.
 */
export default function createEnvironment(params: CreateEnvironmentParams) {
  const schema = loadSchema("tenant", params.resolvers);
  const environment = new Environment({
    network: Network.create(
      wrapFetchWithLogger(createFetch({ schema }), params.logNetwork)
    ),
    store: new Store(new RecordSource()),
  });
  if (params.initLocalState) {
    commitLocalUpdate(environment, s => {
      const root = s.getRoot();
      const localRecord = createAndRetain(environment, s, LOCAL_ID, LOCAL_TYPE);
      root.setLinkedRecord(localRecord, "local");
      params.initLocalState!(localRecord);
    });
  }
  return environment;
}

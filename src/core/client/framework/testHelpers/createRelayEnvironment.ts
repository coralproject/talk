import { IResolvers } from "graphql-tools";
import { createFetch } from "relay-local-schema";
import {
  commitLocalUpdate,
  Environment,
  Network,
  RecordProxy,
  RecordSource,
  RecordSourceProxy,
  Store,
} from "relay-runtime";

import {
  createAndRetain,
  LOCAL_ID,
  LOCAL_TYPE,
  wrapFetchWithLogger,
} from "talk-framework/lib/relay";

import { loadSchema } from "talk-common/graphql";

export interface CreateRelayEnvironmentNetworkParams {
  /** project name of graphql-config */
  projectName: string;
  /** graphql resolvers */
  resolvers: IResolvers<any, any>;
  /** If enabled, graphql responses will be logged to the console */
  logNetwork?: boolean;
}

export interface CreateRelayEnvironmentParams {
  /** If set, creates a network to a local graphql server with a local schema */
  network?: CreateRelayEnvironmentNetworkParams;
  /**
   * Initializes an empty local state if true.
   * When passing in a function it gets executed after
   * the intialization. Defaults to true.
   */
  initLocalState?:
    | ((
        local: RecordProxy,
        source: RecordSourceProxy,
        environment: Environment
      ) => void)
    | false
    | true;
  /** Use this source for creating the environment */
  source?: RecordSource;
}

/**
 * create Relay environment for tests environments.
 */
export default function createRelayEnvironment(
  params: CreateRelayEnvironmentParams = {}
) {
  let network: Network = null as any;
  if (params.network) {
    const schema = loadSchema(
      params.network.projectName,
      params.network.resolvers,
      { requireResolversForResolveType: false }
    );
    network = Network.create(
      wrapFetchWithLogger(createFetch({ schema }), params.network.logNetwork)
    );
  }
  const environment = new Environment({
    network,
    store: new Store(params.source || new RecordSource()),
  });
  if (params.initLocalState !== false) {
    commitLocalUpdate(environment, sourceProxy => {
      const root = sourceProxy.getRoot();
      const localRecord = createAndRetain(
        environment,
        sourceProxy,
        LOCAL_ID,
        LOCAL_TYPE
      );
      root.setLinkedRecord(localRecord, "local");
      if (typeof params.initLocalState === "function") {
        params.initLocalState!(localRecord, sourceProxy, environment);
      }
    });
  }
  return environment;
}

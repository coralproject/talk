import { graphql, GraphQLSchema, parse } from "graphql";
import { IResolvers } from "graphql-tools";
import { SubscribeFunction } from "react-relay-network-modern/es";
import {
  commitLocalUpdate,
  Disposable,
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
} from "coral-framework/lib/relay";

import { loadSchema } from "coral-common/graphql";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";

import { SubscriptionHandler } from "./createSubscriptionHandler";

export interface CreateRelayEnvironmentNetworkParams {
  /** project name of graphql-config */
  projectName: string;
  /** graphql resolvers */
  resolvers?: IResolvers<any, any>;
  /** If enabled, graphql responses will be logged to the console */
  logNetwork?: boolean;
  /** If enabled, graphql errors will be muted */
  muteNetworkErrors?: boolean;
  /** handler for subscriptions */
  subscriptionHandler?: SubscriptionHandler;
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

function createFetch({
  schema,
  rootValue,
  contextValue,
}: {
  schema: GraphQLSchema;
  rootValue?: any;
  contextValue?: any;
}) {
  return function fetchQuery(operation: any, variables: Record<string, any>) {
    return graphql(
      schema,
      operation.text,
      rootValue,
      contextValue,
      variables
    ).then(payload => {
      if (payload.errors) {
        payload.errors.forEach(e => {
          // Throw our custom errors directly.
          if (
            e.originalError instanceof InvalidRequestError ||
            e.originalError instanceof ModerationNudgeError
          ) {
            throw e.originalError;
          }
        });
        throw new Error(payload.errors.toString());
      }
      return payload;
    });
  };
}

function createSubscribe(
  subscriptionHandler: SubscriptionHandler
): SubscribeFunction {
  const fn: SubscribeFunction = (
    operation,
    variables,
    cacheConfig,
    observer
  ) => {
    // TODO: (cvle) This could probably made less brittle to changes in the order of the
    // document AST.
    const subscriptionSelections = (parse(operation.text!) as any)
      .definitions[0].selectionSet.selections as any[];
    const disposables: Disposable[] = [];
    const fields = subscriptionSelections.map(f => f.name.value);
    const defaultData = fields.reduce((res, f) => {
      res[f] = null;
      return res;
    }, {});

    fields.forEach(field => {
      const subscription = {
        field,
        variables: variables || {},
        dispatch: (response: any) => {
          observer.onNext({
            data: {
              ...defaultData,
              [field]: response,
            },
          });
        },
      };
      subscriptionHandler.add(subscription);
      disposables.push({
        dispose: () => {
          subscriptionHandler.remove(subscription);
        },
      });
    });
    return {
      dispose: () => {
        disposables.forEach(d => d.dispose());
      },
    };
  };
  return fn;
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
      params.network.resolvers || {},
      { requireResolversForResolveType: false }
    );
    network = Network.create(
      wrapFetchWithLogger(createFetch({ schema }), {
        logResult: params.network.logNetwork,
        muteErrors: params.network.muteNetworkErrors,
      }),
      params.network.subscriptionHandler
        ? (createSubscribe(params.network.subscriptionHandler) as any)
        : undefined
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

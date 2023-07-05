import { IResolvers } from "@graphql-tools/utils";
import { graphql, GraphQLSchema, parse } from "graphql";
import {
  CacheConfig,
  commitLocalUpdate,
  Environment,
  FetchFunction,
  GraphQLResponse,
  INetwork,
  Network,
  Observable,
  RecordProxy,
  RecordSource,
  RecordSourceProxy,
  RequestParameters,
  Store,
  SubscribeFunction,
  UploadableMap,
  Variables,
} from "relay-runtime";

import { loadSchema } from "coral-common/graphql";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import {
  createAndRetain,
  LOCAL_ID,
  LOCAL_TYPE,
  wrapFetchWithLogger,
} from "coral-framework/lib/relay";

import { SubscriptionHandler } from "./createSubscriptionHandler";

export interface CreateRelayEnvironmentNetworkParams {
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
}): FetchFunction {
  return function fetchQuery(
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null
  ) {
    return graphql(
      schema,
      request.text!,
      rootValue,
      contextValue,
      variables
    ).then((payload) => {
      if (payload.errors) {
        payload.errors.forEach((e) => {
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
      return {
        data: payload.data || undefined,
        errors: payload.errors || [],
      };
    });
  };
}

function resolveArguments(
  variables: Record<string, any> = {},
  args: any[] = []
) {
  return args.reduce((res, a) => {
    const argName = a.name.value;
    const variableName = a.value.name.value;
    if (variableName in variables) {
      res[argName] = variables[variableName];
    }
    return res;
  }, {});
}

function createSubscribe(
  subscriptionHandler: SubscriptionHandler
): SubscribeFunction {
  const fn: SubscribeFunction = (operation, variables, cacheConfig) => {
    return Observable.create<GraphQLResponse>((sink) => {
      // TODO: (cvle) This could probably made less brittle to changes in the order of the
      // document AST.
      const subscriptionSelections = (parse(operation.text!) as any)
        .definitions[0].selectionSet.selections as any[];
      const sel = subscriptionSelections[0];
      const subscription = {
        field: sel.name.value,
        variables: resolveArguments(variables, sel.arguments),
        dispatch: (response: any) => {
          sink.next({
            data: {
              [sel.name.value]: response,
            },
          });
        },
      };
      subscriptionHandler.add(subscription);
    });
  };
  return fn;
}

/**
 * create Relay environment for tests environments.
 */
export default function createRelayEnvironment(
  params: CreateRelayEnvironmentParams = {}
) {
  let network: INetwork = null as any;
  if (params.network) {
    const schema = loadSchema(params.network.resolvers || {}, {
      requireResolversForResolveType: false,
    });
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
    commitLocalUpdate(environment, (sourceProxy) => {
      const root = sourceProxy.getRoot();
      const localRecord = createAndRetain(
        environment,
        sourceProxy,
        LOCAL_ID,
        LOCAL_TYPE
      );
      root.setLinkedRecord(localRecord, "local");
      if (typeof params.initLocalState === "function") {
        params.initLocalState(localRecord, sourceProxy, environment);
      }
    });
  }
  return environment;
}

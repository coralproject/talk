import { execute, ExecutionResult, parse, subscribe } from "graphql";
import http, { IncomingMessage } from "http";
import {
  ConnectionContext,
  ExecutionParams,
  OperationMessage,
  OperationMessagePayload,
  SubscriptionServer as ApolloSubscriptionServer,
} from "subscriptions-transport-ws";
import { container } from "tsyringe";
import { v4 as uuid } from "uuid";

import {
  ACCESS_TOKEN_PARAM,
  BUNDLE_CONFIG_PARAM,
  BUNDLE_ID_PARAM,
  CLIENT_ID_PARAM,
} from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import { getHostname } from "coral-server/app/helpers/hostname";
import JWTStrategy, {
  verifyAndRetrieveUser,
} from "coral-server/app/middleware/passport/strategies/jwt";
import { CONFIG, Config } from "coral-server/config";
import {
  CoralError,
  LiveUpdatesDisabled,
  RawQueryNotAuthorized,
  TenantNotFoundError,
  WrappedInternalError,
} from "coral-server/errors";
import { getPersistedQuery } from "coral-server/graph/persisted";
import {
  enrichError,
  getOperationMetadata,
  logAndReportError,
  logQuery,
} from "coral-server/graph/plugins";
import logger from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import {
  createStoryViewer,
  removeStoryViewer,
} from "coral-server/models/story/viewers";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { hasStaffRole } from "coral-server/models/user/helpers";
import { I18nService } from "coral-server/services/i18n";
import { extractTokenFromRequest } from "coral-server/services/jwt";
import { MetricsService } from "coral-server/services/metrics";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { PersistedQueryCache } from "coral-server/services/queries";
import { REDIS, Redis } from "coral-server/services/redis";
import { find } from "coral-server/services/stories";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  GQLFEATURE_FLAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext, { GraphContextOptions } from "../context";
import SchemaService from "../schema";

function extractTokenFromWSRequest(
  connectionParams: OperationMessagePayload,
  req: IncomingMessage
): string | null {
  // Try to grab the token from the connection params if available.
  if (
    typeof connectionParams[ACCESS_TOKEN_PARAM] === "string" &&
    connectionParams[ACCESS_TOKEN_PARAM].length > 0
  ) {
    return connectionParams[ACCESS_TOKEN_PARAM];
  }

  // Try to get the access token from the request.
  return extractTokenFromRequest(req);
}

function extractClientID(connectionParams: OperationMessagePayload) {
  if (
    typeof connectionParams[CLIENT_ID_PARAM] === "string" &&
    connectionParams[CLIENT_ID_PARAM].length > 0
  ) {
    // Limit the clientID to 36 characters (the length of a UUID).
    return connectionParams[CLIENT_ID_PARAM].slice(0, 36);
  }

  return null;
}

function extractBundleID(
  connectionParams: OperationMessagePayload
): string | null {
  if (
    typeof connectionParams[BUNDLE_ID_PARAM] === "string" &&
    connectionParams[BUNDLE_ID_PARAM].length > 0
  ) {
    return connectionParams[BUNDLE_ID_PARAM];
  }

  return null;
}

function extractBundleConfig(
  connectionParams: OperationMessagePayload
): null | Record<string, string> {
  if (typeof connectionParams[BUNDLE_CONFIG_PARAM] === "object") {
    return connectionParams[BUNDLE_CONFIG_PARAM];
  }

  return null;
}

function hasStoryViewer(
  socket: any
): socket is {
  tenantID: string;
  siteID: string;
  storyID: string;
  clientID: string;
} {
  if (
    typeof socket.tenantID === "string" &&
    socket.tenantID.length > 0 &&
    typeof socket.siteID === "string" &&
    socket.siteID.length > 0 &&
    typeof socket.storyID === "string" &&
    socket.storyID.length > 0 &&
    typeof socket.clientID === "string" &&
    socket.clientID.length > 0
  ) {
    return true;
  }

  return false;
}

export class SubscriptionServer {
  private readonly options: AppOptions;
  private readonly schema: SchemaService;
  private readonly persistedQueryCache: PersistedQueryCache;
  private readonly redis: Redis;
  private readonly config: Config;
  private readonly tenantCache: TenantCache;
  private readonly strategy: JWTStrategy;
  private readonly mongo: Mongo;
  private readonly i18n: I18nService;
  private readonly metrics: MetricsService;

  /**
   * attached will be true when the server has attached to am
   * ApolloSubscriptionServer.
   */
  private attached = false;

  constructor(options: AppOptions) {
    // TODO: Replace with DI.
    this.schema = container.resolve(SchemaService);
    this.config = container.resolve<Config>(CONFIG);
    this.i18n = container.resolve(I18nService);
    this.mongo = container.resolve<Mongo>(MONGO);
    this.persistedQueryCache = container.resolve(PersistedQueryCache);
    this.redis = container.resolve<Redis>(REDIS);
    this.strategy = container.resolve(JWTStrategy);
    this.tenantCache = container.resolve(TenantCache);
    this.metrics = container.resolve(MetricsService);

    this.options = options;
  }

  public attach(server: http.Server) {
    if (this.attached) {
      throw new Error("server was already attached");
    }
    this.attached = true;

    return ApolloSubscriptionServer.create(
      {
        schema: this.schema.schema,
        execute,
        subscribe,
        onConnect: this.onConnect.bind(this),
        onOperation: this.onOperation.bind(this),
        onDisconnect: this.onDisconnect.bind(this),
        keepAlive: this.config.get("websocket_keep_alive_timeout"),
      },
      {
        server,
        path: "/api/graphql/live",
      }
    );
  }

  private async onConnect(
    connectionParams: OperationMessagePayload,
    socket: any,
    context: ConnectionContext
  ) {
    logger.trace("a socket has connected");

    try {
      // Pull the upgrade request off of the connection.
      const req: IncomingMessage = socket.upgradeReq;

      // Get the hostname of the request.
      const hostname = getHostname(req);
      if (!hostname) {
        throw new Error("could not detect hostname");
      }

      // Get the Tenant for this hostname.
      const tenant = await this.tenantCache.retrieveByDomain(hostname);
      if (!tenant) {
        throw new TenantNotFoundError(hostname);
      }

      // Create some new options to store the tenant context details inside.
      const opts: GraphContextOptions = {
        id: uuid(),
        now: new Date(),
        tenant,
        logger,
        // Disable caching with this Context to ensure that every call (besides)
        // to the tenant, is not cached, and is instead fresh.
        disableCaching: true,
      };

      // If the token is available, try to get the user.
      const tokenString = extractTokenFromWSRequest(connectionParams, req);
      if (tokenString) {
        const user = await verifyAndRetrieveUser(
          this.strategy.verifiers,
          tenant,
          tokenString
        );
        if (user) {
          opts.user = user;
        }
      }

      // Check to see if live updates are disabled on the server, if they are,
      // we can block the websocket request here for non-staff users.
      if (this.config.get("disable_live_updates")) {
        // TODO: (wyattjoh) if the story settings can only disable, and not
        // enable live updates (as it takes precedence over global settings)
        // then we can add a check for `!tenant.live.enabled` here too.
        if (!opts.user || !hasStaffRole(opts.user)) {
          throw new LiveUpdatesDisabled();
        }
      }

      // Extract the users clientID from the request.
      const clientID = extractClientID(connectionParams);
      if (clientID) {
        opts.clientID = clientID;
      }

      // Create the GraphContext.
      const ctx = new GraphContext(opts);

      // Get the bundleID and bundleConfig.
      const bundleID = extractBundleID(connectionParams);
      const bundleConfig = extractBundleConfig(connectionParams);

      // Check to see if we have the viewer count feature flag enabled.
      const enabled = hasFeatureFlag(tenant, GQLFEATURE_FLAG.VIEWER_COUNT);

      if (
        // If this tenant has this feature flag enabled...
        enabled &&
        // And the request has a clientID...
        clientID &&
        // And it's from the stream...
        bundleID === "stream" &&
        // And it has a bundle config...
        bundleConfig &&
        // And we have either a storyID or storyURL on the config...
        (bundleConfig.storyID || bundleConfig.storyURL)
      ) {
        // Then we need to create a new storyViewerf for the request!
        const story = await find(this.mongo, tenant, {
          id: bundleConfig.storyID,
          url: bundleConfig.storyURL,
        });
        if (story) {
          // Attach the clientID to the socket so the disconnect handler can use
          // it to disconnect this clientID.
          socket.tenantID = tenant.id;
          socket.siteID = story.siteID;
          socket.storyID = story.id;
          socket.clientID = clientID;

          // Create the viewer entry!
          await createStoryViewer(
            this.redis,
            {
              tenantID: tenant.id,
              siteID: story.siteID,
              storyID: story.id,
            },
            clientID,
            this.config.get("story_viewer_timeout"),
            ctx.now
          );
        }
      }

      return ctx;
    } catch (err) {
      if (err instanceof LiveUpdatesDisabled) {
        logger.info({ err }, "websocket connection rejected");
      } else {
        logger.error({ err }, "could not setup websocket connection");
      }

      if (!(err instanceof CoralError)) {
        // eslint-disable-next-line no-ex-assign
        err = new WrappedInternalError(
          err,
          "could not setup websocket connection"
        );
      }
      const { message } = err.serializeExtensions(this.i18n.getDefaultBundle());

      throw new Error(message);
    }
  }

  private async onOperation(
    message: OperationMessage,
    params: ExecutionParams<GraphContext>
  ) {
    // Handle the payload if it is a persisted query.
    const persisted = await getPersistedQuery(
      this.persistedQueryCache,
      message.payload
    );
    if (!persisted) {
      // Check to see if this is from an ADMIN token which is allowed to run
      // un-persisted queries.
      if (
        this.options.persistedQueriesRequired &&
        (!params.context.user ||
          params.context.user.role !== GQLUSER_ROLE.ADMIN)
      ) {
        throw new RawQueryNotAuthorized(
          params.context.tenant.id,
          message.payload && message.payload.query
            ? message.payload.query
            : null,
          params.context.user ? params.context.user.id : null
        );
      }
    } else {
      // The query was found for this operation, replace the query with the one
      // provided.
      params.query = persisted.query;
    }

    // Attach the response formatter.
    params.formatResponse = this.formatResponse(persisted);

    return params;
  }

  private async onDisconnect(socket: any) {
    logger.trace("a socket has disconnected");

    // If the socket has a clientID attached, then remove the story viewer
    // entry.
    if (hasStoryViewer(socket)) {
      const { tenantID, siteID, storyID } = socket;

      await removeStoryViewer(
        this.redis,
        { tenantID, siteID, storyID },
        socket.clientID,
        this.config.get("story_viewer_timeout")
      );
    }
  }

  private formatResponse = (persisted?: PersistedQuery) => (
    value: ExecutionResult,
    { context, query }: ExecutionParams<GraphContext>
  ) => {
    // Parse the query in order to extract operation metadata.
    if (typeof query === "string") {
      query = parse(query);
    }

    // Log out the query.
    logQuery(context, query, persisted);

    // Get the request metadata.
    const { operation, operationName } = getOperationMetadata(query);
    if (operation && operationName) {
      // Increment the graph query value, tagging with the name of the query.
      this.metrics.executedGraphQueriesTotalCounter
        .labels(operation, operationName)
        .inc();
    }

    if (value.errors && value.errors.length > 0) {
      return {
        ...value,
        errors: value.errors.map((err) => {
          const enriched = enrichError(context, err);

          // Log the error out.
          logAndReportError(context, enriched);

          return enriched;
        }),
      };
    }

    return value;
  };
}

import {
  execute,
  ExecutionResult,
  GraphQLSchema,
  parse,
  subscribe,
} from "graphql";
import http, { IncomingMessage } from "http";
import {
  ConnectionContext,
  ExecutionParams,
  OperationMessage,
  OperationMessagePayload,
  SubscriptionServer,
} from "subscriptions-transport-ws";

import { ACCESS_TOKEN_PARAM, CLIENT_ID_PARAM } from "coral-common/constants";
import { Omit } from "coral-common/types";
import { AppOptions } from "coral-server/app";
import { getHostname } from "coral-server/app/helpers/hostname";
import {
  createVerifiers,
  verifyAndRetrieveUser,
} from "coral-server/app/middleware/passport/strategies/jwt";
import {
  CoralError,
  InternalError,
  LiveUpdatesDisabled,
  RawQueryNotAuthorized,
  TenantNotFoundError,
} from "coral-server/errors";
import {
  enrichError,
  logError,
  logQuery,
} from "coral-server/graph/common/extensions";
import { getOperationMetadata } from "coral-server/graph/common/extensions/helpers";
import { getPersistedQuery } from "coral-server/graph/tenant/persisted";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import { hasStaffRole } from "coral-server/models/user/helpers";
import { extractTokenFromRequest } from "coral-server/services/jwt";

import TenantContext, { TenantContextOptions } from "../context";

type OnConnectFn = (
  params: OperationMessagePayload,
  socket: any,
  context: ConnectionContext
) => Promise<TenantContext>;

export function extractTokenFromWSRequest(
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

export function extractClientID(connectionParams: OperationMessagePayload) {
  if (
    typeof connectionParams[CLIENT_ID_PARAM] === "string" &&
    connectionParams[CLIENT_ID_PARAM].length > 0
  ) {
    return connectionParams[CLIENT_ID_PARAM];
  }

  return null;
}

export type OnConnectOptions = Omit<
  TenantContextOptions,
  "tenant" | "signingConfig" | "disableCaching"
> &
  Required<Pick<TenantContextOptions, "signingConfig">>;

export function onConnect(options: OnConnectOptions): OnConnectFn {
  // Create the JWT verifiers that will be used to verify all the requests
  // coming in.
  const verifiers = createVerifiers(options);

  // Return the per-connection operation.
  return async (connectionParams, socket) => {
    try {
      // Pull the upgrade request off of the connection.
      const req: IncomingMessage = socket.upgradeReq;

      // Get the hostname of the request.
      const hostname = getHostname(req);
      if (!hostname) {
        throw new Error("could not detect hostname");
      }

      // Get the Tenant for this hostname.
      const tenant = await options.tenantCache.retrieveByDomain(hostname);
      if (!tenant) {
        throw new TenantNotFoundError(hostname);
      }

      // Create some new options to store the tenant context details inside.
      const opts: TenantContextOptions = {
        ...options,
        // Disable caching with this Context to ensure that every call (besides)
        // to the tenant, is not cached, and is instead fresh.
        disableCaching: true,
        tenant,
      };

      // If the token is available, try to get the user.
      const tokenString = extractTokenFromWSRequest(connectionParams, req);
      if (tokenString) {
        const user = await verifyAndRetrieveUser(
          verifiers,
          tenant,
          tokenString
        );
        if (user) {
          opts.user = user;
        }
      }

      // Check to see if live updates are disabled on the server, if they are,
      // we can block the websocket request here for non-staff users.
      if (options.config.get("disable_live_updates")) {
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

      return new TenantContext(opts);
    } catch (err) {
      if (err instanceof LiveUpdatesDisabled) {
        logger.info({ err }, "websocket connection rejected");
      } else {
        logger.error({ err }, "could not setup websocket connection");
      }

      if (!(err instanceof CoralError)) {
        err = new InternalError(err, "could not setup websocket connection");
      }
      const { message } = err.serializeExtensions(
        options.i18n.getDefaultBundle()
      );

      throw { message };
    }
  };
}

export type FormatResponseOptions = Pick<AppOptions, "metrics">;

export function formatResponse({ metrics }: FormatResponseOptions) {
  return (
    value: ExecutionResult,
    { context, query }: ExecutionParams<TenantContext>
  ) => {
    // Parse the query in order to extract operation metadata.
    if (typeof query === "string") {
      query = parse(query);
    }

    // Log out the query.
    logQuery(context, query);

    // Increment the metrics if enabled.
    if (metrics) {
      // Get the request metadata.
      const { operation, operationName } = getOperationMetadata(query);
      if (operation && operationName) {
        // Increment the graph query value, tagging with the name of the query.
        metrics.executedGraphQueriesTotalCounter
          .labels(operation, operationName)
          .inc();
      }
    }

    if (value.errors && value.errors.length > 0) {
      return {
        ...value,
        errors: value.errors.map(err => {
          const enriched = enrichError(context, err);

          // Log the error out.
          logError(context, enriched);

          return enriched;
        }),
      };
    }

    return value;
  };
}

export type OnOperationOptions = FormatResponseOptions &
  Pick<AppOptions, "persistedQueryCache" | "persistedQueriesRequired">;

export function onOperation(options: OnOperationOptions) {
  return async (
    message: OperationMessage,
    params: ExecutionParams<TenantContext>
  ) => {
    // Attach the response formatter.
    params.formatResponse = formatResponse(options);

    // Handle the payload if it is a persisted query.
    const query = await getPersistedQuery(
      options.persistedQueryCache,
      message.payload
    );
    if (!query) {
      // Check to see if this is from an ADMIN token which is allowed to run
      // un-persisted queries.
      if (
        options.persistedQueriesRequired &&
        (!params.context.user ||
          params.context.user.role !== GQLUSER_ROLE.ADMIN)
      ) {
        throw new RawQueryNotAuthorized(
          params.context.tenant.id,
          params.context.user ? params.context.user.id : null
        );
      }
    } else {
      // The query was found for this operation, replace the query with the one
      // provided.
      params.query = query.query;
    }

    return params;
  };
}

export type Options = OnConnectOptions & OnOperationOptions;

export function createSubscriptionServer(
  server: http.Server,
  schema: GraphQLSchema,
  options: Options
) {
  const keepAlive = options.config.get("websocket_keep_alive_timeout");
  if (typeof keepAlive !== "number" || keepAlive <= 0) {
    throw new Error(
      "expected the websocket_keep_alive_timeout configuration to be a positive number"
    );
  }

  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: onConnect(options),
      onOperation: onOperation(options),
      keepAlive,
    },
    {
      server,
      path: "/api/graphql/live",
    }
  );
}

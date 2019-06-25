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
  TenantNotFoundError,
} from "coral-server/errors";
import {
  enrichError,
  logError,
  logQuery,
} from "coral-server/graph/common/extensions";
import { getOperationMetadata } from "coral-server/graph/common/extensions/helpers";
import logger from "coral-server/logger";
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

      // Extract the users clientID from the request.
      const clientID = extractClientID(connectionParams);
      if (clientID) {
        opts.clientID = clientID;
      }

      return new TenantContext(opts);
    } catch (err) {
      logger.error({ err }, "could not setup websocket connection");

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

export type OnOperationOptions = FormatResponseOptions;

export function onOperation(options: OnOperationOptions) {
  return (message: any, params: ExecutionParams<TenantContext>) => {
    // Attach the response formatter.
    params.formatResponse = formatResponse(options);

    return params;
  };
}

export type Options = OnConnectOptions & OnOperationOptions;

export function createSubscriptionServer(
  server: http.Server,
  schema: GraphQLSchema,
  options: Options
) {
  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: onConnect(options),
      onOperation: onOperation(options),
    },
    {
      server,
      path: "/api/graphql/live",
    }
  );
}

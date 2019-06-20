import { execute, GraphQLSchema, subscribe } from "graphql";
import http, { IncomingMessage } from "http";
import {
  ConnectionContext,
  ExecutionParams,
  OperationMessagePayload,
  SubscriptionServer,
} from "subscriptions-transport-ws";

import { Omit } from "coral-common/types";
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
import logger from "coral-server/logger";
import { extractTokenFromRequest } from "coral-server/services/jwt";

import { ACCESS_TOKEN_PARAM, CLIENT_ID_PARAM } from "coral-common/constants";
import TenantContext, { TenantContextOptions } from "../context";

type Options = Omit<
  TenantContextOptions,
  "tenant" | "signingConfig" | "disableCaching"
> &
  Required<Pick<TenantContextOptions, "signingConfig">>;

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

export function onConnect(options: Options): OnConnectFn {
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

// FIXME: (wyattjoh) errors over subscriptions (including GraphQL ones) are not logged

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
    },
    {
      server,
      path: "/api/graphql/live",
    }
  );
}

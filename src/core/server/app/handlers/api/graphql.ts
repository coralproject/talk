import { generateSchemaHash } from "apollo-server-core/dist/utils/schemaHash";

import { CLIENT_ID_HEADER } from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import { graphqlMiddleware } from "coral-server/app/middleware/graphql";
import GraphContext, { GraphContextOptions } from "coral-server/graph/context";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

export type GraphMiddlewareOptions = Pick<
  AppOptions,
  | "config"
  | "i18n"
  | "mailerQueue"
  | "scraperQueue"
  | "rejectorQueue"
  | "notifierQueue"
  | "webhookQueue"
  | "mongo"
  | "redis"
  | "schema"
  | "signingConfig"
  | "pubsub"
  | "tenantCache"
  | "metrics"
  | "broker"
  | "reporter"
>;

export const graphQLHandler = ({
  schema,
  config,
  metrics,
  ...options
}: GraphMiddlewareOptions): RequestHandler<TenantCoralRequest> => {
  // Generate the schema hash.
  const schemaHash = generateSchemaHash(schema);

  return graphqlMiddleware(
    config,
    async (req: Request<TenantCoralRequest>) => {
      // Pull out some useful properties from Coral.
      const { id, now, tenant, logger, persisted } = req.coral;

      // Create some new options to store the tenant context details inside.
      const opts: GraphContextOptions = {
        ...options,
        id,
        now,
        req,
        persisted,
        config,
        tenant,
        logger,
      };

      // Add the user if there is one.
      if (req.user) {
        opts.user = req.user;
      }

      // Add the clientID if there is one on the request.
      const clientID = req.get(CLIENT_ID_HEADER);
      if (clientID) {
        // TODO: (wyattjoh) validate length
        opts.clientID = clientID;
      }

      return {
        schema,
        schemaHash,
        context: new GraphContext(opts),
      };
    },
    metrics
  );
};

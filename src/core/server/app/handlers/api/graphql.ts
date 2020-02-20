import { CLIENT_ID_HEADER } from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import { graphqlMiddleware } from "coral-server/app/middleware/graphql";
import GraphContext, { GraphContextOptions } from "coral-server/graph/context";
import { Request, RequestHandler } from "coral-server/types/express";

export type GraphMiddlewareOptions = Pick<
  AppOptions,
  | "config"
  | "i18n"
  | "mailerQueue"
  | "mongo"
  | "redis"
  | "schema"
  | "scraperQueue"
  | "signingConfig"
  | "pubsub"
  | "tenantCache"
  | "metrics"
  | "broker"
>;

export const graphQLHandler = ({
  schema,
  config,
  metrics,
  ...options
}: GraphMiddlewareOptions): RequestHandler =>
  graphqlMiddleware(
    config,
    async (req: Request) => {
      if (!req.coral) {
        throw new Error("coral was not set");
      }

      // Pull out some useful properties from Coral.
      const { id, now, tenant, cache, logger, persisted } = req.coral;

      if (!cache) {
        throw new Error("cache was not set");
      }

      if (!tenant) {
        throw new Error("tenant was not set");
      }

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
        context: new GraphContext(opts),
      };
    },
    metrics
  );

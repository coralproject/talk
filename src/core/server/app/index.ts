import { Express } from "express";
import http from "http";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import { Config } from "talk-common/config";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";
import { createPassport } from "talk-server/app/middleware/passport";
import { JWTSigningConfig } from "talk-server/app/middleware/passport/jwt";
import { handleSubscriptions } from "talk-server/graph/common/subscriptions/middleware";
import { Schemas } from "talk-server/graph/schemas";
import TenantCache from "talk-server/services/tenant/cache";

import { accessLogger, errorLogger } from "./middleware/logging";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  parent: Express;
  config: Config;
  mongo: Db;
  redis: Redis;
  schemas: Schemas;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

/**
 * createApp will create a Talk Express app that can be used to handle requests.
 */
export async function createApp(options: AppOptions): Promise<Express> {
  // Pull the parent out of the options.
  const { parent } = options;

  // Logging
  parent.use(accessLogger);

  // Create some services for the router.
  const passport = createPassport(options);

  // Mount the router.
  parent.use(
    await createRouter(options, {
      passport,
    })
  );

  // Static Files
  parent.use(serveStatic);

  // Error Handling
  parent.use(notFoundMiddleware);
  parent.use(errorLogger);

  return parent;
}

/**
 * listenAndServe will start the given express application.
 *
 * @param app the express application to start
 * @param port the port to listen on
 */
export const listenAndServe = (
  app: Express,
  port: number
): Promise<http.Server> =>
  new Promise(async resolve => {
    // Listen on the designated port.
    const httpServer = app.listen(port, () => resolve(httpServer));
  });

/**
 * attachSubscriptionHandlers attaches all the handlers to the http.Server to
 * handle websocket traffic by upgrading their http connections to websocket.
 *
 * @param schemas schemas for every schema this application handles
 * @param server the http.Server to attach the websocket upgrader to
 */
export async function attachSubscriptionHandlers(
  schemas: Schemas,
  server: http.Server
) {
  // Setup the Management Subscription endpoint.
  handleSubscriptions(server, {
    schema: schemas.management,
    path: "/api/management/live",
  });

  // Setup the Tenant Subscription endpoint.
  handleSubscriptions(server, {
    schema: schemas.tenant,
    path: "/api/tenant/live",
  });
}

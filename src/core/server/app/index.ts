import cons from "consolidate";
import cors from "cors";
import { Express } from "express";
import http from "http";
import { Db } from "mongodb";
import nunjucks from "nunjucks";
import path from "path";

import { Config } from "talk-common/config";
import { cacheHeadersMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { errorHandler } from "talk-server/app/middleware/error";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";
import { createPassport } from "talk-server/app/middleware/passport";
import { handleSubscriptions } from "talk-server/graph/common/subscriptions/middleware";
import { Schemas } from "talk-server/graph/schemas";
import { TaskQueue } from "talk-server/queue";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { AugmentedRedis } from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";

import { accessLogger, errorLogger } from "./middleware/logging";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  parent: Express;
  queue: TaskQueue;
  config: Config;
  mongo: Db;
  redis: AugmentedRedis;
  schemas: Schemas;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

/**
 * createApp will create a Talk Express app that can be used to handle requests.
 */
export async function createApp(options: AppOptions): Promise<Express> {
  // Configure the application.
  configureApplication(options);

  // Pull the parent out of the options.
  const { parent } = options;

  // Logging
  parent.use(accessLogger);

  // Create some services for the router.
  const passport = createPassport(options);

  // Mount the router.
  parent.use(
    "/",
    await createRouter(options, {
      passport,
    })
  );

  // Enable CORS headers for media assets, font's require them.
  parent.use("/assets/media", cors());

  // Static Files
  parent.use("/assets", cacheHeadersMiddleware("1w"), serveStatic);

  // Error Handling
  parent.use(notFoundMiddleware);
  parent.use(errorLogger);
  parent.use(errorHandler);

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

function configureApplication(options: AppOptions) {
  const { parent } = options;

  // Trust the first proxy in front of us, this will enable us to trust the fact
  // that SSL was terminated correctly.
  parent.set("trust proxy", 1);

  // Setup the view config.
  setupViews(options);
}

function setupViews(options: AppOptions) {
  const { parent } = options;

  // configure the default views directory.
  const views = path.join(__dirname, "..", "..", "..", "..", "dist", "static");
  parent.set("views", views);

  // Reconfigure nunjucks.
  (cons.requires as any).nunjucks = nunjucks.configure(views, {
    // In development, we should enable file watch mode.
    watch: options.config.get("env") === "development",
  });

  // assign the nunjucks engine to .njk and .html files.
  parent.engine("njk", cons.nunjucks);
  parent.engine("html", cons.nunjucks);

  // set .html as the default extension.
  parent.set("view engine", "html");
}

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

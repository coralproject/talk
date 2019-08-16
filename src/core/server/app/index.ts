import cons from "consolidate";
import cors from "cors";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";
import http from "http";
import { Db } from "mongodb";
import nunjucks from "nunjucks";
import path from "path";

import { cacheHeadersMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { HTMLErrorHandler } from "coral-server/app/middleware/error";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { createPassport } from "coral-server/app/middleware/passport";
import { Config } from "coral-server/config";
import { PersistedQueryCache } from "coral-server/models/queries";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { Metrics } from "coral-server/services/metrics";
import { AugmentedRedis } from "coral-server/services/redis";
import TenantCache from "coral-server/services/tenant/cache";

import { accessLogger, errorLogger } from "./middleware/logging";
import { metricsRecorder } from "./middleware/metrics";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  config: Config;
  disableClientRoutes: boolean;
  i18n: I18n;
  mailerQueue: MailerQueue;
  metrics?: Metrics;
  mongo: Db;
  parent: Express;
  persistedQueryCache: PersistedQueryCache;
  persistedQueriesRequired: boolean;
  pubsub: RedisPubSub;
  redis: AugmentedRedis;
  schema: GraphQLSchema;
  scraperQueue: ScraperQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

/**
 * createApp will create a Coral Express app that can be used to handle requests.
 */
export async function createApp(options: AppOptions): Promise<Express> {
  // Configure the application.
  configureApplication(options);

  // Pull the parent out of the options.
  const { parent } = options;

  // Logging
  parent.use(accessLogger);

  if (options.metrics) {
    // Capturing metrics.
    parent.use(metricsRecorder(options.metrics));
  }

  // Create some services for the router.
  const passport = createPassport(options);

  // Mount the router.
  parent.use(
    "/",
    createRouter(options, {
      passport,
      disableClientRoutes: options.disableClientRoutes,
    })
  );

  // Enable CORS headers for media assets, font's require them.
  parent.use("/assets/media", cors());

  // Static Files
  parent.use("/assets", cacheHeadersMiddleware("1w"), serveStatic);

  // Error Handling
  parent.use(notFoundMiddleware);
  parent.use(errorLogger);
  parent.use(HTMLErrorHandler(options.i18n));

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

  // Trust the proxy in front of us, this will enable us to trust the fact that
  // SSL was terminated correctly.
  const trust = options.config.get("trust_proxy");
  if (trust) {
    parent.set("trust proxy", trust);
  }

  // Setup the view config.
  setupViews(options);
}

function setupViews(options: AppOptions) {
  const { parent } = options;

  // Configure the default views directory.
  const views = path.join(__dirname, "views");
  parent.set("views", views);

  // Reconfigure nunjucks.
  (cons.requires as any).nunjucks = nunjucks.configure(views, {
    // In development, we should enable file watch mode, and prevent file
    // caching.
    watch: options.config.get("env") === "development",
    noCache: options.config.get("env") === "development",
  });

  // assign the nunjucks engine to .njk and .html files.
  parent.engine("html", cons.nunjucks);

  // set .html as the default extension.
  parent.set("view engine", "html");
}

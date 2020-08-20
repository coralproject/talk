import cons from "consolidate";
import cors from "cors";
import express, { Express } from "express";
import enforceHTTPSMiddleware from "express-enforces-ssl";
import { GraphQLSchema } from "graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { hsts, noSniff, referrerPolicy, xssFilter } from "helmet";
import http from "http";
import { Db } from "mongodb";
import nunjucks from "nunjucks";
import path from "path";
import { register } from "prom-client";

import {
  cacheHeadersMiddleware,
  noCacheMiddleware,
} from "coral-server/app/middleware/cacheHeaders";
import {
  HTMLErrorHandler,
  JSONErrorHandler,
} from "coral-server/app/middleware/error";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { createPassport } from "coral-server/app/middleware/passport";
import { Config } from "coral-server/config";
import CoralEventListenerBroker from "coral-server/events/publisher";
import logger from "coral-server/logger";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";
import { ScraperQueue } from "coral-server/queue/tasks/scraper";
import { WebhookQueue } from "coral-server/queue/tasks/webhook";
import { ErrorReporter } from "coral-server/services/errors";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { Metrics } from "coral-server/services/metrics";
import { MigrationManager } from "coral-server/services/migrate";
import { PersistedQueryCache } from "coral-server/services/queries";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import { healthHandler, versionHandler } from "./handlers";
import { compileTrust } from "./helpers";
import { basicAuth } from "./middleware/basicAuth";
import { accessLogger } from "./middleware/logging";
import { metricsRecorder } from "./middleware/metrics";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  broker: CoralEventListenerBroker;
  config: Config;
  disableClientRoutes: boolean;
  i18n: I18n;
  mailerQueue: MailerQueue;
  metrics: Metrics;
  migrationManager: MigrationManager;
  mongo: Db;
  notifierQueue: NotifierQueue;
  parent: Express;
  persistedQueriesRequired: boolean;
  persistedQueryCache: PersistedQueryCache;
  pubsub: RedisPubSub;
  redis: AugmentedRedis;
  rejectorQueue: RejectorQueue;
  reporter?: ErrorReporter;
  schema: GraphQLSchema;
  scraperQueue: ScraperQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
  webhookQueue: WebhookQueue;
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

  // Capturing metrics.
  parent.use(metricsRecorder(options.metrics));

  // Configure the health check endpoint.
  parent.get("/api/health", healthHandler);

  // Configure the version route.
  parent.get("/api/version", versionHandler);

  // Configure the SSL requirement after the health check endpoint.
  configureApplicationHTTPS(options);

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
  parent.use(HTMLErrorHandler(options));

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
  new Promise((resolve) => {
    // Listen on the designated port.
    const httpServer = app.listen(port, () => resolve(httpServer));
  });

function configureApplication(options: AppOptions) {
  const { parent } = options;

  // Trust the proxy in front of us, this will enable us to trust the fact that
  // SSL was terminated correctly.
  const trust = options.config.get("trust_proxy");
  if (trust) {
    parent.set("trust proxy", compileTrust(trust));
  }

  // Configure security middleware and options.
  parent.disable("x-powered-by");
  parent.use(noSniff());
  parent.use(referrerPolicy({ policy: "same-origin" }));
  parent.use(xssFilter());

  // Setup the view config.
  configureApplicationViews(options);
}

function configureApplicationHTTPS(options: AppOptions) {
  const { parent, config } = options;

  const log = logger.child(
    { env: config.get("env"), forceSSL: config.get("force_ssl") },
    true
  );

  // If we're in production mode, configure some production security settings.
  if (config.get("env") === "production") {
    if (config.get("force_ssl")) {
      // Coral in production requires SSL, so we'll send the HSTS headers here as
      // well as force the use of HTTPS with a 301 redirect.
      parent.use(
        hsts({
          // We don't want to break existing other services that don't run with
          // SSL.
          includeSubDomains: false,
        })
      );
      parent.use(enforceHTTPSMiddleware());
    } else {
      log.warn(
        "FORCE_SSL=true should be set when a SSL terminating proxy has been configured"
      );
    }
  }
}

function configureApplicationViews(options: AppOptions) {
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
    // Trim whitespace in templates.
    trimBlocks: true,
    lstripBlocks: true,
  });

  // assign the nunjucks engine to .njk and .html files.
  parent.engine("html", cons.nunjucks);

  // set .html as the default extension.
  parent.set("view engine", "html");
}

export default function createMetricsServer(config: Config) {
  const server = express();

  // Setup access logger.
  server.use(accessLogger);
  server.use(noCacheMiddleware);

  // Add basic auth if provided.
  const username = config.get("metrics_username");
  const password = config.get("metrics_password");
  if (username && password) {
    server.use(basicAuth(username, password));
    logger.info("adding authentication to metrics endpoint");
  } else {
    logger.info(
      "not adding authentication to metrics endpoint, credentials not provided"
    );
  }

  // Use the memory register to handle serving metrics.
  server.get("/metrics", (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(register.metrics());
  });

  // Error handling.
  server.use(notFoundMiddleware);
  server.use(JSONErrorHandler());

  return server;
}

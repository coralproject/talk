import cons from "consolidate";
import cors from "cors";
import express, { Express } from "express";
import enforceHTTPSMiddleware from "express-enforces-ssl";
import { hsts, noSniff, referrerPolicy, xssFilter } from "helmet";
import nunjucks from "nunjucks";
import path from "path";
import { register } from "prom-client";
import { container } from "tsyringe";

import {
  cacheHeadersMiddleware,
  noCacheMiddleware,
} from "coral-server/app/middleware/cacheHeaders";
import {
  HTMLErrorHandler,
  JSONErrorHandler,
} from "coral-server/app/middleware/error";
import { notFoundMiddleware } from "coral-server/app/middleware/notFound";
import { CONFIG, Config } from "coral-server/config";
import logger from "coral-server/logger";
import { ErrorReporter } from "coral-server/services/errors";

import { healthHandler, versionHandler } from "./handlers";
import { compileTrust } from "./helpers";
import { basicAuth } from "./middleware/basicAuth";
import { accessLogger } from "./middleware/logging";
import { metricsRecorder } from "./middleware/metrics";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  // QUESTION: What's the best way to provide computed properties from other services?
  persistedQueriesRequired: boolean;

  // QUESTION: What's the best way to handle an optionally provided service?
  reporter?: ErrorReporter;
}

/**
 * createApp will create a Coral Express app that can be used to handle requests.
 */
export function createApp(options: AppOptions): Express {
  const config = container.resolve<Config>(CONFIG);
  const app = createBaseApplication(config);

  // Setup the view config.
  configureApplicationViews(config, app);

  // Capturing metrics.
  app.use(metricsRecorder());

  // Configure the health check endpoint.
  app.get("/api/health", healthHandler);

  // Configure the version route.
  app.get("/api/version", versionHandler);

  // Configure the SSL requirement after the health check endpoint.
  configureApplicationHTTPS(config, app);

  // Mount the router.
  app.use("/", createRouter(options));

  // Enable CORS headers for media assets, font's require them.
  app.use("/assets/media", cors());

  // Static Files
  app.use(
    "/assets",
    cacheHeadersMiddleware({ cacheDuration: "1w" }),
    serveStatic
  );

  // Error Handling
  app.use(notFoundMiddleware);
  app.use(HTMLErrorHandler(options));

  return app;
}

function createBaseApplication(config: Config) {
  // Create the express.Express app.
  const app = express();

  // Trust the proxy in front of us, this will enable us to trust the fact that
  // SSL was terminated correctly.
  const trust = config.get("trust_proxy");
  if (trust) {
    app.set("trust proxy", compileTrust(trust));
  }

  // Configure security middleware and options.
  app.disable("x-powered-by");
  app.use(noSniff());
  app.use(referrerPolicy({ policy: "same-origin" }));
  app.use(xssFilter());

  app.use(accessLogger);

  return app;
}

function configureApplicationHTTPS(config: Config, app: Express) {
  const log = logger.child(
    { env: config.get("env"), forceSSL: config.get("force_ssl") },
    true
  );

  // If we're in production mode, configure some production security settings.
  if (config.get("env") === "production") {
    if (config.get("force_ssl")) {
      // Coral in production requires SSL, so we'll send the HSTS headers here as
      // well as force the use of HTTPS with a 301 redirect.
      app.use(
        hsts({
          // We don't want to break existing other services that don't run with
          // SSL.
          includeSubDomains: false,
        })
      );
      app.use(enforceHTTPSMiddleware());
    } else {
      log.warn(
        "FORCE_SSL=true should be set when a SSL terminating proxy has been configured"
      );
    }
  }
}

function configureApplicationViews(config: Config, app: Express) {
  // Configure the default views directory.
  const views = path.join(__dirname, "views");
  app.set("views", views);

  // Reconfigure nunjucks.
  (cons.requires as any).nunjucks = nunjucks.configure(views, {
    // In development, we should enable file watch mode, and prevent file
    // caching.
    watch: config.get("env") === "development",
    noCache: config.get("env") === "development",
    // Trim whitespace in templates.
    trimBlocks: true,
    lstripBlocks: true,
  });

  // assign the nunjucks engine to .njk and .html files.
  app.engine("html", cons.nunjucks);

  // set .html as the default extension.
  app.set("view engine", "html");
}

export default function createMetricsApp() {
  const config = container.resolve<Config>(CONFIG);
  const app = createBaseApplication(config);

  // Setup access logger.
  app.use(accessLogger);
  app.use(noCacheMiddleware);

  // Add basic auth if provided.
  const username = config.get("metrics_username");
  const password = config.get("metrics_password");
  if (username && password) {
    app.use(basicAuth(username, password));
    logger.info("adding authentication to metrics endpoint");
  } else {
    logger.info(
      "not adding authentication to metrics endpoint, credentials not provided"
    );
  }

  // Use the memory register to handle serving metrics.
  app.get("/metrics", (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(register.metrics());
  });

  // Error handling.
  app.use(notFoundMiddleware);
  app.use(JSONErrorHandler());

  return app;
}

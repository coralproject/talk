import cons from "consolidate";
import cors from "cors";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import http from "http";
import { Db } from "mongodb";
import nunjucks from "nunjucks";
import path from "path";

import { cacheHeadersMiddleware } from "talk-server/app/middleware/cacheHeaders";
import { HTMLErrorHandler } from "talk-server/app/middleware/error";
import { notFoundMiddleware } from "talk-server/app/middleware/notFound";
import { createPassport } from "talk-server/app/middleware/passport";
import { Config } from "talk-server/config";
import { IndexerQueue } from "talk-server/queue/tasks/indexer";
import { MailerQueue } from "talk-server/queue/tasks/mailer";
import { ScraperQueue } from "talk-server/queue/tasks/scraper";
import { Elasticsearch } from "talk-server/services/elasticsearch";
import { I18n } from "talk-server/services/i18n";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { AugmentedRedis } from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";

import { accessLogger, errorLogger } from "./middleware/logging";
import serveStatic from "./middleware/serveStatic";
import { createRouter } from "./router";

export interface AppOptions {
  config: Config;
  elasticsearch: Elasticsearch;
  i18n: I18n;
  mailerQueue: MailerQueue;
  scraperQueue: ScraperQueue;
  indexerQueue: IndexerQueue;
  mongo: Db;
  parent: Express;
  redis: AugmentedRedis;
  schema: GraphQLSchema;
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
  parent.use("/", createRouter(options, { passport }));

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

  // Trust the first proxy in front of us, this will enable us to trust the fact
  // that SSL was terminated correctly.
  parent.set("trust proxy", 1);

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

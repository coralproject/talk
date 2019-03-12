import express, { Express } from "express";
import { GraphQLSchema } from "graphql";
import http from "http";
import { Db } from "mongodb";

import { LanguageCode } from "talk-common/helpers/i18n/locales";
import { createApp, listenAndServe } from "talk-server/app";
import config, { Config } from "talk-server/config";
import getTenantSchema from "talk-server/graph/tenant/schema";
import logger from "talk-server/logger";
import { createQueue, TaskQueue } from "talk-server/queue";
import { I18n } from "talk-server/services/i18n";
import { createJWTSigningConfig } from "talk-server/services/jwt";
import { createMongoDB } from "talk-server/services/mongodb";
import { ensureIndexes } from "talk-server/services/mongodb/indexes";
import {
  AugmentedRedis,
  createAugmentedRedisClient,
  createRedisClient,
} from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";

export interface ServerOptions {
  /**
   * config when specified will specify the configuration to load.
   */
  config?: Config;
}

/**
 * Server provides an interface to create, start, and manage a Talk Server.
 */
class Server {
  // parentApp is the root application that the server will bind to.
  private parentApp: Express;

  // schema is the GraphQL Schema that relates to the given Tenant.
  private schema: GraphQLSchema;

  // config exposes application specific configuration.
  public config: Config;

  // httpServer is the running instance of the HTTP server that will bind to
  // the requested port.
  public httpServer: http.Server;

  // tasks stores a reference to the queues that can process operations.
  private tasks: TaskQueue;

  // redis stores the redis connection used by the application.
  private redis: AugmentedRedis;

  // mongo stores the mongo connection used by the application.
  private mongo: Db;

  // tenantCache stores the tenant cache used by the application.
  private tenantCache: TenantCache;

  // connected when true, indicates that `connect()` was already called.
  private connected: boolean = false;

  // processing when true, indicates that `process()` was already called.
  private processing: boolean = false;

  constructor(options: ServerOptions) {
    this.parentApp = express();

    // Load the configuration.
    this.config = config
      .load(options.config || {})
      .validate({ allowed: "strict" });
    logger.debug({ config: this.config.toString() }, "loaded configuration");

    // Load the graph schemas.
    this.schema = getTenantSchema();
  }

  /**
   * connect will connect to all the databases and start priming data needed for
   * runtime.
   */
  public async connect() {
    // Guard against double connecting.
    if (this.connected) {
      throw new Error("server has already connected");
    }
    this.connected = true;

    // Setup MongoDB.
    this.mongo = await createMongoDB(config);

    // Setup Redis.
    this.redis = await createAugmentedRedisClient(config);

    // Create the TenantCache.
    this.tenantCache = new TenantCache(
      this.mongo,
      createRedisClient(this.config),
      config
    );

    // Prime the tenant cache so it'll be ready to serve now.
    await this.tenantCache.primeAll();

    // Create the Job Queue.
    this.tasks = await createQueue({
      config: this.config,
      mongo: this.mongo,
      tenantCache: this.tenantCache,
    });
  }

  /**
   * process will start the job processors and ancillary operations.
   */
  public async process() {
    // Guard against double connecting.
    if (this.processing) {
      throw new Error("server has already processing");
    }
    this.processing = true;

    // Create the database indexes if it isn't disabled.
    if (!this.config.get("disable_mongodb_autoindexing")) {
      // Setup the database indexes.
      await ensureIndexes(this.mongo);
    }

    // Launch all of the job processors.
    this.tasks.mailer.process();
    this.tasks.scraper.process();
  }

  /**
   * start orchestrates the application by starting it and returning a promise
   * when the server has started.
   *
   * @param parent the optional express application to bind the server to.
   */
  public async start(parent?: Express) {
    // Guard against not being connected.
    if (!this.connected) {
      throw new Error("server has not connected yet");
    }

    const port = this.config.get("port");

    // Ensure we have an app to bind to.
    parent = parent ? parent : this.parentApp;

    // Create the signing config.
    const signingConfig = createJWTSigningConfig(this.config);

    // Get the default locale. This is asserted here because the LanguageCode
    // is verified via Convict, but not typed, so this resolves that.
    const defaultLocale = this.config.get("default_locale") as LanguageCode;

    // Create and load the translations.
    const i18n = new I18n(defaultLocale);
    await i18n.load();

    // Create the Talk App, branching off from the parent app.
    const app: Express = await createApp({
      parent,
      mongo: this.mongo,
      redis: this.redis,
      signingConfig,
      tenantCache: this.tenantCache,
      config: this.config,
      schema: this.schema,
      i18n,
      mailerQueue: this.tasks.mailer,
      scraperQueue: this.tasks.scraper,
    });

    // Start the application and store the resulting http.Server. The server
    // will return when the server starts listening. The NodeJS application will
    // not exit until all tasks are handled, which for an open socket, is never.
    this.httpServer = await listenAndServe(app, port);

    // TODO: (wyattjoh) add the subscription handler here

    logger.info({ port }, "now listening");
  }
}

export default Server;

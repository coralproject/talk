import express, { Express } from "express";
import { GraphQLSchema } from "graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";
import http from "http";
import { Db } from "mongodb";
import { collectDefaultMetrics } from "prom-client";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import createMetricsServer, {
  AppOptions,
  createApp,
  listenAndServe,
} from "coral-server/app";
import config, { Config } from "coral-server/config";
import startScheduledTasks, { ScheduledJobGroups } from "coral-server/cron";
import getTenantSchema from "coral-server/graph/schema";
import { createPubSubClient } from "coral-server/graph/subscriptions/pubsub";
import { createSubscriptionServer } from "coral-server/graph/subscriptions/server";
import logger from "coral-server/logger";
import { createQueue, TaskQueue } from "coral-server/queue";
import { I18n } from "coral-server/services/i18n";
import {
  createJWTSigningConfig,
  JWTSigningConfig,
} from "coral-server/services/jwt";
import { createMetrics } from "coral-server/services/metrics";
import { MigrationManager } from "coral-server/services/migrate";
import { createMongoDB } from "coral-server/services/mongodb";
import { PersistedQueryCache } from "coral-server/services/queries";
import {
  AugmentedRedis,
  createAugmentedRedisClient,
  createRedisClient,
} from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  AnalyticsCoralEventListener,
  NotifierCoralEventListener,
  PerspectiveCoralEventListener,
  SlackCoralEventListener,
  SubscriptionCoralEventListener,
  WebhookCoralEventListener,
} from "./events/listeners";
import CoralEventListenerBroker from "./events/publisher";
import { ErrorReporter, SentryErrorReporter } from "./services/errors";
import { isInstalled } from "./services/tenant";

export interface ServerOptions {
  /**
   * config when specified will specify the configuration to load.
   */
  config?: Config;
}

export interface ServerStartOptions {
  parent?: Express;
}

/**
 * Server provides an interface to create, start, and manage a Coral Server.
 */
class Server {
  // parentApp is the root application that the server will bind to.
  private parentApp: Express;

  // schema is the GraphQL Schema that relates to the given Tenant.
  private readonly schema: GraphQLSchema;

  // config exposes application specific configuration.
  public readonly config: Config;

  // httpServer is the running instance of the HTTP server that will bind to
  // the requested port.
  public httpServer: http.Server;

  // subscriptionServer is the running instance of the HTTP server that will
  // bind to the requested port to serve websocket traffic.
  public subscriptionServer: SubscriptionServer;

  // scheduledTasks are tasks managed by cron.
  public scheduledTasks: ScheduledJobGroups;

  // tasks stores a reference to the queues that can process operations.
  private tasks: TaskQueue;

  // redis stores the redis connection used by the application.
  private redis: AugmentedRedis;

  // pubsub stores the pubsub engine used by the application.
  private pubsub: RedisPubSub;

  // mongo stores the mongo connection used by the application.
  private mongo: Db;

  // tenantCache stores the tenant cache used by the application.
  private tenantCache: TenantCache;

  // connected when true, indicates that `connect()` was already called.
  private connected = false;

  // processing when true, indicates that `process()` was already called.
  private processing = false;

  // i18n is the server reference to the i18n framework.
  private readonly i18n: I18n;

  // signingConfig is the server reference to the signing configuration.
  private readonly signingConfig: JWTSigningConfig;

  // persistedQueryCache is the cache of persisted queries used by the GraphQL
  // server to handle persisted queries.
  private persistedQueryCache: PersistedQueryCache;

  // migrationManager is the manager for performing migrations on Coral.
  private migrationManager: MigrationManager;

  private readonly reporter?: ErrorReporter;

  /**
   * broker stores a reference to all of the listeners that can be used in
   * conjunction with an event to publish activity occurring inside Coral.
   */
  private broker: CoralEventListenerBroker;

  constructor(options: ServerOptions) {
    this.parentApp = express();

    // Load the configuration.
    this.config = config
      .load(options.config || {})
      .validate({ allowed: "strict" });
    logger.debug({ config: this.config.toString() }, "loaded configuration");

    // Do some extra validation for production.
    if (this.config.get("env") === "production") {
      // Ensure that the signing secret has been specified.
      if (
        this.config.get("signing_secret") ===
        this.config.default("signing_secret")
      ) {
        throw new Error(
          "SIGNING_SECRET is required in production environments"
        );
      }
    }

    // Configure the error reporter.
    if (this.config.get("sentry_backend_key")) {
      this.reporter = new SentryErrorReporter(
        this.config.get("sentry_backend_key")
      );
    }

    // Load the graph schemas.
    this.schema = getTenantSchema();

    // Get the default locale. This is asserted here because the LanguageCode
    // is verified via Convict, but not typed, so this resolves that.
    const defaultLocale = this.config.get("default_locale") as LanguageCode;

    // Setup the translation framework.
    this.i18n = new I18n(defaultLocale);

    // Create the signing config.
    this.signingConfig = createJWTSigningConfig(
      this.config.get("signing_secret"),
      this.config.get("signing_algorithm")
    );
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

    // Load the translations.
    await this.i18n.load();

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

    // Create the migration manager.
    this.migrationManager = new MigrationManager({
      tenantCache: this.tenantCache,
      i18n: this.i18n,
    });

    // Load and upsert the persisted queries.
    this.persistedQueryCache = new PersistedQueryCache({ mongo: this.mongo });

    // Prime the tenant cache so it'll be ready to serve now.
    await this.tenantCache.primeAll();

    // Create the Job Queue.
    this.tasks = createQueue({
      config: this.config,
      mongo: this.mongo,
      redis: this.redis,
      tenantCache: this.tenantCache,
      i18n: this.i18n,
      signingConfig: this.signingConfig,
    });

    // Create the pubsub client.
    this.pubsub = createPubSubClient(
      createRedisClient(this.config),
      createRedisClient(this.config)
    );

    // Setup the broker.
    this.broker = new CoralEventListenerBroker();
    this.broker.register(new AnalyticsCoralEventListener(this.config));
    this.broker.register(new NotifierCoralEventListener(this.tasks.notifier));
    this.broker.register(new SlackCoralEventListener());
    this.broker.register(new SubscriptionCoralEventListener());
    this.broker.register(new WebhookCoralEventListener(this.tasks.webhook));
    this.broker.register(new PerspectiveCoralEventListener());

    // Setup the metrics collectors.
    collectDefaultMetrics();
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

    // Run migrations if there is already a Tenant installed.
    if (await isInstalled(this.tenantCache)) {
      await this.migrationManager.executePendingMigrations(
        this.mongo,
        this.redis
      );
      await this.tenantCache.primeAll();
    } else {
      logger.info("no tenants are installed, skipping running migrations");
    }

    // Prime the queries in the database.
    await this.persistedQueryCache.prime();

    // Launch all of the job processors.
    if (!this.config.get("disable_job_processors")) {
      logger.info("job processing is enabled, starting job processors");

      this.tasks.mailer.process();
      this.tasks.scraper.process();
      this.tasks.notifier.process();
      this.tasks.webhook.process();
      this.tasks.rejector.process();
    } else {
      logger.info("job processing is disabled, not starting job processors");
    }

    // Start up the cron job processors.
    this.scheduledTasks = startScheduledTasks({
      mongo: this.mongo,
      config: this.config,
      mailerQueue: this.tasks.mailer,
      tenantCache: this.tenantCache,
      signingConfig: this.signingConfig,
    });

    // Configure the metrics server and start it.
    const port = this.config.get("metrics_port");
    await listenAndServe(createMetricsServer(this.config), port);
    logger.info({ port, path: "/metrics" }, "now listening for metrics");
  }

  /**
   * start orchestrates the application by starting it and returning a promise
   * when the server has started.
   *
   * @param parent the optional express application to bind the server to.
   */
  public async start({ parent }: ServerStartOptions) {
    // Guard against not being connected.
    if (!this.connected) {
      throw new Error("server has not connected yet");
    }

    const port = this.config.get("port");

    // Ensure we have an app to bind to.
    parent = parent ? parent : this.parentApp;

    // Disables the client routes to serve bundles etc. Useful for developing with
    // Webpack Dev Server.
    const disableClientRoutes = this.config.get("disable_client_routes");

    const options: AppOptions = {
      broker: this.broker,
      config: this.config,
      disableClientRoutes,
      i18n: this.i18n,
      mailerQueue: this.tasks.mailer,
      metrics: createMetrics(),
      migrationManager: this.migrationManager,
      mongo: this.mongo,
      notifierQueue: this.tasks.notifier,
      parent,
      persistedQueriesRequired:
        this.config.get("env") === "production" &&
        !this.config.get("enable_graphiql"),
      persistedQueryCache: this.persistedQueryCache,
      pubsub: this.pubsub,
      redis: this.redis,
      rejectorQueue: this.tasks.rejector,
      reporter: this.reporter,
      schema: this.schema,
      scraperQueue: this.tasks.scraper,
      signingConfig: this.signingConfig,
      tenantCache: this.tenantCache,
      webhookQueue: this.tasks.webhook,
    };

    // Create the Coral App, branching off from the parent app.
    const app: Express = await createApp(options);

    // Start the application and store the resulting http.Server. The server
    // will return when the server starts listening. The NodeJS application will
    // not exit until all tasks are handled, which for an open socket, is never.
    this.httpServer = await listenAndServe(app, port);

    // Setup subscriptions and attach it to the httpServer.
    this.subscriptionServer = createSubscriptionServer(
      this.httpServer,
      this.schema,
      options
    );

    logger.info({ port }, "now listening");
  }
}

export default Server;

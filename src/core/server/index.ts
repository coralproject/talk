import { Express } from "express";
import http from "http";
import { collectDefaultMetrics } from "prom-client";
import { inject, singleton } from "tsyringe";

import createMetricsApp, { AppOptions, createApp } from "./app";
import { CONFIG, Config } from "./config";
import { SubscriptionServer } from "./graph/subscriptions/server";
import logger from "./logger";
import { TaskQueueService } from "./queue";
import { ScheduledJobsService } from "./scheduled";
import { ErrorReporter, SentryErrorReporter } from "./services/errors";
import { I18nService } from "./services/i18n";
import { MigrationManager } from "./services/migrate";
import { PersistedQueryCache } from "./services/queries";
import { isInstalled } from "./services/tenant";
import { TenantCache } from "./services/tenant/cache";

export interface ServerStartOptions {
  parent?: Express;
}

/**
 * Server provides an interface to create, start, and manage a Coral Server.
 */
@singleton()
class Server {
  constructor(
    @inject(CONFIG) private readonly config: Config,
    private readonly i18n: I18nService,
    private readonly tenantCache: TenantCache,
    private readonly migrationManager: MigrationManager,
    private readonly persistedQueryCache: PersistedQueryCache,
    private readonly tasks: TaskQueueService,
    private readonly scheduledJobs: ScheduledJobsService
  ) {}

  /**
   * connect will connect to all the databases and start priming data needed for
   * runtime.
   */
  public async connect() {
    // Load the translations.
    await this.i18n.load();

    // Connect the tenant cache.
    await this.tenantCache.connect();

    // Prime the TenantCache so it's good to go!
    await this.tenantCache.primeAll();

    // Prime the queries in the database.
    await this.persistedQueryCache.prime();

    // Setup the metrics collectors.
    collectDefaultMetrics();
  }

  /**
   * process will start the job processors and ancillary operations.
   */
  public async process() {
    // Run migrations if there is already a Tenant installed.
    if (await isInstalled(this.tenantCache)) {
      await this.migrationManager.executePendingMigrations();
      await this.tenantCache.primeAll();
    } else {
      logger.info("no tenants are installed, skipping running migrations");
    }

    // Launch all of the job processors.
    if (!this.config.get("disable_job_processors")) {
      logger.info("job processing is enabled, starting job processors");

      this.tasks.process();
      this.scheduledJobs.start();
    } else {
      logger.info("job processing is disabled, not starting job processors");
    }

    // Configure the metrics server and start it.
    const port = this.config.get("metrics_port");
    createMetricsApp().listen(port, () => {
      logger.info({ port, path: "/metrics" }, "now listening for metrics");
    });
  }

  /**
   * start orchestrates the application by starting it and returning a promise
   * when the server has started.
   *
   * @param parent the optional express application to bind the server to.
   */
  public async start() {
    // Disables the client routes to serve bundles etc. Useful for developing with
    // Webpack Dev Server.
    const persistedQueriesRequired =
      this.config.get("env") === "production" &&
      !this.config.get("enable_graphiql");

    // Configure the error reporter if it's available.
    let reporter: ErrorReporter | undefined;
    if (
      this.config.get("env") === "production" &&
      this.config.get("sentry_backend_key")
    ) {
      reporter = new SentryErrorReporter(this.config.get("sentry_backend_key"));
    }

    const options: AppOptions = {
      persistedQueriesRequired,
      reporter,
    };

    // Create the Express Application and Subscription Server.
    const app = createApp(options);
    const subscriptions = new SubscriptionServer(options);

    // Create a new HTTP server for the application we just created.
    const server = http.createServer(app);

    // Attach the subscriptions server to the http.Server we just created
    subscriptions.attach(server);

    // Start listening for requests now!
    const port = this.config.get("port");
    server.listen(port, () => {
      logger.info({ port }, "now listening");
    });
  }
}

export default Server;

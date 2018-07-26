import express, { Express } from "express";
import http from "http";

import { createJWTSigningConfig } from "talk-server/app/middleware/passport/jwt";
import getManagementSchema from "talk-server/graph/management/schema";
import { Schemas } from "talk-server/graph/schemas";
import getTenantSchema from "talk-server/graph/tenant/schema";
import { createQueue } from "talk-server/services/queue";
import TenantCache from "talk-server/services/tenant/cache";

import { attachSubscriptionHandlers, createApp, listenAndServe } from "./app";
import config, { Config } from "./config";
import logger from "./logger";
import { createMongoDB } from "./services/mongodb";
import { createRedisClient } from "./services/redis";

export interface ServerOptions {
  config?: Config;
}

/**
 * Server provides an interface to create, start, and manage a Talk Server.
 */
class Server {
  // parentApp is the root application that the server will bind to.
  private parentApp: Express;

  // schemas are the set of GraphQLSchema objects for each schema used by the
  // server.
  private schemas: Schemas;

  // config exposes application specific configuration.
  public config: Config;

  // httpServer is the running instance of the HTTP server that will bind to
  // the requested port.
  public httpServer: http.Server;

  constructor(options: ServerOptions) {
    this.parentApp = express();
    this.config = config
      .load(options.config || {})
      .validate({ allowed: "strict" });

    // Load the graph schemas.
    this.schemas = {
      management: getManagementSchema(),
      tenant: getTenantSchema(),
    };
  }

  /**
   * start orchestrates the application by starting it and returning a promise
   * when the server has started.
   *
   * @param parent the optional express application to bind the server to.
   */
  public async start(parent?: Express) {
    const port = this.config.get("port");

    // Ensure we have an app to bind to.
    parent = parent ? parent : this.parentApp;

    // Setup MongoDB.
    const mongo = await createMongoDB(config);

    // Setup Redis.
    const redis = createRedisClient(config);

    // Create the signing config.
    const signingConfig = createJWTSigningConfig(this.config);

    // Create the TenantCache.
    const tenantCache = new TenantCache(mongo, createRedisClient(config));

    // Prime the tenant cache so it'll be ready to serve now.
    await tenantCache.primeAll();

    // Create the Job Queue.
    const queue = createQueue({ config, mongo });

    // Create the Talk App, branching off from the parent app.
    const app: Express = await createApp({
      parent,
      queue,
      mongo,
      redis,
      config: this.config,
      schemas: this.schemas,
      signingConfig,
      tenantCache,
    });

    // Start the application and store the resulting http.Server.
    this.httpServer = await listenAndServe(app, port);

    // Setup the websocket servers on the new http.Server.
    attachSubscriptionHandlers(this.schemas, this.httpServer);

    logger.info({ port }, "now listening");
  }
}

export default Server;

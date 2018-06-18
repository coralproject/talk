import config, { Config } from './config';
import express, { Express } from 'express';
import http from 'http';
import { createApp, startApp } from './app';
import logger from './logger';
import { create as createMongoDB } from './services/mongodb';
import { create as createRedis } from 'talk-server/services/redis';

export interface ServerOptions {
    config?: Config;
}

/**
 * Server provides an interface to create, start, and manage a Talk Server.
 */
class Server {
    // parentApp is the root application that the server will bind to.
    private parentApp: Express;

    // config exposes application specific configuration.
    public config: Config;

    // httpServer is the running instance of the HTTP server that will bind to
    // the requested port.
    public httpServer: http.Server;

    constructor(options: ServerOptions) {
        this.parentApp = express();
        this.config = config
            .load(options.config || {})
            .validate({ allowed: 'strict' });
    }

    /**
     * start orchestrates the application by starting it and returning a promise
     * when the server has started.
     *
     * @param parent the optional express application to bind the server to.
     */
    public async start(parent?: Express) {
        const port = this.config.get('port');

        // Ensure we have an app to bind to.
        parent = parent ? parent : this.parentApp;

        // Setup MongoDB.
        const mongo = await createMongoDB(config);

        // Setup Redis.
        const redis = await createRedis(config);

        // Create the Talk App, branching off from the parent app.
        const app = await createApp(parent, {
            mongo,
            redis,
            config: this.config,
        });

        // Start the application.
        this.httpServer = await startApp(port, app);

        logger.info({ port }, 'now listening');
    }
}

export default Server;

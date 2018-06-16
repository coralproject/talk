import config, { Config } from './config';
import express, { Express } from 'express';
import http from 'http';
import { createApp } from './app';
import logger from './logger';

export interface ServerOptions {}

/**
 * Server provides an interface to create, start, and manage a Talk Server.
 */
class Server {
    // app is the root application that the server will bind to.
    private app: Express;

    // config exposes application specific configuration.
    public config: Config;

    // httpServer is the running instance of the HTTP server that will bind to the
    // requested port.
    public httpServer: http.Server;

    constructor(options: ServerOptions) {
        this.app = express();
        this.config = config.validate({ allowed: 'strict' });
    }

    /**
     * start orchestrates the application by starting it and returning a promise
     * when the server has started.
     *
     * @param parent the optional express application to bind the server to.
     */
    start = (parent?: Express): Promise<Server> =>
        new Promise(async resolve => {
            const port = this.config.get('port');

            // Ensure we have an app to bind to.
            parent = parent ? parent : this.app;

            // Create the Talk App, branching off from the parent app.
            const app: Express = await createApp(parent, this.config);

            logger.info({ port }, 'now listening');

            // Listen on the designated port.
            this.httpServer = app.listen(port, () => resolve(this));
        });
}

export default Server;

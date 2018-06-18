import express, { Express, Router } from 'express';
import { Db } from 'mongodb';
import http from 'http';

import { Config } from 'talk-server/config';
import { create } from 'talk-server/services/mongodb';
import tenantGraphMiddleware from 'talk-server/graph/tenant/middleware';
import managementGraphMiddleware from 'talk-server/graph/management/middleware';

import serveStatic from './middleware/serveStatic';
import playground from './middleware/playground';
import {
    access as accessLogger,
    error as errorLogger,
} from './middleware/logging';
import { Redis } from 'ioredis';

export interface AppOptions {
    config: Config;
    mongo: Db;
    redis: Redis;
}

async function createManagementRouter(opts: AppOptions): Promise<Router> {
    const router = express.Router();

    if (opts.config.get('env') === 'development') {
        // GraphiQL
        router.get(
            '/graphiql',
            playground({
                endpoint: '/api/management/graphql',
            })
        );
    }

    // Management API
    router.use(
        '/graphql',
        express.json(),
        managementGraphMiddleware(opts.mongo)
    );

    return router;
}

async function createTenantRouter(opts: AppOptions): Promise<Router> {
    const router = express.Router();

    if (opts.config.get('env') === 'development') {
        // GraphiQL
        router.get(
            '/graphiql',
            playground({
                endpoint: '/api/tenant/graphql',
            })
        );
    }

    // Tenant API
    router.use('/graphql', express.json(), tenantGraphMiddleware(opts.mongo));

    return router;
}

async function createAPIRouter(opts: AppOptions): Promise<Router> {
    // Create a router.
    const router = express.Router();

    // Configure the tenant routes.
    router.use('/tenant', await createTenantRouter(opts));

    // Configure the management routes.
    router.use('/management', await createManagementRouter(opts));

    return router;
}

async function createRouter(opts: AppOptions): Promise<Router> {
    // Create a router.
    const router = express.Router();

    router.use('/api', await createAPIRouter(opts));

    return router;
}

/**
 * createApp will create a Talk Express app that can be used to handle requests.
 *
 * @param parent the root application to attach the Talk routes/middleware to.
 */
export async function createApp(
    parent: Express,
    options: AppOptions
): Promise<Express> {
    // Logging
    parent.use(accessLogger);

    // Static Files
    parent.use(serveStatic);

    // Mount the router.
    parent.use(await createRouter(options));

    // Error Handling
    parent.use(errorLogger);

    return parent;
}

/**
 * startApp will start the given express application.
 *
 * @param port the port to listen on
 * @param app the express application to start
 */
export const startApp = (port: number, app: Express): Promise<http.Server> =>
    new Promise(async resolve => {
        // Listen on the designated port.
        const httpServer = app.listen(port, () => resolve(httpServer));
    });

import express, { Express, Router } from 'express';
import { Db } from 'mongodb';

import { Config } from 'talk-server/config';
import schema from 'talk-server/graph/tenant/schema';
import { create } from 'talk-server/services/mongodb';

import serveStatic from './middleware/serveStatic';

import playground from './middleware/playground';
import {
    access as accessLogger,
    error as errorLogger,
} from './middleware/logging';
import tenantGraphMiddleware from 'talk-server/graph/tenant/middleware';

async function createTenantRouter(config: Config, db: Db): Promise<Router> {
    const router = express.Router({ mergeParams: true });

    if (config.get('env') === 'development') {
        // GraphiQL
        router.get(
            '/graphiql',
            playground(req => ({
                endpoint: `/api/tenant/${req.params.tenantID}/graphql`,
            }))
        );
    }

    // Tenant API
    router.use('/graphql', express.json(), tenantGraphMiddleware(db));

    return router;
}

async function createAPIRouter(config: Config, db: Db): Promise<Router> {
    // Create a router.
    const router = express.Router({ mergeParams: true });

    // Configure the tenant routes.
    router.use('/tenant/:tenantID', await createTenantRouter(config, db));

    return router;
}

async function createRouter(config: Config): Promise<Router> {
    // Setup MongoDB.
    const db = await create(config);

    // Create a router.
    const router = express.Router({ mergeParams: true });

    router.use('/api', await createAPIRouter(config, db));

    return router;
}

/**
 * createApp will create a Talk Express app that can be used to handle requests.
 *
 * @param parent the root application to attach the Talk routes/middleware to.
 */
export async function createApp(
    app: Express,
    config: Config
): Promise<Express> {
    // Logging
    app.use(accessLogger);

    // Static Files
    app.use(serveStatic);

    // Mount the router.
    app.use(await createRouter(config));

    // Error Handling
    app.use(errorLogger);

    return app;
}

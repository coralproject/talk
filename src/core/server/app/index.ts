import express, { Express } from 'express';
import { Config } from 'talk-server/config';

import serveStatic from './middleware/serveStatic';
import graphql from './middleware/graphql';
import graphiql from './middleware/graphiql';
import {
    access as accessLogger,
    error as errorLogger,
} from './middleware/logging';

import schema from 'talk-server/graph/schema';
import { create } from 'talk-server/services/mongodb';

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

    if (config.get('env') === 'development') {
        // GraphiQL
        app.get('/graphiql', graphiql());
    }

    // Setup MongoDB.
    const db = await create(config);

    // API
    app.use('/api/graphql', express.json(), graphql({ schema, db }));

    // Error Handling
    app.use(errorLogger);

    return app;
}

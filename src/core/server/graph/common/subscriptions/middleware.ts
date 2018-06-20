import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { GraphQLSchema, execute, subscribe } from 'graphql';

export interface SubscriptionMiddlewareOptions {
    schema: GraphQLSchema;
    path: string;
}

export function handleSubscriptions(
    server: http.Server,
    { schema, path }: SubscriptionMiddlewareOptions
): SubscriptionServer {
    // Configure some options for the subscription system.
    const options = {
        schema,
        execute,
        subscribe,
    };

    // Configure the socket options for the websocket server. It needs to handle
    // upgrade requests on that route.
    const socketOption = {
        server,
        path,
    };

    return new SubscriptionServer(options, socketOption);
}

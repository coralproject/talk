import { ApolloServer } from "apollo-server-express";

import { CLIENT_ID_HEADER } from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import GraphContext, { GraphContextOptions } from "coral-server/graph/context";
import {
  ErrorApolloServerPlugin,
  LoggerApolloServerPlugin,
  MetricsApolloServerPlugin,
} from "coral-server/graph/plugins";
import { Request, TenantCoralRequest } from "coral-server/types/express";

type ContextProviderOptions = Omit<AppOptions, "schema" | "metrics">;

function contextProvider(options: ContextProviderOptions) {
  return ({ req }: { req: Request<TenantCoralRequest> }) => {
    // Grab the details from the Coral request.
    const { id, now, tenant, logger, persisted } = req.coral;

    // Create some new options to store the tenant context details inside.
    const opts: GraphContextOptions = {
      ...options,
      id,
      now,
      req,
      persisted,
      tenant,
      logger,
    };

    // Add the user if there is one.
    if (req.user) {
      opts.user = req.user;
    }

    // Add the clientID if there is one on the request.
    const clientID = req.get(CLIENT_ID_HEADER);
    if (clientID) {
      // TODO: (wyattjoh) validate length
      opts.clientID = clientID;
    }

    // Return the compiled context.
    return new GraphContext(opts);
  };
}

export const apolloGraphQLMiddleware = ({
  schema,
  metrics,
  ...options
}: AppOptions) => {
  // Create the ApolloServer that we'll use to get the middleware from.
  const server = new ApolloServer({
    // Provide the executable schema that we assembled earlier.
    schema,

    // Create the context provider that'll create a new context for each
    // request.
    context: contextProvider(options),

    // Introspection is enabled when we aren't in a production environment or if
    // the GraphiQL is enabled.
    introspection:
      options.config.get("env") !== "production" ||
      options.config.get("enable_graphiql"),

    // Disable uploads, Coral doesn't handle any file uploads.
    uploads: false,

    // Disable the embedded playground, Coral provides it's own GraphiQL
    // interface.
    playground: false,

    // Disable engine, Coral doesn't use it.
    engine: false,

    // Disable cache control, Coral doesn't use it yet.
    cacheControl: false,

    // Disable subscriptions as we'll be providing it seperatly.
    subscriptions: false,

    // Disable automated persisted queries as Coral will provide it's own
    // implementation at the Express level.
    persistedQueries: false,

    // Configure plugins to be ran on requests.
    plugins: [
      ErrorApolloServerPlugin,
      LoggerApolloServerPlugin,
      MetricsApolloServerPlugin(metrics),
    ],

    // Disable the debug mode, as we already add in our logging function.
    debug: false,
  });

  // Get the GraphQL middleware.
  return server.getMiddleware({
    // Disable the health check endpoint, Coral does not use this endpoint and
    // instead uses the /api/health endpoint.
    disableHealthCheck: true,

    // Disable CORS, Coral does not allow cross origin requests.
    cors: false,

    // Disable the body parser, we will add our own.
    bodyParserConfig: false,

    // Configure the path.
    path: "/graphql",
  });
};

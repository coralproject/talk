import { ApolloServer } from "apollo-server-express";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import ResponseCachePlugin from "apollo-server-plugin-response-cache";

import { CLIENT_ID_HEADER } from "coral-common/constants";
import { AppOptions } from "coral-server/app";
import GraphContext, { GraphContextOptions } from "coral-server/graph/context";
import {
  CommentSeenServerPlugin,
  ErrorApolloServerPlugin,
  LoggerApolloServerPlugin,
  MetricsApolloServerPlugin,
} from "coral-server/graph/plugins";
import { Request, TenantCoralRequest } from "coral-server/types/express";

import { RedisCache } from "./cache/redis";

type ContextProviderOptions = Omit<AppOptions, "schema" | "metrics">;

function contextProvider(options: ContextProviderOptions) {
  return ({ req }: { req: Request<TenantCoralRequest> }) => {
    // Grab the details from the Coral request.
    const { id, now, tenant, site, logger, persisted } = req.coral;

    // Create some new options to store the tenant context details inside.
    const opts: GraphContextOptions = {
      ...options,
      id,
      now,
      req,
      persisted,
      tenant,
      logger,
      site,
    };

    // Add the user if there is one.
    if (req.user) {
      opts.user = req.user;
    }

    // Add the clientID if there is one on the request.
    const clientID = req.get(CLIENT_ID_HEADER);
    if (clientID) {
      // Limit the clientID to 36 characters (the length of a UUID).
      opts.clientID = clientID.slice(0, 36);
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
  // Optionally add `Cache-Control` headers to GraphQL responses.
  let cacheControl:
    | {
        defaultMaxAge: number;
      }
    | boolean = false;
  if (options.config.get("graphql_cache_headers")) {
    cacheControl = {
      defaultMaxAge: Math.floor(
        options.config.get("default_graphql_cache_max_age") / 1000
      ),
    };
  }

  const plugins: ApolloServerPlugin[] = [
    ErrorApolloServerPlugin,
    LoggerApolloServerPlugin,
    MetricsApolloServerPlugin(metrics),
    CommentSeenServerPlugin,
  ];

  // Optionally cache GraphQL responses in Redis. Will only enable if headers
  // are also enabled.
  if (
    options.config.get("graphql_response_cache") &&
    options.config.get("graphql_cache_headers")
  ) {
    plugins.push(
      ResponseCachePlugin({
        // Each user will share the same cache.
        sessionId: ({ context }) => (context.user ? context.user.id : null),
        cache: new RedisCache(options.redis),
      })
    );
  }

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

    // Configure optional cache control headers.
    cacheControl,

    // Disable subscriptions as we'll be providing it separately.
    subscriptions: false,

    // Disable automated persisted queries as Coral will provide it's own
    // implementation at the Express level.
    persistedQueries: false,

    // Configure plugins to be ran on requests.
    plugins,

    // Disable the debug mode, as we already add in our logging function.
    debug: false,
  });

  // Get the GraphQL middleware.
  return server.getMiddleware({
    // Disable the health check endpoint, Coral does not use this endpoint and
    // instead uses the /api/health endpoint.
    disableHealthCheck: true,

    // CORS is not enabled here, but in a different middleware that comes before this.
    cors: false,

    // Disable the body parser, we will add our own.
    bodyParserConfig: false,

    // Configure the path.
    path: "/graphql",
  });
};

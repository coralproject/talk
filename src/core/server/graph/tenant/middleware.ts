import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
// import { createPubSub } from "talk-server/graph/common/subscriptions/pubsub";
import { retrieveTenantByDomain } from "talk-server/models/tenant";

import TenantContext from "./context";

export default async (schema: GraphQLSchema, config: Config, db: Db) => {
  // Configure the PubSub broker.
  // const pubsub = await createPubSub(config);

  return graphqlMiddleware(config, async req => {
    // TODO: replace with shared synced cache instead of direct db access.
    const tenant = await retrieveTenantByDomain(db, req.hostname);

    // Load the user from the request.
    const user = req.user;

    // Return the graph options.
    return {
      schema,
      context: new TenantContext({ db, tenant, user }),
    };
  });
};

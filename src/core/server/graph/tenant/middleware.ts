import { Db } from "mongodb";
import { GraphQLSchema } from "graphql";

import { retrieveByDomain } from "talk-server/models/tenant";
import { createPubSub } from "talk-server/graph/common/subscriptions/pubsub";
import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";

import TenantContext from "./context";

export default async (schema: GraphQLSchema, config: Config, db: Db) => {
  // Configure the PubSub broker.
  const pubsub = await createPubSub(config);

  return graphqlMiddleware(config, async req => {
    // TODO: replace with shared synced cache instead of direct db access.
    const tenant = await retrieveByDomain(db, req.hostname);

    return {
      schema,
      context: new TenantContext({ db, tenant }),
    };
  });
};

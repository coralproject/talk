import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  QueryToUsersArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Connection } from "talk-server/models/helpers/connection";
import {
  retrieveManyUsers,
  retrieveUserConnection,
  User,
  UserConnectionInput,
} from "talk-server/models/user";

type UserConnectionFilterInput = UserConnectionInput["filter"];

const roleFilter = (role?: GQLUSER_ROLE): UserConnectionFilterInput => {
  if (role) {
    return { role };
  }

  return {};
};

const queryFilter = (query?: string): UserConnectionFilterInput => {
  if (query) {
    return { $text: { $search: query } };
  }

  return {};
};

const statusFilter = (
  now: Date,
  status?: GQLUSER_STATUS
): UserConnectionFilterInput => {
  switch (status) {
    case GQLUSER_STATUS.ACTIVE:
      return {
        "status.banned.active": false,
        "status.suspension.history": {
          $not: {
            $elemMatch: {
              "from.start": {
                $lte: now,
              },
              "from.finish": {
                $gt: now,
              },
            },
          },
        },
      };
    case GQLUSER_STATUS.BANNED:
      return { "status.banned.active": true };
    case GQLUSER_STATUS.SUSPENDED:
      return {
        "status.suspension.history": {
          $elemMatch: {
            "from.start": {
              $lte: now,
            },
            "from.finish": {
              $gt: now,
            },
          },
        },
      };
    default:
      return {};
  }
};

/**
 * primeUsersFromConnection will prime a given context with the users retrieved
 * via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeUsersFromConnection = (ctx: Context) => (
  connection: Readonly<Connection<Readonly<User>>>
) => {
  // For each of the nodes, prime the user loader.
  connection.nodes.forEach(user => {
    ctx.loaders.Users.user.prime(user.id, user);
  });

  return connection;
};

export default (ctx: Context) => {
  const user = new DataLoader<string, User | null>(ids =>
    retrieveManyUsers(ctx.mongo, ctx.tenant.id, ids)
  );

  if (ctx.user) {
    // Prime the current logged in user in the dataloader cache.
    user.prime(ctx.user.id, ctx.user);
  }

  return {
    user,
    connection: ({
      first = 10,
      after,
      role,
      query,
      status,
    }: QueryToUsersArgs) =>
      retrieveUserConnection(ctx.mongo, ctx.tenant.id, {
        first,
        after,
        filter: {
          // Merge the role filters into the query.
          ...roleFilter(role),

          // Merge the query filters into the query.
          ...queryFilter(query),

          // Merge the status filters into the query.
          ...statusFilter(ctx.now, status),
        },
      }).then(primeUsersFromConnection(ctx)),
  };
};

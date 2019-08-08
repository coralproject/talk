import DataLoader from "dataloader";

import Context from "coral-server/graph/tenant/context";
import {
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  QueryToUsersArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { Connection } from "coral-server/models/helpers";
import {
  retrieveManyUsers,
  retrieveUserConnection,
  User,
  UserConnectionInput,
} from "coral-server/models/user";

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
        "status.ban.active": false,
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
      return { "status.ban.active": true };
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
  if (!ctx.disableCaching) {
    // For each of the nodes, prime the user loader.
    connection.nodes.forEach(user => {
      ctx.loaders.Users.user.prime(user.id, user);
    });
  }

  return connection;
};

export default (ctx: Context) => {
  const user = new DataLoader<string, User | null>(
    ids => retrieveManyUsers(ctx.mongo, ctx.tenant.id, ids),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  );

  if (ctx.user && !ctx.disableCaching) {
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

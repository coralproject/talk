import DataLoader from "dataloader";
import { isNil, omitBy } from "lodash";

import Context from "talk-server/graph/tenant/context";
import { QueryToUsersArgs } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  retrieveManyUsers,
  retrieveUserConnection,
  User,
} from "talk-server/models/user";

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
    connection: ({ first = 10, after, role }: QueryToUsersArgs) =>
      retrieveUserConnection(ctx.mongo, ctx.tenant.id, {
        first,
        after,
        filter: omitBy({ role }, isNil),
      }),
  };
};

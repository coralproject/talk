import DataLoader from "dataloader";
import Context from "talk-server/graph/tenant/context";
import { retrieveManyUsers, User } from "talk-server/models/user";

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
  };
};

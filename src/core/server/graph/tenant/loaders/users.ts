import DataLoader from "dataloader";
import Context from "talk-server/graph/tenant/context";
import { retrieveManyUsers, User } from "talk-server/models/user";

export default (ctx: Context) => ({
  me: ctx.user,
  user: new DataLoader<string, User | null>(ids =>
    retrieveManyUsers(ctx.mongo, ctx.tenant.id, ids)
  ),
});

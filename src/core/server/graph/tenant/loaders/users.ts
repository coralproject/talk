import DataLoader from "dataloader";
import Context from "talk-server/graph/tenant/context";
import { retrieveMany, User } from "talk-server/models/user";

export default (ctx: Context) => ({
  user: new DataLoader<string, User | null>(ids =>
    retrieveMany(ctx.db, ctx.tenant.id, ids)
  ),
});

import { GQLQueryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Query: GQLQueryTypeResolver<void> = {
  asset: (source, args, ctx) => ctx.loaders.Assets.findOrCreate(args),
  settings: (source, args, ctx) => ctx.tenant,
  me: (source, args, ctx) => ctx.user,
};

export default Query;

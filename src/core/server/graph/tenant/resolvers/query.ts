import { GQLQueryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Query: GQLQueryTypeResolver<void> = {
  asset: (source, args, ctx) => ctx.loaders.Assets.asset.load(args.id),
  settings: (parent, args, ctx) => ctx.tenant,
};

export default Query;

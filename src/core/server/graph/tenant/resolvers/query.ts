import TenantContext from "talk-server/graph/tenant/context";
import { Asset } from "talk-server/models/asset";

export default {
  asset: async (
    _source: void,
    { id }: { id?: string; url: string },
    ctx: TenantContext
  ): Promise<Asset> => {
    return ctx.loaders.Assets.asset.load(id);
  },
  settings: async (_parent: any, _args: any, ctx: TenantContext) => ctx.tenant,
};

import TenantContext from "talk-server/graph/tenant/context";

export default {
  asset: async (
    _source: void,
    { id }: { id: string; url: string },
    ctx: TenantContext
  ) => ctx.loaders.Assets.asset.load(id),
  settings: async (_parent: any, _args: any, ctx: TenantContext) => ctx.tenant,
};

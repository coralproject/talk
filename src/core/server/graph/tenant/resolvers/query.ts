import TenantContext from "talk-server/graph/tenant/context";

export default {
  asset: async (
    source: void,
    { id }: { id: string; url: string },
    ctx: TenantContext
  ) => ctx.loaders.Assets.asset.load(id),
  comment: async (
    source: void,
    { id }: { id: string; url: string },
    ctx: TenantContext
  ) => (id ? ctx.loaders.Comments.comment.load(id) : null),
  settings: async (parent: any, args: any, ctx: TenantContext) => ctx.tenant,
};

import TenantContext from 'talk-server/graph/tenant/context';
import { Asset } from 'talk-server/models/asset';

export default {
    asset: async (
        _: any,
        { id, url }: { id?: string; url: string },
        ctx: TenantContext
    ): Promise<Asset> => {
        return ctx.loaders.Assets.asset.load(id);
    },
    settings: async (parent: any, args: any, ctx: TenantContext) => ctx.tenant,
};

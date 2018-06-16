import Context from 'talk-server/graph/tenant/context';
import { Asset } from 'talk-server/models/asset';

export default {
    asset: async (
        _: any,
        { id, url }: { id?: string; url: string },
        ctx: Context
    ): Promise<Asset> => {
        return ctx.loaders.Assets.asset.load(id);
    },
};

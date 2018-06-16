import DataLoader from 'dataloader';
import {
    Asset,
    retrieveMany as retrieveManyAssets,
} from 'talk-server/models/asset';
import Context from 'talk-server/graph/context';

const loadAssets = async (ctx: Context, ids: string[]): Promise<Array<Asset>> =>
    retrieveManyAssets(ctx.db, ids);

export default (ctx: Context) => ({
    asset: new DataLoader<string, Asset>(ids => loadAssets(ctx, ids)),
});

import DataLoader from 'dataloader';
import {
    Comment,
    retrieveMany,
    retrieveAssetConnection,
    ConnectionInput,
    retrieveRepliesConnection,
} from 'talk-server/models/comment';
import Context from 'talk-server/graph/tenant/context';

export default (ctx: Context) => ({
    comment: new DataLoader((ids: string[]) =>
        retrieveMany(ctx.db, ctx.tenant.id, ids)
    ),
    forAsset: (assetID: string, input: ConnectionInput) =>
        retrieveAssetConnection(ctx.db, ctx.tenant.id, assetID, input),
    forParent: (assetID: string, parentID: string, input: ConnectionInput) =>
        retrieveRepliesConnection(
            ctx.db,
            ctx.tenant.id,
            assetID,
            parentID,
            input
        ),
});

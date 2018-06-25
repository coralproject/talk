import Context from "talk-server/graph/tenant/context";
import { Asset } from "talk-server/models/asset";
import { ConnectionInput } from "talk-server/models/comment";

export default {
  comments: async (asset: Asset, input: ConnectionInput, ctx: Context) =>
    ctx.loaders.Comments.forAsset(asset.id, input),
};

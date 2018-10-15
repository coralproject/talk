import { GQLAssetTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action";
import { Asset } from "talk-server/models/asset";

const Asset: GQLAssetTypeResolver<Asset> = {
  comments: (asset, input, ctx) =>
    ctx.loaders.Comments.forAsset(asset.id, input),
  // TODO: implement this.
  isClosed: () => false,
  actionCounts: asset => decodeActionCounts(asset.action_counts),
  commentCounts: asset => asset.comment_counts,
};

export default Asset;

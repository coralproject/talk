import { GQLAssetTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Asset } from "talk-server/models/asset";

const Asset: GQLAssetTypeResolver<Asset> = {
  comments: (asset, input, ctx) =>
    ctx.loaders.Comments.forAsset(asset.id, input),
  // TODO: implement this.
  isClosed: () => false,
};

export default Asset;

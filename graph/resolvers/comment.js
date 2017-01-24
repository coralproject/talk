const Comment = {
  user({author_id}, _, {loaders}) {
    return loaders.Users.getByID.load(author_id);
  },
  replies({id}, _, {loaders}) {
    return loaders.Comments.getByParentID.load(id);
  },
  actions({id}, _, {loaders}) {
    return loaders.Actions.getByItemID.load(id);
  },
  asset({asset_id}, _, {loaders}) {
    return loaders.Assets.getByID.load(asset_id);
  }
};

module.exports = Comment;

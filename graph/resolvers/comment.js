const Comment = {
  user({author_id}, _, {loaders: {Users}}) {
    return Users.getByID.load(author_id);
  },
  replies({id, asset_id}, {sort, limit}, {loaders: {Comments}}) {
    return Comments.getByQuery({
      asset_id,
      parent_id: id,
      sort,
      limit
    });
  },
  replyCount({id}, _, {loaders: {Comments}}) {
    return Comments.countByParentID.load(id);
  },
  actions({id}, _, {user, loaders: {Actions}}) {

    // Only return the actions if the user is not an admin.
    if (user && user.hasRoles('ADMIN')) {
      return Actions.getByID.load(id);
    }

    return null;
  },
  action_summaries({id}, _, {loaders: {Actions}}) {
    return Actions.getSummariesByItemID.load(id);
  },
  asset({asset_id}, _, {loaders: {Assets}}) {
    return Assets.getByID.load(asset_id);
  }
};

module.exports = Comment;

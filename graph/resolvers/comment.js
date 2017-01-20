const Comment = {
  user({author_id}, _, {loaders}) {
    return loaders.Users.getByID.load(author_id);
  },
  replies({id}, _, {loaders}) {
    return loaders.Comments.getByParentID.load(id);
  },
  actions({id}, _, {loaders}) {
    return loaders.Actions.getByID.load(id);
  },
  status({status}) {

    // Because the status can be `null`, we do this check.
    if (status) {
      return status.toUpperCase();
    }
  }
};

module.exports = Comment;

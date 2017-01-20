const RootQuery = {
  assets(_, args, {loaders}) {
    return loaders.Assets.getAll.load();
  },
  asset(_, {id = null, url}, {loaders}) {
    if (id) {

      // TODO: we may not always have a comment stream here, therefore, when we
      // load it, we may also need to create with the url. This may also have to
      // move the logic over to the mutators function as an upsert operation
      // possibly.
      return loaders.Assets.getByID.load(id);
    } else {
      return loaders.Assets.getByURL(url);
    }
  },
  settings(_, args, {loaders}) {
    return loaders.Settings.load();
  },
  me(_, args, {user}) {
    return user;
  }
};

module.exports = RootQuery;

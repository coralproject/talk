const Query = {
  assets(_, args, {loaders}) {
    return loaders.Assets.getAll.load();
  },
  asset(_, {id}, {loaders}) {
    return loaders.Assets.getByID.load(id);
  },
  settings(_, args, {loaders}) {
    return loaders.Settings.load();
  },
  me(_, args, {user}) {
    return user;
  }
};

module.exports = Query;

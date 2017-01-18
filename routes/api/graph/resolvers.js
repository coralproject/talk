module.exports = {
  Query: {
    assets(_, args, {loaders}) {
      return loaders.Assets.getAll.load();
    },
    asset(_, {id}, {loaders}) {
      return loaders.Assets.getByID.load(id);
    },
    settings(_, args, {loaders}) {
      return loaders.Settings.load();
    }
  },
  Mutation: {
    createComment(_, {asset_id, parent_id, body}, {mutators}) {
      return mutators.createComment({asset_id, parent_id, body});
    }
  },
  Asset: {
    comments({id}, _, {loaders}) {
      return loaders.Comments.getByAssetID.load(id);
    },
    settings({settings = null}, _, {loaders}) {
      return loaders.Settings.load()
        .then((globalSettings) => {

          if (settings) {
            settings = Object.assign({}, settings, globalSettings);
          } else {
            settings = globalSettings;
          }

          return settings;
        });
    }
  },
  User: {
    actions({id}, _, {loaders}) {
      return loaders.Actions.getByID.load(id);
    }
  },
  Comment: {
    user({author_id}, _, {loaders}) {
      return loaders.Users.getByID.load(author_id);
    },
    replies({id}, _, {loaders}) {
      return loaders.Comments.getByParentID.load(id);
    },
    actions({id}, _, {loaders}) {
      return loaders.Actions.getByID.load(id);
    }
  }
};

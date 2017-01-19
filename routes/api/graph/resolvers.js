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
    },
    me(_, args, {user}) {
      return user;
    }
  },
  Mutation: {
    createComment(_, {asset_id, parent_id, body}, {mutators}) {
      return mutators.Comment.create({asset_id, parent_id, body});
    },
    createAction(_, {action}, {mutators}) {
      return mutators.Action.create(action);
    },
    deleteAction(_, {id}, {mutators}) {
      return mutators.Action.delete({id});
    },
    updateUserSettings(_, {settings}, {mutators}) {
      return mutators.User.updateSettings(settings);
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
  Action: {
    action_type({action_type}) {

      // TODO: remove once we cast the data model to have uppercase action
      // types.
      return action_type.toUpperCase();
    },
    item_type({item_type}) {

      // TODO: remove once we cast the data model to have uppercase item
      // types.
      return item_type.toUpperCase();
    },
    user({user_id}, _, {loaders}) {
      return loaders.Users.getByID.load(user_id);
    }
  },
  ActionSummary: {
    action_type({action_type}) {

      // TODO: remove once we cast the data model to have uppercase action
      // types.
      return action_type.toUpperCase();
    },
    item_type({item_type}) {

      // TODO: remove once we cast the data model to have uppercase item
      // types.
      return item_type.toUpperCase();
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

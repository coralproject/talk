const RootMutation = {
  createComment(_, {asset_id, parent_id, body}, {mutators: {Comment}}) {
    return Comment.create({asset_id, parent_id, body});
  },
  createAction(_, {action}, {mutators: {Action}}) {
    return Action.create(action);
  },
  deleteAction(_, {id}, {mutators: {Action}}) {
    return Action.delete({id});
  },
  updateUserSettings(_, {settings}, {mutators: {User}}) {
    return User.updateSettings(settings);
  }
};

module.exports = RootMutation;

const RootMutation = {
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
};

module.exports = RootMutation;

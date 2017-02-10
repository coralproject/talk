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
  setUserStatus(_, {id, status}, {mutators: {User}}) {
    return User.setUserStatus({id, status});
  }
};

module.exports = RootMutation;

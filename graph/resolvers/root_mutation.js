const RootMutation = {
  createComment: async (_, {input}, {mutators: {Comment}, loaders: {Actions}}) => {
    const comment = await Comment.create(input);

    // Retrieve actions that was assigned to comment.
    const actions = await Actions.getByID.load(comment.id);

    return {comment, actions};
  },
  editComment: async (_, {id, asset_id, edit: {body}}, {mutators: {Comment}}) => ({
    comment: await Comment.edit({id, asset_id, edit: {body}}),
  }),
  createFlag: async (_, {flag: {item_id, item_type, reason, message}}, {mutators: {Action}}) => ({
    flag: Action.create({item_id, item_type, action_type: 'FLAG', group_id: reason, metadata: {message}}),
  }),
  createDontAgree: async (_, {dontagree: {item_id, item_type, reason, message}}, {mutators: {Action}}) => ({
    dontagree: await Action.create({item_id, item_type, action_type: 'DONTAGREE', group_id: reason, metadata: {message}}),
  }),
  deleteAction: async (_, {id}, {mutators: {Action}}) => {
    await Action.delete({id});
  },
  setUserStatus: async (_, {id, status}, {mutators: {User}}) => {
    await User.setUserStatus({id, status});
  },
  suspendUser: async (_, {input: {id, message, until}}, {mutators: {User}}) => {
    await User.suspendUser({id, message, until});
  },
  rejectUsername: async (_, {input: {id, message}}, {mutators: {User}}) => {
    await User.rejectUsername({id, message});
  },
  ignoreUser: async (_, {id}, {mutators: {User}}) => {
    await User.ignoreUser({id});
  },
  stopIgnoringUser: async (_, {id}, {mutators: {User}}) => {
    await User.stopIgnoringUser({id});
  },
  updateAssetSettings: async (_, {id, input: settings}, {mutators: {Asset}}) => {
    await Asset.updateSettings(id, settings);
  },
  updateAssetStatus: async (_, {id, input: status}, {mutators: {Asset}}) => {
    await Asset.updateStatus(id, status);
  },
  setCommentStatus: async (_, {id, status}, {mutators: {Comment}, pubsub}) => {
    const comment = await Comment.setStatus({id, status});
    if (status === 'ACCEPTED') {

      // Publish the comment status change via the subscription.
      pubsub.publish('commentAccepted', comment);
    } else if (status === 'REJECTED') {

      // Publish the comment status change via the subscription.
      pubsub.publish('commentRejected', comment);
    }
  },
  addTag: async (_, {tag}, {mutators: {Tag}}) => {
    await Tag.add(tag);
  },
  removeTag: async (_, {tag}, {mutators: {Tag}}) => {
    await Tag.remove(tag);
  },
  updateSettings: async (_, {input: settings}, {mutators: {Settings}}) => {
    await Settings.update(settings);
  },
  updateWordlist: async (_, {input: wordlist}, {mutators: {Settings}}) => {
    await Settings.updateWordlist(wordlist);
  },
  createToken: async (_, {input}, {mutators: {Token}}) => ({
    token: await Token.create(input),
  }),
  revokeToken: async (_, {input}, {mutators: {Token}}) => {
    await Token.revoke(input);
  }
};

module.exports = RootMutation;

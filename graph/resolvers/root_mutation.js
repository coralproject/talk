const RootMutation = {
  createComment: async (
    _,
    { input },
    { mutators: { Comment }, loaders: { Actions } }
  ) => {
    const comment = await Comment.create(input);

    // Retrieve actions that was assigned to comment.
    const actions = await Actions.getByID.load(comment.id);

    return { comment, actions };
  },
  editComment: async (
    _,
    { id, asset_id, edit: { body } },
    { mutators: { Comment } }
  ) => ({
    comment: await Comment.edit({ id, asset_id, edit: { body } }),
  }),
  createFlag: async (
    _,
    { flag: { item_id, item_type, reason, message } },
    { mutators: { Action } }
  ) => ({
    flag: await Action.create({
      item_id,
      item_type,
      action_type: 'FLAG',
      group_id: reason,
      metadata: { message },
    }),
  }),
  createDontAgree: async (
    _,
    { dontagree: { item_id, item_type, message } },
    { mutators: { Action } }
  ) => ({
    dontagree: await Action.create({
      item_id,
      item_type,
      action_type: 'DONTAGREE',
      metadata: { message },
    }),
  }),
  deleteAction: async (_, { id }, { mutators: { Action } }) => {
    await Action.delete({ id });
  },
  approveUsername: async (_, { id }, { mutators: { User } }) => {
    await User.setUserUsernameStatus(id, 'APPROVED');
  },
  rejectUsername: async (_, { id }, { mutators: { User } }) => {
    await User.setUserUsernameStatus(id, 'REJECTED');
  },
  changeUsername: async (_, { id, username }, { mutators: { User } }) => {
    await User.changeUsername(id, username);
  },
  setUsername: async (_, { id, username }, { mutators: { User } }) => {
    await User.setUsername(id, username);
  },
  suspendUser: async (
    obj,
    { input: { id, until, message } },
    { mutators: { User } }
  ) => {
    await User.setUserSuspensionStatus(id, until, message);
  },
  unsuspendUser: async (obj, { input: { id } }, { mutators: { User } }) => {
    await User.setUserSuspensionStatus(id);
  },
  banUser: async (obj, { input: { id, message } }, { mutators: { User } }) => {
    await User.setUserBanStatus(id, true, message);
  },
  unbanUser: async (obj, { input: { id } }, { mutators: { User } }) => {
    await User.setUserBanStatus(id, false);
  },
  ignoreUser: async (_, { id }, { mutators: { User } }) => {
    await User.ignoreUser({ id });
  },
  stopIgnoringUser: async (_, { id }, { mutators: { User } }) => {
    await User.stopIgnoringUser({ id });
  },
  updateAssetSettings: async (
    _,
    { id, input: settings },
    { mutators: { Asset } }
  ) => {
    await Asset.updateSettings(id, settings);
  },
  updateAssetStatus: async (
    _,
    { id, input: status },
    { mutators: { Asset } }
  ) => {
    await Asset.updateStatus(id, status);
  },
  closeAsset: async (_, { id }, { mutators: { Asset } }) => {
    await Asset.closeNow(id);
  },
  setUserRole: async (_, { id, role }, { mutators: { User } }) => {
    await User.setRole(id, role);
  },
  setCommentStatus: async (
    _,
    { id, status },
    { mutators: { Comment }, pubsub }
  ) => {
    const comment = await Comment.setStatus({ id, status });
    if (status === 'ACCEPTED') {
      pubsub.publish('commentAccepted', comment);
    } else if (status === 'REJECTED') {
      pubsub.publish('commentRejected', comment);
    } else if (status === 'NONE') {
      pubsub.publish('commentReset', comment);
    }
  },
  addTag: async (_, { tag }, { mutators: { Tag } }) => {
    await Tag.add(tag);
  },
  removeTag: async (_, { tag }, { mutators: { Tag } }) => {
    await Tag.remove(tag);
  },
  updateSettings: async (
    _,
    { input: settings },
    { mutators: { Settings } }
  ) => {
    await Settings.update(settings);
  },
  createToken: async (_, { input }, { mutators: { Token } }) => ({
    token: await Token.create(input),
  }),
  revokeToken: async (_, { input }, { mutators: { Token } }) => {
    await Token.revoke(input);
  },
};

module.exports = RootMutation;

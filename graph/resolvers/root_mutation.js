const RootMutation = {
  async createComment(_, {input}, {mutators: {Comment}}) {
    return {
      comment: await Comment.create(input),
    };
  },
  async editComment(_, {id, asset_id, edit: {body}}, {mutators: {Comment}}) {
    return {
      comment: await Comment.edit({id, asset_id, edit: {body}}),
    };
  },
  async createFlag(_, {flag: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return {
      flag: Action.create({item_id, item_type, action_type: 'FLAG', group_id: reason, metadata: {message}}),
    };
  },
  async createDontAgree(_, {dontagree: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return {
      dontagree: await Action.create({item_id, item_type, action_type: 'DONTAGREE', group_id: reason, metadata: {message}}),
    };
  },
  async deleteAction(_, {id}, {mutators: {Action}}) {
    await Action.delete({id});
  },
  async setUserStatus(_, {id, status}, {mutators: {User}}) {
    await User.setUserStatus({id, status});
  },
  async suspendUser(_, {input: {id, message, until}}, {mutators: {User}}) {
    await User.suspendUser({id, message, until});
  },
  async rejectUsername(_, {input: {id, message}}, {mutators: {User}}) {
    await User.rejectUsername({id, message});
  },
  async ignoreUser(_, {id}, {mutators: {User}}) {
    await User.ignoreUser({id});
  },
  async stopIgnoringUser(_, {id}, {mutators: {User}}) {
    await User.stopIgnoringUser({id});
  },
  async setCommentStatus(_, {id, status}, {mutators: {Comment}, pubsub}) {
    const comment = await Comment.setStatus({id, status});
    if (status === 'ACCEPTED') {

      // Publish the comment status change via the subscription.
      pubsub.publish('commentAccepted', comment);
    } else if (status === 'REJECTED') {

      // Publish the comment status change via the subscription.
      pubsub.publish('commentRejected', comment);
    }
  },
  async addTag(_, {tag}, {mutators: {Tag}}) {
    await Tag.add(tag);
  },
  async removeTag(_, {tag}, {mutators: {Tag}}) {
    await Tag.remove(tag);
  },
  async createToken(_, {input}, {mutators: {Token}}) {
    return {
      token: await Token.create(input),
    };
  },
  async revokeToken(_, {input}, {mutators: {Token}}) {
    await Token.revoke(input);
  }
};

module.exports = RootMutation;

const {Error: {ValidationError}} = require('mongoose');
const errors = require('../../errors');

/**
 * Wraps up a promise to return an object with the resolution of the promise
 * keyed at `key` or an error caught at `errors`.
 */
const wrapResponse = (key) => (promise) => {
  return promise.then((value) => {
    let res = {};
    if (key) {
      res[key] = value;
    }
    return res;
  }).catch((err) => {

    if (err instanceof errors.APIError) {
      return {
        errors: [err]
      };
    } else if (err instanceof ValidationError) {

      // TODO: wrap this with one of our internal errors.
      throw err;
    }

    throw err;
  });
};

const RootMutation = {
  createComment(_, {asset_id, parent_id, body}, {mutators: {Comment}}) {
    return wrapResponse('comment')(Comment.create({asset_id, parent_id, body}));
  },
  createLike(_, {like: {item_id, item_type}}, {mutators: {Action}}) {
    return wrapResponse('like')(Action.create({item_id, item_type, action_type: 'LIKE'}));
  },
  createFlag(_, {flag: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return wrapResponse('flag')(Action.create({item_id, item_type, action_type: 'FLAG', group_id: reason, metadata: {message}}));
  },
  createDontAgree(_, {dontagree: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return wrapResponse('dontagee')(Action.create({item_id, item_type, action_type: 'DONTAGREE', group_id: reason, metadata: {message}}));
  },
  deleteAction(_, {id}, {mutators: {Action}}) {
    return wrapResponse(null)(Action.delete({id}));
  },
  setUserStatus(_, {id, status}, {mutators: {User}}) {
    return wrapResponse(null)(User.setUserStatus({id, status}));
  },
  setCommentStatus(_, {id, status}, {mutators: {Comment}}) {
    return wrapResponse(null)(Comment.setCommentStatus({id, status}));
  }
};

module.exports = RootMutation;

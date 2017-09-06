const perspective = require('./perspective');
const {ADD_COMMENT_TAG} = require('../../../perms/constants');
const {ErrToxic} = require('./errors');
const {TOXICITY_THRESHOLD} = require('./constants');

module.exports = {
  Comment: {
    tags: {
      post(comment, input, {user}, _info, result) {
        if (comment.metadata.perspective && user && user.can(ADD_COMMENT_TAG)) {
          return result.concat({tag: {name: 'TOXIC', created_at: new Date()}});
        }
        return result;
      }
    },
  },
  RootMutation: {
    createComment: {
      async pre(_, {input}, _context, _info) {

        // Don't call out to perspective when running tests.
        if (process.env.NODE_ENV === 'test') {
          return;
        }

        const apiKey = require('./apiKey');
        const scores = await perspective.getScores(apiKey, input.body);
        if (input.checkToxicity && scores.SEVERE_TOXICITY.summaryScore > TOXICITY_THRESHOLD) {
          throw ErrToxic;
        }
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });
      },
    },
  },
};

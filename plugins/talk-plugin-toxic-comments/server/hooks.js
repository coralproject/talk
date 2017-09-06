const perspective = require('./perspective');
const {ErrToxic} = require('./errors');
const {TOXICITY_THRESHOLD} = require('./constants');

module.exports = {
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

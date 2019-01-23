const { getScores, submitFeedback, isToxic } = require('./perspective');
const { SEND_FEEDBACK } = require('./config');
const { ErrToxic } = require('./errors');

const { merge } = require('lodash');
const debug = require('debug')('talk:plugin:toxic-comments');

function handlePositiveToxic(input) {
  input.status = 'SYSTEM_WITHHELD';
  input.actions =
    input.actions && input.actions.length >= 0 ? input.actions : [];
  input.actions.push({
    action_type: 'FLAG',
    user_id: null,
    group_id: 'TOXIC_COMMENT',
    metadata: {},
  });
}

async function getScore(body) {
  // Try getting scores.
  let scores;
  try {
    scores = await getScores(body);
  } catch (err) {
    // Warn and let mutation pass.
    debug('Error sending to API: %o', err);
    return;
  }

  return scores;
}

// Create all the hooks that will enable Perspective to add scores to Comments.
const hooks = {
  RootMutation: {
    editComment: {
      pre: async (_, { edit: { body }, edit }) => {
        const scores = await getScore(body);
        if (isToxic(scores)) {
          handlePositiveToxic(edit);
        }
      },
    },
    createComment: {
      async pre(_, { input }, _context, _info) {
        const scores = await getScore(input.body);

        if (isToxic(scores)) {
          if (input.checkToxicity) {
            throw new ErrToxic();
          }

          // Mark the comment as positive toxic.
          handlePositiveToxic(input);
        }

        // Attach scores to metadata.
        input.metadata = Object.assign({}, input.metadata, {
          perspective: scores,
        });
      },
    },
  },
};

// If feedback sending is enabled, we need to add in the hooks for processing
// feedback.
if (SEND_FEEDBACK) {
  // statusMap provides a map of Talk names to ones Perspective are expecting.
  const statusMap = {
    ACCEPTED: 'APPROVED',
    REJECTED: 'DELETED',
  };

  // Merge these hooks into the hooks for plugging into the graph operations.
  merge(hooks, {
    RootMutation: {
      // Hook into mutations associated with accepting/rejecting comments.
      setCommentStatus: {
        async post(root, args, ctx) {
          if (ctx.user && args.status in statusMap) {
            const comment = await ctx.loaders.Comments.get.load(args.id);
            if (comment) {
              const asset = await ctx.loaders.Assets.getByID.load(
                comment.asset_id
              );

              // Submit feedback.
              submitFeedback(comment, asset, statusMap[args.status]);
            }
          }
        },
      },
      // Hook into mutations associated with featuring comments.
      addTag: {
        async post(root, args, ctx) {
          if (
            ctx.user &&
            args.tag.name === 'FEATURED' &&
            args.tag.item_type === 'COMMENTS'
          ) {
            const comment = await ctx.loaders.Comments.get.load(args.tag.id);
            if (comment) {
              const asset = await ctx.loaders.Assets.getByID.load(
                comment.asset_id
              );

              // Submit feedback.
              submitFeedback(comment, asset, 'HIGHLIGHTED');
            }
          }
        },
      },
    },
  });
}

module.exports = hooks;

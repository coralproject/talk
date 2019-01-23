const get = require('lodash/get');

// This phase checks to see if the user making the comment is allowed to do so
// considering their reliability (Trust) status.
module.exports = ctx => {
  const {
    connectors: {
      services: { Karma },
    },
  } = ctx;
  const trust = get(ctx, 'user.metadata.trust', null);

  // If the user is not a reliable commenter (passed the unreliability
  // threshold by having too many rejected comments) then we can change the
  // status of the comment to `SYSTEM_WITHHELD`, therefore pushing the user's
  // comments away from the public eye until a moderator can manage them. This of
  // course can only be applied if the comment's current status is `NONE`,
  // we don't want to interfere if the comment was rejected.
  if (Karma.isReliable('comment', trust) === false) {
    // Add the flag related to Trust to the comment.
    return {
      status: 'SYSTEM_WITHHELD',
      actions: [
        {
          action_type: 'FLAG',
          user_id: null,
          group_id: 'TRUST',
          metadata: {
            trust,
          },
        },
      ],
    };
  }
};

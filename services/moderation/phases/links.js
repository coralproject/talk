const linkify = require('linkify-it')().tlds(require('tlds'));

// This phase checks the comment if it has any links in it if the check is
// enabled.
module.exports = (
  ctx,
  comment,
  {
    asset: {
      settings: { premodLinksEnable },
    },
  }
) => {
  if (premodLinksEnable && linkify.test(comment.body.replace(/\xAD/g, ''))) {
    // Add the flag related to Trust to the comment.
    return {
      status: 'SYSTEM_WITHHELD',
      actions: [
        {
          action_type: 'FLAG',
          user_id: null,
          group_id: 'LINKS',
          metadata: {
            links: comment.body,
          },
        },
      ],
    };
  }
};

const { DISABLE_AUTOFLAG_SUSPECT_WORDS } = require('../../../config');

// This phase checks the comment against the wordlist.
module.exports = async (ctx, comment, { settings }) => {
  const {
    connectors: {
      services: { Wordlist },
    },
  } = ctx;

  // Create a new instance of the Wordlist.
  const wl = new Wordlist();

  // Load the wordlist.
  wl.upsert(settings.wordlist);

  // Scan the comment body for wordlist violations.
  const { banned = null, suspect = null } = wl.scan('body', comment.body);

  // Decide the status based on whether or not the current asset/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordlist, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  if (banned) {
    // Add the flag related to Trust to the comment.
    return {
      status: 'REJECTED',
      actions: [
        {
          action_type: 'FLAG',
          user_id: null,
          group_id: 'BANNED_WORD',
          metadata: {},
        },
      ],
    };
  }

  // If the comment has a suspect word or a link, we need to add a
  // flag to it to indicate that it needs to be looked at.
  // Otherwise just return the new comment.

  // If the wordlist has matched the suspect word filter and we haven't disabled
  // auto-flagging suspect words, then we should flag the comment!
  if (suspect && !DISABLE_AUTOFLAG_SUSPECT_WORDS) {
    // TODO: this is kind of fragile, we should refactor this to resolve
    // all these const's that we're using like 'COMMENTS', 'FLAG' to be
    // defined in a checkable schema.
    return {
      actions: [
        {
          action_type: 'FLAG',
          user_id: null,
          group_id: 'SUSPECT_WORD',
          metadata: {},
        },
      ],
    };
  }
};

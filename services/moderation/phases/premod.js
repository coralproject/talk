// This phase checks to see if the settings have premod enabled, if they do,
// the comment is premod, otherwise, it's just none.
module.exports = (
  ctx,
  comment,
  {
    asset: {
      settings: { moderation },
    },
  }
) => {
  // If the settings say that we're in premod mode, or the user is flagged as
  // always premod, then the comment is in premod status.
  if (moderation === 'PRE' || ctx.user.status.alwaysPremod.status === true) {
    return {
      status: 'PREMOD',
    };
  }

  return {
    status: 'NONE',
  };
};

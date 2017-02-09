const ActionSummary = {
  __resolveType({action_type}) {
    switch (action_type) {
    case 'FLAG':
      return 'FlagActionSummary';
    case 'LIKE':
      return 'LikeActionSummary';
    }
  },
};

module.exports = ActionSummary;

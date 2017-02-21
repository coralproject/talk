const ActionSummary = {
  __resolveType({action_type}) {
    switch (action_type) {
    case 'FLAG':
      return 'FlagActionSummary';
    case 'LIKE':
      return 'LikeActionSummary';
    case 'DONTAGREE':
      return 'DontAgreeActionSummary';
    }
  },
};

module.exports = ActionSummary;

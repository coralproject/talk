const ActionSummary = {
  __resolveType({ action_type }) {
    switch (action_type) {
      case 'FLAG':
        return 'FlagActionSummary';
      case 'DONTAGREE':
        return 'DontAgreeActionSummary';
      default:
        return undefined;
    }
  },
};

module.exports = ActionSummary;

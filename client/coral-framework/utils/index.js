export const getTotalActionCount = (type, comment) => {
  if (!comment.action_summaries) {
    return 0;
  }

  return comment.action_summaries.reduce((total, summary) => {
    if (summary.__typename === type) {
      return total + summary.count;
    } else {
      return total;
    }
  }, 0);
};

export const iPerformedThisAction = (type, comment) => {
  if (!comment.action_summaries) {
    return 0;
  }

  // if there is a current_user on any of the ActionSummary(s), the user performed this action
  return comment.action_summaries
    .filter(a => a.__typename === type)
    .some(a => a.current_user);
};

 /**
 * getActionSummary
 * retrieves the action summaries based on the type and the comment
 * array could be length > 1, as in the case of FlagActionSummary
 */

export const getActionSummary = (type, comment) => {
  if (!comment.action_summaries) {
    return null;
  }

  return comment.action_summaries.filter(a => a.__typename === type);
};

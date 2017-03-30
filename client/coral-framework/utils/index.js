export const getActionSummary = (type, comment) => comment.action_summaries
  .filter((a) => a.__typename === type)[0];
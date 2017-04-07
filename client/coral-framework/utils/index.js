/**
* getActionSummary
* retrieves the action summary based on the type and the comment
*/

export const getActionSummary = (type, comment) =>
  comment.action_summaries.filter(a => a.__typename === type)[0];

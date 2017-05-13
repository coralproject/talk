import {gql} from 'react-apollo';

export const getTotalActionCount = (type, comment) => {
  return comment.action_summaries
    .filter(s => s.__typename === type)
    .reduce((total, summary) => {
      return total + summary.count;
    }, 0);
};

export const iPerformedThisAction = (type, comment) => {

  // if there is a current_user on any of the ActionSummary(s), the user performed this action
  return comment.action_summaries
    .filter(a => a.__typename === type)
    .some(a => a.current_user);
};

export const getMyActionSummary = (type, comment) => {
  return comment.action_summaries
    .filter(a => a.__typename === type)
    .find(a => a.current_user);
};

 /**
 * getActionSummary
 * retrieves the action summaries based on the type and the comment
 * array could be length > 1, as in the case of FlagActionSummary
 */

export const getActionSummary = (type, comment) => {
  return comment.action_summaries.filter(a => a.__typename === type);
};

/**
 * Get name of first (or $pos-th) definition
 */
export function getDefinitionName(doc, pos = 0) {
  return doc.definitions[pos].name.value;
}

/**
 * Separate apollo `data` props into `data` and `root`.
 * `data` will contain props like `loading`, `fetchMore`...
 * while `root` contains the actual query data.
 */
export function separateDataAndRoot(
  {
    fetchMore,
    loading,
    networkStatus,
    refetch,
    startPolling,
    stopPolling,
    subscribeToMore,
    updateQuery,
    variables,
    ...root,
  }) {
  return {
    data: {fetchMore, loading, networkStatus, refetch, startPolling,
      stopPolling, subscribeToMore, updateQuery, variables},
    root,
  };
}

export function mergeDocuments(documents) {
  const main = typeof documents[0] === 'string' ? documents[0] : documents[0].loc.source.body;
  const substitutions = documents.slice(1);
  const literals = [main, ...substitutions.map(() => '\n')];
  return gql.apply(null, [literals, ...substitutions]);
}


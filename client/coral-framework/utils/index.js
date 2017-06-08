import {gql} from 'react-apollo';

export const getTotalActionCount = (type, comment) => {
  return comment.action_summaries
    .filter((s) => s.__typename === type)
    .reduce((total, summary) => {
      return total + summary.count;
    }, 0);
};

export const iPerformedThisAction = (type, comment) => {

  // if there is a current_user on any of the ActionSummary(s), the user performed this action
  return comment.action_summaries
    .filter((a) => a.__typename === type)
    .some((a) => a.current_user);
};

export const getMyActionSummary = (type, comment) => {
  return comment.action_summaries
    .filter((a) => a.__typename === type)
    .find((a) => a.current_user);
};

 /**
 * getActionSummary
 * retrieves the action summaries based on the type and the comment
 * array could be length > 1, as in the case of FlagActionSummary
 */

export const getActionSummary = (type, comment) => {
  return comment.action_summaries.filter((a) => a.__typename === type);
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
    error,
    ...root,
  }) {
  return {
    data: {fetchMore, loading, networkStatus, refetch, startPolling,
      stopPolling, subscribeToMore, updateQuery, variables, error},
    root,
  };
}

/**
 * Taken from: http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object.
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
export function dateAdd(date, interval, units) {
  let ret = new Date(date); // don't change original date
  const checkRollover = () => {
    if (ret.getDate() !== date.getDate()) {
      ret.setDate(0);
    }
  };
  switch(interval.toLowerCase()) {
  case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
  case 'quarter':  ret.setMonth(ret.getMonth() + 3 * units); checkRollover();  break;
  case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
  case 'week'   :  ret.setDate(ret.getDate() + 7 * units);  break;
  case 'day'    :  ret.setDate(ret.getDate() + units);  break;
  case 'hour'   :  ret.setTime(ret.getTime() + units * 3600000);  break;
  case 'minute' :  ret.setTime(ret.getTime() + units * 60000);  break;
  case 'second' :  ret.setTime(ret.getTime() + units * 1000);  break;
  default       :  ret = undefined;  break;
  }
  return ret;
}

export function mergeDocuments(documents) {
  const main = typeof documents[0] === 'string' ? documents[0] : documents[0].loc.source.body;
  const substitutions = documents.slice(1);
  const literals = [main, ...substitutions.map(() => '\n')];
  return gql.apply(null, [literals, ...substitutions]);
}

export function getResponseErrors(mutationResult) {
  const result = [];
  Object.keys(mutationResult.data).forEach((response) => {
    const errors = mutationResult.data[response].errors;
    if (errors && errors.length) {
      result.push(...errors);
    }
  });
  return result.length ? result : false;
}

export function createDefaultResponseFragments(...names) {
  const result = {};
  names.forEach((response) => {
    result[response] = gql`
      fragment Coral_${response} on ${response} {
        errors {
          translation_key
        }
      }
    `;
  });
  return result;
}

import { gql } from 'react-apollo';
import t from 'coral-framework/services/i18n';
import union from 'lodash/union';
import get from 'lodash/get';
import { capitalize } from 'coral-framework/helpers/strings';
import assignWith from 'lodash/assignWith';
import mapValues from 'lodash/mapValues';
export * from 'coral-framework/helpers/strings';
export * from './url';

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
export function separateDataAndRoot({
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
  ...root
}) {
  return {
    data: {
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
    },
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
  switch (interval.toLowerCase()) {
    case 'year':
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case 'quarter':
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case 'month':
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case 'week':
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case 'day':
      ret.setDate(ret.getDate() + units);
      break;
    case 'hour':
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case 'minute':
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case 'second':
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      ret = undefined;
      break;
  }
  return ret;
}

export function mergeDocuments(documents) {
  const main =
    typeof documents[0] === 'string'
      ? documents[0]
      : documents[0].loc.source.body;
  const substitutions = documents.slice(1);
  const literals = [main, ...substitutions.map(() => '\n')];
  return gql.apply(null, [literals, ...substitutions]);
}

export function getResponseErrors(mutationResult) {
  const result = [];
  Object.keys(mutationResult.data).forEach(response => {
    const errors =
      mutationResult.data[response] && mutationResult.data[response].errors;
    if (errors && errors.length) {
      result.push(...errors);
    }
  });
  return result.length ? result : false;
}

export function createDefaultResponseFragments(...names) {
  const result = {};
  names.forEach(response => {
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

export function forEachError(error, callback) {
  const errors = error.errors || [error];
  errors.forEach(e => {
    console.error(e);

    let msg = '';
    if (e.translation_key) {
      msg = t(`error.${e.translation_key}`);
    } else if (error.networkError) {
      msg = t('error.network_error');
    } else {
      msg = t('error.unexpected');
    }
    callback({ error: e, msg });
  });
}

export function getErrorMessages(error) {
  const result = [];
  forEachError(error, ({ msg }) => result.push(msg));
  return result;
}

export function appendNewNodes(nodesA, nodesB) {
  return nodesA.concat(
    nodesB.filter(nodeB => !nodesA.some(nodeA => nodeA.id === nodeB.id))
  );
}

export function prependNewNodes(nodesA, nodesB) {
  return nodesB
    .filter(nodeB => !nodesA.some(nodeA => nodeA.id === nodeB.id))
    .concat(nodesA);
}

export const isTagged = (tags, which) => tags.some(t => t.tag.name === which);

export * from './url';

/**
 * getSlotFragmentSpreads will return a string in the
 * expected format for slot fragments, given `slots` and  `resource`.
 * e.g. `getSlotFragmentSpreads(['slotName'], 'root')` returns
 * `...TalkSlot_SlotName_root`.
 */
export function getSlotFragmentSpreads(slots, resource) {
  return `...${slots
    .map(s => `TalkSlot_${capitalize(s)}_${resource}`)
    .join('\n...')}\n`;
}

export function isCommentActive(commentStatus) {
  return ['NONE', 'ACCEPTED'].indexOf(commentStatus) >= 0;
}

export function isCommentDeleted(comment) {
  return (
    get(comment, 'body', null) === null ||
    get(comment, 'deleted_at', null) !== null
  );
}

export function getShallowChanges(a, b) {
  return union(Object.keys(a), Object.keys(b)).filter(key => a[key] !== b[key]);
}

// TODO: replace with something less fragile.
// NOT_REACTION_TYPES are the action summaries that are not reactions.
const NOT_REACTION_TYPES = ['FlagActionSummary', 'DontAgreeActionSummary'];

export function getTotalReactionsCount(actionSummaries) {
  return actionSummaries
    .filter(({ __typename }) => !NOT_REACTION_TYPES.includes(__typename))
    .reduce((total, { count }) => total + count, 0);
}

// Like lodash merge but does not recurse into arrays.
export function mergeExcludingArrays(objValue, srcValue) {
  if (
    typeof srcValue === 'object' &&
    !Array.isArray(srcValue) &&
    srcValue !== null
  ) {
    return assignWith({}, objValue, srcValue, mergeExcludingArrays);
  }
  return srcValue;
}

// Map nested object leaves. Array objects are considered leaves.
export function mapLeaves(o, mapper) {
  return mapValues(o, val => {
    if (typeof val === 'object' && !Array.isArray(val)) {
      return mapLeaves(val, mapper);
    }
    return mapper(val);
  });
}

export function translateError(error) {
  if (error.translation_key) {
    return t(`error.${error.translation_key}`);
  } else if (error.networkError) {
    return t('error.network_error');
  }
  return error.toString();
}

/**
 * handlePopupAuth will optionally open a popup with the requested uri if the
 * window is not already a popup.
 *
 * @param {String} uri the url to open the window? to
 * @param {String} title the title of the new window? to open
 * @param {String} features the features to use when opening a window?
 */
export function handlePopupAuth(
  uri,
  title = 'Login', // TODO: translate
  features = 'menubar=0,resizable=0,width=500,height=550,top=200,left=500'
) {
  if (window.opener) {
    window.location = uri;
  } else {
    window.open(uri, title, features);
  }
}

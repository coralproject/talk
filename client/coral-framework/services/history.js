import { browserHistory } from 'react-router';
import { useBasename } from 'history';

/**
 * createHistory returns the history service for react router
 * @param  {string}  basename  base path of the url
 * @return {Object}  histor service
 */
export function createHistory(basename) {
  if (!basename) {
    return browserHistory;
  }

  return useBasename(() => browserHistory)({
    basename,
  });
}

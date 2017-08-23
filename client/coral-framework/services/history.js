import {browserHistory} from 'react-router';
import {useBasename} from 'history';

export function createHistory(basename) {
  if (!basename) {
    return browserHistory;
  }

  return useBasename(() => browserHistory)({
    basename
  });
}

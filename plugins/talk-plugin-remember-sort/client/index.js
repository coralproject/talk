import {setSort} from 'plugin-api/beta/client/actions/stream';
import {sortOrderSelector, sortBySelector} from 'plugin-api/beta/client/selectors/stream';

const STORAGE_PATH = 'talkPluginRememberSort';

export default {
  init: ({store, storage, introspection}) => {

    // TODO: workaround as this plugin is included in any target and
    // embeds (e.g. admin), but should only be included inside the stream.

    // Detect if we are currently running inside the stream.
    if (!store.getState().stream) {
      return;
    }

    const sort = JSON.parse(storage.getItem(STORAGE_PATH));
    if (
      sort &&
      introspection.isValidEnumValue('SORT_ORDER', sort.sortOrder) &&
      introspection.isValidEnumValue('SORT_COMMENTS_BY', sort.sortBy)
    ) {
      store.dispatch(setSort(sort));
    }
    store.subscribe(() => {
      const state = store.getState();
      const sortOrder = sortOrderSelector(state);
      const sortBy = sortBySelector(state);
      if (!sort || sort.sortOrder !== sortOrder || sort.sortBy !== sortBy) {
        storage.setItem(STORAGE_PATH, JSON.stringify({sortOrder, sortBy}));
      }
    });
  }
};

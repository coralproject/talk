import translations from './translations.json';
import OffTopicTag from './components/OffTopicTag';
import OffTopicCheckbox from './containers/OffTopicCheckbox';
import OffTopicFilter from './containers/OffTopicFilter';
import isEnabled from './containers/OffTopicStatus';
import reducer from './reducer';

/**
 * coral-plugin-offtopic depends on a plugin to place the filter allowing user to show/hide off topic comments.
 * the filter is generally placed in the streamBox slot
 * the default plugin that can be used is coral-plugin-viewing-options
 */

export default {
  translations,
  reducer,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    commentInfoBar: [OffTopicTag],
    viewingOptions: [OffTopicFilter]
  },
  isEnabled
};

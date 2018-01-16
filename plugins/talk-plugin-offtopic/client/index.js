import translations from './translations.json';
import OffTopicTag from './containers/OffTopicTag';
import OffTopicFilter from './containers/OffTopicFilter';
import OffTopicCheckbox from './containers/OffTopicCheckbox';
import reducer from './reducer';

/**
 * talk-plugin-offtopic depends on talk-plugin-viewing-options
 * in other to display filter.
 */

export default {
  translations,
  reducer,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    commentInfoBar: [OffTopicTag],
    viewingOptionsFilter: [OffTopicFilter],
  },
};

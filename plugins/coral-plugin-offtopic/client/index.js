import translations from './translations.json';
import OffTopicTag from './components/OffTopicTag';
import OffTopicFilter from './containers/OffTopicFilter';
import OffTopicCheckbox from './containers/OffTopicCheckbox';
import reducer from './reducer';

/**
 * coral-plugin-offtopic depends on coral-plugin-viewing-options
 * in other to display filter and use the streamViewingOptions slot
 */

export default {
  translations,
  reducer,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    streamViewingOptions: [OffTopicFilter],
    commentInfoBar: [OffTopicTag]
  }
};

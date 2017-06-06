import translations from './translations.json';
import OffTopicTag from './components/OffTopicTag';
import OffTopicFilter from './containers/OffTopicFilter';
import OffTopicCheckbox from './containers/OffTopicCheckbox';
import reducer from './reducer';

export default {
  translations,
  reducer,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    streamViewingOptions: [OffTopicFilter],
    commentInfoBar: [OffTopicTag]
  }
};

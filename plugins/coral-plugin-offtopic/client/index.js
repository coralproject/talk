import OffTopicCheckbox from './components/OffTopicCheckbox';
import OffTopicTag from './components/OffTopicTag';
import OffTopicFilter from './components/OffTopicFilter';
import translations from './translations.json';
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

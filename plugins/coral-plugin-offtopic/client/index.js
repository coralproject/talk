import OffTopicCheckbox from './components/OffTopicCheckbox';
import OffTopicTag from './components/OffTopicTag';
import OffTopicFilter from './components/OffTopicFilter';
import translations from './translations.json';

export default {
  translations,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    streamViewingOptions: [OffTopicFilter],
    commentInfoBar: [OffTopicTag]
  }
};

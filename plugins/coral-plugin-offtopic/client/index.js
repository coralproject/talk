import OffTopicCheckbox from './components/OffTopicCheckbox';
import OffTopicTag from './components/OffTopicTag';
import translations from './translations.json';

export default {
  translations,
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    commentInfoBar: [OffTopicTag]
  }
};

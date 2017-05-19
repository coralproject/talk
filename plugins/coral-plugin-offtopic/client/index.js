import OffTopicCheckbox from './components/OffTopicCheckbox';
import OffTopicTag from './components/OffTopicTag';
import translations from './translations.json';
import {loadTranslations} from 'coral-framework/services/i18n';

loadTranslations(translations);

export default {
  slots: {
    commentInputDetailArea: [OffTopicCheckbox],
    commentInfoBar: [OffTopicTag]
  }
};

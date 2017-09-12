import ModerationActions from './containers/ModerationActions';
import translations from './translations.yml';
import reducer from './reducer';

export default {
  slots: {
    commentInfoBar: [ModerationActions],
  },
  reducer,
  translations
};

import ViewingOptions from './containers/ViewingOptions';
import reducer from './reducer';
import translations from './translations.yml';

export default {
  reducer,
  slots: {
    streamFilter: [ViewingOptions],
  },
  translations,
};

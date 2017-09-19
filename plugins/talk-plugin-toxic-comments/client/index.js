import translations from './translations.yml';
import CheckToxicityHook from './containers/CheckToxicityHook';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckToxicityHook],
  },
};

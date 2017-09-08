import translations from './translations.yml';
import CheckToxicityHook from './components/CheckToxicityHook';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckToxicityHook],
  },
};

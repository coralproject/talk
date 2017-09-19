import translations from './translations.yml';
import CheckToxicityHook from './containers/CheckToxicityHook';
import ToxicLabel from './containers/ToxicLabel';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckToxicityHook],
    adminCommentLabels: [ToxicLabel],
  },
};

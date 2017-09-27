import translations from './translations.yml';
import CheckToxicityHook from './containers/CheckToxicityHook';
import ToxicLabel from './containers/ToxicLabel';
import ToxicDetail from './containers/ToxicDetail';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckToxicityHook],
    adminCommentLabels: [ToxicLabel],
    adminCommentDetailArea: [ToxicDetail],
  },
};

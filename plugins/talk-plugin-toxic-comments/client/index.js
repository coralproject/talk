import translations from './translations.yml';
import CheckToxicityHook from './containers/CheckToxicityHook';
import ToxicLabel from './containers/ToxicLabel';
import ToxicCommentDetail from './containers/ToxicCommentDetail';
import ToxicCommentFlagDetail from './containers/ToxicCommentFlagDetail';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckToxicityHook],
    adminCommentLabels: [ToxicLabel],
    adminCommentMoreDetails: [ToxicCommentDetail],
    adminCommentMoreFlagDetails: [ToxicCommentFlagDetail],
  },
};

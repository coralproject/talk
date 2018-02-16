import translations from './translations.yml';
import CheckSpamHook from './containers/CheckSpamHook';
import SpamLabel from './containers/SpamLabel';
import SpamCommentDetail from './containers/SpamCommentDetail';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckSpamHook],
    adminCommentLabels: [SpamLabel],
    adminCommentMoreDetails: [SpamCommentDetail],
  },
};

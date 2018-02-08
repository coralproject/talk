import translations from './translations.yml';
import CheckSpamHook from './containers/CheckSpamHook';
import SpamLabel from './containers/SpamLabel';
import SpamCommentDetail from './containers/SpamCommentDetail';
import SpamCommentFlagDetail from './containers/SpamCommentFlagDetail';

export default {
  translations,
  slots: {
    commentInputDetailArea: [CheckSpamHook],
    adminCommentLabels: [SpamLabel],
    adminCommentMoreDetails: [SpamCommentDetail],
    adminCommentMoreFlagDetails: [SpamCommentFlagDetail],
  },
};

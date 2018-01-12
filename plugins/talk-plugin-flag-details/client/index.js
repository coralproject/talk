import FlagDetails from './containers/FlagDetails';
import UserFlagDetails from './containers/UserFlagDetails';
import translations from './translations.yml';

export default {
  translations,
  slots: {
    adminCommentDetailArea: [FlagDetails],
    adminCommentMoreFlagDetails: [UserFlagDetails],
  },
};

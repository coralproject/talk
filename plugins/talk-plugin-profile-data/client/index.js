import DownloadCommentHistory from './containers/DownloadCommentHistory';
import DeleteMyAccount from './containers/DeleteMyAccount';
import AccountDeletionRequestedSign from './containers/AccountDeletionRequestedSign';
import translations from './translations.yml';
import graphql from './graphql';

export default {
  slots: {
    stream: [AccountDeletionRequestedSign],
    profileSettings: [DownloadCommentHistory, DeleteMyAccount],
  },
  translations,
  ...graphql,
};

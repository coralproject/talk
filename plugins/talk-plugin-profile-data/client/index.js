import DownloadCommentHistory from './containers/DownloadCommentHistory';
import translations from './translations.yml';
import graphql from './graphql';

export default {
  slots: {
    profileSettings: [DownloadCommentHistory],
  },
  translations,
  ...graphql,
};

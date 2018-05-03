import update from 'immutability-helper';
import { createDefaultResponseFragments } from 'coral-framework/utils';

export default {
  fragments: {
    ...createDefaultResponseFragments(
      'RequestAccountDeletionResponse',
      'RequestDownloadLinkResponse',
      'CancelAccountDeletionResponse'
    ),
  },
  mutations: {
    RequestDownloadLink: () => ({
      updateQueries: {
        CoralEmbedStream_Profile: previousData =>
          update(previousData, {
            me: {
              lastAccountDownload: {
                $set: new Date().toISOString(),
              },
            },
          }),
      },
    }),
  },
};

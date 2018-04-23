import update from 'immutability-helper';

export default {
  mutations: {
    DownloadCommentHistory: () => ({
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

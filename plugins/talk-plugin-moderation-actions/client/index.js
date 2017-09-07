import ModerationActions from './containers/ModerationActions';
import translations from './translations.yml';
import update from 'immutability-helper';

export default {
  slots: {
    commentInfoBar: [ModerationActions],
  },
  translations,
  mutations: {
    SetCommentStatus: ({variables: {status, commentId}}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (prev) => {
          
          if (status !== 'REJECTED' && status !== "ACCEPTED") {
            return prev;
          }

          const updated = update(prev, {
            asset: { 
              comments: {
                nodes: {
                  $apply: (nodes) => nodes.map((node) => {
                    if (node.id === commentId) {
                      node.status = status;
                    }

                    return node;
                  })
                }
              }
            }
          });

          return updated;
        }
      }
    }),
  },
};

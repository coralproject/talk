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

          // Permalink view will retrieve only one comment.
          if (prev.asset.comment) {
            const updated = update(prev, {
              asset: {
                comment: {
                  status: {
                    $set: status
                  }
                }
              }
            });

            return updated;
          }

          // Stream View
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

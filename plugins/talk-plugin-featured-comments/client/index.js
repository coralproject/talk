import Tab from './containers/Tab';
import TabPane from './containers/TabPane';
import FeaturedTag from './components/FeaturedTag';
import FeaturedButton from './components/FeaturedButton';
import translations from './translations.json';
import update from 'immutability-helper';

import {findCommentInEmbedQuery, insertSorted} from 'plugin-api/beta/client/utils/stream';

export default {
  translations,
  slots: {
    streamTabs: [Tab],
    streamTabPanes: [TabPane],
    commentInfoBar: [FeaturedTag],
    commentReactions: [FeaturedButton]
  },
  mutations: {
    AddTag: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (previous) => {
        
          if (variables.name !== 'FEATURED') {
            return;
          }

          const comment = findCommentInEmbedQuery(previous, variables.id);

          const updated = update(previous, {
            asset: {
              featuredComments: {
                nodes: {
                  $apply: (nodes) => insertSorted(nodes, comment, 'REVERSE_CHRONOLOGICAL')
                }
              },
              featuredCommentsCount: {
                $apply: (value) => value + 1
              }
            }
          });

          return updated;
        },
      }
    }),
    RemoveTag: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (previous) => {

          if (variables.name !== 'FEATURED') {
            return;
          }

          const updated = update(previous, {
            asset: {
              featuredComments: {
                nodes: {
                  $apply: (nodes) => 
                    nodes.filter((n) => n.id !== variables.id)
                }
              },
              featuredCommentsCount: {
                $apply: (value) => value - 1
              }
            }
          });

          return updated;
        },
      }
    })
  },
};

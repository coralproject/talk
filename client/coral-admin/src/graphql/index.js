import update from 'immutability-helper';
import {mapLeaves} from 'coral-framework/utils';

export default {
  mutations: {
    SetUserStatus: ({variables: {status, userId}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {
          if (status !== 'APPROVED') {
            return prev;
          }
          const updated = update(prev, {
            users: {
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== userId)},
            },
          });
          return updated;
        }
      }
    }),
    RejectUsername: ({variables: {input: {id: userId}}})  => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {
          const updated = update(prev, {
            users: {
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== userId)},
            },
          });
          return updated;
        }
      }
    }),
    UpdateSettings: ({variables: {input}})  => ({
      updateQueries: {
        TalkAdmin_Configure: (prev) => {
          const updated = update(prev, {
            settings: mapLeaves(input, (leaf) => ({$set: leaf})),
          });
          return updated;
        }
      }
    }),
  },
};


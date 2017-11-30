import update from 'immutability-helper';
import {mapLeaves} from 'coral-framework/utils';

export default {
  mutations: {
    SetUserBanStatus: ({variables: {status, id}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {
          if (!status) {
            return prev;
          }
          const updated = update(prev, {
            users: {
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== id)},
            },
          });
          return updated;
        }
      }
    }),
    ApproveUsername: ({variables: {id}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {
          const updated = update(prev, {
            users: {
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== id)},
            },
          });
          return updated;
        }
      }
    }),
    RejectUsername: ({variables: {id: userId}})  => ({
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


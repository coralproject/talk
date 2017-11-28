import update from 'immutability-helper';
import mapValues from 'lodash/mapValues';

// Map nested object leaves. Array objects are considered leaves.
function mapLeaves(o, mapper) {
  return mapValues(o, (val) => {
    if (typeof val === 'object' && !Array.isArray(val)) {
      return mapLeaves(val, mapper);
    }
    return mapper(val);
  });
}

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
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== userId)},
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


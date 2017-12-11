import update from 'immutability-helper';
import {mapLeaves} from 'coral-framework/utils';

export default {
  mutations: {
    SetUserRole: ({variables: {id: userId, role}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {

          const updated = update(prev, {
            users: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.id === userId) {
                    node.role = role;
                  }
                  
                  return node;
                })
              },
            },
          });
          
          return updated;
        }
      }
    }),
    BanUser: ({variables: {input: {id: userId}}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {

          const updated = update(prev, {
            users: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.id === userId) {
                    node.state.status.banned.status = true;
                  }
                  
                  return node;
                })
              },
            },
          });
          
          return updated;
        }
      }
    }),
    UnBanUser: ({variables: {input: {id: userId}}}) => ({
      updateQueries: {
        TalkAdmin_Community: (prev) => {

          const updated = update(prev, {
            users: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.id === userId) {
                    node.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
          });
          
          return updated;
        },
        CoralAdmin_Moderation: (prev) => {

          const updated = update(prev, {
            new: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
            all: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
            approved: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
            premod: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
            rejected: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            },
            reported: {
              nodes: {
                $apply: (nodes) => nodes.map((node) => {
                  if (node.user.id === userId) {
                    node.user.state.status.banned.status = false;
                  }
                  
                  return node;
                })
              },
            }
          });

          return updated;
        }
      }
    }),
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


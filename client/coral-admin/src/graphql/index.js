import update from 'immutability-helper';
import {mapLeaves} from 'coral-framework/utils';
import {gql} from 'react-apollo';

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
    SuspendUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragment = gql`
        fragment Talk_UpdateUserStatus on User {
          state {
            status {
              suspension {
                until
              }
            }
          }
        }`;

        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({fragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              suspension: {
                until: {$set: new Date()}
              }
            }
          }
        });

        proxy.writeFragment({fragment, id: fragmentId, data: updated});
      }
    }),
    UnSuspendUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragment = gql`
        fragment Talk_UpdateUserStatus on User {
          state {
            status {
              suspension {
                until
              }
            }
          }
        }`;

        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({fragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              suspension: {
                until: {$set: null}
              }
            }
          }
        });

        proxy.writeFragment({fragment, id: fragmentId, data: updated});
      }
    }),
    BanUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragment = gql`
        fragment Talk_UpdateUserStatus on User {
          state {
            status {
              banned {
                status
              }
            }
          }
        }`;

        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({fragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              banned: {
                status: {$set: true}
              }
            }
          }
        });

        proxy.writeFragment({fragment, id: fragmentId, data: updated});
      }
    }),
    UnBanUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragment = gql`
        fragment Talk_UpdateUserStatus on User {
          state {
            status {
              banned {
                status
              }
            }
          }
        }`;

        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({fragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              banned: {
                status: {$set: false}
              }
            }
          }
        });

        proxy.writeFragment({fragment, id: fragmentId, data: updated});
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


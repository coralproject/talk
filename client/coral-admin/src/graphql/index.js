import update from 'immutability-helper';
import {mapLeaves} from 'coral-framework/utils';
import {gql} from 'react-apollo';

const userStatusFragment = gql`
  fragment Talk_UpdateUserStatus on User {
    state {
      status {
        banned {
          status
        }
        suspension {
          until
        }
      }
    }
  }`;

const userRoleFragment = gql`
  fragment Talk_UpdateUserRole on User {
    role
  }`;

export default {
  mutations: {
    SetUserRole: ({variables: {id, role}}) => ({
      update: (proxy) => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({fragment: userRoleFragment, id: fragmentId});

        const updated = update(data, {
          role: {
            $set: role
          }
        });

        proxy.writeFragment({fragment: userRoleFragment, id: fragmentId, data: updated});
      },
    }),
    SuspendUser: ({variables: {input: {id, until}}}) => ({
      update: (proxy) => {
        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({fragment: userStatusFragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              suspension: {
                until: {$set: until}
              }
            }
          }
        });

        proxy.writeFragment({fragment: userStatusFragment, id: fragmentId, data: updated});
      }
    }),
    UnsuspendUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({fragment: userStatusFragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              suspension: {
                until: {$set: null}
              }
            }
          }
        });

        proxy.writeFragment({fragment: userStatusFragment, id: fragmentId, data: updated});
      },
    }),
    BanUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({fragment: userStatusFragment, id: fragmentId});
        
        const updated = update(data, {
          state : {
            status: {
              banned: {
                status: {$set: true}
              }
            }
          }
        });

        proxy.writeFragment({fragment: userStatusFragment, id: fragmentId, data: updated});
      }
    }),
    UnbanUser: ({variables: {input: {id}}}) => ({
      update: (proxy) => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({fragment: userStatusFragment, id: fragmentId});

        const updated = update(data, {
          state : {
            status: {
              banned: {
                status: {$set: false}
              }
            }
          }
        });

        proxy.writeFragment({fragment: userStatusFragment, id: fragmentId, data: updated});
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
            flaggedUsers: {
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
            flaggedUsers: {
              nodes: {$apply: (nodes) => nodes.filter((node) => node.id !== userId)},
            },
          });
          return updated;
        }
      },
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

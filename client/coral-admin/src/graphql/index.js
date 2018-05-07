import update from 'immutability-helper';
import { mapLeaves } from 'coral-framework/utils';
import { gql } from 'react-apollo';
import get from 'lodash/get';

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
  }
`;

const userRoleFragment = gql`
  fragment Talk_UpdateUserRole on User {
    role
  }
`;

export default {
  mutations: {
    SetUserRole: ({ variables: { id, role } }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userRoleFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          role: {
            $set: role,
          },
        });

        proxy.writeFragment({
          fragment: userRoleFragment,
          id: fragmentId,
          data: updated,
        });
      },
    }),
    SuspendUser: ({ variables: { input: { id, until } } }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;

        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              suspension: {
                until: { $set: until },
              },
            },
          },
        });

        proxy.writeFragment({
          fragment: userStatusFragment,
          id: fragmentId,
          data: updated,
        });
      },
    }),
    UnsuspendUser: ({ variables: { input: { id } } }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              suspension: {
                until: { $set: null },
              },
            },
          },
        });

        proxy.writeFragment({
          fragment: userStatusFragment,
          id: fragmentId,
          data: updated,
        });
      },
    }),
    BanUser: ({ variables: { input: { id } } }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              banned: {
                status: { $set: true },
              },
            },
          },
        });

        proxy.writeFragment({
          fragment: userStatusFragment,
          id: fragmentId,
          data: updated,
        });
      },
    }),
    UnbanUser: ({ variables: { input: { id } } }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              banned: {
                status: { $set: false },
              },
            },
          },
        });

        proxy.writeFragment({
          fragment: userStatusFragment,
          id: fragmentId,
          data: updated,
        });
      },
    }),
    SetUserBanStatus: ({ variables: { status, id } }) => ({
      updateQueries: {
        TalkAdmin_Community: prev => {
          if (!status) {
            return prev;
          }
          const updated = update(prev, {
            users: {
              nodes: { $apply: nodes => nodes.filter(node => node.id !== id) },
            },
          });
          return updated;
        },
      },
    }),
    ApproveUsername: ({ variables: { id } }) => ({
      optimisticResponse: {
        approveUsername: {
          __typename: 'ApproveUsernameResponse',
          errors: null,
          isOptimistic: true,
        },
      },
      updateQueries: {
        TalkAdmin_Community_FlaggedAccounts: (prev, { mutationResult }) => {
          const decrement = {
            flaggedUsernamesCount: { $apply: count => count - 1 },
          };

          // Remove from list after the mutation was "really" completed.
          if (get(mutationResult, 'data.approveUsername.isOptimistic')) {
            return update(prev, decrement);
          }

          const updated = update(prev, {
            ...decrement,
            flaggedUsers: {
              nodes: { $apply: nodes => nodes.filter(node => node.id !== id) },
            },
          });
          return updated;
        },
      },
      update: proxy => {
        proxy.writeFragment({
          fragment: gql`
            fragment Talk_ApproveUsername on User {
              state {
                status {
                  username {
                    status
                  }
                }
              }
            }
          `,
          id: `User_${id}`,
          data: {
            __typename: 'User',
            state: {
              __typename: 'UserState',
              status: {
                __typename: 'UserStatus',
                username: {
                  __typename: 'UsernameStatus',
                  status: 'APPROVED',
                },
              },
            },
          },
        });
      },
    }),
    RejectUsername: ({ variables: { id } }) => ({
      optimisticResponse: {
        rejectUsername: {
          __typename: 'RejectUsernameResponse',
          errors: null,
          isOptimistic: true,
        },
      },
      updateQueries: {
        TalkAdmin_Community_FlaggedAccounts: (prev, { mutationResult }) => {
          const decrement = {
            flaggedUsernamesCount: { $apply: count => count - 1 },
          };

          // Remove from list after the mutation was "really" completed.
          if (get(mutationResult, 'data.rejectUsername.isOptimistic')) {
            return update(prev, decrement);
          }

          const updated = update(prev, {
            ...decrement,
            flaggedUsers: {
              nodes: {
                $apply: nodes => nodes.filter(node => node.id !== id),
              },
            },
          });
          return updated;
        },
      },
      update: proxy => {
        proxy.writeFragment({
          fragment: gql`
            fragment Talk_RejectUsername on User {
              state {
                status {
                  username {
                    status
                  }
                }
              }
            }
          `,
          id: `User_${id}`,
          data: {
            __typename: 'User',
            state: {
              __typename: 'UserState',
              status: {
                __typename: 'UserStatus',
                username: {
                  __typename: 'UsernameStatus',
                  status: 'REJECTED',
                },
              },
            },
          },
        });
      },
    }),
    UpdateSettings: ({ variables: { input } }) => ({
      updateQueries: {
        TalkAdmin_Configure: prev => {
          const updated = update(prev, {
            settings: mapLeaves(input, leaf => ({ $set: leaf })),
          });
          return updated;
        },
      },
    }),
    SetCommentStatus: ({ variables: { status } }) => ({
      updateQueries: {
        CoralAdmin_UserDetail: prev => {
          const increment = {
            rejectedComments: {
              $apply: count => (count < prev.totalComments ? count + 1 : count),
            },
          };

          const decrement = {
            rejectedComments: {
              $apply: count => (count > 0 ? count - 1 : 0),
            },
          };

          // If rejected then increment rejectedComments by one
          if (status === 'REJECTED') {
            const updated = update(prev, increment);
            return updated;
          }

          // If approved then decrement rejectedComments by one
          if (status === 'ACCEPTED') {
            const updated = update(prev, decrement);
            return updated;
          }

          return prev;
        },
      },
    }),
  },
};

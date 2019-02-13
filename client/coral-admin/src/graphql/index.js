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
        alwaysPremod {
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

/**
 * calculateReliability will determine the reliability of a karma score based on
 * the settings for the karma type.
 *
 * @param {Number} karma - the current karma value/score for the given user
 * @param {Object} thresholds - the karma thresholds to base the karma computation on
 */
const calculateReliability = (karma, { reliable, unreliable }) => {
  if (karma >= reliable) {
    return true;
  }

  if (karma <= unreliable) {
    return false;
  }

  return null;
};

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
    SuspendUser: ({
      variables: {
        input: { id, until },
      },
    }) => ({
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
    UnsuspendUser: ({
      variables: {
        input: { id },
      },
    }) => ({
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
    AlwaysPremodUser: ({
      variables: {
        input: { id },
      },
    }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              alwaysPremod: {
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
    RemoveAlwaysPremodUser: ({
      variables: {
        input: { id },
      },
    }) => ({
      update: proxy => {
        const fragmentId = `User_${id}`;
        const data = proxy.readFragment({
          fragment: userStatusFragment,
          id: fragmentId,
        });

        const updated = update(data, {
          state: {
            status: {
              alwaysPremod: {
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
    BanUser: ({
      variables: {
        input: { id },
      },
    }) => ({
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
    SetUserAlwaysPremodStatus: ({ variables: { status, id } }) => ({
      updateQueries: {
        TalkAdmin_Community: prev => {
          if (!status) {
            return prev;
          }
          const updated = update(prev, {
            users: {
              nodes: {
                $apply: nodes => nodes.filter(node => node.id !== id),
              },
            },
          });
          return updated;
        },
      },
    }),
    UnbanUser: ({
      variables: {
        input: { id },
      },
    }) => ({
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
              nodes: {
                $apply: nodes => nodes.filter(node => node.id !== id),
              },
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
          // No need to update, when user was not in the flagged users queue.
          // TODO: this should be more generic, e.g. looking at the history.
          if (!prev.flaggedUsers.nodes.find(node => node.id === id)) {
            return prev;
          }

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
              nodes: {
                $apply: nodes => nodes.filter(node => node.id !== id),
              },
            },
          });
          return updated;
        },
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
          // No need to update, when user was not in the flagged users queue.
          // TODO: this should be more generic, e.g. looking at the history.
          if (!prev.flaggedUsers.nodes.find(node => node.id === id)) {
            return prev;
          }

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
            user: {
              reliable: {
                commenter: {
                  $set: calculateReliability(
                    prev.user.reliable.commenterKarma - 1,
                    prev.settings.karmaThresholds.comment
                  ),
                },
                commenterKarma: {
                  $apply: count => count - 1,
                },
              },
            },
            rejectedComments: {
              $apply: count => (count < prev.totalComments ? count + 1 : count),
            },
          };

          const decrement = {
            user: {
              reliable: {
                commenter: {
                  $set: calculateReliability(
                    prev.user.reliable.commenterKarma + 1,
                    prev.settings.karmaThresholds.comment
                  ),
                },
                commenterKarma: {
                  $apply: count => count + 1,
                },
              },
            },
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

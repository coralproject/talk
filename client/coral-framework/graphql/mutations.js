import { gql } from 'react-apollo';
import withMutation from '../hocs/withMutation';

function convertItemType(item_type) {
  switch (item_type) {
    case 'COMMENTS':
      return 'Comment';
    case 'USERS':
      return 'User';
    case 'ASSETS':
      return 'Asset';
    default:
      throw new Error(`Unknown item_type ${item_type}`);
  }
}

function getTagFragment(item_type) {
  return gql`
    fragment Coral_UpdateFragment on ${convertItemType(item_type)} {
      tags {
        tag {
          name
        }
      }
    }
  `;
}

export const withAddTag = withMutation(
  gql`
    mutation AddTag(
      $id: ID!
      $asset_id: ID!
      $name: String!
      $item_type: TAGGABLE_ITEM_TYPE!
    ) {
      addTag(
        tag: {
          name: $name
          id: $id
          item_type: $item_type
          asset_id: $asset_id
        }
      ) {
        ...ModifyTagResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      addTag: ({ id, name, assetId, itemType }) => {
        return mutate({
          variables: {
            id,
            name,
            asset_id: assetId,
            item_type: itemType,
          },
          optimisticResponse: {
            addTag: {
              __typename: 'ModifyTagResponse',
              errors: null,
            },
          },
          update: proxy => {
            const fragmentId = `${convertItemType(itemType)}_${id}`;
            const fragment = getTagFragment(itemType);

            // Read the data from our cache for this query.
            const data = proxy.readFragment({ fragment, id: fragmentId });

            data.tags.push({
              tag: {
                __typename: 'Tag',
                name,
              },
              __typename: 'TagLink',
            });

            // Write our data back to the cache.
            proxy.writeFragment({ fragment, id: fragmentId, data });
          },
        });
      },
    }),
  }
);

export const withRemoveTag = withMutation(
  gql`
    mutation RemoveTag(
      $id: ID!
      $asset_id: ID!
      $name: String!
      $item_type: TAGGABLE_ITEM_TYPE!
    ) {
      removeTag(
        tag: {
          name: $name
          id: $id
          item_type: $item_type
          asset_id: $asset_id
        }
      ) {
        ...ModifyTagResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      removeTag: ({ id, name, assetId, itemType }) => {
        return mutate({
          variables: {
            id,
            name,
            asset_id: assetId,
            item_type: itemType,
          },
          optimisticResponse: {
            removeTag: {
              __typename: 'ModifyTagResponse',
              errors: null,
            },
          },
          update: proxy => {
            const fragmentId = `${convertItemType(itemType)}_${id}`;
            const fragment = getTagFragment(itemType);

            // Read the data from our cache for this query.
            const data = proxy.readFragment({ fragment, id: fragmentId });

            const idx = data.tags.findIndex(i => i.tag.name === name);

            data.tags = [
              ...data.tags.slice(0, idx),
              ...data.tags.slice(idx + 1),
            ];

            // Write our data back to the cache.
            proxy.writeFragment({ fragment, id: fragmentId, data });
          },
        });
      },
    }),
  }
);

export const withSetCommentStatus = withMutation(
  gql`
    mutation SetCommentStatus($commentId: ID!, $status: COMMENT_STATUS!) {
      setCommentStatus(id: $commentId, status: $status) {
        ...SetCommentStatusResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      setCommentStatus: ({ commentId, status }) => {
        return mutate({
          variables: {
            commentId,
            status,
          },
          optimisticResponse: {
            setCommentStatus: {
              __typename: 'SetCommentStatusResponse',
              errors: null,
            },
          },
          update: proxy => {
            const fragment = gql`
              fragment Talk_SetCommentStatus_Comment on Comment {
                status
                status_history {
                  type
                }
              }
            `;

            const fragmentId = `Comment_${commentId}`;

            const data = proxy.readFragment({ fragment, id: fragmentId });

            data.status = status;

            data.status_history = data.status_history
              ? data.status_history
              : [];

            data.status_history.push({
              __typename: 'CommentStatusHistory',
              type: status,
            });

            proxy.writeFragment({ fragment, id: fragmentId, data });
          },
        });
      },
    }),
  }
);

export const withSuspendUser = withMutation(
  gql`
    mutation SuspendUser($input: SuspendUserInput!) {
      suspendUser(input: $input) {
        ...SuspendUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      suspendUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withUnsuspendUser = withMutation(
  gql`
    mutation UnsuspendUser($input: UnsuspendUserInput!) {
      unsuspendUser(input: $input) {
        ...UnsuspendUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      unsuspendUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

const SetUsernameStatusFragment = gql`
  fragment Talk_SetUsernameStatus on User {
    state {
      status {
        username {
          status
        }
      }
    }
  }
`;

export const withApproveUsername = withMutation(
  gql`
    mutation ApproveUsername($id: ID!) {
      approveUsername(id: $id) {
        ...SetUsernameStatusResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      approveUsername: id => {
        return mutate({
          variables: {
            id,
          },
          update: proxy => {
            const fragmentId = `User_${id}`;
            const data = {
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
            };
            proxy.writeFragment({
              fragment: SetUsernameStatusFragment,
              id: fragmentId,
              data,
            });
          },
        });
      },
    }),
  }
);

export const withRejectUsername = withMutation(
  gql`
    mutation RejectUsername($id: ID!) {
      rejectUsername(id: $id) {
        ...SetUsernameStatusResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      rejectUsername: id => {
        return mutate({
          variables: {
            id,
          },
          update: proxy => {
            const fragmentId = `User_${id}`;
            const data = {
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
            };
            proxy.writeFragment({
              fragment: SetUsernameStatusFragment,
              id: fragmentId,
              data,
            });
          },
        });
      },
    }),
  }
);

const SetUsernameFragment = gql`
  fragment Talk_SetUsername on User {
    username
  }
`;

export const withChangeUsername = withMutation(
  gql`
    mutation ChangeUsername($id: ID!, $username: String!) {
      changeUsername(id: $id, username: $username) {
        ...ChangeUsernameResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      changeUsername: (id, username) => {
        return mutate({
          variables: {
            id,
            username,
          },
          update: proxy => {
            const fragmentId = `User_${id}`;
            const data = {
              __typename: 'User',
              username,
            };
            proxy.writeFragment({
              fragment: SetUsernameFragment,
              id: fragmentId,
              data,
            });
          },
        });
      },
    }),
  }
);

export const withSetUsername = withMutation(
  gql`
    mutation SetUsername($id: ID!, $username: String!) {
      setUsername(id: $id, username: $username) {
        ...SetUsernameResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      setUsername: (id, username) => {
        return mutate({
          variables: {
            id,
            username,
          },
          update: proxy => {
            const fragmentId = `User_${id}`;
            const data = {
              __typename: 'User',
              username,
            };
            proxy.writeFragment({
              fragment: SetUsernameFragment,
              id: fragmentId,
              data,
            });
          },
        });
      },
    }),
  }
);

export const withAlwaysPremodUser = withMutation(
  gql`
    mutation AlwaysPremodUser($input: AlwaysPremodUserInput!) {
      alwaysPremodUser(input: $input) {
        ...AlwaysPremodUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      alwaysPremodUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withRemoveAlwaysPremodUser = withMutation(
  gql`
    mutation RemoveAlwaysPremodUser($input: RemoveAlwaysPremodUserInput!) {
      removeAlwaysPremodUser(input: $input) {
        ...RemoveAlwaysPremodUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      removeAlwaysPremodUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withBanUser = withMutation(
  gql`
    mutation BanUser($input: BanUserInput!) {
      banUser(input: $input) {
        ...BanUsersResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      banUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withUnbanUser = withMutation(
  gql`
    mutation UnbanUser($input: UnbanUserInput!) {
      unbanUser(input: $input) {
        ...UnbanUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      unbanUser: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withSetUserRole = withMutation(
  gql`
    mutation SetUserRole($id: ID!, $role: USER_ROLES!) {
      setUserRole(id: $id, role: $role) {
        ...SetUserRoleResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      setUserRole: (id, role) => {
        return mutate({
          variables: {
            id,
            role,
          },
        });
      },
    }),
  }
);

export const withPostComment = withMutation(
  gql`
    mutation PostComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        ...CreateCommentResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      postComment: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withEditComment = withMutation(
  gql`
    mutation EditComment($id: ID!, $asset_id: ID!, $edit: EditCommentInput) {
      editComment(id: $id, asset_id: $asset_id, edit: $edit) {
        ...EditCommentResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      editComment: (id, asset_id, edit) => {
        return mutate({
          variables: {
            id,
            asset_id,
            edit,
          },
        });
      },
    }),
  }
);

export const withPostFlag = withMutation(
  gql`
    mutation PostFlag($flag: CreateFlagInput!) {
      createFlag(flag: $flag) {
        ...CreateFlagResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      postFlag: flag => {
        return mutate({
          variables: {
            flag,
          },
        });
      },
    }),
  }
);

export const withPostDontAgree = withMutation(
  gql`
    mutation CreateDontAgree($dontagree: CreateDontAgreeInput!) {
      createDontAgree(dontagree: $dontagree) {
        ...CreateDontAgreeResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      postDontAgree: dontagree => {
        return mutate({
          variables: {
            dontagree,
          },
        });
      },
    }),
  }
);

export const withDeleteAction = withMutation(
  gql`
    mutation DeleteAction($id: ID!) {
      deleteAction(id: $id) {
        ...DeleteActionResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      deleteAction: id => {
        return mutate({
          variables: {
            id,
          },
        });
      },
    }),
  }
);

export const withIgnoreUser = withMutation(
  gql`
    mutation IgnoreUser($id: ID!) {
      ignoreUser(id: $id) {
        ...IgnoreUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      ignoreUser: id => {
        return mutate({
          variables: {
            id,
          },
        });
      },
    }),
  }
);

export const withStopIgnoringUser = withMutation(
  gql`
    mutation StopIgnoringUser($id: ID!) {
      stopIgnoringUser(id: $id) {
        ...StopIgnoringUserResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      stopIgnoringUser: ({ id }) => {
        return mutate({
          variables: {
            id,
          },
        });
      },
    }),
  }
);

export const withUpdateSettings = withMutation(
  gql`
    mutation UpdateSettings($input: UpdateSettingsInput!) {
      updateSettings(input: $input) {
        ...UpdateSettingsResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      updateSettings: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withChangePassword = withMutation(
  gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
      changePassword(input: $input) {
        ...ChangePasswordResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      changePassword: input => {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }
);

export const withUpdateAssetSettings = withMutation(
  gql`
    mutation UpdateAssetSettings($id: ID!, $input: AssetSettingsInput!) {
      updateAssetSettings(id: $id, input: $input) {
        ...UpdateAssetSettingsResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      updateAssetSettings: (id, input) => {
        return mutate({
          variables: {
            id,
            input,
          },
          optimisticResponse: {
            updateAssetSettings: {
              __typename: 'UpdateAssetSettingsResponse',
              errors: null,
            },
          },
        });
      },
    }),
  }
);

export const withUpdateAssetStatus = withMutation(
  gql`
    mutation UpdateAssetStatus($id: ID!, $input: UpdateAssetStatusInput!) {
      updateAssetStatus(id: $id, input: $input) {
        ...UpdateAssetStatusResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      updateAssetStatus: (id, input) => {
        return mutate({
          variables: {
            id,
            input,
          },
          optimisticResponse: {
            updateAssetStatus: {
              __typename: 'UpdateAssetStatusResponse',
              errors: null,
            },
          },
          update: proxy => {
            if (input.closedAt !== undefined) {
              const fragment = gql`
                fragment Talk_UpdateAssetStatusResponse on Asset {
                  closedAt
                  isClosed
                }
              `;

              const fragmentId = `Asset_${id}`;
              const data = {
                __typename: 'Asset',
                closedAt: input.closedAt,
                isClosed:
                  !!input.closedAt &&
                  new Date(input.closedAt).getTime() <= new Date().getTime(),
              };
              proxy.writeFragment({ fragment, id: fragmentId, data });
            }
          },
        });
      },
    }),
  }
);

export const withCloseAsset = withMutation(
  gql`
    mutation CloseAsset($id: ID!) {
      closeAsset(id: $id) {
        ...CloseAssetResponse
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      closeAsset: id => {
        return mutate({
          variables: {
            id,
          },
          optimisticResponse: {
            closeAsset: {
              __typename: 'CloseAssetResponse',
              errors: null,
            },
          },
          update: proxy => {
            const fragment = gql`
              fragment Talk_CloseAssetResponse on Asset {
                closedAt
                isClosed
              }
            `;

            const fragmentId = `Asset_${id}`;
            const data = {
              __typename: 'Asset',
              closedAt: new Date().toISOString(),
              isClosed: true,
            };
            proxy.writeFragment({ fragment, id: fragmentId, data });
          },
        });
      },
    }),
  }
);

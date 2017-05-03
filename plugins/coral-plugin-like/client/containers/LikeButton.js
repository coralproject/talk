import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql, graphql } from 'react-apollo';
import LikeButton from '../components/LikeButton';
import withFragments from 'coral-framework/hocs/withFragments';
import { showSignInDialog } from 'coral-framework/actions/auth';

const isLikeAction = a => a.__typename === 'LikeActionSummary';

const COMMENT_FRAGMENT = gql`
  fragment LikeButton_updateFragment on Comment {
    action_summaries {
      ... on LikeActionSummary {
        count
        current_user {
          id
        }
      }
    }
  }
`;

const withDeleteAction = graphql(
  gql`
  mutation deleteAction($id: ID!) {
      deleteAction(id:$id) {
        errors {
          translation_key
        }
      }
  }
`,
  {
    props: ({ mutate }) => ({
      deleteAction: (id, commentId) => {
        return mutate({
          variables: { id },
          optimisticResponse: {
            deleteAction: {
              __typename: 'DeleteActionResponse',
              errors: null
            }
          },
          update: proxy => {
            const fragmentId = `Comment_${commentId}`;

            // Read the data from our cache for this query.
            const data = proxy.readFragment({
              fragment: COMMENT_FRAGMENT,
              id: fragmentId
            });

            // Check whether we liked this comment.
            const idx = data.action_summaries.findIndex(isLikeAction);
            if (
              idx < 0 ||
              get(data.action_summaries[idx], 'current_user.id') !== id
            ) {
              return;
            }

            data.action_summaries[idx] = {
              ...data.action_summaries[idx],
              count: data.action_summaries[idx].count - 1,
              current_user: null
            };

            // Write our data back to the cache.
            proxy.writeFragment({
              fragment: COMMENT_FRAGMENT,
              id: fragmentId,
              data
            });
          }
        });
      }
    })
  }
);

const withPostLike = graphql(
  gql`
  mutation createLike($like: CreateLikeInput!) {
    createLike(like: $like) {
      like {
        id
      }
      errors {
        translation_key
      }
    }
  }
`,
  {
    props: ({ mutate }) => ({
      postLike: like => {
        return mutate({
          variables: { like },
          optimisticResponse: {
            createLike: {
              __typename: 'CreateLikeResponse',
              errors: null,
              like: {
                __typename: 'LikeAction',
                id: 'pending'
              }
            }
          },
          update: (proxy, mutationResult) => {
            const fragmentId = `Comment_${like.item_id}`;

            // Read the data from our cache for this query.
            const data = proxy.readFragment({
              fragment: COMMENT_FRAGMENT,
              id: fragmentId
            });

            // Add our comment from the mutation to the end.
            let idx = data.action_summaries.findIndex(isLikeAction);

            // Check whether we already liked this comment.
            if (idx >= 0 && data.action_summaries[idx].current_user) {
              return;
            }

            if (idx < 0) {
              // Add initial action when it doesn't exist.
              data.action_summaries.push({
                __typename: 'LikeActionSummary',
                count: 0,
                current_user: null
              });
              idx = data.action_summaries.length - 1;
            }

            data.action_summaries[idx] = {
              ...data.action_summaries[idx],
              count: data.action_summaries[idx].count + 1,
              current_user: mutationResult.data.createLike.like
            };

            // Write our data back to the cache.
            proxy.writeFragment({
              fragment: COMMENT_FRAGMENT,
              id: fragmentId,
              data
            });
          }
        });
      }
    })
  }
);

const mapDispatchToProps = dispatch =>
  bindActionCreators({ showSignInDialog }, dispatch);

const enhance = compose(
  withFragments({
    root: gql`
      fragment LikeButton_root on RootQuery {
        me {
          status
        }
      }
    `,
    comment: gql`
      fragment LikeButton_comment on Comment {
        action_summaries {
          ... on LikeActionSummary {
            count
            current_user {
              id
            }
          }
        }
      }`
  }),
  connect(null, mapDispatchToProps),
  withDeleteAction,
  withPostLike
);

export default enhance(LikeButton);

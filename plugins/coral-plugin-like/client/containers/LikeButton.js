import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import get from 'lodash/get';
import withFragments from 'coral-framework/hocs/withFragments';
import {showSignInDialog} from 'coral-framework/actions/auth';
import RespectButton from '../components/LikeButton';

const isRespectAction = (a) => a.__typename === 'RespectActionSummary';

const COMMENT_FRAGMENT = gql`
  fragment RespectButton_updateFragment on Comment {
    action_summaries {
      ... on RespectActionSummary {
        count
        current_user {
          id
        }
      }
    }
  }
`;

const withDeleteAction = graphql(gql`
  mutation deleteAction($id: ID!) {
      deleteAction(id:$id) {
        errors {
          translation_key
        }
      }
  }
`, {
  props: ({mutate}) => ({
    deleteAction: (id, commentId) => {
      return mutate({
        variables: {id},
        optimisticResponse: {
          deleteAction: {
            __typename: 'DeleteActionResponse',
            errors: null,
          }
        },
        update: (proxy) => {
          const fragmentId = `Comment_${commentId}`;

          // Read the data from our cache for this query.
          const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

          // Check whether we respected this comment.
          const idx = data.action_summaries.findIndex(isRespectAction);
          if (idx < 0 || get(data.action_summaries[idx], 'current_user.id') !== id) {
            return;
          }

          data.action_summaries[idx] = {
            ...data.action_summaries[idx],
            count: data.action_summaries[idx].count - 1,
            current_user: null,
          };

          // Write our data back to the cache.
          proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
        },
      });
    },
  }),
});

const withPostRespect = graphql(gql`
  mutation createRespect($respect: CreateRespectInput!) {
    createRespect(respect: $respect) {
      respect {
        id
      }
      errors {
        translation_key
      }
    }
  }
`, {
  props: ({mutate}) => ({
    postRespect: (respect) => {
      return mutate({
        variables: {respect},
        optimisticResponse: {
          createRespect: {
            __typename: 'CreateRespectResponse',
            errors: null,
            respect: {
              __typename: 'RespectAction',
              id: 'pending',
            },
          }
        },
        update: (proxy, mutationResult) => {
          const fragmentId = `Comment_${respect.item_id}`;

          // Read the data from our cache for this query.
          const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

          // Add our comment from the mutation to the end.
          let idx = data.action_summaries.findIndex(isRespectAction);

          // Check whether we already respected this comment.
          if (idx >= 0 && data.action_summaries[idx].current_user) {
            return;
          }

          if (idx < 0) {

            // Add initial action when it doesn't exist.
            data.action_summaries.push({
              __typename: 'RespectActionSummary',
              count: 0,
              current_user: null,
            });
            idx = data.action_summaries.length - 1;
          }

          data.action_summaries[idx] = {
            ...data.action_summaries[idx],
            count: data.action_summaries[idx].count + 1,
            current_user: mutationResult.data.createRespect.respect,
          };

          // Write our data back to the cache.
          proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
        },
      });
    },
  }),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog}, dispatch);

const enhance = compose(
  withFragments({
    root: gql`
      fragment RespectButton_root on RootQuery {
        me {
          status
        }
      }
    `,
    comment: gql`
      fragment RespectButton_comment on Comment {
        action_summaries {
          ... on RespectActionSummary {
            count
            current_user {
              id
            }
          }
        }
      }`,
  }),
  connect(null, mapDispatchToProps),
  withDeleteAction,
  withPostRespect,
);

export default enhance(RespectButton);

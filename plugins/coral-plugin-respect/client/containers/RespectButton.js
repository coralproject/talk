import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import get from 'lodash/get';

import {showSignInDialog} from 'coral-framework/actions/auth';
import RespectButton from '../components/RespectButton';

export const RESPECT_QUERY = gql`
  query RespectQuery($commentId: ID!) {
    comment(id: $commentId) {
      id
      action_summaries {
        ... on RespectActionSummary {
          count
          current_user {
            id
          }
        }
      }
    }
    me {
      status
    }
  }
`;

const withQuery = graphql(RESPECT_QUERY);

function getRefetchTarget(props) {
  return {
    query: RESPECT_QUERY,
    variables: {
      commentId: props.commentId,
    },
  };
}

const withDeleteAction = graphql(gql`
  mutation deleteAction($id: ID!) {
      deleteAction(id:$id) {
        errors {
          translation_key
        }
      }
  }
`, {
  options: (props) => ({
    refetchQueries: [getRefetchTarget(props)],
  }),
  props: ({mutate}) => ({
    deleteAction: (id) => {
      return mutate({
        variables: {id},
        optimisticResponse: {
          deleteAction: {
            __typename: 'DeleteActionResponse',
            errors: null,
          }
        },
        updateQueries: {
          CommentQuery: (prev) => {
            if (get(prev, 'comment.action_summaries.0.current_user.id') !== id) {
              return prev;
            }
            const next = {
              ...prev,
              comment: {
                ...prev.comment,
                action_summaries: [{
                  __typename: 'RespectActionSummary',
                  count: prev.comment.action_summaries[0].count - 1,
                  current_user: null,
                }],
              }
            };
            return next;
          },
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
  options: (props) => ({
    refetchQueries: [getRefetchTarget(props)],
  }),
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
        updateQueries: {
          CommentQuery: (prev, {mutationResult, queryVariables}) => {
            if (queryVariables.commentId !== respect.item_id) {
              return prev;
            }
            const respectAction = mutationResult.data.createRespect.respect;
            const count = prev.action_summaries ? prev.action_summaries.count : 0;
            const next = {
              ...prev,
              comment: {
                ...prev.comment,
                action_summaries: [{
                  __typename: 'RespectActionSummary',
                  count: count + 1,
                  current_user: respectAction,
                }],
              }
            };
            return next;
          },
        },
      });
    },
  }),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog}, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withDeleteAction,
  withPostRespect,
  withQuery,
);

export default enhance(RespectButton);


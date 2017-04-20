import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import get from 'lodash/get';

import {showSignInDialog} from 'coral-framework/actions/auth';
import RespectButton from '../components/RespectButton';

// TODO: use `update` instead of `updateQueries` for optimistic mutations.
// See https://dev-blog.apollodata.com/apollo-clients-new-imperative-store-api-6cb69318a1e3
// and https://github.com/apollographql/apollo-client/issues/1224

const isRespectAction = (a) => a.__typename === 'RespectActionSummary';

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
          RespectQuery: (prev) => {
            const action_summaries = prev.comment.action_summaries;
            const idx = action_summaries.findIndex(isRespectAction);
            if (idx < 0 || get(action_summaries[idx], 'current_user.id') !== id) {
              return prev;
            }
            const next = {
              ...prev,
              comment: {
                ...prev.comment,
                action_summaries: action_summaries.map(
                  (a, i) => i !== idx ? a : ({
                    ...a,
                    count: a.count - 1,
                    current_user: null,
                  })),
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
          RespectQuery: (prev, {mutationResult, queryVariables}) => {
            if (queryVariables.commentId !== respect.item_id) {
              return prev;
            }

            let action_summaries = prev.comment.action_summaries;
            let idx = action_summaries.findIndex(isRespectAction);

            // Check whether we already respected this comment.
            if (idx >= 0 && action_summaries[idx].current_user) {
              return prev;
            }

            if (idx < 0) {

              // Add initial action when it doesn't exist.
              action_summaries = action_summaries.concat([{
                __typename: 'RespectActionSummary',
                count: 0,
                current_user: null,
              }]);
              idx = action_summaries.length - 1;
            }

            const respectAction = mutationResult.data.createRespect.respect;
            const next = {
              ...prev,
              comment: {
                ...prev.comment,
                action_summaries: action_summaries.map(
                  (a, i) => i !== idx ? a : ({
                    ...a,
                    count: a.count + 1,
                    current_user: respectAction,
                  })),
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


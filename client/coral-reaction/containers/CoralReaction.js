import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql, graphql} from 'react-apollo';
import CoralReaction from '../components/CoralReaction';
import withFragments from 'coral-framework/hocs/withFragments';
import {showSignInDialog} from 'coral-framework/actions/auth';
import {capitalize} from '../helpers';

const name = 'love';

const isReaction = a => a.__typename === `${capitalize(name)}ActionSummary`;

const COMMENT_FRAGMENT = gql`
    fragment ${capitalize(name)}Button_updateFragment on Comment {
        action_summaries {
            ... on ${capitalize(name)}ActionSummary {
                count
                current_user {
                    id
                }
            }
        }
    }
`;

const withDeleteReaction = graphql(
  gql`
      mutation deleteReaction($id: ID!) {
          deleteAction(id:$id) {
              errors {
                  translation_key
              }
          }
      }
  `,
  {
    props: ({mutate}) => ({
      deleteReaction: (id, commentId) => {
        return mutate({
          variables: {id},
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
            const idx = data.action_summaries.findIndex(isReaction);
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

const withPostReaction = graphql(
  gql`
      mutation create${capitalize(name)}($${name}: Create${capitalize(name)}Input!) {
          create${capitalize(name)}(${name}: $${capitalize(name)}) {
              ${name} {
                  id
              }
              errors {
                  translation_key
              }
          }
      }
  `,
  {
    props: ({mutate}) => ({
      postReaction: reaction => {
        return mutate({
          variables: {reaction},
          optimisticResponse: {
            [`create${capitalize(name)}`]: {
              __typename: `Create${capitalize(name)}Response`,
              errors: null,
              [name]: {
                __typename: `${capitalize(name)}Action`,
                id: 'pending'
              }
            }
          },
          update: (proxy, mutationResult) => {
            const fragmentId = `Comment_${reaction.item_id}`;

            // Read the data from our cache for this query.
            const data = proxy.readFragment({
              fragment: COMMENT_FRAGMENT,
              id: fragmentId
            });

            // Add our comment from the mutation to the end.
            let idx = data.action_summaries.findIndex(isReaction);

            // Check whether we already reactioned this comment.
            if (idx >= 0 && data.action_summaries[idx].current_user) {
              return;
            }

            if (idx < 0) {
              // Add initial action when it doesn't exist.
              data.action_summaries.push({
                __typename: `${capitalize(name)}ActionSummary`,
                count: 0,
                current_user: null
              });
              idx = data.action_summaries.length - 1;
            }

            data.action_summaries[idx] = {
              ...data.action_summaries[idx],
              count: data.action_summaries[idx].count + 1,
              current_user: mutationResult.data[`create${capitalize(name)}`][name]
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
  bindActionCreators({showSignInDialog}, dispatch);

const enhance = compose(
  withFragments({
    root: gql`
        fragment ${capitalize(name)}Button_root on RootQuery {
            me {
                status
            }
        }
    `,
    comment: gql`
        fragment ${capitalize(name)}Button_comment on Comment {
            action_summaries {
                ... on ${capitalize(name)}ActionSummary {
                    count
                    current_user {
                        id
                    }
                }
            }
        }`
  }),
  connect(null, mapDispatchToProps),
  withDeleteReaction,
  withPostReaction
);

export default enhance(CoralReaction);

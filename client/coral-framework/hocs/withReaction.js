import React from 'react';
import get from 'lodash/get';
import uuid from 'uuid/v4';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql, graphql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import {showSignInDialog} from 'coral-framework/actions/auth';
import {capitalize} from 'coral-framework/helpers/strings';
import {getMyActionSummary, getTotalActionCount} from 'coral-framework/utils';

export default reaction => WrappedComponent => {
  if (typeof reaction !== 'string') {
    console.error('Reaction must be a valid string');
    return null;
  }

  reaction = reaction.toLowerCase();

  class WithReactions extends React.Component {
    render() {
      const {comment} = this.props;

      const reactionSummary = getMyActionSummary(
        `${capitalize(reaction)}ActionSummary`,
        comment
      );
      const count = getTotalActionCount(
        `${capitalize(reaction)}ActionSummary`,
        comment
      );

      const withReactionProps = {reactionSummary, count};

      return <WrappedComponent {...this.props} {...withReactionProps} />;
    }
  }

  const isReaction = a =>
    a.__typename === `${capitalize(reaction)}ActionSummary`;

  const COMMENT_FRAGMENT = gql`
      fragment ${capitalize(reaction)}Button_updateFragment on Comment {
          action_summaries {
          ... on ${capitalize(reaction)}ActionSummary {
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
        mutation create${capitalize(reaction)}($${reaction}: Create${capitalize(reaction)}Input!) {
            create${capitalize(reaction)}(${reaction}: $${reaction}) {
                ${reaction} {
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
        postReaction: reactionData => {
          return mutate({
            variables: {[reaction]: reactionData},
            optimisticResponse: {
              [`create${capitalize(reaction)}`]: {
                __typename: `Create${capitalize(reaction)}Response`,
                errors: null,
                [reaction]: {
                  __typename: `${capitalize(reaction)}Action`,
                  id: uuid()
                }
              }
            },
            update: (proxy, mutationResult) => {
              const fragmentId = `Comment_${reactionData.item_id}`;

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
                  __typename: `${capitalize(reaction)}ActionSummary`,
                  count: 0,
                  current_user: null
                });
                idx = data.action_summaries.length - 1;
              }

              data.action_summaries[idx] = {
                ...data.action_summaries[idx],
                count: data.action_summaries[idx].count + 1,
                current_user: mutationResult.data[
                  `create${capitalize(reaction)}`
                ][reaction]
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
          fragment ${capitalize(reaction)}Button_root on RootQuery {
            me {
                status
            }
          }
      `,
      comment: gql`
          fragment ${capitalize(reaction)}Button_comment on Comment {
            action_summaries {
              ... on ${capitalize(reaction)}ActionSummary {
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

  return enhance(WithReactions);
};

import React from 'react';
import get from 'lodash/get';
import uuid from 'uuid/v4';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getDisplayName} from 'coral-framework/helpers/hoc';
import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import withMutation from 'coral-framework/hocs/withMutation';
import {showSignInDialog} from 'coral-framework/actions/auth';
import {capitalize} from 'coral-framework/helpers/strings';
import {getMyActionSummary, getTotalActionCount} from 'coral-framework/utils';
import * as PropTypes from 'prop-types';

export default (reaction) => (WrappedComponent) => {
  if (typeof reaction !== 'string') {
    console.error('Reaction must be a valid string');
    return null;
  }

  // Global instance counter for each `reaction` type.
  let instances = 0;

  // Track current subscriptions.
  let createdSubscription = null;
  let deletedSubscription = null;

  reaction = reaction.toLowerCase();
  const Reaction = capitalize(reaction);

  const COMMENT_FRAGMENT = gql`
    fragment ${Reaction}Button_updateFragment on Comment {
        action_summaries {
        ... on ${Reaction}ActionSummary {
          count
          current_user {
            id
          }
        }
      }
    }
  `;

  const isReaction = (a) =>
    a.__typename === `${Reaction}ActionSummary`;

  const addReactionToStore = (proxy, {action, self}) => {
    const fragmentId = `Comment_${action.item_id}`;

    // Read the data from our cache for this query.
    const data = proxy.readFragment({
      fragment: COMMENT_FRAGMENT,
      id: fragmentId
    });

    // Add our comment from the mutation to the end.
    let idx = data.action_summaries.findIndex(isReaction);

    // Check whether we already reactioned this comment.
    if (self && idx >= 0 && data.action_summaries[idx].current_user) {
      return;
    }

    if (idx < 0) {

      // Add initial action when it doesn't exist.
      data.action_summaries.push({
        __typename: `${Reaction}ActionSummary`,
        count: 0,
        current_user: null
      });
      idx = data.action_summaries.length - 1;
    }

    data.action_summaries[idx] = {
      ...data.action_summaries[idx],
      count: data.action_summaries[idx].count + 1,
      current_user: self ? action : data.action_summaries[idx].current_user
    };

    // Write our data back to the cache.
    proxy.writeFragment({
      fragment: COMMENT_FRAGMENT,
      id: fragmentId,
      data
    });
  };

  const deleteReactionFromStore = (proxy, {action, self}) => {
    const fragmentId = `Comment_${action.item_id}`;

    // Read the data from our cache for this query.
    const data = proxy.readFragment({
      fragment: COMMENT_FRAGMENT,
      id: fragmentId
    });

    // Check whether we liked this comment.
    const idx = data.action_summaries.findIndex(isReaction);

    if (
      self &&
      (idx < 0 || get(data.action_summaries[idx], 'current_user.id') !== action.id)
    ) {
      return;
    }

    data.action_summaries[idx] = {
      ...data.action_summaries[idx],
      count: data.action_summaries[idx].count - 1,
      current_user: self ? null : data.action_summaries[idx].current_user,
    };

    // Write our data back to the cache.
    proxy.writeFragment({
      fragment: COMMENT_FRAGMENT,
      id: fragmentId,
      data
    });
  };

  const REACTION_CREATED_SUBSCRIPTION = gql`
    subscription ${Reaction}ActionCreated($assetId: ID!) {
      ${reaction}ActionCreated(asset_id: $assetId) {
        id
        user {
          id
        }
        item_id
      }
    }
  `;

  const REACTION_DELETED_SUBSCRIPTION = gql`
    subscription ${Reaction}ActionDeleted($assetId: ID!) {
      ${reaction}ActionDeleted(asset_id: $assetId) {
        id
        user {
          id
        }
        item_id
      }
    }
  `;

  class WithReactions extends React.Component {

    static contextTypes = {
      client: PropTypes.object.isRequired,
    };

    // Whether or not a mutation is currently active.
    duringMutation = false;

    constructor(props, context) {
      super(props, context);

      // Start subscriptions when it is first needed.
      if (instances === 0) {
        createdSubscription = context.client.subscribe({
          query: REACTION_CREATED_SUBSCRIPTION,
          variables: {
            assetId: this.props.root.asset.id,
          },
        }).subscribe({
          next: this.onReactionCreated,
          error(err) { console.error('err', err); },
        });

        deletedSubscription = context.client.subscribe({
          query: REACTION_DELETED_SUBSCRIPTION,
          variables: {
            assetId: this.props.root.asset.id,
          },
        }).subscribe({
          next: this.onReactionDeleted,
          error(err) { console.error('err', err); },
        });
      }
      instances++;
    }

    // onReactionCreated handles live updates through the subscriptions.
    onReactionCreated = ({[`${reaction}ActionCreated`]: action}) => {
      if (this.props.user && action.user && this.props.user.id === action.user.id) {
        return;
      }
      addReactionToStore(this.context.client, {action, self: false});
    };

    // onReactionDeleted handles live updates through the subscriptions.
    onReactionDeleted = ({[`${reaction}ActionDeleted`]: action}) => {
      if (this.props.user && action.user && this.props.user.id === action.user.id) {
        return;
      }
      deleteReactionFromStore(this.context.client, {action, self: false});
    };

    componentWillUnmount() {
      instances--;

      // End subscriptions when last component will be unmounted.
      if (instances === 0) {
        try {
          createdSubscription.unsubscribe();
          deletedSubscription.unsubscribe();
        }
        catch(e) {
          console.warn(e);
        }
      }
    }

    postReaction = () => {
      if (this.duringMutation) {
        return;
      }
      this.duringMutation = true;
      return this.props.postReaction(this.props.comment)
        .then((result) => {this.duringMutation = false; return Promise.resolve(result); })
        .catch((err) => {this.duringMutation = false; throw err; });
    }

    deleteReaction = () => {
      if (this.duringMutation) {
        return;
      }
      this.duringMutation = true;
      return this.props.deleteReaction(this.props.comment)
        .then((result) => {this.duringMutation = false; return Promise.resolve(result); })
        .catch((err) => {this.duringMutation = false; throw err; });
    }

    render() {
      const {comment} = this.props;

      const reactionSummary = getMyActionSummary(
        `${Reaction}ActionSummary`,
        comment
      );

      const count = getTotalActionCount(
        `${Reaction}ActionSummary`,
        comment
      );

      const alreadyReacted = !!reactionSummary;

      return <WrappedComponent
        showSignInDialog={this.props.showSignInDialog}
        user={this.props.user}
        comment={comment}
        reactionSummary={reactionSummary}
        count={count}
        alreadyReacted={alreadyReacted}
        postReaction={this.postReaction}
        deleteReaction={this.deleteReaction}
      />;
    }
  }

  const withDeleteReaction = withMutation(
    gql`
      mutation Delete${Reaction}Action($input: Delete${Reaction}ActionInput!) {
        delete${Reaction}Action(input: $input) {
          errors {
            translation_key
          }
        }
      }
    `,
    {
      props: ({mutate}) => ({
        deleteReaction: (comment) => {

          const reactionSummary = getMyActionSummary(
            `${Reaction}ActionSummary`,
            comment
          );

          const id = reactionSummary.current_user.id;
          const item_id = comment.id;

          const input = {id};
          return mutate({
            variables: {input},
            optimisticResponse: {
              [`delete${Reaction}Action`]: {
                __typename: `Delete${Reaction}ActionResponse`,
                errors: null
              }
            },
            update: (proxy) => {
              deleteReactionFromStore(proxy, {action: {item_id, id}, self: true});
            }
          });
        }
      })
    }
  );

  const withPostReaction = withMutation(
    gql`
        mutation Create${Reaction}Action($input: Create${Reaction}ActionInput!) {
          create${Reaction}Action(input: $input) {
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
        postReaction: (comment) => {

          const input = {
            item_id: comment.id,
          };

          return mutate({
            variables: {input},
            optimisticResponse: {
              [`create${Reaction}Action`]: {
                __typename: `Create${Reaction}ActionResponse`,
                errors: null,
                [reaction]: {
                  __typename: `${Reaction}Action`,
                  id: uuid()
                }
              }
            },
            update: (proxy, {data: {[`create${Reaction}Action`]: {[reaction]: action}}}) => {
              const a = {
                ...action,
                item_id: input.item_id,
              };
              addReactionToStore(proxy, {action: a, self: true});
            }
          });
        }
      })
    }
  );

  const mapStateToProps = (state) => ({
    user: state.auth.toJS().user,
  });

  const mapDispatchToProps = (dispatch) =>
    bindActionCreators({showSignInDialog}, dispatch);

  const enhance = compose(
    withFragments({
      comment: gql`
        fragment ${Reaction}Button_comment on Comment {
          action_summaries {
            ... on ${Reaction}ActionSummary {
              count
              current_user {
                id
              }
            }
          }
        }`
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withDeleteReaction,
    withPostReaction
  );

  WithReactions.displayName = `WithReactions(${getDisplayName(WrappedComponent)})`;

  return enhance(WithReactions);
};

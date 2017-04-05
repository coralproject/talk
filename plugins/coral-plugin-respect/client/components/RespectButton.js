import React from 'react';
import styles from './style.css';
import Icon from './Icon';

import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {I18n} from 'coral-framework';
import get from 'lodash/get';
import cn from 'classnames';
import translations from '../translations.json';

const lang = new I18n(translations);

import {showSignInDialog} from 'coral-framework/actions/auth';

class RespectButton extends React.Component {

  static slot = 'Comment.Detail';

  handleClick = () => {
    const {postRespect, showSignInDialog, deleteAction, commentId} = this.props;
    const {me, comment} = this.props.data;

    const respect = comment.action_summaries[0];
    const respected = (respect && respect.current_user);

    // If the current user does not exist, trigger sign in dialog.
    if (!me) {
      const offset = document.getElementById(`c_${commentId}`).getBoundingClientRect().top - 75;
      showSignInDialog(offset);
      return;
    }

    // If the current user is banned, do nothing.
    if (me.status === 'BANNED') {
      return;
    }

    if (!respected) {
      postRespect({
        item_id: commentId,
        item_type: 'COMMENTS'
      });
    } else {
      deleteAction(respect.current_user.id);
    }
  }

  render() {
    const {comment} = this.props.data;
    const respect = comment && comment.action_summaries && comment.action_summaries[0];
    const respected = respect && respect.current_user;
    let count = respect ? respect.count : 0;

    return (
      <div className={styles.respect}>
        <button
          className={cn(styles.button, {[styles.respected]: respected})}
          onClick={this.handleClick} >
          <span>{lang.t(respected ? 'respected' : 'respect')}</span>
          <Icon className={cn(styles.icon, {[styles.respected]: respected})} />
          {count > 0 && count}
        </button>
      </div>
    );
  }
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
  options: {
    refetchQueries: [
      'CommentQuery',
    ],
  },
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
      },
    );
    }}),
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
  options: {
    refetchQueries: [
      'CommentQuery',
    ],
  },
  props: ({mutate}) => ({
    postRespect: (respect) => {
      return mutate({
        variables: {respect},
        optimisticResponse: {
          createRespect: {
            __typename: 'CreateRespectResponse',
            erros: null,
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
    }})
});

const withQuery = graphql(gql`
  query CommentQuery($commentId: ID!) {
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
`);

const mapDispatchToProps = dispatch =>
  bindActionCreators({showSignInDialog}, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withDeleteAction,
  withPostRespect,
  withQuery,
);

export default enhance(RespectButton);


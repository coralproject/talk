import React from 'react';
import styles from './style.css';
import Icon from './Icon';

import {compose, gql, graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {I18n} from 'coral-framework';
import cn from 'classnames';
import translations from '../translations.json';
import {withPostRespect} from '../mutations';

const lang = new I18n(translations);

import {getActionSummary} from 'coral-framework/utils';
import {showSignInDialog} from 'coral-framework/actions/auth';
import {deleteAction} from 'coral-framework/graphql/mutations';

class RespectButton extends React.Component {

  static slot = 'Comment.Detail';

  constructor(props) {
    super(props);

    this.state = {
      localPost: null, // Set to the ID of an action if one is posted
      localDelete: false // Set to true is the user deletes an action, unless localPost is already set.
    };
  }

  handleClick = () => {
    const {postRespect, showSignInDialog, deleteAction, commentId} = this.props;
    const {me, comment} = this.props.data;

    const {localPost, localDelete} = this.state;
    const respect = getActionSummary('RespectActionSummary', comment);
    const respected = (respect && respect.current_user && !localDelete) || localPost;

    /**
     *  If the current user does not exist, trigger signIn Box
     */

    if (!me) {
      const offset = document.getElementById(`c_${commentId}`).getBoundingClientRect().top - 75;
      showSignInDialog(offset);
      return;
    }

    /**
     *  If the current user is banned, do nothing
     */

    if (me.status === 'BANNED') {
      return;
    }

    if (!respected) {
      this.setState({
        localPost: 'temp'
      });

      postRespect({
        item_id: commentId,
        item_type: 'COMMENTS'
      }).then(({data}) => {
        this.setState({
          localPost: data.createRespect.respect.id
        });
      });

    } else {
      this.setState((prev) => prev.localPost ? {...prev, localPost: null} : {...prev, localDelete: true});
      deleteAction(localPost || respect.current_user.id);
    }
  }

  render() {
    const {comment} = this.props.data;
    const {localPost, localDelete} = this.state;
    const respect = comment && getActionSummary('RespectActionSummary', comment);
    const respected = (respect && respect.current_user && !localDelete) || localPost;
    let count = respect ? respect.count : 0;

    if (localPost) {count += 1;}
    if (localDelete) {count -= 1;}

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

const withQuery = graphql(gql`
  query CommentQuery($commentId: ID!) {
    comment(id: $commentId) {
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
  deleteAction,
  withPostRespect,
  withQuery,
);

export default enhance(RespectButton);


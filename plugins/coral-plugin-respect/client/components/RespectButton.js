import React, {Component} from 'react';
import styles from './style.css';
import Icon from './Icon';

import {I18n} from 'coral-framework';
import cn from 'classnames';
import translations from '../translations.json';

const lang = new I18n(translations);

class RespectButton extends Component {

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

RespectButton.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default RespectButton;


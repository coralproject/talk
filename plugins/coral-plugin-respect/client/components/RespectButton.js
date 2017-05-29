import React, {Component} from 'react';
import styles from './style.css';
import Icon from './Icon';

import t from 'coral-framework/services/i18n';
import cn from 'classnames';

import {getMyActionSummary, getTotalActionCount} from 'coral-framework/utils';

class RespectButton extends Component {

  handleClick = () => {
    const {postRespect, showSignInDialog, deleteAction} = this.props;
    const {root: {me}, comment} = this.props;

    const myRespectActionSummary = getMyActionSummary('RespectActionSummary', comment);

    // If the current user does not exist, trigger sign in dialog.
    if (!me) {
      showSignInDialog();
      return;
    }

    // If the current user is banned, do nothing.
    if (me.status === 'BANNED') {
      return;
    }

    if (myRespectActionSummary) {
      deleteAction(myRespectActionSummary.current_user.id, comment.id);
    } else {
      postRespect({
        item_id: comment.id,
        item_type: 'COMMENTS'
      });
    }
  }

  render() {
    const {comment} = this.props;

    if (!comment) {
      return null;
    }

    const myRespect = getMyActionSummary('RespectActionSummary', comment);
    let count = getTotalActionCount('RespectActionSummary', comment);

    return (
      <div className={styles.respect}>
        <button
          className={cn(styles.button, {[styles.respected]: myRespect})}
          onClick={this.handleClick} >
          <span>{t(myRespect ? 'respected' : 'respect')}</span>
          <Icon className={cn(styles.icon, {[styles.respected]: myRespect})} />
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

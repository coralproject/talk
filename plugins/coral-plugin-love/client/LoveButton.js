import React from 'react';
import {Icon} from 'coral-ui';
import styles from './styles.css';
import {I18n} from 'coral-framework';
import translations from './translations.json';
import withReaction from 'coral-framework/hocs/withReaction';
const lang = new I18n(translations);

class LoveButton extends React.Component {
  handleClick = () => {
    const {
      postReaction,
      deleteReaction,
      showSignInDialog,
      reactionSummary
    } = this.props;
    const {root: {me}, comment} = this.props;

    // If the current user does not exist, trigger sign in dialog.
    if (!me) {
      showSignInDialog();
      return;
    }

    // If the current user is banned, do nothing.
    if (me.status === 'BANNED') {
      return;
    }

    if (reactionSummary) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const {count, reactionSummary} = this.props;
    return (
      <button
        className={`${styles.button} ${reactionSummary ? styles.loved : ''}`}
        onClick={this.handleClick}
      >
        <span>{lang.t(reactionSummary ? 'loved' : 'love')}</span>
        <Icon name="favorite" />
        <span>{count > 0 && count}</span>
      </button>
    );
  }
}

export default withReaction('love')(LoveButton);

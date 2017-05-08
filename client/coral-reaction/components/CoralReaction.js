import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './style.css';

import {capitalize} from '../helpers';
import {getMyActionSummary, getTotalActionCount} from 'coral-framework/utils';

class CoralReaction extends React.Component {
  handleClick = () => {
    const name = this.props.children;
    const {postReaction, deleteReaction, showSignInDialog} = this.props;

    const {root: {me}, comment} = this.props;

    const myActionSummary = getMyActionSummary(
      `${capitalize(name)}ActionSummary`,
      comment
    );

    // If the current user does not exist, trigger sign in dialog.
    if (!me) {
      showSignInDialog();
      return;
    }

    // If the current user is banned, do nothing.
    if (me.status === 'BANNED') {
      return;
    }

    if (myActionSummary) {
      deleteReaction(myActionSummary.current_user.id, comment.id);
    } else {
      postReaction({
        item_id: comment.id,
        item_type: 'COMMENTS'
      });
    }
  };

  render() {
    const name = this.props.children;
    const {comment} = this.props;

    console.log(this.props)

    if (!comment) {
      return null;
    }

    const myReaction = getMyActionSummary(`${capitalize(name)}ActionSummary`, comment);
    let count = getTotalActionCount(`${capitalize(name)}ActionSummary`, comment);

    return (
      <div className={cn(styles.like, `${name}-container`)}>
        <button
          className={cn(
            styles.button,
            {[styles.liked]: myReaction},
            `${name}-button`
          )}
          onClick={this.handleClick}
        >
          <span className={`${name}-button-text`}>
            {this.props.children} {(myReaction ? 'd' : '')}
          </span>
          <i
            className={cn(
              styles.icon,
              'material-icons',
              {[styles.liked]: myReaction},
              `${name}-icon`
            )}
            aria-hidden={true}
          >
            thumb_up
          </i>
          <span className={`${name}-count`}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

CoralReaction.propTypes = {
  children: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tag: PropTypes.string,
  translations: PropTypes.object
};

export default CoralReaction;

/**
 *
 * icon: Could be a string or a component https://material.io/icons/
 **/

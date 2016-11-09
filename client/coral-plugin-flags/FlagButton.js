import React from 'react';

const name = 'coral-plugin-flags';

const FlagButton = ({flag, item_id, postAction, currentUser, addNotification}) => {
  const flagged = flag && flag.includes(currentUser);
  const onFlagClick = () => {
    postAction(item_id, 'flag', currentUser);
    addNotification('success', 'Thank you for reporting this comment. Our moderation team has been notified and will review it shortly.');

  };
  return <div className={`${name  }-container`}>
    <button onClick={onFlagClick} className={`${name  }-button`}>
      <i className={`${name  }-icon material-icons`}
        style={flagged ? styles.flaggedIcon : styles.unflaggedIcon}
        aria-hidden={true}>flag</i>
      {
        flagged
        ? <span className={`${name  }-button-text`}>Flagged</span>
        : <span className={`${name  }-button-text`}>Flag</span>
      }
    </button>
  </div>;
};

export default FlagButton;

const styles = {
  flaggedIcon: {
    color: '#F00'
  },
  unflaggedIcon: {
    color: 'inherit'
  }
};

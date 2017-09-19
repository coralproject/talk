import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommentLabels.css';
import Label from './Label';
import FlagLabel from './FlagLabel';
import cn from 'classnames';

function isUserFlagged(actions) {
  return actions.some((action) => action.__typename === 'FlagAction' && action.user);
}

function hasSuspectedWords(actions) {
  return actions.some((action) => action.__typename === 'FlagAction' && action.reason === 'Matched suspect word filter');
}

function hasHistoryFlag(actions) {
  return actions.some((action) => action.__typename === 'FlagAction' && action.reason === 'TRUST');
}

const CommentLabels = ({className, status, actions, isReply}) => {
  return (
    <div className={cn(className, styles.root)}>
      {isReply && <Label iconName="reply">reply</Label>}
      {status === 'PREMOD' && <Label iconName="query_builder">Pre-Mod</Label>}
      {isUserFlagged(actions) && <FlagLabel iconName="person">User</FlagLabel>}
      {hasSuspectedWords(actions) && <FlagLabel iconName="sms_failed">Suspect</FlagLabel>}
      {hasHistoryFlag(actions) && <FlagLabel iconName="sentiment_very_dissatisfied">History</FlagLabel>}
    </div>
  );
};

CommentLabels.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
  actions: PropTypes.array,
  isReply: PropTypes.bool,
};

export default CommentLabels;

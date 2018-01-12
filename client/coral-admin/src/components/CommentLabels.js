import React from 'react';
import PropTypes from 'prop-types';
import Label from 'coral-ui/components/Label';
import Slot from 'coral-framework/components/Slot';
import FlagLabel from 'coral-ui/components/FlagLabel';
import cn from 'classnames';
import styles from './CommentLabels.css';

const staffRoles = ['ADMIN', 'STAFF', 'MODERATOR'];

function isUserFlagged(actions) {
  return actions.some(
    action => action.__typename === 'FlagAction' && action.user
  );
}

function getUserFlaggedType(actions) {
  return actions.some(
    action =>
      action.__typename === 'FlagAction' &&
      action.user &&
      staffRoles.includes(action.user.role)
  )
    ? 'Staff'
    : 'User';
}

function hasSuspectedWords(actions) {
  return actions.some(
    action =>
      action.__typename === 'FlagAction' && action.reason === 'SUSPECT_WORD'
  );
}

function hasHistoryFlag(actions) {
  return actions.some(
    action => action.__typename === 'FlagAction' && action.reason === 'TRUST'
  );
}

const CommentLabels = ({
  comment,
  comment: { className, status, actions, hasParent },
}) => {
  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.coreLabels}>
        {hasParent && (
          <Label iconName="reply" className={styles.replyLabel}>
            reply
          </Label>
        )}
        {status === 'PREMOD' && (
          <Label iconName="query_builder" className={styles.premodLabel}>
            Pre-Mod
          </Label>
        )}
        {isUserFlagged(actions) && (
          <FlagLabel iconName="person">{getUserFlaggedType(actions)}</FlagLabel>
        )}
        {hasSuspectedWords(actions) && (
          <FlagLabel iconName="sms_failed">Suspect</FlagLabel>
        )}
        {hasHistoryFlag(actions) && (
          <FlagLabel iconName="sentiment_very_dissatisfied">History</FlagLabel>
        )}
      </div>
      <Slot
        className={styles.slot}
        fill="adminCommentLabels"
        queryData={{ comment }}
      />
    </div>
  );
};

CommentLabels.propTypes = {
  comment: PropTypes.shape({
    className: PropTypes.string,
    status: PropTypes.string,
    actions: PropTypes.array,
    hasParent: PropTypes.bool,
  }),
};

export default CommentLabels;

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';

const RejectCommentAction = ({ rejectComment }) => (
  <button
    className={cn(styles.button, 'talk-plugin-moderation-actions-reject')}
    onClick={rejectComment}
  >
    <Icon name="clear" className={styles.icon} />
    {t('talk-plugin-moderation-actions.reject_comment')}
  </button>
);

RejectCommentAction.propTypes = {
  rejectComment: PropTypes.func,
};

export default RejectCommentAction;

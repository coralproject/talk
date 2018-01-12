import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const isApproved = status => status === 'ACCEPTED';

const ApproveCommentAction = ({ approveComment, comment: { status } }) =>
  isApproved(status) ? (
    <span className={styles.approved}>
      <Icon name="check_circle" className={styles.icon} />
      {t('talk-plugin-moderation-actions.approved_comment')}
    </span>
  ) : (
    <button
      className={cn(styles.button, 'talk-plugin-moderation-actions-approve')}
      onClick={approveComment}
    >
      <Icon name="done" className={styles.icon} />
      {t('talk-plugin-moderation-actions.approve_comment')}
    </button>
  );

ApproveCommentAction.propTypes = {
  approveComment: PropTypes.func,
  comment: PropTypes.object,
};

export default ApproveCommentAction;

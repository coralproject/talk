import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './CommentStatusBlameLog.css';
import {t} from 'plugin-api/beta/client/services';
import {Slot, IfSlotIsNotEmpty, CommentDetail} from 'plugin-api/beta/client/components';

class CommentStatusBlameLog extends Component {

  render() {
    const {root} = this.props;

    const {assigned_by: {username = null} = {}} = root.comment ? root.comment.status_history.slice(-1)[0] : {};

    return (
      <CommentDetail
        icon={'face'}
        header={`${t('talk-plugin-comment-status-blame-log.moderator')}`}
        info={
          <p className={styles.info}>
            {username}
          </p>
        }>
      </CommentDetail>
    )
  }
}

CommentStatusBlameLog.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object
};

export default CommentStatusBlameLog;

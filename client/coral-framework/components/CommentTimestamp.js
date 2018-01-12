import React from 'react';
import PropTypes from 'prop-types';
import { timeago } from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './CommentTimestamp.css';

const CommentTimestamp = ({ className, created_at }) => (
  <div className={cn(className, styles.timestamp, 'talk-comment-timestamp')}>
    {timeago(created_at)}
  </div>
);

CommentTimestamp.propTypes = {
  className: PropTypes.string,
  created_at: PropTypes.string,
};

export default CommentTimestamp;

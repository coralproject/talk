import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './CommentTimestamp.css';
import TimeAgo from 'coral-framework/components/TimeAgo';

const CommentTimestamp = ({ className, created_at }) => (
  <TimeAgo
    className={cn(className, styles.timestamp, 'talk-comment-timestamp')}
    datetime={created_at}
  />
);

CommentTimestamp.propTypes = {
  className: PropTypes.string,
  created_at: PropTypes.string,
};

export default CommentTimestamp;

import React, { PropTypes } from 'react';
import styles from './CommentCount.css';

const CommentCount = props => (
  <span className={styles.count}>{props.count}</span>
);

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;

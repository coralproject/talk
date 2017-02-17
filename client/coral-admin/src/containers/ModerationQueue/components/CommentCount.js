import React, {PropTypes} from 'react';
import styles from './CommentCount.css';

const CommentCount = props => (
  <span className={styles.count}>{props.children}</span>
);

CommentCount.propTypes = {
  children: PropTypes.node
};

export default CommentCount;

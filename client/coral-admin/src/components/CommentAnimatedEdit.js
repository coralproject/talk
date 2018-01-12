import React from 'react';
import { murmur3 } from 'murmurhash-js';
import { CSSTransitionGroup } from 'react-transition-group';
import styles from './CommentAnimatedEdit.css';
import PropTypes from 'prop-types';

const CommentAnimatedEdit = ({ children, body }) => {
  return (
    <CSSTransitionGroup
      component={'div'}
      className={styles.root}
      transitionName={{
        enter: styles.bodyEnter,
        enterActive: styles.bodyEnterActive,
        leave: styles.bodyLeave,
        leaveActive: styles.bodyLeaveActive,
      }}
      transitionEnter={true}
      transitionLeave={true}
      transitionEnterTimeout={3600}
      transitionLeaveTimeout={2800}
    >
      {React.cloneElement(React.Children.only(children), {
        key: murmur3(body),
      })}
    </CSSTransitionGroup>
  );
};

CommentAnimatedEdit.propTypes = {
  children: PropTypes.node,
  body: PropTypes.string,
};

export default CommentAnimatedEdit;

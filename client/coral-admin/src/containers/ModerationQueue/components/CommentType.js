import React, {PropTypes} from 'react';
import styles from './CommentType.css';
import {Icon} from 'coral-ui';

const CommentType = props => {
  const typeData = getTypeData(props.type);

  return (
    <span className={`${styles.commentType} ${styles[typeData.className]}`}>
      <Icon name={typeData.icon}/>{typeData.text}
    </span>
  );
};

const getTypeData = type => {
  switch (type) {
  case 'premod':
    return {icon: 'clock', text: 'Pre-Mod', className: 'premod'};
  case 'flagged':
    return {icon: 'flag', text: 'Flagged', className: 'flagged'};
  default:
    return {icon: 'flag', text: 'no-type', className: 'non'};
  }
};

CommentType.propTypes = {
  type: PropTypes.string.isRequired
};

export default CommentType;

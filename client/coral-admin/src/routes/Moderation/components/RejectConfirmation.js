import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './RejectConfirmation.css';

const RejectConfirmation = (props) => (
  props.show && <div className={cn(styles.rejectConfirmation)}>
    You have rejected this comment. <span className={cn(styles.undo)} onClick={props.onUndo}>Undo</span>
  </div>
);

RejectConfirmation.propTypes = {
  onUndo: PropTypes.func.isRequired,
};

export default RejectConfirmation;

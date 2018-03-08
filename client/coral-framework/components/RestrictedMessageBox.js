import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './RestrictedMessageBox.css';

const RestrictedMessageBox = ({ children }) => (
  <div className={cn(styles.message, 'talk-restricted-message-box')}>
    {children}
  </div>
);

RestrictedMessageBox.propTypes = {
  children: PropTypes.node,
};

export default RestrictedMessageBox;

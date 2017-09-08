import React from 'react';
import PropTypes from 'prop-types';
import styles from './Drawer.css';

const Drawer = ({children, onClose}) => {
  return (
    <div className={styles.drawer}>
      <div className={styles.closeButton} onClick={onClose}>×</div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Drawer.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default Drawer;

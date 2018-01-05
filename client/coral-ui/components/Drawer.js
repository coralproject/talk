import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './Drawer.css';

const Drawer = ({children, onClose, className = ''}) => {
  return (
    <div className={cn(styles.drawer, className)}>
      <button className={cn(styles.closeButton, [className, 'close-button'].join('-'))} onClick={onClose}>×</button>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Drawer.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Drawer;

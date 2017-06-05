import React, {PropTypes} from 'react';
import styles from './Drawer.css';
import onClickOutside from 'react-onclickoutside';

const Drawer = ({children, handleClickOutside}) => {
  return (
    <div className={styles.drawer}>
      <div className={styles.closeButton} onClick={handleClickOutside}>×</div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Drawer.propTypes = {
  active: PropTypes.bool,
  handleClickOutside: PropTypes.func.isRequired
};

export default onClickOutside(Drawer);

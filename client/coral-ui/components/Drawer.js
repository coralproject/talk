import React, {PropTypes} from 'react';
import styles from './Drawer.css';

const Drawer = (props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.drawer}>{props.children}</div>
      <div className={styles.closeButton} onClick={props.close}>×</div>
    </div>
  );
};

Drawer.propTypes = {
  active: PropTypes.bool
};

export default Drawer;

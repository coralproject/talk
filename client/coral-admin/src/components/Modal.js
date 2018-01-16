import React from 'react';
import { Button, Icon } from 'react-mdl';
import styles from './Modal.css';

export default ({ open, children, onClose }) => (
  <div className={`${styles.container} ${!open ? styles.hide : ''}`}>
    <div className={styles.inner}>
      <Button className={styles.close} onClick={onClose}>
        <Icon name="close" />
      </Button>
      {children}
    </div>
  </div>
);

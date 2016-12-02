import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import BanUserDialogContent from './BanUserDialogContent';

const BanUserDialog = ({open, handleClose, ...props}) => (
  <Dialog className={styles.dialog} open={open}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <BanUserDialogContent {...props} />
  </Dialog>
);
export default BanUserDialog;

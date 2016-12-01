import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import BanUserDialogContent from './BanUserDialogContent';

const BanUserDialog = ({view, handleClose, ...props}) => (
  <Dialog className={styles.dialog}>
    <span className={styles.close} onClick={handleClose}>×</span>
    {view === 'Ban' && <BanUserDialogContent {...props} />}
  </Dialog>
);

export default BanUserDialog;

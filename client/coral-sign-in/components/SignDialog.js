import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SingUpContent from './SignUpContent';
import ForgotContent from './ForgotContent';

const SignDialog = ({open, view, handleClose, offset, ...props}) => (
  <Dialog
    className={styles.dialog}
    id="signInDialog"
    open={open}
    style={{
      position: 'relative',
      top: offset !== 0 && offset
    }}>
    <span className={styles.close} onClick={handleClose}>×</span>
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {view === 'SIGNUP' && <SingUpContent {...props} />}
    {view === 'FORGOT' && <ForgotContent {...props} />}
  </Dialog>
);

export default SignDialog;

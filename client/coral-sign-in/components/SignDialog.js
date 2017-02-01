import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SignUpContent from './SignUpContent';
import ForgotContent from './ForgotContent';

const SignDialog = ({open, view, handleClose, offset, ...props}) => (
  <Dialog
    className={styles.dialog}
    id="signInDialog"
    open={open}
    style={{
      position: 'fixed',
      top: offset !== 0 && offset
    }}>
    <span className={styles.close} onClick={handleClose}>×</span>
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {
      view === 'SIGNUP' && <SignUpContent
        emailConfirmationLoading={props.emailConfirmationLoading}
        emailConfirmationSuccess={props.emailConfirmationSuccess}
        {...props} />
    }
    {view === 'FORGOT' && <ForgotContent {...props} />}
  </Dialog>
);

export default SignDialog;

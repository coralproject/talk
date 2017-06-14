import React from 'react';
import {Dialog} from 'plugin-api/beta/client/components/ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SignUpContent from './SignUpContent';
import ForgotContent from './ForgotContent';

const SignDialog = ({open, view, hideSignInDialog, ...props}) => (
  <Dialog className={styles.dialog} id="signInDialog" open={open}>
    <span className={styles.close} onClick={hideSignInDialog}>×</span>
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {view === 'SIGNUP' && <SignUpContent {...props} />}
    {view === 'FORGOT' && <ForgotContent {...props} />}
  </Dialog>
);

export default SignDialog;

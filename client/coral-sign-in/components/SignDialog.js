import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SingUpContent from './SignUpContent';
import ForgotContent from './ForgotContent';

const SignDialog = ({open, view, onClose, ...props}) => (
  <Dialog className={styles.dialog} open={open}>
    <span className={styles.close} onClick={onClose}>×</span>
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {view === 'SIGNUP' && <SingUpContent {...props} />}
    {view === 'FORGOT' && <ForgotContent {...props} />}
  </Dialog>
);

export default SignDialog;

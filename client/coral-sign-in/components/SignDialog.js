import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SingUpContent from './SignUpContent';

const SignDialog = ({open, step, ...props}) => (
  <Dialog className={styles.dialog} open={open}>
    {step === 1 && <SignInContent {...props} />}
    {step === 2 && <SingUpContent {...props} />}
  </Dialog>
);

export default SignDialog;

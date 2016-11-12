import React from 'react';
import {Dialog} from 'coral-ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SingUpContent from './SignUpContent';

const SignDialog = ({open, view, ...props}) => (
  <Dialog className={styles.dialog} open={open}>
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {view === 'SIGNUP' && <SingUpContent {...props} />}
  </Dialog>
);

export default SignDialog;

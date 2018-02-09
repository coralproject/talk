import React from 'react';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import styles from './Main.css';

import SignIn from '../containers/SignIn';

const SignDialog = () => (
  <Dialog className={styles.dialog} id="signInDialog" open={true}>
    <SignIn />
  </Dialog>
);

export default SignDialog;

import React from 'react';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import styles from './styles.css';

import SignInContent from './SignInContent';
import SignUpContent from './SignUpContent';
import ForgotContent from './ForgotContent';
import ResendVerification from './ResendVerification';

const SignDialog = ({ open, view, resetSignInDialog, ...props }) => (
  <Dialog className={styles.dialog} id="signInDialog" open={open}>
    {view !== 'SIGNIN' && (
      <span className={styles.close} onClick={resetSignInDialog}>
        ×
      </span>
    )}
    {view === 'SIGNIN' && <SignInContent {...props} />}
    {view === 'SIGNUP' && <SignUpContent {...props} />}
    {view === 'FORGOT' && <ForgotContent {...props} />}
    {view === 'RESEND_VERIFICATION' && (
      <ResendVerification
        resendVerification={props.resendVerification}
        error={props.auth.emailVerificationFailure}
        success={props.auth.emailVerificationSuccess}
        loading={props.auth.emailVerificationLoading}
        email={props.auth.email}
      />
    )}
  </Dialog>
);

export default SignDialog;

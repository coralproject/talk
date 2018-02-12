import React from 'react';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import styles from './Main.css';
import PropTypes from 'prop-types';
import SignIn from '../containers/SignIn';
import SignUp from '../containers/SignUp';
import ForgotPassword from '../containers/ForgotPassword';
import ResendEmailConfirmation from '../containers/ResendEmailConfirmation';
import * as views from '../enums/views';

const Main = ({ view, onResetView }) => (
  <Dialog className={styles.dialog} id="signInDialog" open={true}>
    {view !== views.SIGN_IN && (
      <span className={styles.close} onClick={onResetView}>
        ×
      </span>
    )}
    {view === views.SIGN_IN && <SignIn />}
    {view === views.SIGN_UP && <SignUp />}
    {view === views.FORGOT_PASSWORD && <ForgotPassword />}
    {view === views.RESEND_EMAIL_CONFIRMATION && <ResendEmailConfirmation />}
  </Dialog>
);

Main.propTypes = {
  view: PropTypes.string.isRequired,
  onResetView: PropTypes.func.isRequired,
};

export default Main;

import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { handleSuccessfulLogin } from '../actions/auth';
import { translateError } from '../utils';
import { t } from '../services/i18n';

/**
 * WithSignIn provides properties
 * `signIn`
 * `loading`
 * `errorMessage`
 * `requireRecaptcha`
 * `requireEmailConfirmation`
 * 'success'
 */
export default hoistStatics(WrappedComponent => {
  class WithSignIn extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
      rest: PropTypes.func,
    };

    state = {
      error: null,
      loading: false,
      success: false,
      requireRecaptcha: false,
      requireEmailConfirmation: false,
    };

    signIn = (email, password, recaptchaResponse) => {
      const { store, rest } = this.context;
      const params = {
        method: 'POST',
        body: {
          email,
          password,
        },
      };

      if (recaptchaResponse) {
        params.headers = {
          'X-Recaptcha-Response': recaptchaResponse,
        };
      }

      rest('/auth/local', params)
        .then(({ user, token }) => {
          this.setState({ success: true, loading: false, error: null });
          store.dispatch(handleSuccessfulLogin(user, token));
        })
        .catch(error => {
          if (!error.status || error.status !== 401) {
            console.error(error);
          }
          const changeSet = { success: false, loading: false, error };
          if (error.translation_key === 'LOGIN_MAXIMUM_EXCEEDED') {
            changeSet.requireRecaptcha = !!this.context.store.getState().config
              .static.TALK_RECAPTCHA_PUBLIC;
          } else if (error.translation_key === 'EMAIL_NOT_VERIFIED') {
            changeSet.requireEmailConfirmation = true;
          }
          this.setState(changeSet);
        });
    };

    getErrorMessage() {
      if (!this.state.error) {
        return null;
      }
      return this.state.error.translation_key === 'NOT_AUTHORIZED'
        ? t('error.email_password')
        : translateError(this.state.error);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          signIn={this.signIn}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
          requireRecaptcha={this.state.requireRecaptcha}
          requireEmailConfirmation={this.state.requireEmailConfirmation}
          success={this.state.success}
        />
      );
    }
  }

  return WithSignIn;
});

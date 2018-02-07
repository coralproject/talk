import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { handleSuccessfulLogin } from '../actions/auth';
import { translateError } from '../utils';
import { t } from '../services/i18n';

/**
 * WithSignIn provides properties `signIn`, `loading` and `errorMessage`, `requireRecaptcha`.
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
      requireRecaptcha: false,
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
          this.setState({ loading: false, error: null });
          store.dispatch(handleSuccessfulLogin(user, token));
        })
        .catch(error => {
          if (!error.status || error.status !== 401) {
            console.error(error);
          }
          const changeSet = { loading: false, error };
          if (error.translation_key === 'LOGIN_MAXIMUM_EXCEEDED') {
            changeSet.requireRecaptcha = !!this.context.store.getState().static
              .TALK_RECAPTCHA_PUBLIC;
          }
          this.setState(changeSet);
        });
    };

    getErrorMessage() {
      if (!this.state.error) {
        return '';
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
        />
      );
    }
  }

  return WithSignIn;
});

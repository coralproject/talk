import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { handleSuccessfulLogin } from '../actions/auth';
import { translateError } from '../utils';
import { t } from '../services/i18n';

/**
 * WithLogin provides properties `login`, `loading` and `errorMessage`, `requireRecaptcha`.
 */
export default hoistStatics(WrappedComponent => {
  class WithLogin extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
      rest: PropTypes.func,
    };

    state = {
      error: null,
      loading: false,
    };

    login = (email, password, recaptchaResponse) => {
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
          this.setState({ loading: false, error });
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
          login={this.login}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
          requireRecaptcha={false}
        />
      );
    }
  }

  return WithLogin;
});

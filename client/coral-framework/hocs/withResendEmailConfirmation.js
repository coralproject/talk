import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { translateError } from '../utils';

/**
 * WithResendEmailConfirmaton provides properties
 * `resendEmailConfirmation`,
 * `loading`,
 * `errorMessage`,
 * `success`.
 */
export default hoistStatics(WrappedComponent => {
  class WithResendEmailConfirmaton extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
      rest: PropTypes.func,
      pym: PropTypes.object,
    };

    state = {
      error: null,
      loading: false,
      success: false,
    };

    resendEmailConfirmation = (email, redirectUri) => {
      if (!redirectUri) {
        redirectUri = this.context.pym.parentUrl || location.href;
      }
      const { rest } = this.context;
      this.setState({ loading: true, error: null, success: false });

      rest('/users/resend-verify', {
        method: 'POST',
        body: { email },
        headers: { 'X-Pym-Url': redirectUri },
      })
        .then(() => {
          this.setState({ loading: false, error: null, success: true });
        })
        .catch(error => {
          console.error(error);
          this.setState({ loading: false, error });
        });
    };

    getErrorMessage() {
      if (!this.state.error) {
        return null;
      }
      return translateError(this.state.error);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          resendEmailConfirmation={this.resendEmailConfirmation}
          success={this.state.success}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
        />
      );
    }
  }

  return WithResendEmailConfirmaton;
});

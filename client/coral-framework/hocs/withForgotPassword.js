import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { translateError } from '../utils';

/**
 * WithForgotPassword provides properties
 * `forgotPasssword`,
 * `loading`,
 * `errorMessage`,
 * `success`.
 */
export default hoistStatics(WrappedComponent => {
  class WithForgotPassword extends React.Component {
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

    forgotPassword = (email, redirectUri) => {
      if (!redirectUri) {
        redirectUri = this.context.pym.parentUrl || location.href;
      }
      const { rest } = this.context;
      this.setState({ loading: true, error: null, success: false });

      rest('/account/password/reset', {
        method: 'POST',
        body: { email, loc: redirectUri },
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
          forgotPassword={this.forgotPassword}
          success={this.state.success}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
        />
      );
    }
  }

  return WithForgotPassword;
});

import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { HANDLE_SUCCESSFUL_LOGIN } from 'coral-framework/constants/auth';
import {
  handleSuccessfulLogin,
  setAuthToken,
} from 'coral-framework/actions/auth';

/**
 * WithPopupAuthHandler listens to successful logins over
 * the `postMessage` service.
 */
export default hoistStatics(WrappedComponent => {
  class WithPopupAuthHandler extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
      postMessage: PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);
      context.postMessage.subscribe(this.handleAuth);
    }

    componentWillUnmount() {
      this.context.postMessage.unsubscribe(this.handleAuth);
    }

    handleAuth = ({ name, data }) => {
      if (name !== HANDLE_SUCCESSFUL_LOGIN) {
        return;
      }

      const { store } = this.context;
      // data will contain the user and token.
      const { user, token } = data;

      if (user && token) {
        store.dispatch(handleSuccessfulLogin(user, token));
      } else if (token) {
        store.dispatch(setAuthToken(token));
      } else {
        console.error('Invalid auth data supplied', data);
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithPopupAuthHandler;
});

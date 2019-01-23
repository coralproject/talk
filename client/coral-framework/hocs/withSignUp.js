import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import { compose, gql } from 'react-apollo';
import PropTypes from 'prop-types';
import { translateError } from '../utils';
import validate from '../helpers/validate';
import errorMsg from 'coral-framework/helpers/error';
import t from '../services/i18n';
import withQuery from './withQuery';
import get from 'lodash/get';

const requiredFields = ['username', 'email', 'password'];
const allFields = requiredFields;

const QUERY = gql`
  query TalkFramework_WithSignUpQuery {
    settings {
      requireEmailConfirmation
    }
  }
`;

export const withSettingsQuery = withQuery(QUERY);

/**
 * withSignUp provides properties
 * `signUp`,
 * `loading`,
 * `errorMessage`,
 * `requireEmailVerification`,
 * `success`,
 * `validate`.
 */
const withSignUp = hoistStatics(WrappedComponent => {
  class WithSignUp extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
      rest: PropTypes.func,
      pym: PropTypes.object,
    };

    static propTypes = {
      root: PropTypes.object.isRequired,
    };

    state = {
      error: null,
      loading: false,
      success: false,
    };

    validate = (field, value) => {
      if (!allFields.includes(field)) {
        return null;
      }

      if (requiredFields.includes(field) && !value) {
        return t('error.required_field');
      }

      if (field in validate) {
        return validate[field](value) ? null : errorMsg[field];
      }

      return null;
    };

    signUp = ({ username, email, password }, redirectUri) => {
      if (!redirectUri) {
        redirectUri = this.context.pym.parentUrl || location.href;
      }

      const { rest } = this.context;
      const params = {
        method: 'POST',
        body: {
          username,
          email,
          password,
        },
        headers: { 'X-Pym-Url': redirectUri },
      };

      rest('/users', params)
        .then(() => {
          this.setState({ success: true, loading: false, error: null });
        })
        .catch(error => {
          if (!error.status || error.status !== 401) {
            console.error(error);
          }
          const changeSet = { success: false, loading: false, error };
          this.setState(changeSet);
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
          signUp={this.signUp}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
          requireEmailConfirmation={
            !!get(this.props, 'root.settings.requireEmailConfirmation')
          }
          success={this.state.success}
          validate={this.validate}
        />
      );
    }
  }

  return WithSignUp;
});

export default compose(
  withSettingsQuery,
  withSignUp
);

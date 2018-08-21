import React from 'react';
import hoistStatics from 'recompose/hoistStatics';
import PropTypes from 'prop-types';
import { getErrorMessages } from '../utils';
import validate from '../helpers/validate';
import errorMsg from 'coral-framework/helpers/error';
import t from '../services/i18n';
import { withSetUsername as withSetUsernameMutation } from 'coral-framework/graphql/mutations';
import { updateUsername, updateStatus } from '../actions/auth';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

/**
 * withSetUsername provides properties
 * `setUsername`,
 * `loading`,
 * `errorMessage`,
 * `requireEmailVerification`,
 * `success`,
 * `validateUsername`.
 */
const withSetUsername = hoistStatics(WrappedComponent => {
  class WithSetUsername extends React.Component {
    static propTypes = {
      setUsername: PropTypes.func.isRequired,
      currentUserId: PropTypes.string,
      updateUsername: PropTypes.func.isRequired,
      updateStatus: PropTypes.func.isRequired,
    };

    state = {
      error: null,
      loading: false,
      success: false,
    };

    validateUsername = value => {
      if (!value) {
        return t('error.required_field');
      }
      return validate.username(value) ? null : errorMsg.username;
    };

    setUsername = async username => {
      if (!this.props.currentUserId) {
        throw new Error('User not logged in');
      }

      try {
        await this.props.setUsername(this.props.currentUserId, username);
        this.props.updateUsername(username);
        this.props.updateStatus({ username: { status: 'SET' } });
        this.setState({ success: true, loading: false, error: null });
      } catch (error) {
        if (!error.status || error.status !== 401) {
          console.error(error);
        }
        const changeSet = { success: false, loading: false, error };
        this.setState(changeSet);
        throw error;
      }
    };

    getErrorMessage() {
      if (!this.state.error) {
        return null;
      }
      return getErrorMessages(this.state.error).join(', ');
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          setUsername={this.setUsername}
          loading={this.state.loading}
          errorMessage={this.getErrorMessage()}
          success={this.state.success}
          validateUsername={this.validateUsername}
        />
      );
    }
  }

  return WithSetUsername;
});

const mapStateToProps = ({ auth }) => ({
  currentUserId: get(auth, 'user.id'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateUsername, updateStatus }, dispatch);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSetUsernameMutation,
  withSetUsername
);

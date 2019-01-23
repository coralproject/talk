import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  connect,
  withResendEmailConfirmation,
} from 'plugin-api/beta/client/hocs';
import { compose } from 'recompose';
import ResendEmailConfirmaton from '../components/ResendEmailConfirmation';
import { bindActionCreators } from 'redux';
import * as views from '../enums/views';
import { setView } from '../actions';

class ResendEmailConfirmatonContainer extends Component {
  handleSubmit = () => {
    this.props.resendEmailConfirmation(this.props.email);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      setTimeout(() => {
        // allow success UI to be shown for a second, and then close the modal
        this.props.setView(views.SIGN_IN);
      }, 2500);
    }
  }

  render() {
    return (
      <ResendEmailConfirmaton
        onSubmit={this.handleSubmit}
        email={this.props.email}
        errorMessage={this.props.errorMessage}
        success={this.props.success}
        loading={this.props.loading}
      />
    );
  }
}

ResendEmailConfirmatonContainer.propTypes = {
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  resendEmailConfirmation: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setView: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  email: state.email,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
    },
    dispatch
  );

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withResendEmailConfirmation
)(ResendEmailConfirmatonContainer);

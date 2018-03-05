import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withResendEmailConfirmation } from 'plugin-api/beta/client/hocs';
import { compose } from 'recompose';
import EmailVerificationBanner from '../components/EmailVerificationBanner';

class EmailVerificationBannerContainer extends Component {
  handleResendEmailVerification = () => {
    this.props.resendEmailConfirmation(this.props.email);
  };

  render() {
    return (
      <EmailVerificationBanner
        onResendEmailVerification={this.handleResendEmailVerification}
        errorMessage={this.props.errorMessage}
        success={this.props.success}
        loading={this.props.loading}
        email={this.props.email}
      />
    );
  }
}

EmailVerificationBannerContainer.propTypes = {
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  resendEmailConfirmation: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  email: PropTypes.string.isRequired,
};

export default compose(withResendEmailConfirmation)(
  EmailVerificationBannerContainer
);

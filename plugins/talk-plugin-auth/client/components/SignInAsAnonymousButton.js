import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'plugin-api/beta/client/components/ui';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchAnonymousSignIn} from 'coral-embed-stream/src/actions/auth';
import t from 'coral-framework/services/i18n';

class SignInAsAnonymousButton extends React.Component {
  render() {
    return (
      <div className="talk-stream-auth-sign-in-button">
        {!this.props.loggedIn
          ? <Button id="SignInAsAnonymousButton" onClick={this.props.fetchAnonymousSignIn} full>
            {t('sign_in.continue_as_anonymous')}
          </Button>
          : null}
      </div>
    );
  }
}

SignInAsAnonymousButton.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  fetchAnonymousSignIn: PropTypes.func.isRequired
};

const mapStateToProps = ({auth}) => ({
  loggedIn: auth.loggedIn
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({fetchAnonymousSignIn}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInAsAnonymousButton);

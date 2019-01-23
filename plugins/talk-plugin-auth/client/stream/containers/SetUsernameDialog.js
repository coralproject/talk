import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, withSetUsername } from 'plugin-api/beta/client/hocs';
import { compose, branch, renderNothing } from 'recompose';
import {
  usernameStatusSelector,
  usernameSelector,
} from 'plugin-api/beta/client/selectors/auth';
import SetUsernameDialog from '../components/SetUsernameDialog';

class SetUsernameDialogContainer extends Component {
  state = {
    username: this.props.username,
    usernameError: null,
  };

  handleSubmit = () => {
    const validationError = this.props.validateUsername(this.state.username);
    if (validationError) {
      this.setState({ usernameError: validationError });
    } else {
      this.props.setUsername(this.state.username);
    }
  };

  setUsername = username => this.setState({ username });

  render() {
    if (!this.props.unset) {
      return null;
    }
    return (
      <SetUsernameDialog
        username={this.state.username}
        usernameError={this.state.usernameError}
        onSubmit={this.handleSubmit}
        onUsernameChange={this.setUsername}
        errorMessage={this.props.errorMessage}
        loading={this.props.loading}
      />
    );
  }
}

SetUsernameDialogContainer.propTypes = {
  unset: PropTypes.bool.isRequired,
  username: PropTypes.string,
  setUsername: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  success: PropTypes.bool.isRequired,
  validateUsername: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  unset: usernameStatusSelector(state) === 'UNSET',
  username: usernameSelector(state),
});

export default compose(
  connect(
    mapStateToProps,
    null
  ),
  withSetUsername,
  branch(props => !props.username, renderNothing)
)(SetUsernameDialogContainer);

import React from 'react';
import PropTypes from 'prop-types';
import Main from '../components/Main';
import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { setView } from '../actions';
import {
  setAuthToken,
  handleSuccessfulLogin,
} from 'plugin-api/beta/client/actions/auth';
import * as views from '../enums/views';

class MainContainer extends React.Component {
  resetView = () => {
    this.props.setView(views.SIGN_IN);
  };

  resizeHeight() {
    setTimeout(() => {
      const height = document.getElementById('signInDialog').offsetHeight + 100;
      window.resizeTo(500, height);
    }, 20);
  }

  componentDidMount() {
    this.resizeHeight();
    this.listenToStorageChanges();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view) {
      this.resizeHeight();
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  listenToStorageChanges() {
    window.addEventListener('storage', this.handleAuth);
  }

  unlisten() {
    window.removeEventListener('storage', this.handleAuth);
  }

  // External logins store auth data into `auth`, we use it to detect
  // a successful sign in.
  handleAuth = e => {
    if (e.key === 'auth') {
      const { err, data } = JSON.parse(e.newValue);
      if (err) {
        console.error(err);
      } else if (data && data.token) {
        if (data.user) {
          this.props.handleSuccessfulLogin(data.user, data.token);
        } else {
          this.props.setAuthToken(data.token);
        }
        this.unlisten();
        localStorage.removeItem('auth');
        window.close();
      } else {
        console.error('auth was set, but did not contain a token');
      }
    }
  };

  render() {
    return <Main onResetView={this.resetView} view={this.props.view} />;
  }
}

MainContainer.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  handleSuccessfulLogin: PropTypes.func.isRequired,
  setAuthToken: PropTypes.func.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  view: state.view,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
      handleSuccessfulLogin,
      setAuthToken,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

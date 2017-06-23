import React, {Component} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/ui/Layout';
import {fetchConfig} from '../actions/config';
import AdminLogin from '../components/AdminLogin';
import {logout} from 'coral-framework/actions/auth';
import {FullLoading} from '../components/FullLoading';
import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import {toggleModal as toggleShortcutModal} from '../actions/moderation';
import {checkLogin, handleLogin, requestPasswordReset} from '../actions/auth';
import {can} from 'coral-framework/services/perms';

class LayoutContainer extends Component {
  componentWillMount() {
    const {checkLogin, fetchConfig} = this.props;

    checkLogin();
    fetchConfig();
  }
  render() {
    const {
      user,
      loggedIn,
      loadingUser,
      loginError,
      loginMaxExceeded,
      passwordRequestSuccess
    } = this.props.auth;

    const {
      handleLogout,
      toggleShortcutModal,
      TALK_RECAPTCHA_PUBLIC
    } = this.props;
    if (loadingUser) {
      return <FullLoading />;
    }
    if (!loggedIn) {
      return (
        <AdminLogin
          loginMaxExceeded={loginMaxExceeded}
          handleLogin={this.props.handleLogin}
          requestPasswordReset={this.props.requestPasswordReset}
          passwordRequestSuccess={passwordRequestSuccess}
          recaptchaPublic={TALK_RECAPTCHA_PUBLIC}
          errorMessage={loginError}
        />
      );
    }
    if (can(user, 'ACCESS_ADMIN') && loggedIn) {
      return (
        <Layout
          handleLogout={handleLogout}
          toggleShortcutModal={toggleShortcutModal}
          {...this.props}
        >
        <BanUserDialog />
        <SuspendUserDialog />
        {this.props.children}
        </Layout>
      );
    } else if (loggedIn) {
      return (
        <Layout {...this.props}>
          <p>This page is for team use only. Please contact an administrator if you want to join this team.</p>
        </Layout>
      );
    }
    return <FullLoading />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth.toJS(),
  TALK_RECAPTCHA_PUBLIC: state.config
    .get('data')
    .get('TALK_RECAPTCHA_PUBLIC', null)
});

const mapDispatchToProps = (dispatch) => ({
  checkLogin: () => dispatch(checkLogin()),
  fetchConfig: () => dispatch(fetchConfig()),
  handleLogin: (username, password, recaptchaResponse) =>
    dispatch(handleLogin(username, password, recaptchaResponse)),
  requestPasswordReset: (email) => dispatch(requestPasswordReset(email)),
  toggleShortcutModal: (toggle) => dispatch(toggleShortcutModal(toggle)),
  handleLogout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);

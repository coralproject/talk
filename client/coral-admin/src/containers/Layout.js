import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Layout from '../components/Layout';
import { fetchConfig } from '../actions/config';
import AdminLogin from '../components/AdminLogin';
import { FullLoading } from '../components/FullLoading';
import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import { toggleModal as toggleShortcutModal } from '../actions/moderation';
import {
  checkLogin,
  handleLogin,
  requestPasswordReset,
  logout,
} from '../actions/auth';
import { can } from 'coral-framework/services/perms';
import UserDetail from 'coral-admin/src/containers/UserDetail';
import PropTypes from 'prop-types';

class LayoutContainer extends React.Component {
  componentWillMount() {
    const { checkLogin, fetchConfig } = this.props;

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
      passwordRequestSuccess,
    } = this.props.auth;

    const {
      children,
      logout,
      toggleShortcutModal,
      TALK_RECAPTCHA_PUBLIC,
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
          handleLogout={logout}
          toggleShortcutModal={toggleShortcutModal}
          auth={this.props.auth}
        >
          <BanUserDialog />
          <SuspendUserDialog />
          <UserDetail />
          {children}
        </Layout>
      );
    } else if (loggedIn) {
      return (
        <Layout {...this.props}>
          <p>
            This page is for team use only. Please contact an administrator if
            you want to join this team.
          </p>
        </Layout>
      );
    }
    return <FullLoading />;
  }
}

LayoutContainer.propTypes = {
  children: PropTypes.node,
  requestPasswordReset: PropTypes.func,
  handleLogin: PropTypes.func,
  auth: PropTypes.object,
  handleLogout: PropTypes.func,
  logout: PropTypes.func,
  toggleShortcutModal: PropTypes.func,
  TALK_RECAPTCHA_PUBLIC: PropTypes.string,
  checkLogin: PropTypes.func,
  fetchConfig: PropTypes.func,
};

const mapStateToProps = state => ({
  auth: state.auth,
  TALK_RECAPTCHA_PUBLIC: state.config.data.TALK_RECAPTCHA_PUBLIC,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkLogin,
      fetchConfig,
      handleLogin,
      requestPasswordReset,
      toggleShortcutModal,
      logout,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);

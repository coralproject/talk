import React, {Component, cloneElement} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/ui/Layout';
import {fetchConfig} from '../actions/config';
import AdminLogin from '../components/AdminLogin';
import {FullLoading} from '../components/FullLoading';
import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import {toggleModal as toggleShortcutModal} from '../actions/moderation';
import {checkLogin, handleLogin, requestPasswordReset, logout} from '../actions/auth';
import {can} from 'coral-framework/services/perms';
import UserDetail from 'coral-admin/src/containers/UserDetail';
import PropTypes from 'prop-types';
import {compose, gql} from 'react-apollo';

import withQuery from 'coral-framework/hocs/withQuery';
import {bindActionCreators} from 'redux';
import {getDefinitionName} from 'coral-framework/utils';
import Community from '../routes/Community/containers/Community';
import Header from '../containers/Header';

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
          root={this.props.root} 
          auth={this.props.auth} >
          <BanUserDialog />
          <SuspendUserDialog />
          <UserDetail />
          {cloneElement(children, {
            root: this.props.root,
            data: this.props.data
          })}
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
  root: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const withData = withQuery(gql`
  query TalkAdmin_initialQuery {
    ...${getDefinitionName(Header.fragments.root)}
    ...${getDefinitionName(Community.fragments.root)}
  }
  ${Header.fragments.root}
  ${Community.fragments.root}
  `, {
  options: {
    fetchPolicy: 'network-only',
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  TALK_RECAPTCHA_PUBLIC: state.config.data.TALK_RECAPTCHA_PUBLIC,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    checkLogin,
    fetchConfig,
    handleLogin,
    requestPasswordReset,
    toggleShortcutModal,
    logout
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withData
)(LayoutContainer);

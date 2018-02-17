import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Layout from '../components/Layout';
import Login from '../containers/Login';
import { FullLoading } from '../components/FullLoading';
import BanUserDialog from './BanUserDialog';
import SuspendUserDialog from './SuspendUserDialog';
import { toggleModal as toggleShortcutModal } from '../actions/moderation';
import { logout } from 'coral-framework/actions/auth';
import { can } from 'coral-framework/services/perms';
import UserDetail from 'coral-admin/src/containers/UserDetail';
import PropTypes from 'prop-types';

class LayoutContainer extends React.Component {
  render() {
    const {
      currentUser,
      checkedInitialLogin,
      children,
      logout,
      toggleShortcutModal,
    } = this.props;

    if (!checkedInitialLogin) {
      return <FullLoading />;
    }

    if (!currentUser) {
      return <Login />;
    }

    if (currentUser) {
      if (can(currentUser, 'ACCESS_ADMIN')) {
        return (
          <Layout
            handleLogout={logout}
            toggleShortcutModal={toggleShortcutModal}
            currentUser={this.props.currentUser}
          >
            <BanUserDialog />
            <SuspendUserDialog />
            <UserDetail />
            {children}
          </Layout>
        );
      } else {
        return (
          <Layout {...this.props} handleLogout={logout}>
            <p>
              This page is for team use only. Please contact an administrator if
              you want to join this team.
            </p>
          </Layout>
        );
      }
    }
    return <FullLoading />;
  }
}

LayoutContainer.propTypes = {
  children: PropTypes.node,
  currentUser: PropTypes.object,
  checkedInitialLogin: PropTypes.bool,
  logout: PropTypes.func,
  toggleShortcutModal: PropTypes.func,
};

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  checkedInitialLogin: state.auth.checkedInitialLogin,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleShortcutModal,
      logout,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);

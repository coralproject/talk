import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout} from '../components/ui/Layout';
import {checkLogin, logout} from '../actions/auth';
import {FullLoading} from '../components/FullLoading';
import {PermissionRequired} from '../components/PermissionRequired';

class LayoutContainer extends Component {
  componentWillMount () {
    const {checkLogin} = this.props;
    checkLogin();
  }
  render () {
    const {isAdmin, loggedIn, loadingUser} = this.props.auth;
    if (loadingUser) { return <FullLoading />; }
    if (!isAdmin) { return <PermissionRequired />; }
    if (isAdmin && loggedIn) { return <Layout {...this.props} />; }
    return <FullLoading />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin()),
  handleLogout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer);


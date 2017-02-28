import React, {Component} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/ui/Layout';
import {checkLogin, handleLogin, logout} from '../actions/auth';
import {FullLoading} from '../components/FullLoading';
import LoginView from '../components/LoginView';

class LayoutContainer extends Component {
  componentWillMount () {
    const {checkLogin} = this.props;
    checkLogin();
  }
  render () {
    const {isAdmin, loggedIn, loadingUser} = this.props.auth;
    const {handleLogout} = this.props;
    if (loadingUser) { return <FullLoading />; }
    if (!isAdmin) {
      return <LoginView handleLogin={this.props.handleLogin} />;
    }
    if (isAdmin && loggedIn) { return <Layout handleLogout={handleLogout} {...this.props} />; }
    return <FullLoading />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin()),
  handleLogin: (username, password) => dispatch(handleLogin(username, password)),
  handleLogout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/ui/Layout';
import {checkLogin, handleLogin, logout, requestPasswordReset} from '../actions/auth';
import {fetchPageData} from '../actions/pageData';
import {FullLoading} from '../components/FullLoading';
import AdminLogin from '../components/AdminLogin';

class LayoutContainer extends Component {
  componentWillMount () {
    const {checkLogin, fetchPageData} = this.props;

    checkLogin();
    fetchPageData();
  }
  render () {
    const {
      isAdmin,
      loggedIn,
      loadingUser,
      loginError,
      loginMaxExceeded,
      passwordRequestSuccess
    } = this.props.auth;

    const {
      TALK_RECAPTCHA_PUBLIC
    } = this.props;

    const {handleLogout} = this.props;
    if (loadingUser) { return <FullLoading />; }
    if (!isAdmin) {
      return <AdminLogin
        loginMaxExceeded={loginMaxExceeded}
        handleLogin={this.props.handleLogin}
        requestPasswordReset={this.props.requestPasswordReset}
        passwordRequestSuccess={passwordRequestSuccess}
        recaptchaPublic={TALK_RECAPTCHA_PUBLIC}
        errorMessage={loginError} />;
    }
    if (isAdmin && loggedIn) { return <Layout handleLogout={handleLogout} {...this.props} />; }
    return <FullLoading />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.toJS(),
  TALK_RECAPTCHA_PUBLIC: state.pageData.get('data').get('TALK_RECAPTCHA_PUBLIC', null)
});

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin()),
  fetchPageData: () => dispatch(fetchPageData()),
  handleLogin: (username, password, recaptchaResponse) => dispatch(handleLogin(username, password, recaptchaResponse)),
  requestPasswordReset: email => dispatch(requestPasswordReset(email)),
  handleLogout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer);

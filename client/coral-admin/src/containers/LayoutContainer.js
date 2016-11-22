import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout} from '../components/ui/Layout';
import {checkLogin} from '../actions/auth';
import {NotFound} from '../components/NotFound';
import {PermissionRequired} from '../components/PermissionRequired';

class LayoutContainer extends Component {
  componentWillMount () {
    this.props.checkLogin();
  }
  render () {
    const {isAdmin, loggedIn} = this.props.auth;

    if (!loggedIn) {
      return <NotFound />;
    }

    if (!isAdmin && loggedIn) {
      return <PermissionRequired />;
    }

    return <Layout {...this.props} />;
  }
}

LayoutContainer.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth.toJS()
});

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer);


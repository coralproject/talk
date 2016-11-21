import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout} from '../components/ui/Layout';
import {checkLogin} from 'coral-framework/actions/auth';

class LayoutContainer extends Component {
  componentWillMount () {
    this.props.checkLogin();
  }
  render () {
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


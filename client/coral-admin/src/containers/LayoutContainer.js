import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components/ui/Layout';

class LayoutContainer extends Component {
  render () {
    return <Layout {...this.props} />;
  }
}

LayoutContainer.propTypes = {};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);


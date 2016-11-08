import React, { Component }from 'react'
import { connect } from 'react-redux'

import Layout from '../components/ui/Layout'

class LayoutContainer extends Component {
  render () {
    return <Layout { ...this.props } />
  }
}

LayoutContainer.propTypes = {};

const mapStateToProps = state => {
  return {
    data: {}
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps, null)(LayoutContainer);


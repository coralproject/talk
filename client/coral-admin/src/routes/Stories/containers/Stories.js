import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';
import {fetchAssets, updateAssetState} from 'coral-admin/src/actions/assets';
import Stories from '../components/Stories';

class StoriesContainer extends Component {
  render () {
    return <Stories {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchAssets,
    updateAssetState,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(StoriesContainer);


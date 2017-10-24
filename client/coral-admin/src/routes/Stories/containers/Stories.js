import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchAssets, updateAssetState} from 'coral-admin/src/actions/assets';
import Stories from '../components/Stories';

const mapStateToProps = ({assets}) => ({assets});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchAssets,
    updateAssetState,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Stories);


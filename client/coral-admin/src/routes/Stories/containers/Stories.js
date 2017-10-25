import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchAssets, updateAssetState, setPage} from 'coral-admin/src/actions/stories';
import Stories from '../components/Stories';

const mapStateToProps = ({stories}) => ({
  assets: stories,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setPage,
    fetchAssets,
    updateAssetState,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Stories);


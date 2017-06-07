import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addTag, removeTag} from 'plugin-api/alpha/client/actions';
import OffTopicCheckbox from '../components/OffTopicCheckbox';

const mapStateToProps = ({commentBox}) => ({commentBox});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({addTag, removeTag}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicCheckbox);

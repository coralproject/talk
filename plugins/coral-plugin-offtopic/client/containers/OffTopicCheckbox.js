import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addTag, removeTag} from 'coral-plugin-commentbox/actions';
import OffTopicCheckbox from '../components/OffTopicCheckbox';

const mapStateToProps = ({commentBox}) => ({commentBox});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({addTag, removeTag}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicCheckbox);

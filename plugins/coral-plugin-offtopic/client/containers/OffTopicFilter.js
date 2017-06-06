import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox} from '../actions';
import {
  addClassName,
  removeClassName
} from 'coral-embed-stream/src/actions/comment';
import OffTopicFilter from '../components/OffTopicFilter';
import {closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

const mapStateToProps = ({comment, offTopic}) => ({
  classNames: comment.classNames,
  checked: offTopic.checked
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addClassName,
      removeClassName,
      toggleCheckbox,
      closeViewingOptions
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicFilter);

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox} from '../actions';
import {
  addCommentClassName,
  removeCommentClassName
} from 'coral-embed-stream/src/actions/comment';
import OffTopicFilter from '../components/OffTopicFilter';
import {closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

const mapStateToProps = ({comment, offTopic}) => ({
  commentClassNames: comment.commentClassNames,
  checked: offTopic.checked
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleCheckbox,
      closeViewingOptions,
      addCommentClassName,
      removeCommentClassName
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicFilter);

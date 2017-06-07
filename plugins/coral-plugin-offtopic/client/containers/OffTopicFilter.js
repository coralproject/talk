import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox} from '../actions';
import OffTopicFilter from '../components/OffTopicFilter';
import {
  closeViewingOptions
} from 'plugins/coral-plugin-viewing-options/client/actions';
import {
  addCommentClassName,
  removeCommentClassName
} from 'plugin-api/alpha/client/actions';

const mapStateToProps = ({comment, coralPluginOfftopic: offTopic}) => ({
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

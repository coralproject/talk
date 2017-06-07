import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox} from '../actions';
import {commentClassNamesSelector} from 'plugin-api/alpha/client/selectors';
import OffTopicFilter from '../components/OffTopicFilter';
import {
  closeViewingOptions
} from 'plugins/coral-plugin-viewing-options/client/actions';
import {
  addCommentClassName,
  removeCommentClassName
} from 'plugin-api/alpha/client/actions';

const mapStateToProps = (state) => ({
  commentClassNames: commentClassNamesSelector(state),
  checked: state.coralPluginOfftopic.checked
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

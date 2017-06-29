import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleCheckbox, toggleState} from '../actions';
import {commentClassNamesSelector} from 'plugin-api/alpha/client/selectors';
import OffTopicFilter from '../components/OffTopicFilter';
import {
  addCommentClassName,
  removeCommentClassName
} from 'plugin-api/alpha/client/actions';

const mapStateToProps = (state) => ({
  commentClassNames: commentClassNamesSelector(state),
  checked: state.coralPluginOfftopic.checked,
  offTopicState: state.coralPluginOfftopic.offTopicState
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleCheckbox,
      toggleState,
      addCommentClassName,
      removeCommentClassName
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicFilter);

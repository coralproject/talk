import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { toggleCheckbox } from '../actions';
import { commentClassNamesSelector } from 'plugin-api/alpha/client/selectors';
import OffTopicFilter from '../components/OffTopicFilter';
import {
  addCommentClassName,
  removeCommentClassName,
} from 'plugin-api/alpha/client/actions';

const mapStateToProps = state => ({
  commentClassNames: commentClassNamesSelector(state),
  checked: state.talkPluginOfftopic.checked,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleCheckbox,
      addCommentClassName,
      removeCommentClassName,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OffTopicFilter);

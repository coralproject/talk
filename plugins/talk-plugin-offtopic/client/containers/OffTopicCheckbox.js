import { bindActionCreators } from 'redux';
import { addTag, removeTag } from 'plugin-api/alpha/client/actions';
import { commentBoxTagsSelector } from 'plugin-api/alpha/client/selectors';
import { connect } from 'plugin-api/beta/client/hocs';
import OffTopicCheckbox from '../components/OffTopicCheckbox';

const mapStateToProps = state => ({
  tags: commentBoxTagsSelector(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addTag, removeTag }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicCheckbox);

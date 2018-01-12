import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import ModActionButton from '../components/ModActionButton';
import { withTags, connect } from 'plugin-api/beta/client/hocs';
import { closeMenu } from 'plugins/talk-plugin-moderation-actions/client/actions';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeMenu,
    },
    dispatch
  );

const enhance = compose(
  withTags('featured'),
  connect(null, mapDispatchToProps)
);

export default enhance(ModActionButton);

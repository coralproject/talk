import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import FeaturedConfirmation from '../components/FeaturedConfirmation';
import {withTags, connect} from 'plugin-api/beta/client/hocs';
import {closeMenu} from 'plugins/talk-plugin-moderation-actions/client/actions';

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    closeMenu,
  }, dispatch);

const enhance = compose(
  withTags('featured'),
  connect(null, mapDispatchToProps),
);

export default enhance(FeaturedConfirmation);

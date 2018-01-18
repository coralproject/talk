import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import { withRejectUsername } from 'coral-framework/graphql/mutations';
import { hideRejectUsernameDialog } from '../../../actions/community';
import Community from '../components/Community';

const mapStateToProps = state => ({
  community: state.community,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      hideRejectUsernameDialog,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRejectUsername
)(Community);

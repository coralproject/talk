import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import AddEmailAddressDialog from '../components/AddEmailAddressDialog';
import { notify } from 'coral-framework/actions/notification';
import { withAttachLocalAuth } from '../hocs';
import { startAttach, finishAttach } from '../actions';

const mapStateToProps = ({ talkPluginLocalAuth: state }) => ({
  inProgress: state.inProgress,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notify, startAttach, finishAttach }, dispatch);

const withData = withFragments({
  root: gql`
    fragment TalkPluginLocalAuth_AddEmailAddressDialog_root on RootQuery {
      me {
        id
        email
      }
      settings {
        requireEmailConfirmation
      }
    }
  `,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAttachLocalAuth,
  withData,
  excludeIf(
    ({ root: { me }, inProgress }) =>
      !((me && !me.email) || (me && me.email && inProgress))
  )
)(AddEmailAddressDialog);

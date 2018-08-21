import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import AccountDeletionRequestedSign from '../components/AccountDeletionRequestedSign';
import { notify } from 'coral-framework/actions/notification';
import { withCancelAccountDeletion } from '../hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

const withData = withFragments({
  root: gql`
    fragment Talk_AccountDeletionRequestedSignIn_root on RootQuery {
      me {
        scheduledDeletionDate
      }
    }
  `,
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withCancelAccountDeletion,
  withData,
  excludeIf(({ root: { me } }) => !me || !me.scheduledDeletionDate)
)(AccountDeletionRequestedSign);

import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import DeleteMyAccount from '../components/DeleteMyAccount';
import { notify } from 'coral-framework/actions/notification';
import { withRequestAccountDeletion, withCancelAccountDeletion } from '../hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

const withData = withFragments({
  root: gql`
    fragment Talk_DeleteMyAccount_root on RootQuery {
      me {
        scheduledDeletionDate
      }
      settings {
        organizationContactEmail
      }
    }
  `,
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withRequestAccountDeletion,
  withCancelAccountDeletion,
  withData
)(DeleteMyAccount);

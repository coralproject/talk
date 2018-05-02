import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import AddEmailAddressDialog from '../components/AddEmailAddressDialog';
import { notify } from 'coral-framework/actions/notification';

import { withAttachLocalAuth } from 'plugin-api/beta/client/hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

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

const mapStateToProps = ({ talkPluginLocalAuth: state }) => ({
  showAddEmailDialog: state.showAddEmailDialog,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAttachLocalAuth,
  withData
)(AddEmailAddressDialog);

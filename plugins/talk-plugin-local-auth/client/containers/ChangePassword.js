import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import ChangePassword from '../components/ChangePassword';
import { notify } from 'coral-framework/actions/notification';
import {
  withChangePassword,
  withForgotPassword,
} from 'plugin-api/beta/client/hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

const withData = withFragments({
  root: gql`
    fragment TalkPluginLocalAuth_ChangePassword_root on RootQuery {
      me {
        email
      }
    }
  `,
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withChangePassword,
  withForgotPassword,
  withData
)(ChangePassword);

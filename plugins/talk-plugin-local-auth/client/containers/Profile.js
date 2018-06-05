import { compose, gql } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import Profile from '../components/Profile';
import { notify } from 'coral-framework/actions/notification';
import { withSetUsername } from 'plugin-api/beta/client/hocs';
import { withUpdateEmailAddress } from '../hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

const withData = withFragments({
  root: gql`
    fragment TalkPluginLocalAuth_Profile_root on RootQuery {
      me {
        id
        email
        username
        state {
          status {
            username {
              status
              history {
                status
                created_at
              }
            }
          }
        }
      }
    }
  `,
});

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withSetUsername,
  withUpdateEmailAddress,
  withData
)(Profile);

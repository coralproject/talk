import { compose, gql } from 'react-apollo';
import UserFlagDetails from '../components/UserFlagDetails';
import { bindActionCreators } from 'redux';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { viewUserDetail } from 'plugin-api/beta/client/actions/admin';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      viewUserDetail,
    },
    dispatch
  ),
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    comment: gql`
      fragment CoralAdmin_UserFlagDetails_comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            id
            reason
            message
            user {
              id
              username
            }
          }
        }
      }
    `,
  }),
  excludeIf(
    ({ comment: { actions } }) =>
      !actions.some(action => action.__typename === 'FlagAction' && action.user)
  )
);

export default enhance(UserFlagDetails);

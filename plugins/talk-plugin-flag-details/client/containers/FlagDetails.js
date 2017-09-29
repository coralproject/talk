import {compose, gql} from 'react-apollo';
import FlagDetails from '../components/FlagDetails';
import {bindActionCreators} from 'redux';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';
import {viewUserDetail} from 'coral-admin/src/actions/userDetail';
import {connect} from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    viewUserDetail,
  }, dispatch)
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    comment: gql`
      fragment CoralAdmin_FlagDetails_comment on Comment {
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
    `
  }),
  excludeIf(({comment: {actions}}) => !actions.some((action) => action.__typename === 'FlagAction')),
);

export default enhance(FlagDetails);

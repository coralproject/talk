import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName} from 'coral-framework/utils';
import {withSetUserStatus, withRejectUsername} from 'coral-framework/graphql/mutations';
import FlaggedAccounts from '../containers/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';
import {hideRejectUsernameDialog} from '../../../actions/community';
import Community from '../components/Community';

const mapStateToProps = (state) => ({
  community: state.community,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    hideRejectUsernameDialog,
  }, dispatch);

const withData = withQuery(gql`
  query TalkAdmin_Community {
    flaggedUsernamesCount: userCount(query: {
      action_type: FLAG,
      statuses: [PENDING]
    })
    ...${getDefinitionName(FlaggedAccounts.fragments.root)}
    ...${getDefinitionName(FlaggedUser.fragments.root)}
    me {
      ...${getDefinitionName(FlaggedUser.fragments.me)}
      __typename
    }
  }
  ${FlaggedAccounts.fragments.root}
  ${FlaggedUser.fragments.root}
  ${FlaggedUser.fragments.me}
`, {
  options: {
    fetchPolicy: 'network-only',
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetUserStatus,
  withRejectUsername,
  withData
)(Community);

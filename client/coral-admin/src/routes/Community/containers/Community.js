import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';

import FlaggedAccounts from '../containers/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';

import {withSetUserStatus, withRejectUsername} from 'coral-framework/graphql/mutations';
import {getDefinitionName} from 'coral-framework/utils';

import {
  fetchAccounts,
  updateSorting,
  newPage,
  hideRejectUsernameDialog
} from '../../../actions/community';

import Community from '../components/Community';

class CommunityContainer extends Component {

  componentWillMount() {
    this.props.fetchAccounts({});
  }

  render() {
    return <Community {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  community: state.community,
});

const withData = withQuery(gql`
    query TalkAdmin_FlaggedUsernamesCount {
      flaggedUsernamesCount: userCount(query: {
        action_type: FLAG
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchAccounts,
    hideRejectUsernameDialog,
    updateSorting,
    newPage,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSetUserStatus,
  withRejectUsername,
  withData,
)(CommunityContainer);

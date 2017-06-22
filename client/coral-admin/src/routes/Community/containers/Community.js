import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {Spinner} from 'coral-ui';

import {withSetUserStatus, withRejectUsername} from 'coral-framework/graphql/mutations';

import {showBanUserDialog} from 'actions/banUserDialog';
import {showSuspendUserDialog} from 'actions/suspendUserDialog';

import {
  fetchAccounts,
  updateSorting,
  newPage,
  showRejectUsernameDialog,
  hideRejectUsernameDialog
} from '../../../actions/community';

import Community from '../components/Community';

class CommunityContainer extends Component {

  componentWillMount() {
    this.props.fetchAccounts({});
  }

  approveUser = ({userId}) => {
    return this.props.setUserStatus({userId, status: 'APPROVED'});
  }

  banUser = ({userId}) => {
    return this.props.setUserStatus({userId, status: 'BANNED'});
  }

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (!('users' in this.props.root)) {
      return <div><Spinner/></div>;
    }
    return (
      <Community {...this.props} approveUser={this.approveUser} banUser={this.banUser}/>
    );
  }
}

export const withCommunityQuery = withQuery(gql`
  query CoralAdmin_Community($action_type: ACTION_TYPE) {
    users(query:{action_type: $action_type}){
      id
      username
      status
      roles
      actions{
        id
        created_at
        ... on FlagAction {
          reason
          message
          user {
            id
            username
          }
        }
      }
      action_summaries {
        count
        ... on FlagActionSummary {
          reason
        }
      }
    }
  }
`, {
  options: ({params: {action_type = 'FLAG'}}) => {
    return {
      variables: {
        action_type: action_type
      }
    };
  }
});

const mapStateToProps = (state) => ({
  community: state.community.toJS()
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchAccounts,
    showBanUserDialog,
    showSuspendUserDialog,
    showRejectUsernameDialog,
    hideRejectUsernameDialog,
    updateSorting,
    newPage,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCommunityQuery,
  withSetUserStatus,
  withRejectUsername,
)(CommunityContainer);

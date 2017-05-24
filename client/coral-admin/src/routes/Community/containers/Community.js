import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, graphql, gql} from 'react-apollo';

import {banUser, setUserStatus, rejectUsername} from 'coral-admin/src/graphql/mutations';

import {
  fetchAccounts,
  updateSorting,
  newPage,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog
} from '../../../actions/community';

import Community from '../components/Community';

class CommunityContainer extends Component {

  componentWillMount() {
    this.props.fetchAccounts({});
  }

  render() {
    return (
      <Community {...this.props} />
    );
  }
}

export const withQuery = graphql(gql`
  query Users($action_type: ACTION_TYPE) {
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
    hideBanUserDialog,
    showSuspendUserDialog,
    hideSuspendUserDialog,
    updateSorting,
    newPage,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withQuery,
  banUser,
  setUserStatus,
  rejectUsername
)(CommunityContainer);

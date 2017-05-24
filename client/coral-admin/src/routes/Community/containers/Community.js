import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';

import {modUserFlaggedQuery} from 'coral-admin/src/graphql/queries';
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
  modUserFlaggedQuery,
  banUser,
  setUserStatus,
  rejectUsername
)(CommunityContainer);

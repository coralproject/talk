import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'react-apollo';

import {withSetUserStatus, withRejectUsername} from 'coral-framework/graphql/mutations';
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
    return (
      <Community {...this.props} />
    );
  }
}
const mapStateToProps = (state) => ({
  community: state.community,
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
)(CommunityContainer);

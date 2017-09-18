import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';

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


const withFlaggedUsernamesCount = withQuery(gql`
    query TalkAdmin_FlaggedUsernamesCount {
      flaggedUsernamesCount: userCount(query: {
        action_type: FLAG
      })
    }
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
  withFlaggedUsernamesCount,
)(CommunityContainer);

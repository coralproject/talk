import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {compose, gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName} from 'coral-framework/utils';
import {withSetUserStatus, withRejectUsername} from 'coral-framework/graphql/mutations';
import FlaggedAccounts from '../containers/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';

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
    return <Community
      fetchAccounts={this.props.fetchAccounts}
      community={this.props.community}
      hideRejectUsernameDialog={this.props.hideRejectUsernameDialog}
      updateSorting={this.props.updateSorting}
      newPage={this.props.newPage}
      route={this.props.route}
      rejectUsername={this.props.rejectUsername}
      data={this.props.data}
      root={this.props.root}
    />;
  }
}
const mapStateToProps = (state) => ({
  community: state.community,
});

CommunityContainer.propTypes = {
  community: PropTypes.object,
  fetchAccounts: PropTypes.func,
  hideRejectUsernameDialog: PropTypes.func,
  updateSorting: PropTypes.func,
  newPage: PropTypes.func,
  route: PropTypes.object,
  rejectUsername: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    fetchAccounts,
    hideRejectUsernameDialog,
    updateSorting,
    newPage,
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
)(CommunityContainer);

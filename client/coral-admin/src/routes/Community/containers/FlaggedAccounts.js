import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import {withFragments} from 'plugin-api/beta/client/hocs';
import {Spinner} from 'coral-ui';
import PropTypes from 'prop-types';

import {withSetUserStatus} from 'coral-framework/graphql/mutations';
import {showBanUserDialog} from 'actions/banUserDialog';
import {showSuspendUserDialog} from 'actions/suspendUserDialog';
import {showRejectUsernameDialog} from '../../../actions/community';
import {viewUserDetail} from '../../../actions/userDetail';
import {getDefinitionName} from 'coral-framework/utils';
import {appendNewNodes} from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';

import FlaggedAccounts from '../components/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';

class FlaggedAccountsContainer extends Component {

  constructor(props) {
    super(props);
  }

  approveUser = ({userId}) => {
    return this.props.setUserStatus({
      userId,
      status: 'APPROVED'
    });
  }

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.root.users.endCursor,
      },
      updateQuery: (previous, {fetchMoreResult:{users}}) => {
        const updated = update(previous, {
          users: {
            nodes: {
              $apply: (nodes) => appendNewNodes(nodes, users.nodes),
            },
            hasNextPage: {$set: users.hasNextPage},
            endCursor: {$set: users.endCursor},
          },
        });
        return updated;
      },
    });
  };

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return <div><Spinner/></div>;
    }
    return (
      <FlaggedAccounts
        showBanUserDialog={this.props.showBanUserDialog}
        showSuspendUserDialog={this.props.showSuspendUserDialog}
        showRejectUsernameDialog={this.props.showRejectUsernameDialog}
        viewUserDetail={this.props.viewUserDetail}
        approveUser={this.approveUser}
        loadMore={this.loadMore}
        data={this.props.data}
        root={this.props.root}
        users={this.props.root.users}
        me={this.props.root.me}
      />
    );
  }
}

FlaggedAccountsContainer.propTypes = {
  showBanUserDialog: PropTypes.func,
  showSuspendUserDialog: PropTypes.func,
  showRejectUsernameDialog: PropTypes.func,
  viewUserDetail: PropTypes.func,
  setUserStatus: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object
};

const LOAD_MORE_QUERY = gql`
  query TalkAdmin_LoadMoreFlaggedAccounts($limit: Int, $cursor: Cursor) {
    users(query:{action_type: FLAG, statuses: [PENDING], limit: $limit, cursor: $cursor}){
      hasNextPage
      endCursor
      nodes {
        __typename
        ...${getDefinitionName(FlaggedUser.fragments.user)}
      }
    }
  }
  ${FlaggedUser.fragments.user}
`;

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showBanUserDialog,
    showSuspendUserDialog,
    showRejectUsernameDialog,
    viewUserDetail,
  }, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withSetUserStatus,
  withFragments({
    root: gql`
      fragment TalkAdminCommunity_FlaggedAccounts_root on RootQuery {
        users(query:{action_type: FLAG, statuses: [PENDING], limit: 10}){
          hasNextPage
          endCursor
          nodes {
            __typename
            ...${getDefinitionName(FlaggedUser.fragments.user)}
          }
        }
        me {
          id
        }
      }
      ${FlaggedUser.fragments.user}
    `,
  }),
)(FlaggedAccountsContainer);

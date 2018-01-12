import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { Spinner } from 'coral-ui';
import PropTypes from 'prop-types';
import { withApproveUsername } from 'coral-framework/graphql/mutations';
import { showRejectUsernameDialog } from '../../../actions/community';
import { viewUserDetail } from '../../../actions/userDetail';
import { getDefinitionName } from 'coral-framework/utils';
import { appendNewNodes } from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';

import FlaggedAccounts from '../components/FlaggedAccounts';
import FlaggedUser from '../containers/FlaggedUser';

class FlaggedAccountsContainer extends Component {
  constructor(props) {
    super(props);
  }

  approveUser = ({ userId: id }) => {
    return this.props.approveUsername(id);
  };

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.root.flaggedUsers.endCursor,
      },
      updateQuery: (previous, { fetchMoreResult: { flaggedUsers } }) => {
        const updated = update(previous, {
          flaggedUsers: {
            nodes: {
              $apply: nodes => appendNewNodes(nodes, flaggedUsers.nodes),
            },
            hasNextPage: { $set: flaggedUsers.hasNextPage },
            endCursor: { $set: flaggedUsers.endCursor },
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
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    return (
      <FlaggedAccounts
        showRejectUsernameDialog={this.props.showRejectUsernameDialog}
        viewUserDetail={this.props.viewUserDetail}
        approveUser={this.approveUser}
        loadMore={this.loadMore}
        data={this.props.data}
        root={this.props.root}
        users={this.props.root.flaggedUsers}
        me={this.props.root.me}
      />
    );
  }
}

FlaggedAccountsContainer.propTypes = {
  showRejectUsernameDialog: PropTypes.func,
  viewUserDetail: PropTypes.func,
  approveUsername: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
};

const LOAD_MORE_QUERY = gql`
  query TalkAdmin_LoadMoreFlaggedAccounts($limit: Int, $cursor: Cursor) {
    flaggedUsers: users(query:{
        action_type: FLAG,
        state: {
          status: {
            username: [SET, CHANGED]
          }
        },
        limit: $limit,
        cursor: $cursor
      }){
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showRejectUsernameDialog,
      viewUserDetail,
    },
    dispatch
  );

export default compose(
  connect(null, mapDispatchToProps),
  withApproveUsername,
  withFragments({
    root: gql`
      fragment TalkAdminCommunity_FlaggedAccounts_root on RootQuery {
        flaggedUsers: users(query:{
            action_type: FLAG,
            state: {
              status: {
                username: [SET, CHANGED]
              }
            }
            limit: 10
          }){
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
  })
)(FlaggedAccountsContainer);

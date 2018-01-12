import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserDetail from '../components/UserDetail';
import withQuery from 'coral-framework/hocs/withQuery';
import {
  getDefinitionName,
  getSlotFragmentSpreads,
} from 'coral-framework/utils';
import {
  viewUserDetail,
  hideUserDetail,
  changeTab,
  clearUserDetailSelections,
  toggleSelectCommentInUserDetail,
  toggleSelectAllCommentInUserDetail,
} from 'coral-admin/src/actions/userDetail';
import {
  withSetCommentStatus,
  withUnbanUser,
  withUnsuspendUser,
} from 'coral-framework/graphql/mutations';
import UserDetailComment from './UserDetailComment';
import update from 'immutability-helper';
import { notify } from 'coral-framework/actions/notification';
import { showBanUserDialog } from 'actions/banUserDialog';
import { showSuspendUserDialog } from 'actions/suspendUserDialog';

const commentConnectionFragment = gql`
  fragment CoralAdmin_UserDetail_CommentConnection on CommentConnection {
    nodes {
      ...${getDefinitionName(UserDetailComment.fragments.comment)}
    }
    hasNextPage
    startCursor
    endCursor
  }
  ${UserDetailComment.fragments.comment}
`;

const slots = ['userProfile'];

class UserDetailContainer extends React.Component {
  isLoadingMore = false;

  // status can be 'ACCEPTED' or 'REJECTED'
  bulkSetCommentStatus = async status => {
    const changes = this.props.selectedCommentIds.map(commentId => {
      return this.props.setCommentStatus({ commentId, status });
    });

    await Promise.all(changes);
    this.props.clearUserDetailSelections(); // un-select everything
  };

  bulkReject = () => {
    return this.bulkSetCommentStatus('REJECTED');
  };

  bulkAccept = () => {
    return this.bulkSetCommentStatus('ACCEPTED');
  };

  acceptComment = ({ commentId }) => {
    return this.props.setCommentStatus({ commentId, status: 'ACCEPTED' });
  };

  rejectComment = ({ commentId }) => {
    return this.props.setCommentStatus({ commentId, status: 'REJECTED' });
  };

  loadMore = () => {
    if (this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    const variables = {
      limit: 10,
      cursor: this.props.root.comments.endCursor,
      author_id: this.props.data.variables.author_id,
      statuses: this.props.data.variables.statuses,
    };
    this.props.data
      .fetchMore({
        query: LOAD_MORE_QUERY,
        variables,
        updateQuery: (prev, { fetchMoreResult: { comments } }) => {
          return update(prev, {
            comments: {
              nodes: { $push: comments.nodes },
              hasNextPage: { $set: comments.hasNextPage },
              startCursor: { $set: comments.startCursor },
              endCursor: { $set: comments.endCursor },
            },
          });
        },
      })
      .then(() => {
        this.isLoadingMore = false;
      })
      .catch(err => {
        this.isLoadingMore = false;
        throw err;
      });
  };

  componentWillReceiveProps(next) {
    if (this.props.userId === null && next.userId) {
      next.data.refetch();
    }
  }

  render() {
    if (!this.props.userId) {
      return null;
    }

    const loading = this.props.data.loading;

    return (
      <UserDetail
        bulkReject={this.bulkReject}
        bulkAccept={this.bulkAccept}
        changeTab={this.props.changeTab}
        toggleSelect={this.props.toggleSelectCommentInUserDetail}
        toggleSelectAll={this.props.toggleSelectAllCommentInUserDetail}
        acceptComment={this.acceptComment}
        rejectComment={this.rejectComment}
        loading={loading}
        loadMore={this.loadMore}
        {...this.props}
      />
    );
  }
}

UserDetailContainer.propTypes = {
  changeTab: PropTypes.func,
  toggleSelectCommentInUserDetail: PropTypes.func,
  toggleSelectAllCommentInUserDetail: PropTypes.func,
  data: PropTypes.object,
  root: PropTypes.object,
  setCommentStatus: PropTypes.func,
  clearUserDetailSelections: PropTypes.func,
  selectedCommentIds: PropTypes.array,
  unbanUser: PropTypes.func.isRequired,
  unsuspendUser: PropTypes.func.isRequired,
};

const LOAD_MORE_QUERY = gql`
  query CoralAdmin_Moderation_LoadMore(
    $limit: Int = 10
    $cursor: Cursor
    $author_id: ID!
    $statuses: [COMMENT_STATUS!]
  ) {
    comments(
      query: {
        limit: $limit
        cursor: $cursor
        author_id: $author_id
        statuses: $statuses
      }
    ) {
      ...CoralAdmin_UserDetail_CommentConnection
    }
  }
  ${commentConnectionFragment}
`;

export const withUserDetailQuery = withQuery(
  gql`
  query CoralAdmin_UserDetail($author_id: ID!, $statuses: [COMMENT_STATUS!]) {
    user(id: $author_id) {
      id
      username
      created_at
      profiles {
        id
        provider
      }
      reliable {
        flagger
      }
      state {
        status {
          suspension {
            until
            history {
              until
              created_at
              assigned_by {
                id
                username
              }
            }
          }
          banned {
            status
            history {
              status
              assigned_by {
                id
                username
              }
              created_at
            }
          }
          username {
            status
            history {
              status
              assigned_by {
                id
                username
              }
              created_at
            }
          }
        }
      }
      ${getSlotFragmentSpreads(slots, 'user')}
    }
    me {
      id
    }
    totalComments: commentCount(query: {author_id: $author_id, statuses: []})
    rejectedComments: commentCount(query: {author_id: $author_id, statuses: [REJECTED]})
    comments: comments(query: {
      author_id: $author_id,
      statuses: $statuses
    }) {
      ...CoralAdmin_UserDetail_CommentConnection
    }
    ...${getDefinitionName(UserDetailComment.fragments.root)}
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${UserDetailComment.fragments.root}
  ${commentConnectionFragment}
`,
  {
    options: ({ userId, statuses }) => {
      return {
        variables: { author_id: userId, statuses },
        fetchPolicy: 'network-only',
      };
    },
    skip: ownProps => !ownProps.userId,
  }
);

const mapStateToProps = state => ({
  userId: state.userDetail.userId,
  selectedCommentIds: state.userDetail.selectedCommentIds,
  statuses: state.userDetail.statuses,
  activeTab: state.userDetail.activeTab,
  modal: state.ui.modal,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      showBanUserDialog,
      showSuspendUserDialog,
      changeTab,
      clearUserDetailSelections,
      toggleSelectCommentInUserDetail,
      viewUserDetail,
      hideUserDetail,
      toggleSelectAllCommentInUserDetail,
      notify,
    },
    dispatch
  ),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUserDetailQuery,
  withSetCommentStatus,
  withUnbanUser,
  withUnsuspendUser
)(UserDetailContainer);

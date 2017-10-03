import React from 'react';
import {compose, gql} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import UserDetail from '../components/UserDetail';
import withQuery from 'coral-framework/hocs/withQuery';
import {getDefinitionName, getSlotFragmentSpreads} from 'coral-framework/utils';
import {
  viewUserDetail,
  hideUserDetail,
  changeUserDetailStatuses,
  clearUserDetailSelections,
  toggleSelectCommentInUserDetail,
} from 'coral-admin/src/actions/userDetail';
import {withSetCommentStatus} from 'coral-framework/graphql/mutations';
import UserDetailComment from './UserDetailComment';
import update from 'immutability-helper';

const commentConnectionFragment = gql`
  fragment CoralAdmin_Moderation_CommentConnection on CommentConnection {
    nodes {
      ...${getDefinitionName(UserDetailComment.fragments.comment)}
    }
    hasNextPage
    startCursor
    endCursor
  }
  ${UserDetailComment.fragments.comment}
`;

const slots = [
  'userProfile',
];

class UserDetailContainer extends React.Component {
  isLoadingMore = false;

  // status can be 'ACCEPTED' or 'REJECTED'
  bulkSetCommentStatus = async (status) => {
    const changes = this.props.selectedCommentIds.map((commentId) => {
      return this.props.setCommentStatus({commentId, status});
    });

    try {
      await Promise.all(changes);
      this.props.clearUserDetailSelections(); // un-select everything
    } catch (err) {

      // TODO: handle error.
      console.error(err);
    }
  }

  bulkReject = () => {
    this.bulkSetCommentStatus('REJECTED');
  }

  bulkAccept = () => {
    this.bulkSetCommentStatus('ACCEPTED');
  }

  acceptComment = ({commentId}) => {
    return this.props.setCommentStatus({commentId, status: 'ACCEPTED'});
  }

  rejectComment = ({commentId}) => {
    return this.props.setCommentStatus({commentId, status: 'REJECTED'});
  }

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
    this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables,
      updateQuery: (prev, {fetchMoreResult:{comments}}) => {
        return update(prev, {
          comments: {
            nodes: {$push: comments.nodes},
            hasNextPage: {$set: comments.hasNextPage},
            startCursor: {$set: comments.startCursor},
            endCursor: {$set: comments.endCursor},
          },
        });
      }
    })
      .then(() => {
        this.isLoadingMore = false;
      })
      .catch((err) => {
        this.isLoadingMore = false;
        throw err;
      });
  };

  componentWillReceiveProps(next) {
    if (this.props.userId === null && next.userId) {
      next.data.refetch();
    }
  }

  render () {
    if (!this.props.userId) {
      return null;
    }

    const loading = this.props.data.loading;

    return <UserDetail
      bulkReject={this.bulkReject}
      bulkAccept={this.bulkAccept}
      changeStatus={this.props.changeUserDetailStatuses}
      toggleSelect={this.props.toggleSelectCommentInUserDetail}
      acceptComment={this.acceptComment}
      rejectComment={this.rejectComment}
      loading={loading}
      loadMore={this.loadMore}
      {...this.props} />;
  }
}

const LOAD_MORE_QUERY = gql`
  query CoralAdmin_Moderation_LoadMore($limit: Int = 10, $cursor: Cursor, $author_id: ID!, $statuses: [COMMENT_STATUS!]) {
    comments(query: {limit: $limit, cursor: $cursor, author_id: $author_id, statuses: $statuses}) {
      ...CoralAdmin_Moderation_CommentConnection
    }
  }
  ${commentConnectionFragment}
`;

export const withUserDetailQuery = withQuery(gql`
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
      ${getSlotFragmentSpreads(slots, 'user')}
    }
    totalComments: commentCount(query: {author_id: $author_id})
    rejectedComments: commentCount(query: {author_id: $author_id, statuses: [REJECTED]})
    comments: comments(query: {
      author_id: $author_id,
      statuses: $statuses
    }) {
      ...CoralAdmin_Moderation_CommentConnection
    }
    ...${getDefinitionName(UserDetailComment.fragments.root)}
    ${getSlotFragmentSpreads(slots, 'root')}
  }
  ${UserDetailComment.fragments.root}
  ${commentConnectionFragment}
`, {
  options: ({userId, statuses}) => {
    return {
      variables: {author_id: userId, statuses}
    };
  },
  skip: (ownProps) => !ownProps.userId,
});

const mapStateToProps = (state) => ({
  userId: state.userDetail.userId,
  selectedCommentIds: state.userDetail.selectedCommentIds,
  statuses: state.userDetail.statuses,
  activeTab: state.userDetail.activeTab,
  bannedWords: state.settings.wordlist.banned,
  suspectWords: state.settings.wordlist.suspect,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    changeUserDetailStatuses,
    clearUserDetailSelections,
    toggleSelectCommentInUserDetail,
    viewUserDetail,
    hideUserDetail,
  }, dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUserDetailQuery,
  withSetCommentStatus,
)(UserDetailContainer);

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

  // status can be 'ACCEPTED' or 'REJECTED'
  bulkSetCommentStatus = (status) => {
    const changes = this.props.selectedCommentIds.map((commentId) => {
      return this.props.setCommentStatus({commentId, status});
    });

    Promise.all(changes).then(() => {
      this.props.data.refetch(); // some comments may have moved out of this tab
      this.props.clearUserDetailSelections(); // un-select everything
    });
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

  render () {
    if (!this.props.userId) {
      return null;
    }

    const loading = !('user' in this.props.root) || this.props.root.user.id !== this.props.userId;

    return <UserDetail
      bulkReject={this.bulkReject}
      bulkAccept={this.bulkAccept}
      changeStatus={this.props.changeUserDetailStatuses}
      toggleSelect={this.props.toggleSelectCommentInUserDetail}
      acceptComment={this.acceptComment}
      rejectComment={this.rejectComment}
      loading={loading}
      {...this.props} />;
  }
}

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
    ${getSlotFragmentSpreads(slots, 'root')}
  }
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
  bannedWords: state.settings.toJS().wordlist.banned,
  suspectWords: state.settings.toJS().wordlist.suspect,
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

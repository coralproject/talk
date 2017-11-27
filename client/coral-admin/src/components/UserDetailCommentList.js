import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './UserDetailCommentList.css';
import LoadMore from '../components/LoadMore';
import Comment from '../containers/UserDetailComment';

const UserDetailCommentList = (props) => {
  const {
    data,
    root,
    root: {
      user,
      comments: {
        nodes,
        hasNextPage}
    },
    acceptComment,
    rejectComment,
    selectedCommentIds,
    toggleSelect,
    viewUserDetail,
    loadMore,
  } = props;

  return (
    <div className={cn(styles.commentList, 'talk-admin-user-detail-comment-list')}>
      {
        nodes.map((comment) => {
          const selected = selectedCommentIds.indexOf(comment.id) !== -1;
          return <Comment
            key={comment.id}
            user={user}
            root={root}
            data={data}
            comment={comment}
            acceptComment={acceptComment}
            rejectComment={rejectComment}
            selected={selected}
            toggleSelect={toggleSelect}
            viewUserDetail={viewUserDetail}
          />;
        })
      }
      <LoadMore
        className={styles.loadMore}
        loadMore={loadMore}
        showLoadMore={hasNextPage}
      />
    </div>
  );
};

UserDetailCommentList.propTypes = {
  root: PropTypes.object.isRequired,
  acceptComment: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  selectedCommentIds: PropTypes.array.isRequired,
  viewUserDetail: PropTypes.any.isRequired,
  loadMore: PropTypes.any.isRequired,
  toggleSelect: PropTypes.func.isRequired,
};

export default UserDetailCommentList;

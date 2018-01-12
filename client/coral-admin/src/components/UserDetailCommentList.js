import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './UserDetailCommentList.css';
import LoadMore from '../components/LoadMore';
import Comment from '../containers/UserDetailComment';
import RejectButton from './RejectButton';
import ApproveButton from './ApproveButton';

const UserDetailCommentList = props => {
  const {
    data,
    root,
    root: { user, comments: { nodes, hasNextPage } },
    acceptComment,
    rejectComment,
    selectedCommentIds,
    toggleSelect,
    viewUserDetail,
    loadMore,
    toggleSelectAll,
    bulkAcceptThenReload,
    bulkRejectThenReload,
  } = props;

  return (
    <div
      className={cn(styles.commentList, 'talk-admin-user-detail-comment-list')}
    >
      <div
        className={
          selectedCommentIds.length > 0
            ? cn(styles.bulkActionHeader, styles.selected)
            : styles.bulkActionHeader
        }
      >
        {selectedCommentIds.length > 0 && (
          <div className={styles.bulkActionGroup}>
            <ApproveButton onClick={bulkAcceptThenReload} minimal />
            <RejectButton onClick={bulkRejectThenReload} minimal />
            <span className={styles.selectedCommentsInfo}>
              {' '}
              {selectedCommentIds.length} comments selected
            </span>
          </div>
        )}

        <div className={styles.toggleAll}>
          <input
            type="checkbox"
            id="toogleAll"
            checked={
              selectedCommentIds.length > 0 &&
              selectedCommentIds.length === nodes.length
            }
            onChange={e => {
              toggleSelectAll(
                nodes.map(comment => comment.id),
                e.target.checked
              );
            }}
          />
          <label htmlFor="toogleAll">Select all</label>
        </div>
      </div>
      {nodes.map(comment => {
        const selected = selectedCommentIds.indexOf(comment.id) !== -1;
        return (
          <Comment
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
          />
        );
      })}
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
  toggleSelectAll: PropTypes.func.isRequired,
  bulkAcceptThenReload: PropTypes.func.isRequired,
  bulkRejectThenReload: PropTypes.func.isRequired,
};

export default UserDetailCommentList;

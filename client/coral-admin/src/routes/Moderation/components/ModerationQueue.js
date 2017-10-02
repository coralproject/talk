import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../containers/Comment';
import styles from './ModerationQueue.css';
import EmptyCard from '../../../components/EmptyCard';
import LoadMore from '../../../components/LoadMore';
import ViewMore from './ViewMore';
import t from 'coral-framework/services/i18n';
import {CSSTransitionGroup} from 'react-transition-group';

const hasComment = (nodes, id) => nodes.some((node) => node.id === id);

// resetCursors will return the id cursors of the first and second comment of
// the current comment list. The cursors are used to dertermine which
// comments to show. The spare cursor functions as a backup in case one
// of the comments gets deleted.
function resetCursors(state, props) {
  if (props.comments && props.comments.length) {
    const idCursors = [props.comments[0].id];
    if (props.comments[1]) {
      idCursors.push(props.comments[1].id);
    }
    return {idCursors};
  }
  return {idCursors: []};
}

// invalidateCursor is called whenever a comment is removed which is referenced
// by one of the 2 id cursors. It returns a new set of id cursors calculated
// using the help of the backup cursor.
function invalidateCursor(invalidated, state, props) {
  const alt = invalidated === 1 ? 0 : 1;
  const idCursors = [];
  if (state.idCursors[alt]) {
    idCursors.push(state.idCursors[alt]);
    const index = props.comments.findIndex((node) => node.id === idCursors[0]);
    const nextInLine = props.comments[index + 1];
    if (nextInLine) {
      idCursors.push(nextInLine.id);
    }
  }
  return {idCursors};
}

class ModerationQueue extends React.Component {
  isLoadingMore = false;

  constructor(props) {
    super(props);
    this.state = {
      ...resetCursors(this.state, props),
    };
  }

  componentDidUpdate (prev) {
    const {comments, commentCount} = this.props;

    // if the user just moderated the last (visible) comment
    // AND there are more comments available on the server,
    // go ahead and load more comments
    if (prev.comments.length > 0 && comments.length === 0 && commentCount > 0) {
      this.props.loadMore();
    }
  }

  componentWillReceiveProps(next) {
    const {comments: prevComments} = this.props;
    const {comments: nextComments} = next;

    if (!prevComments && nextComments) {
      this.setState(resetCursors);
      return;
    }

    if (
      prevComments && nextComments &&
        nextComments.length < prevComments.length
    ) {

      // Invalidate first cursor if referenced comment was removed.
      if (this.state.idCursors[0] && !hasComment(nextComments, this.state.idCursors[0])) {
        this.setState(invalidateCursor(0, this.state, next));
      }

      // Invalidate second cursor if referenced comment was removed.
      if (this.state.idCursors[1] && !hasComment(nextComments, this.state.idCursors[1])) {
        this.setState(invalidateCursor(1, this.state, next));
      }
    }
  }

  viewNewComments = () => {
    this.setState(resetCursors);
  };

  // getVisibileComments returns a list containing comments
  // which comes after the `idCursor`.
  getVisibleComments() {
    const {comments} = this.props;
    const idCursor = this.state.idCursors[0];

    if (!comments) {
      return [];
    }

    const view = [];
    let pastCursor = false;
    comments.forEach((comment) => {
      if (comment.id === idCursor) {
        pastCursor = true;
      }
      if (pastCursor) {
        view.push(comment);
      }
    });
    return view;
  }

  render () {
    const {
      comments,
      selectedCommentId,
      commentCount,
      singleView,
      viewUserDetail,
      activeTab,
      ...props
    } = this.props;

    if (comments.length === 0) {
      return (
        <div className={styles.root}>
          <EmptyCard>{t('modqueue.empty_queue')}</EmptyCard>
        </div>
      );
    }

    if (singleView) {
      const index = comments.findIndex((comment) => comment.id === selectedCommentId);
      const comment = comments[index];
      return (
        <div className={styles.root}>
          <Comment
            data={this.props.data}
            root={this.props.root}
            key={comment.id}
            comment={comment}
            selected={true}
            suspectWords={props.suspectWords}
            bannedWords={props.bannedWords}
            viewUserDetail={viewUserDetail}
            showBanUserDialog={props.showBanUserDialog}
            showSuspendUserDialog={props.showSuspendUserDialog}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
            currentAsset={props.currentAsset}
            currentUserId={this.props.currentUserId}
          />;
        </div>
      );
    }

    const view = this.getVisibleComments();

    return (
      <div className={styles.root}>
        <ViewMore
          viewMore={this.viewNewComments}
          count={comments.length - view.length}
        />
        <CSSTransitionGroup
          key={activeTab}
          component={'ul'}
          className={styles.list}
          transitionName={{
            enter: styles.commentEnter,
            enterActive: styles.commentEnterActive,
            leave: styles.commentLeave,
            leaveActive: styles.commentLeaveActive,
          }}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {
            view
              .map((comment) => {
                return <Comment
                  data={this.props.data}
                  root={this.props.root}
                  key={comment.id}
                  comment={comment}
                  selected={comment.id === selectedCommentId}
                  suspectWords={props.suspectWords}
                  bannedWords={props.bannedWords}
                  viewUserDetail={viewUserDetail}
                  showBanUserDialog={props.showBanUserDialog}
                  showSuspendUserDialog={props.showSuspendUserDialog}
                  acceptComment={props.acceptComment}
                  rejectComment={props.rejectComment}
                  currentAsset={props.currentAsset}
                  currentUserId={this.props.currentUserId}
                />;
              })
          }
        </CSSTransitionGroup>

        <LoadMore
          loadMore={this.props.loadMore}
          showLoadMore={comments.length < commentCount}
        />
      </div>
    );
  }
}

ModerationQueue.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAsset: PropTypes.object,
  showBanUserDialog: PropTypes.func.isRequired,
  showSuspendUserDialog: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  commentCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  selectedCommentId: PropTypes.string,
  singleView: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default ModerationQueue;

import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../containers/Comment';
import styles from './styles.css';
import EmptyCard from '../../../components/EmptyCard';
import {actionsMap} from '../../../utils/moderationQueueActionsMap';
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

  static propTypes = {
    viewUserDetail: PropTypes.func.isRequired,
    bannedWords: PropTypes.arrayOf(PropTypes.string).isRequired,
    suspectWords: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentAsset: PropTypes.object,
    showBanUserDialog: PropTypes.func.isRequired,
    showSuspendUserDialog: PropTypes.func.isRequired,
    rejectComment: PropTypes.func.isRequired,
    acceptComment: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired
  }

  loadMore = () => {
    if (!this.isLoadingMore) {
      this.isLoadingMore = true;
      this.props.loadMore(this.props.activeTab)
        .then(() => this.isLoadingMore = false)
        .catch((e) => {
          this.isLoadingMore = false;
          throw e;
        });
    }
  }

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
      this.loadMore();
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
      selectedIndex,
      commentCount,
      singleView,
      viewUserDetail,
      activeTab,
      ...props
    } = this.props;

    const view = this.getVisibleComments();

    return (
      <div id="moderationList" className={`${styles.list} ${singleView ? styles.singleView : ''}`}>
        <ViewMore
          viewMore={this.viewNewComments}
          count={comments.length - view.length}
        />
        <CSSTransitionGroup
          key={activeTab}
          component={'ul'}
          style={{paddingLeft: 0}}
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
            view.map((comment, i) => {
              const status = comment.action_summaries ? 'FLAGGED' : comment.status;
              return <Comment
                data={this.props.data}
                root={this.props.root}
                key={comment.id}
                comment={comment}
                selected={i === selectedIndex}
                suspectWords={props.suspectWords}
                bannedWords={props.bannedWords}
                viewUserDetail={viewUserDetail}
                actions={actionsMap[status]}
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
        {comments.length === 0 &&
            <div className={styles.emptyCardContainer}>
              <EmptyCard>{t('modqueue.empty_queue')}</EmptyCard>
            </div>
        }

        <LoadMore
          loadMore={this.loadMore}
          showLoadMore={comments.length < commentCount}
        />
      </div>
    );
  }
}

export default ModerationQueue;

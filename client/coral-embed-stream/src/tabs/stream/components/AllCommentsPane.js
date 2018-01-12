import React from 'react';
import PropTypes from 'prop-types';
import LoadMore from './LoadMore';
import NewCount from './NewCount';
import { TransitionGroup } from 'react-transition-group';
import { forEachError } from 'coral-framework/utils';
import Comment from '../containers/Comment';
import NoComments from './NoComments';

const hasComment = (nodes, id) => nodes.some(node => node.id === id);

// resetCursors will return the id cursors of the first and second comment of
// the current comment list. The cursors are used to dertermine which
// comments to show. The spare cursor functions as a backup in case one
// of the comments gets deleted.
function resetCursors(state, props) {
  const comments = props.asset.comments;
  if (comments && comments.nodes.length) {
    const idCursors = [comments.nodes[0].id];
    if (comments.nodes[1]) {
      idCursors.push(comments.nodes[1].id);
    }
    return { idCursors };
  }
  return { idCursors: [] };
}

// invalidateCursor is called whenever a comment is removed which is referenced
// by one of the 2 id cursors. It returns a new set of id cursors calculated
// using the help of the backup cursor.
function invalidateCursor(invalidated, state, props) {
  const alt = invalidated === 1 ? 0 : 1;
  const comments = props.asset.comments;
  const idCursors = [];
  if (state.idCursors[alt]) {
    idCursors.push(state.idCursors[alt]);
    const index = comments.nodes.findIndex(node => node.id === idCursors[0]);
    const nextInLine = comments.nodes[index + 1];
    if (nextInLine) {
      idCursors.push(nextInLine.id);
    }
  }
  return { idCursors };
}

class AllCommentsPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...resetCursors(this.state, props),
      loadingState: '',
    };
  }

  componentWillReceiveProps(next) {
    const { comments: prevComments } = this.props;
    const { comments: nextComments } = next;

    if (!prevComments && nextComments) {
      this.setState(resetCursors);
      return;
    }

    if (
      prevComments &&
      nextComments &&
      nextComments.nodes.length < prevComments.nodes.length
    ) {
      // Invalidate first cursor if referenced comment was removed.
      if (
        this.state.idCursors[0] &&
        !hasComment(nextComments.nodes, this.state.idCursors[0])
      ) {
        this.setState(invalidateCursor(0, this.state, next));
      }

      // Invalidate second cursor if referenced comment was removed.
      if (
        this.state.idCursors[1] &&
        !hasComment(nextComments.nodes, this.state.idCursors[1])
      ) {
        this.setState(invalidateCursor(1, this.state, next));
      }
    }
  }

  loadMore = () => {
    this.setState({ loadingState: 'loading' });
    this.props
      .loadMore()
      .then(() => {
        this.setState({ loadingState: 'success' });
      })
      .catch(error => {
        this.setState({ loadingState: 'error' });
        forEachError(error, ({ msg }) => {
          this.props.notify('error', msg);
        });
      });
  };

  viewNewComments = () => {
    this.setState(resetCursors);
    this.props.emit('ui.AllCommentsPane.viewNewComments');
  };

  // getVisibileComments returns a list containing comments
  // which were authored by current user or comes after the `idCursor`.
  getVisibleComments() {
    const { comments, currentUser: user } = this.props;
    const idCursor = this.state.idCursors[0];
    const userId = user ? user.id : null;

    if (!comments) {
      return [];
    }

    const view = [];
    let pastCursor = false;
    comments.nodes.forEach(comment => {
      if (comment.id === idCursor) {
        pastCursor = true;
      }
      if (pastCursor || comment.user.id === userId) {
        view.push(comment);
      }
    });
    return view;
  }

  render() {
    const {
      data,
      root,
      comments,
      commentClassNames,
      setActiveReplyBox,
      activeReplyBox,
      notify,
      disableReply,
      postComment,
      asset,
      currentUser,
      postFlag,
      postDontAgree,
      loadNewReplies,
      deleteAction,
      showSignInDialog,
      charCountEnable,
      maxCharCount,
      editComment,
      emit,
    } = this.props;

    const { loadingState } = this.state;
    const visibleComments = this.getVisibleComments();

    return (
      <div>
        {visibleComments.length ? (
          <div className="talk-stream-comments-container">
            <NewCount
              count={comments.nodes.length - visibleComments.length}
              loadMore={this.viewNewComments}
            />
            <TransitionGroup component="div" className="embed__stream">
              {visibleComments.map(comment => {
                return (
                  <Comment
                    commentClassNames={commentClassNames}
                    data={data}
                    root={root}
                    disableReply={disableReply}
                    setActiveReplyBox={setActiveReplyBox}
                    activeReplyBox={activeReplyBox}
                    notify={notify}
                    depth={0}
                    postComment={postComment}
                    asset={asset}
                    currentUser={currentUser}
                    postFlag={postFlag}
                    postDontAgree={postDontAgree}
                    loadMore={loadNewReplies}
                    deleteAction={deleteAction}
                    showSignInDialog={showSignInDialog}
                    key={comment.id}
                    comment={comment}
                    charCountEnable={charCountEnable}
                    maxCharCount={maxCharCount}
                    editComment={editComment}
                    emit={emit}
                  />
                );
              })}
            </TransitionGroup>
            <LoadMore
              topLevel={true}
              moreComments={asset.comments.hasNextPage}
              loadMore={this.loadMore}
              loadingState={loadingState}
            />
          </div>
        ) : (
          <NoComments assetClosed={asset.isClosed} />
        )}
      </div>
    );
  }
}

AllCommentsPane.propTypes = {
  data: PropTypes.object,
  root: PropTypes.object,
  comments: PropTypes.object,
  commentClassNames: PropTypes.array,
  setActiveReplyBox: PropTypes.func,
  activeReplyBox: PropTypes.string,
  notify: PropTypes.func,
  disableReply: PropTypes.bool,
  postComment: PropTypes.func,
  asset: PropTypes.object,
  currentUser: PropTypes.object,
  postFlag: PropTypes.func,
  postDontAgree: PropTypes.func,
  loadNewReplies: PropTypes.func,
  deleteAction: PropTypes.func,
  showSignInDialog: PropTypes.func,
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  editComment: PropTypes.func,
  emit: PropTypes.func,
};

export default AllCommentsPane;

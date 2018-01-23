import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../containers/Comment';
import styles from './ModerationQueue.css';
import EmptyCard from '../../../components/EmptyCard';
import AutoLoadMore from './AutoLoadMore';
import ViewMore from './ViewMore';
import t from 'coral-framework/services/i18n';
import {
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';
import throttle from 'lodash/throttle';
import key from 'keymaster';

const hasComment = (nodes, id) => nodes.some(node => node.id === id);

// resetCursors will return the id cursors of the first and second comment of
// the current comment The spare cursor functions as a backup in case one
// of the comments gets deleted. Additionally the new view based on the new
// cursors are also returned.
function resetCursors(state, props) {
  let idCursors = [];
  if (props.comments && props.comments.length) {
    idCursors.push(props.comments[0].id);
    if (props.comments[1]) {
      idCursors.push(props.comments[1].id);
    }
  }
  const view = getVisibleComments(props.comments, idCursors[0]);
  return { idCursors, view };
}

// invalidateCursor is called whenever a comment is removed which is referenced
// by one of the 2 id cursors. It returns a new set of id cursors calculated
// using the help of the backup cursor.
function invalidateCursor(invalidated, state, props) {
  const alt = invalidated === 1 ? 0 : 1;
  const idCursors = [];
  if (state.idCursors[alt]) {
    idCursors.push(state.idCursors[alt]);
    const index = props.comments.findIndex(node => node.id === idCursors[0]);
    const nextInLine = props.comments[index + 1];
    if (nextInLine) {
      idCursors.push(nextInLine.id);
    }
  }
  return idCursors;
}

// getVisibileComments returns a list containing comments
// which comes after the `idCursor`.
function getVisibleComments(comments, idCursor) {
  if (!comments) {
    return [];
  }

  const view = [];
  let pastCursor = false;
  comments.forEach(comment => {
    if (comment.id === idCursor) {
      pastCursor = true;
    }
    if (pastCursor) {
      view.push(comment);
    }
  });
  return view;
}

// Current keymapper to use for the CellMeasurer Cache.
let keyMapper = null;

// CellMeasurerCache is used to measure the size of the elements
// of the virtual list. We use a global one with a keyMapper that
// should resolve to a comment id, which is then used to cache the height.
const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 250,
  keyMapper: index => keyMapper(index),
});

class ModerationQueue extends React.Component {
  listRef = null;
  callbackCaches = {
    clearHeightCache: {},
    selectCommentId: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      ...resetCursors(this.state, props),
    };

    // Set keyMapper to map to comment ids.
    keyMapper = index => {
      const view = this.state.view;
      if (index < view.length) {
        return view[index].id;
      } else if (index === view.length) {
        return 'loadMore';
      }
      throw new Error(`unknown index ${index}`);
    };

    // Select first comment.
    if (this.state.view.length) {
      props.selectCommentId(this.state.view[0].id);
    }
  }

  componentDidMount() {
    key('j', () => this.selectDown());
    key('k', () => this.selectUp());

    // TODO: Workaround for issue https://github.com/bvaughn/react-virtualized/issues/866
    this.reflowList();
  }

  componentWillUnmount() {
    key.unbind('j');
    key.unbind('k');

    // When switching queues, clean it up first.
    // Removes dangling comments and reduce overly large
    // lists and restore chronological order.
    this.props.cleanUpQueue(this.props.activeTab);
  }

  componentWillReceiveProps(next) {
    const { comments: prevComments } = this.props;
    const { comments: nextComments } = next;

    // New comments where added and our cursor list is incomplete.
    if (
      this.state.idCursors.length < 2 &&
      nextComments.length > this.state.idCursors.length
    ) {
      this.setState(resetCursors(this.state, next));
      return;
    }

    let idCursors = this.state.idCursors;

    // Comments have been removed.
    if (
      prevComments &&
      nextComments &&
      nextComments.length < prevComments.length
    ) {
      // Invalidate first cursor if referenced comment was removed.
      if (
        this.state.idCursors[0] &&
        !hasComment(nextComments, this.state.idCursors[0])
      ) {
        idCursors = invalidateCursor(0, this.state, next);
      }

      // Invalidate second cursor if referenced comment was removed.
      if (
        this.state.idCursors[1] &&
        !hasComment(nextComments, this.state.idCursors[1])
      ) {
        idCursors = invalidateCursor(1, this.state, next);
      }

      // Selected comment was removed, determine and set next selected comment.
      if (
        this.props.selectedCommentId &&
        !hasComment(nextComments, this.props.selectedCommentId)
      ) {
        const view = this.state.view;
        let nextSelectedCommentId = null;

        // Determine a comment to select.
        const prevIndex = view.findIndex(
          comment => comment.id === this.props.selectedCommentId
        );
        if (prevIndex !== view.length - 1) {
          nextSelectedCommentId = view[prevIndex + 1].id;
        } else if (prevIndex > 0) {
          nextSelectedCommentId = view[prevIndex - 1].id;
        }
        this.props.selectCommentId(nextSelectedCommentId);
      }
    }

    // Comments changed.
    if (prevComments !== nextComments) {
      const nextView = getVisibleComments(nextComments, idCursors[0]);
      this.setState({ idCursors, view: nextView });

      // TODO: removing or adding a comment from the list seems to render incorrect, is this a bug?
      // Find first changed comment and perform a reflow.
      const index = this.state.view.findIndex(
        (comment, i) => !nextView[i] || nextView[i].id !== comment.id
      );
      this.reflowList(index);
    }
  }

  componentDidUpdate(prev) {
    const { commentCount, selectedCommentId } = this.props;

    const switchedToMultiMode = prev.singleView && !this.props.singleView;
    const switchedMode = prev.singleView !== this.props.singleView;
    const selectedDifferentComment =
      prev.selectedCommentId !== selectedCommentId && selectedCommentId;
    const moderatedLastComment =
      prev.comments.length > 0 && this.getCommentCountWithoutDagling() === 0;
    const hasMoreComment = commentCount > 0;

    if (switchedToMultiMode) {
      // Reflow virtual list.
      this.reflowList();
    }

    if (switchedMode || selectedDifferentComment) {
      this.scrollToSelectedComment();
    }

    if (moderatedLastComment && hasMoreComment) {
      this.props.loadMore();
    }
  }

  // Returns comment counts without dangling comments.
  getCommentCountWithoutDagling(props = this.props) {
    return props.comments.filter(comment =>
      props.commentBelongToQueue(props.activeTab, comment)
    ).length;
  }

  async selectDown() {
    const view = this.state.view;
    const index = view.findIndex(
      ({ id }) => id === this.props.selectedCommentId
    );
    if (
      index === view.length - 1 &&
      this.getCommentCountWithoutDagling() !== this.props.commentCount
    ) {
      await this.props.loadMore();
      this.selectDown();
      return;
    }
    if (index < view.length - 1) {
      this.props.selectCommentId(view[index + 1].id);
    }
  }

  selectUp() {
    const view = this.state.view;
    const index = view.findIndex(
      ({ id }) => id === this.props.selectedCommentId
    );

    if (index === 0 && view.length < this.props.comments.length) {
      this.viewNewComments(() => this.selectUp());
      return;
    }
    if (index > 0) {
      this.props.selectCommentId(view[index - 1].id);
    }
  }

  handleListRef = list => {
    this.listRef = list;
  };

  scrollToSelectedComment = (props = this.props, state = this.state) => {
    if (props.singleMode) {
      document
        .querySelector(`#comment_${props.selectedCommentId}`)
        .scrollIntoView();
    } else if (this.listRef) {
      const view = state.view;
      const index = view.findIndex(({ id }) => id === props.selectedCommentId);
      this.listRef.scrollToRow(index);
    }
  };

  viewNewComments = callback => {
    this.setState(resetCursors, () => {
      this.reflowList();
      callback && callback();
    });
  };

  reflowList = throttle(index => {
    if (index >= 0) {
      cache.clear(index);
      this.listRef && this.listRef.recomputeRowHeights(index);
    } else {
      cache.clearAll();
      this.listRef && this.listRef.recomputeRowHeights();
    }
  }, 500);

  rowRenderer = ({
    index, // Index of row within collection
    parent,
    style, // Style object to be applied to row (to position it)
  }) => {
    const view = this.state.view;
    const rowCount = view.length + 1;

    let child = null;
    let key = null;

    // Last element of list is our AutoLoadMore component and contains an
    // id indicating that this is the last element in list.
    if (index === rowCount - 1) {
      key = 'end-of-comment-list';
      child = (
        <div style={style} id={'end-of-comment-list'}>
          {this.props.hasNextPage && (
            <AutoLoadMore
              loadMore={this.props.loadMore}
              loading={this.props.isLoadingMore}
            />
          )}
        </div>
      );
    } else {
      const comment = view[index];

      // Use callback cache so not to change the identity of these arrow functions.
      // Otherwise shallow compare will fail to optimize.
      if (!this.callbackCaches.clearHeightCache[index]) {
        this.callbackCaches.clearHeightCache[index] = () =>
          this.reflowList(index);
      }
      if (!this.callbackCaches.selectCommentId[comment.id]) {
        this.callbackCaches.selectCommentId[comment.id] = () =>
          this.props.selectCommentId(comment.id);
      }

      key = comment.id;
      child = (
        <div style={style}>
          <Comment
            data={this.props.data}
            root={this.props.root}
            comment={comment}
            dangling={
              !this.props.commentBelongToQueue(this.props.activeTab, comment)
            }
            selected={comment.id === this.props.selectedCommentId}
            viewUserDetail={this.props.viewUserDetail}
            acceptComment={this.props.acceptComment}
            rejectComment={this.props.rejectComment}
            currentAsset={this.props.currentAsset}
            currentUserId={this.props.currentUserId}
            clearHeightCache={this.callbackCaches.clearHeightCache[index]}
            selectComment={this.callbackCaches.selectCommentId[comment.id]}
          />
        </div>
      );
    }

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {child}
      </CellMeasurer>
    );
  };

  render() {
    const {
      comments,
      selectedCommentId,
      singleView,
      viewUserDetail,
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
      const index = comments.findIndex(
        comment => comment.id === selectedCommentId
      );
      const comment = comments[index];
      return (
        <div className={styles.root}>
          <Comment
            data={this.props.data}
            root={this.props.root}
            key={comment.id}
            comment={comment}
            selected={true}
            viewUserDetail={viewUserDetail}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
            currentAsset={props.currentAsset}
            currentUserId={this.props.currentUserId}
            dangling={
              !this.props.commentBelongToQueue(this.props.activeTab, comment)
            }
          />;
        </div>
      );
    }

    const view = this.state.view;

    return (
      <div className={styles.root}>
        <ViewMore
          viewMore={() => this.viewNewComments()}
          count={comments.length - view.length}
        />
        <WindowScroller onResize={this.reflowList}>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              ref={this.handleListRef}
              autoHeight
              className={styles.list}
              style={{
                width: '100%',
              }}
              height={height}
              width={1280}
              scrollTop={scrollTop}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={view.length + 1}
              deferredMeasurementCache={cache}
              rowRenderer={this.rowRenderer}
              rowHeight={cache.rowHeight}
            />
          )}
        </WindowScroller>
      </div>
    );
  }
}

ModerationQueue.propTypes = {
  selectCommentId: PropTypes.func.isRequired,
  selectedCommentId: PropTypes.string,
  viewUserDetail: PropTypes.func.isRequired,
  currentAsset: PropTypes.object,
  rejectComment: PropTypes.func.isRequired,
  acceptComment: PropTypes.func.isRequired,
  commentBelongToQueue: PropTypes.func.isRequired,
  cleanUpQueue: PropTypes.func.isRequired,
  commentCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  singleView: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  comments: PropTypes.array,
  activeTab: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default ModerationQueue;

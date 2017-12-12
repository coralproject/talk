import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../containers/Comment';
import styles from './ModerationQueue.css';
import EmptyCard from '../../../components/EmptyCard';
import LoadMore from '../../../components/LoadMore';
import ViewMore from './ViewMore';
import t from 'coral-framework/services/i18n';
import {WindowScroller, CellMeasurer, CellMeasurerCache, List} from 'react-virtualized';
import throttle from 'lodash/throttle';
import key from 'keymaster';

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

let keyMapper = null;

// In this example, average cell height is assumed to be about 50px.
// This value will be used for the initial `Grid` layout.
// Width is not dynamic.
const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 250,
  keyMapper: (index) => keyMapper(index),
});

class ModerationQueue extends React.Component {
  isLoadingMore = false;
  cache = cache;
  listRef = null;

  constructor(props) {
    super(props);
    this.state = {
      ...resetCursors(this.state, props),
    };
    keyMapper = (index) => {
      const view = this.getVisibleComments();
      if (index < view.length) {
        return view[index].id;
      }
      else if (index === view.length) {
        return 'loadMore';
      }
      throw new Error(`unknown index ${index}`);
    };
    const view = this.getVisibleComments();
    if (view.length) {
      props.selectCommentId(view[0].id);
    }
  }

  componentDidMount() {
    key('j', () => this.selectDown());
    key('k', () => this.selectUp());
  }

  componentWillUnmount() {
    key.unbind('j');
    key.unbind('k');
  }

  async selectDown() {
    const view = this.getVisibleComments();
    const index = view.findIndex(({id}) => id === this.props.selectedCommentId);
    if (index === view.length - 1 && this.props.comments.length !== this.props.commentCount) {
      await this.props.loadMore();
      this.selectDown();
      return;
    }
    if (index < view.length - 1) {
      this.props.selectCommentId(view[index + 1].id);
    }
  }

  selectUp() {
    const view = this.getVisibleComments();
    const index = view.findIndex(({id}) => id === this.props.selectedCommentId);

    if (index === 0 && view.length < this.props.comments.length) {
      this.viewNewComments(() => this.selectUp());
      return;
    }
    if (index > 0) {
      this.props.selectCommentId(view[index - 1].id);
    }
  }

  componentDidUpdate (prev) {
    const {comments, commentCount} = this.props;

    // if the user just moderated the last (visible) comment
    // AND there are more comments available on the server,
    // go ahead and load more comments
    if (prev.comments.length > 0 && comments.length === 0 && commentCount > 0) {
      this.props.loadMore();
    }

    // Scroll to selected comment.
    if (prev.selectedCommentId !== this.props.selectedCommentId) {

      const view = this.getVisibleComments();
      const index = view.findIndex(({id}) => id === this.props.selectedCommentId);

      this.listRef.scrollToRow(index);
    }
  }

  handleListRef = (list) => {
    this.listRef = list;
  };

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

  viewNewComments = (callback) => {
    this.setState(resetCursors, () => {
      this.reflowList();
      callback && callback();
    });
  };

  reflowList = throttle(() => {
    this.cache.clearAll();
    this.listRef.recomputeRowHeights();
  }, 500);

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

  rowRenderer = ({
    index,       // Index of row within collection
    parent,
    style        // Style object to be applied to row (to position it)
  }) => {
    const view = this.getVisibleComments();
    const rowCount = view.length + 1;
    if (index === rowCount - 1) {
      return (
        <CellMeasurer
          cache={this.cache}
          columnIndex={0}
          key={'loadMore'}
          parent={parent}
          rowIndex={index}
        >
          <div
            style={style}
          >
            <LoadMore
              loadMore={this.props.loadMore}
              showLoadMore={this.props.comments.length < this.props.commentCount}
            />
          </div>
        </CellMeasurer>
      );
    }

    const comment = view[index];
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={comment.id}
        parent={parent}
        rowIndex={index}
      >
        <div
          style={style}
        >
          <Comment
            data={this.props.data}
            root={this.props.root}
            comment={comment}
            selected={comment.id === this.props.selectedCommentId}
            viewUserDetail={this.props.viewUserDetail}
            showBanUserDialog={this.props.showBanUserDialog}
            showSuspendUserDialog={this.props.showSuspendUserDialog}
            acceptComment={this.props.acceptComment}
            rejectComment={this.props.rejectComment}
            currentAsset={this.props.currentAsset}
            currentUserId={this.props.currentUserId}
            clearHeightCache={() => {this.cache.clear(index); this.listRef.recomputeRowHeights(index); }}
            selectComment={() => this.props.selectCommentId(comment.id)}
          />
        </div>
      </CellMeasurer>
    );
  };

  render () {
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
            viewUserDetail={viewUserDetail}
            showBanUserDialog={props.showBanUserDialog}
            showSuspendUserDialog={props.showSuspendUserDialog}
            acceptComment={props.acceptComment}
            rejectComment={props.rejectComment}
            currentAsset={props.currentAsset}
            currentUserId={this.props.currentUserId}
            selectComment={() => this.props.selectCommentId(comment.id)}
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
        <WindowScroller onResize={this.reflowList}>
          {({height, isScrolling, onChildScroll, scrollTop}) => (
            <List
              ref={this.handleListRef}
              autoHeight
              style={{
                width: '100%',
                outline: 'none',
              }}
              height={height}
              width={1280}
              scrollTop={scrollTop}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={view.length + 1}
              deferredMeasurementCache={this.cache}
              rowRenderer={this.rowRenderer}
              rowHeight={this.cache.rowHeight}
            />
          )}
        </WindowScroller>
      </div>
    );
  }
}

ModerationQueue.propTypes = {
  viewUserDetail: PropTypes.func.isRequired,
  currentAsset: PropTypes.object,
  showBanUserDialog: PropTypes.func.isRequired,
  selectCommentId: PropTypes.func.isRequired,
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

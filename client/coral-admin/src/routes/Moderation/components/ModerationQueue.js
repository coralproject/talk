import React, {PropTypes} from 'react';

import Comment from '../containers/Comment';
import styles from './styles.css';
import EmptyCard from '../../../components/EmptyCard';
import {actionsMap} from '../helpers/moderationQueueActionsMap';
import LoadMore from './LoadMore';
import t from 'coral-framework/services/i18n';
import {CSSTransitionGroup} from 'react-transition-group';

class ModerationQueue extends React.Component {

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
    this.props.loadMore(this.props.activeTab);
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

    return (
      <div id="moderationList" className={`${styles.list} ${singleView ? styles.singleView : ''}`}>
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
            comments.length
            ? comments.map((comment, i) => {
              const status = comment.action_summaries ? 'FLAGGED' : comment.status;
              return <Comment
                data={this.props.data}
                root={this.props.root}
                key={comment.id}
                index={i}
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
            : <EmptyCard>{t('modqueue.empty_queue')}</EmptyCard>
          }
        </CSSTransitionGroup>
        <LoadMore
          loadMore={this.loadMore}
          showLoadMore={comments.length < commentCount}
          />
      </div>
    );
  }
}

export default ModerationQueue;

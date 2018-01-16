import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../coral-ui';
import styles from './Comment.css';
import Slot from 'coral-framework/components/Slot';
import CommentTimestamp from 'coral-framework/components/CommentTimestamp';
import CommentContent from 'coral-framework/components/CommentContent';
import cn from 'classnames';
import { getTotalReactionsCount } from 'coral-framework/utils';

import t from 'coral-framework/services/i18n';

class Comment extends React.Component {
  render() {
    const { comment, link, data, root } = this.props;
    const reactionCount = getTotalReactionsCount(comment.action_summaries);
    const queryData = { root, comment, asset: comment.asset };

    return (
      <div className={styles.myComment}>
        <div className={styles.main}>
          <Slot
            fill="commentContent"
            defaultComponent={CommentContent}
            className={cn(styles.commentBody, 'my-comment-body')}
            data={data}
            queryData={queryData}
          />
          <div className={cn(styles.commentSummary, 'comment-summary')}>
            <span
              className={cn(
                styles.commentSummaryReactions,
                'comment-summary-reactions',
                { [styles.countZero]: reactionCount === 0 }
              )}
            >
              <Icon name="thumb_up" />
              <span
                className={cn(
                  styles.reactionCount,
                  'comment-summary-reaction-count'
                )}
              >
                {reactionCount}
              </span>
              {reactionCount === 1
                ? t('common.reaction')
                : t('common.reactions')}
            </span>
            <span
              className={cn('comment-summary-replies', {
                [styles.countZero]: comment.replyCount === 0,
              })}
            >
              <Icon name="reply" />
              <span
                className={cn(styles.replyCount, 'comment-summary-reply-count')}
              >
                {comment.replyCount}
              </span>
              {comment.replyCount === 1
                ? t('common.reply')
                : t('common.replies')}
            </span>
          </div>
          <div className="my-comment-asset">
            <a
              className={cn(styles.assetURL, 'my-comment-anchor')}
              href="#"
              onClick={link(`${comment.asset.url}`)}
            >
              {t('common.story')}:{' '}
              {comment.asset.title ? comment.asset.title : comment.asset.url}
            </a>
          </div>
        </div>
        <div className={styles.sidebar}>
          <ul>
            <li>
              <a
                onClick={link(`${comment.asset.url}?commentId=${comment.id}`)}
                className={styles.viewLink}
              >
                <Icon name="open_in_new" className={styles.iconView} />
                {t('view_conversation')}
              </a>
            </li>
            <li>
              <Icon name="schedule" className={styles.iconDate} />
              <Slot
                fill="historyCommentTimestamp"
                defaultComponent={CommentTimestamp}
                className={'talk-history-comment-published-date'}
                created_at={comment.created_at}
                data={data}
                queryData={queryData}
                inline
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

export default Comment;

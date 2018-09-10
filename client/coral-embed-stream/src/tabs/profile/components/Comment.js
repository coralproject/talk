import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'coral-ui';
import styles from './Comment.css';
import Slot from 'coral-framework/components/Slot';
import CommentTimestamp from 'coral-framework/components/CommentTimestamp';
import CommentContent from 'coral-framework/components/CommentContent';
import cn from 'classnames';
import { getTotalReactionsCount } from 'coral-framework/utils';

import t from 'coral-framework/services/i18n';
import { buildCommentURL } from 'coral-framework/utils/url';

class Comment extends React.Component {
  render() {
    const { comment, root } = this.props;
    const reactionCount = getTotalReactionsCount(comment.action_summaries);
    const slotPassthrough = { root, comment, asset: comment.asset };

    return (
      <div className={styles.myComment}>
        <div className={styles.main}>
          <Slot
            fill="commentContent"
            defaultComponent={CommentContent}
            className={cn(styles.commentBody, 'my-comment-body')}
            passthrough={slotPassthrough}
            size={1}
          />
          <div className={cn(styles.commentSummary, 'comment-summary')}>
            <span
              className={cn(
                styles.commentSummaryReactions,
                'comment-summary-reactions',
                { [styles.countZero]: reactionCount === 0 }
              )}
            >
              <Icon name="whatshot" />
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
              href={this.props.comment.asset.url}
              target="_parent"
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
                className={styles.viewLink}
                href={buildCommentURL(
                  this.props.comment.asset.url,
                  this.props.comment.id
                )}
                target="_parent"
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
                passthrough={{
                  created_at: comment.created_at,
                  ...slotPassthrough,
                }}
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
  comment: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
};

export default Comment;

import React from 'react';
import cn from 'classnames';
import styles from './Comment.css';
import { t } from 'plugin-api/beta/client/services';
import {
  Slot,
  CommentAuthorName,
  CommentTimestamp,
  CommentContent,
} from 'plugin-api/beta/client/components';
import { Icon } from 'plugin-api/beta/client/components/ui';
import { pluginName } from '../../package.json';
import FeaturedButton from '../containers/FeaturedButton';

class Comment extends React.Component {
  viewComment = () => {
    this.props.viewComment(this.props.comment.id);
  };

  render() {
    const { comment, asset, root, data } = this.props;
    const queryData = { comment, asset, root };
    return (
      <div className={cn(styles.root, `${pluginName}-comment`)}>
        <Slot
          component={'blockquote'}
          className={cn(styles.quote, `${pluginName}-comment-body`)}
          fill="commentContent"
          defaultComponent={CommentContent}
          data={data}
          queryData={queryData}
        />

        <div className={cn(`${pluginName}-comment-username-box`)}>
          <Slot
            className={cn(styles.username, `${pluginName}-comment-username`)}
            fill="commentAuthorName"
            defaultComponent={CommentAuthorName}
            queryData={queryData}
            data={data}
            inline
          />

          <Slot
            fill="commentTimestamp"
            defaultComponent={CommentTimestamp}
            className={cn(styles.timestamp, `${pluginName}-comment-timestamp`)}
            created_at={comment.created_at}
            data={data}
            queryData={queryData}
            inline
          />
        </div>

        <footer className={cn(styles.footer, `${pluginName}-comment-footer`)}>
          <div
            className={cn(
              'talk-embed-stream-comment-actions-container-left',
              styles.reactionsContainer,
              `${pluginName}-comment-reactions`
            )}
          >
            <Slot
              fill="commentReactions"
              root={root}
              data={data}
              comment={comment}
              asset={asset}
              inline
            />

            <FeaturedButton
              root={root}
              data={data}
              comment={comment}
              asset={asset}
            />
          </div>
          <div
            className={cn(
              'talk-embed-stream-comment-actions-container-right',
              styles.actionsContainer,
              `${pluginName}-comment-actions`
            )}
          >
            <button
              className={cn(styles.goTo, `${pluginName}-comment-go-to`)}
              onClick={this.viewComment}
            >
              <Icon name="forum" className={styles.repliesIcon} />{' '}
              {comment.replyCount} |{' '}
              {t('talk-plugin-featured-comments.go_to_conversation')}{' '}
              <Icon name="keyboard_arrow_right" className={styles.goToIcon} />
            </button>
          </div>
        </footer>
      </div>
    );
  }
}

export default Comment;

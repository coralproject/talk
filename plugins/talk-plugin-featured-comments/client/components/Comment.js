import React from 'react';
import PropTypes from 'prop-types';
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
    const { comment, asset, root } = this.props;
    const slotPassthrough = { comment, asset, root };
    return (
      <div className={cn(styles.root, `${pluginName}-comment`)}>
        <Slot
          component={'blockquote'}
          className={cn(styles.quote, `${pluginName}-comment-body`)}
          fill="commentContent"
          defaultComponent={CommentContent}
          passthrough={slotPassthrough}
          size={1}
        />

        <div className={cn(`${pluginName}-comment-username-box`)}>
          <Slot
            className={cn(styles.username, `${pluginName}-comment-username`)}
            fill="commentAuthorName"
            defaultComponent={CommentAuthorName}
            passthrough={slotPassthrough}
            inline
          />

          <Slot
            fill="commentTimestamp"
            defaultComponent={CommentTimestamp}
            className={cn(styles.timestamp, `${pluginName}-comment-timestamp`)}
            passthrough={{ created_at: comment.created_at, ...slotPassthrough }}
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
              passthrough={slotPassthrough}
              inline
            />

            <FeaturedButton root={root} comment={comment} asset={asset} />
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

Comment.propTypes = {
  viewComment: PropTypes.func,
  comment: PropTypes.object,
  asset: PropTypes.object,
  root: PropTypes.object,
};

export default Comment;

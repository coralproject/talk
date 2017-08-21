import React from 'react';
import cn from 'classnames';
import styles from './Comment.css';
import {t, timeago} from 'plugin-api/beta/client/services';
import {Slot, CommentAuthorName} from 'plugin-api/beta/client/components';
import {Icon} from 'plugin-api/beta/client/components/ui';
import {pluginName} from '../../package.json';

class Comment extends React.Component {

  viewComment = () => {
    this.props.viewComment(this.props.comment.id);
  }

  render() {
    const {comment, asset, root, data} = this.props;
    return (
      <div className={cn(styles.root, `${pluginName}-comment`)}>

        <blockquote className={cn(styles.quote, `${pluginName}-comment-body`)}>
          {comment.body}
        </blockquote>

        <div className={cn(`${pluginName}-comment-username-box`)}>

          <Slot
            className={cn(styles.username, `${pluginName}-comment-username`)}
            fill="commentAuthorName"
            defaultComponent={CommentAuthorName}
            queryData={{comment, asset, root}}
            data={data}
            inline
          />

          <span className={cn(styles.timeago, `${pluginName}-comment-timeago`)}>
            ,{' '}{timeago(comment.created_at)}
          </span>
        </div>

        <footer className={cn(styles.footer, `${pluginName}-comment-footer`)}>
          <div className={cn(styles.reactionsContainer, `${pluginName}-comment-reactions`)}>

            <Slot
              fill="commentReactions"
              root={root}
              data={data}
              comment={comment}
              asset={asset}
              inline
            />
          </div>
          <div className={cn(styles.actionsContainer, `${pluginName}-comment-actions`)}>
            <button className={cn(styles.goTo, `${pluginName}-comment-go-to`)} onClick={this.viewComment}>
              <Icon name="forum" className={styles.repliesIcon} /> {comment.replyCount} | {t('talk-plugin-featured-comments.go_to_conversation')} <Icon name="keyboard_arrow_right" className={styles.goToIcon} />
            </button>
          </div>
        </footer>
      </div>
    );
  }
}

export default Comment;

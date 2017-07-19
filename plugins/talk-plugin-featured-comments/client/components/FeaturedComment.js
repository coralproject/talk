import React from 'react';
import cn from 'classnames';
import styles from './FeaturedComment.css';
import {name} from '../../package.json';
import {timeago} from 'coral-framework/services/i18n';
import {Slot} from 'plugin-api/beta/client/components';
import {Icon} from 'plugin-api/beta/client/components/ui';

class FeaturedComment extends React.Component {

  viewComment = () => {
    this.props.viewComment(this.props.comment.id);
  }

  render() {
    const {comment, asset, root, data} = this.props;
    return (
      <div className={cn(styles.featuredComment, `${name}__featured-comment`)}>

        <blockquote className={cn(styles.quote, `${name}__featured-comment__comment-body`)}>
          {comment.body}
        </blockquote>

        <div className={cn(`${name}__featured-comment__username-box`)}>
          <strong className={cn(styles.username, `${name}__featured-comment__username`)}>
            {comment.user.username}
          </strong>
          <span className={cn(styles.timeago, `${name}__featured-comment__timeago`)}>
            ,{' '}{timeago(comment.created_at)}
          </span>
        </div>

        <footer className={cn(styles.footer, `${name}__featured-comment__footer`)}>
          <div className={cn(styles.reactionsContainer, `${name}__featured-comment__reactions`)}>

            <Slot
              fill="commentReactions"
              root={root}
              data={data}
              comment={comment}
              asset={asset}
              inline
            />
          </div>
          <div className={cn(styles.actionsContainer, `${name}__featured-comment__actions`)}>
            <a className={cn(styles.goTo, `${name}__featured-comment__go-to`)}
              onClick={this.viewComment}>
              <Icon name="forum" className={styles.repliesIcon} /> {comment.replyCount} |
              Go to conversation<Icon name="keyboard_arrow_right" className={styles.goToIcon} />
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default FeaturedComment;

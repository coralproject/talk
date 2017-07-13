import React from 'react';
import cn from 'classnames';
import styles from './FeaturedComment.css';
import {name} from '../../package.json';
import {timeago} from 'coral-framework/services/i18n';
import {Icon} from 'plugin-api/beta/client/components/ui';

const FeaturedComment = ({comment}) => {
  return (
    <div className={cn(styles.featuredComment, `${name}__featured-comment`)}>
      <blockquote className={cn(styles.quote, `${name}__featured-comment__comment-body`)}>
        {comment.body}
      </blockquote>
      <footer>
        <div>
          <strong className={cn(styles.username, `${name}__featured-comment__username`)}>
            {comment.user.username}
          </strong>
          <span className={cn(styles.timeago, `${name}__featured-comment__timeago`)}>
            ,{' '}{timeago(comment.created_at)}
          </span>
        </div>
        <a className={cn(styles.goTo, `${name}__featured-comment__go-to`)}>
          Go to conversation<Icon name="keyboard_arrow_right" className={styles.goToIcon} />
        </a>
      </footer>
    </div>
  );
};

export default FeaturedComment;

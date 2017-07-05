import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import {name} from '../../package.json';
import {timeago} from 'coral-framework/services/i18n';
import {Icon} from 'plugin-api/beta/client/components/ui';

const FeaturedComment = ({comment}) => {
  return (
    <div className={cn(`${name}__featured-comment`, styles.featuredComment)}>
      <p className={cn(`${name}__featured-comment__comment-body`)}>
        "{comment.body}"
      </p>
      <footer>
        <div>
          <strong className={cn(`${name}__featured-comment__username`, styles.username)}>
            {comment.user.username}
          </strong>
          <span className={cn(`${name}__featured-comment__timeago`, styles.timeago)}>
            ,{' '}{timeago(comment.created_at)}
          </span>
        </div>
        <a className={cn(`${name}__featured-comment__go-to`, styles.goTo)}>
          Go to conversation<Icon name="keyboard_arrow_right" />
        </a>
      </footer>
    </div>
  );
};

export default FeaturedComment;

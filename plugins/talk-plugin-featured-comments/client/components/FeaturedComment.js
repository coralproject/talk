import React from 'react';
import styles from './styles.css';
import {timeago} from 'coral-framework/services/i18n';

const FeaturedComment = ({comment}) => {
  return (
    <div className={styles.featuredComment}>
      <p>
        {comment.body}
      </p>
      <footer>
        <div>
          <strong>
            {comment.user.username}
          </strong>
          <span>
            ,{timeago(comment.created_at)}
          </span>
        </div>
        <a>
          Go to Coneversation >
        </a>
      </footer>
    </div>
  );
};

export default FeaturedComment;

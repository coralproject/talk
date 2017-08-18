import React, {PropTypes} from 'react';
import {Icon} from '../coral-ui';
import styles from './Comment.css';
import Slot from 'coral-framework/components/Slot';
import PubDate from '../talk-plugin-pubdate/PubDate';
import CommentContent from '../coral-embed-stream/src/components/CommentContent';

import t from 'coral-framework/services/i18n';

class Comment extends React.Component {

  render() {
    const {comment, link, data, root} = this.props;
    return (
      <div className={styles.myComment}>
        <div>
          <Slot
            fill="commentContent"
            defaultComponent={CommentContent}
            className={`${styles.commentBody} myCommentBody`}
            data={data}
            root={root}
            comment={comment}
            asset={comment.asset}
          />
          <p className="myCommentAsset">
            <a
              className={`${styles.assetURL} myCommentAnchor`}
              href="#"
              onClick={link(`${comment.asset.url}`)}>
              Story: {comment.asset.title ? comment.asset.title : comment.asset.url}
            </a>
          </p>
        </div>
        <div className={styles.sidebar}>
          <ul>
            <li>
              <a onClick={link(`${comment.asset.url}?commentId=${comment.id}`)}>
                <Icon name="open_in_new" className={styles.iconView}/>{t('view_conversation')}
              </a>
            </li>
            <li>
              <Icon name="schedule" className={styles.iconDate}/>
              <PubDate
                className={styles.pubdate}
                created_at={comment.created_at}
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
    body: PropTypes.string
  }).isRequired,
};

export default Comment;

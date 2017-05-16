import React, {PropTypes} from 'react';
import {Icon} from '../coral-ui';
import styles from './Comment.css';
import PubDate from '../coral-plugin-pubdate/PubDate';
import Content from '../coral-plugin-commentcontent/CommentContent';

const Comment = (props) => {
  return (
    <div className={styles.myComment}>
      <div>
        <Content
          className={`${styles.commentBody} myCommentBody`}
          body={props.comment.body}
        />
        <p className="myCommentAsset">
          <a
            className={`${styles.assetURL} myCommentAnchor`}
            href="#"
            onClick={props.link(`${props.asset.url}`)}>
            Story: {props.asset.title ? props.asset.title : props.asset.url}
          </a>
        </p>
      </div>
      <div className={styles.sidebar}>
        <ul>
          <li>
            <a onClick={props.link(`${props.asset.url}#${props.comment.id}`)}>
              <Icon name="open_in_new" />View Conversation
            </a>
          </li>
          <li>
            <Icon name="schedule" />
            <PubDate
              className={styles.pubdate}
              created_at={props.comment.created_at}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string
  }).isRequired,
  asset: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};

export default Comment;

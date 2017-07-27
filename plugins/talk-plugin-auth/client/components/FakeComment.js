import React from 'react';
import t from 'coral-framework/services/i18n';
import {ReplyButton} from 'talk-plugin-replies';
import PubDate from 'talk-plugin-pubdate/PubDate';
import Slot from 'coral-framework/components/Slot';
import AuthorName from 'talk-plugin-author-name/AuthorName';
import styles from 'coral-embed-stream/src/components/Comment.css';

export const FakeComment = ({username, created_at, comment}) => (
  <div className={`comment ${styles.Comment}`} style={{marginLeft: 0 * 30}}>
    <hr aria-hidden={true} />
    <AuthorName author={{name: username}} />
    <PubDate created_at={created_at} />
    <Slot comment={comment} />
    <div className="commentActionsLeft comment__action-container">
      <div className={`${'talk-plugin-likes'}-container`}>
        <button className={'talk-plugin-likes-button'}>
          <span className={'talk-plugin-likes-button-text'}>
            {t('like')}
          </span>
          <i
            className={`${'talk-plugin-likes'}-icon material-icons`}
            aria-hidden={true}
          >
            thumb_up
          </i>
        </button>
      </div>
      <ReplyButton
        onClick={() => {}}
        parentCommentId={'commentID'}
        currentUserId={{}}
      />
    </div>
    <div className="commentActionsRight comment__action-container">
      <div className="talk-plugin-permalinks-container">
        <button className="talk-plugin-permalinks-button">
          <span
            className={`comment__action-button comment__action-button--nowrap ${'talk-plugin-flags'}-button-text`}
          >
            {t('permalink')}
          </span>
          <i
            className="talk-plugin-permalinks-icon material-icons"
            aria-hidden={true}
          >
            link
          </i>
        </button>
      </div>
      <div className={`${'talk-plugin-flags'}-container`}>
        <button className={`${'talk-plugin-flags'}-button`}>
          <span
            className={`comment__action-button comment__action-button--nowrap ${'talk-plugin-flags'}-button-text`}
          >
            {t('report')}
          </span>
          <i
            className={`${'talk-plugin-flags'}-icon material-icons`}
            aria-hidden={true}
          >
            flag
          </i>
        </button>
      </div>
    </div>
  </div>
);


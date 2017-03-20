import React from 'react';
import styles from 'coral-embed-stream/src/Comment.css';

import AuthorName from 'coral-plugin-author-name/AuthorName';
import Content from 'coral-plugin-commentcontent/CommentContent';
import PubDate from 'coral-plugin-pubdate/PubDate';
import { ReplyButton } from 'coral-plugin-replies';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';

const lang = new I18n(translations);

class FakeComment extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { username, created_at, body } = this.props;

    return (
      <div
        className={`comment ${styles.Comment}`}
        style={{ marginLeft: 0 * 30 }}>
        <hr aria-hidden={true} />
        <AuthorName
          author={{ 'name': username }}/>
        <PubDate created_at={created_at} />
        <Content body={body} />
          <div className="commentActionsLeft">
              <div className={`${'coral-plugin-likes'}-container`}>
                <button className={`${'coral-plugin-likes'}-button`}>
                  <span className={`${'coral-plugin-likes'}-button-text`}>{lang.t('like')}</span>
                  <i className={`${'coral-plugin-likes'}-icon material-icons`}
                    aria-hidden={true}>thumb_up</i>
                </button>
              </div>
              <ReplyButton
                onClick={() => {}}
                parentCommentId={'commentID'}
                currentUserId={{}}
                banned={false}
              />
            </div>
        <div className="commentActionsRight">
          <div className="coral-plugin-permalinks-container">
            <button className="coral-plugin-permalinks-button">
              <i className="coral-plugin-permalinks-icon material-icons" aria-hidden={true}>link</i>
              {lang.t('permalink.permalink')}
            </button>
          </div>
          <div className={`${'coral-plugin-flags'}-container`}>
            <button className={`${'coral-plugin-flags'}-button`}>
              <span className={`${'coral-plugin-flags'}-button-text`}>{lang.t('report')}</span>
              <i className={`${'coral-plugin-flags'}-icon material-icons`}
                aria-hidden={true}>flag</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default FakeComment;
